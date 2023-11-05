import { app } from "../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  multiFactor,
  PhoneAuthProvider,
  RecaptchaVerifier,
  PhoneMultiFactorGenerator,
  signInWithEmailAndPassword,
  getMultiFactorResolver,
  MultiFactorResolver,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  MFAEnrollment,
  emailExists,
  emailVerificationSuccess,
  enterPhoneNumber,
  invalidCredential,
  loggingIn,
  sendSMS,
  sendingCode,
  sendingResetPasswordEmail,
  sendingSMS,
  success,
  waitingForVerification,
} from "./modal";
import { formValidation } from "./formValidation";

const auth = getAuth(app);

export const createUser = async (signupform: HTMLFormElement) => {
  const emailInput = signupform.elements.namedItem("email") as HTMLInputElement;
  const passwordInput = signupform.elements.namedItem(
    "password"
  ) as HTMLInputElement;

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const isFormValid = formValidation(email, password);

  if (!isFormValid) {
    return false;
  }

  loggingIn();

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    return true;
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      emailExists();
    }

    return false;
  }
};

export const sendingVerificationEmail = () => {
  const user = auth.currentUser;
  if (user) {
    sendEmailVerification(user);
  }
};

export const getEmailVerificationStatus = () => {
  const user = auth.currentUser;

  if (user) {
    const email = user.email;

    waitingForVerification(email);

    return new Promise(async (resolve) => {
      setTimeout(async () => {
        await user.reload();
        const verified = auth.currentUser?.emailVerified;

        resolve(verified);
      }, 20000);
    });
  }
};

export const checkEnrollment = () => {
  const user = auth.currentUser;

  if (user) {
    const factors = multiFactor(user).enrolledFactors.length;

    if (factors > 0) {
      return { status: true, email: user.email };
    } else {
      return { status: false, email: user.email };
    }
  }
};

export const smsVerification = async () => {
  const user = auth.currentUser;
  const phoneInput = document.getElementById("phone-input") as HTMLInputElement;
  const phoneNumber = phoneInput.value.trim();

  if (user) {
    sendingSMS();

    const session = await multiFactor(user).getSession();

    const phoneOptions = {
      phoneNumber: phoneNumber,
      session,
    };

    const phoneAuthProvider = new PhoneAuthProvider(auth);

    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
        callback: () => {},
      });

      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneOptions,
        recaptchaVerifier
      );

      recaptchaVerifier.clear();

      return verificationId;
    } catch (error: any) {
      console.log(error);
      return;
    }
  }
};

export const enterVerificationCode = async (verificationId: string) => {
  const user = auth.currentUser;

  const codeInput = document.getElementById("code-input") as HTMLInputElement;
  const code = codeInput.value.trim();

  sendingCode();

  const cred = PhoneAuthProvider.credential(verificationId, code);
  const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

  try {
    if (user) {
      await multiFactor(user).enroll(
        multiFactorAssertion,
        "My personal phone number"
      );
      return true;
    }
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

export const signInUser = async (loginform: HTMLFormElement) => {
  const emailInput = loginform.elements.namedItem("email") as HTMLInputElement;
  const passwordInput = loginform.elements.namedItem(
    "password"
  ) as HTMLInputElement;

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const isFormValid = formValidation(email, password);

  if (!isFormValid) {
    return;
  }

  loggingIn();

  let recaptchaVerifier;
  let resolver;
  let phoneInfoOptions;
  let phoneAuthProvider;

  try {
    const response = await signInWithEmailAndPassword(auth, email, password);

    let isVerified;
    let verifiedEmail;
    let enroll;
    let phoneNumber;
    let verificationId;
    let smsSent;
    let verifiedPhoneNumber;

    if (!response.user.emailVerified) {
      sendingVerificationEmail();

      isVerified = await getEmailVerificationStatus();

      if (isVerified) {
        verifiedEmail = await emailVerificationSuccess();
      }
      if (verifiedEmail) {
        enroll = await MFAEnrollment();
      }
      if (enroll) {
        phoneNumber = await enterPhoneNumber();
      }
      if (phoneNumber) {
        verificationId = await smsVerification();
      }
      if (verificationId) {
        smsSent = await sendSMS();
      }
      if (smsSent) {
        if (verificationId) {
          verifiedPhoneNumber = await enterVerificationCode(verificationId);
        }
      }
      if (verifiedPhoneNumber) {
        success();
      }
    } else if (multiFactor(response.user).enrolledFactors.length === 0) {
      const enroll = await MFAEnrollment();
      if (enroll) {
        phoneNumber = await enterPhoneNumber();
      }
      if (phoneNumber) {
        verificationId = await smsVerification();
      }
      if (verificationId) {
        smsSent = await sendSMS();
      }
      if (smsSent) {
        if (verificationId) {
          verifiedPhoneNumber = await enterVerificationCode(verificationId);
        }
      }
      if (verifiedPhoneNumber) {
        success();
      }
    }

    return;
  } catch (error: any) {
    if (error.code === "auth/invalid-login-credentials") {
      invalidCredential();
      return;
    } else if (error.code === "auth/multi-factor-auth-required") {
      recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
        callback: () => {},
      });

      resolver = getMultiFactorResolver(auth, error);

      if (resolver.hints[0].factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
        phoneInfoOptions = {
          multiFactorHint: resolver.hints[0],
          session: resolver.session,
        };
        phoneAuthProvider = new PhoneAuthProvider(auth);
      }
    } else {
      return;
    }

    try {
      if (phoneAuthProvider && phoneInfoOptions) {
        const verificationId = await phoneAuthProvider.verifyPhoneNumber(
          phoneInfoOptions,
          recaptchaVerifier
        );

        recaptchaVerifier.clear();

        if (resolver && verificationId) {
          return { resolver, verificationId };
        }
      }
    } catch (error: any) {
      console.log(error);
      return;
    }
  }
};

export const enterSMSCode = async (
  response:
    | {
        resolver: MultiFactorResolver;
        verificationId: string;
      }
    | undefined
) => {
  if (response) {
    const { resolver, verificationId } = response;

    if (!resolver || !verificationId) {
      return false;
    }

    const smsInput = document.getElementById("sms-input") as HTMLInputElement;
    const smsCode = smsInput.value.trim();

    sendingCode();

    const cred = PhoneAuthProvider.credential(verificationId, smsCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
    try {
      await resolver.resolveSignIn(multiFactorAssertion);
      return true;
    } catch (error) {
      return false;
    }
  }
};

export const passwordResetEmailSent = async () => {
  const resetInput = document.getElementById("reset-input") as HTMLInputElement;

  const email = resetInput.value.trim();

  sendingResetPasswordEmail();

  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error: any) {
    console.log(error);
    return false;
  }
};
