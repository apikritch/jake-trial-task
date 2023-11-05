import {
  createUser,
  enterVerificationCode,
  getEmailVerificationStatus,
  smsVerification,
} from "../utils/auth";
import {
  emailVerificationSuccess,
  emailVerificationSent,
  MFAEnrollment,
  enterPhoneNumber,
  sendSMS,
  success,
} from "../utils/modal";

export const setupSignup = (signupform: HTMLFormElement) => {
  signupform.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isCreated = await createUser(signupform);

    if (!isCreated) {
      return;
    }

    let isVerified;
    let verifiedEmail;
    let enroll;
    let phoneNumber;
    let verificationId;
    let smsSent;
    let verifiedPhoneNumber;

    const sent = await emailVerificationSent(signupform);

    if (sent) {
      isVerified = await getEmailVerificationStatus();
    }

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
  });
};
