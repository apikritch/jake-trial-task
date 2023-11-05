import Swal from "sweetalert2";
import { checkEnrollment, sendingVerificationEmail } from "./auth";

export const loggingIn = () => {
  Swal.fire({
    title: "Please Wait",
    text: "We are logging you in...",
    padding: "3rem",
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

//Modal for signup feature
export const emailVerificationSent = async (signupform: HTMLFormElement) => {
  const emailInput = signupform.elements.namedItem("email") as HTMLInputElement;
  const email = emailInput.value.trim();

  const result = await Swal.fire({
    padding: "1rem 3rem 3rem 3rem",
    iconHtml: "<i class='material-icons'>email</i>",
    html: `<h5>Email Verification</h5><p>Welcome, ${email}!</p><p>We take your account security very seriously, and require all users to verify their email address and enroll into multi-factor authentication</p>`,
    confirmButtonText: "CONTINUE TO EMAIL VERIFICATION",
    confirmButtonColor: "#2196f3",
    customClass: {
      confirmButton: "email-verification",
      icon: "email-icon",
    },
  });

  if (result.isConfirmed) {
    sendingVerificationEmail();
    return true;
  }
};

export const waitingForVerification = (email: string | null) => {
  Swal.fire({
    padding: "1rem 3rem 3rem 3rem",
    iconHtml: "<i class='material-icons'>access_time</i>",
    html: `<h5>Email Verification</h5><p>An email with verification link has been sent to ${email}</p><p>Account setup process will continue here once the email has been verified</p>`,
    customClass: {
      icon: "access-time-icon",
    },
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const emailVerificationSuccess = async () => {
  const result = await Swal.fire({
    padding: "1rem 3rem 3rem 3rem",
    title: "Verification Successful",
    text: "Your email has been verified",
    icon: "success",
    confirmButtonText: "CONTINUE",
    confirmButtonColor: "#2196f3",
    customClass: {
      confirmButton: "verification-success",
    },
  });

  if (result.isConfirmed) {
    return true;
  }
};

export const MFAEnrollment = async () => {
  loggingIn();

  const enrollmentStatus = checkEnrollment();

  if (enrollmentStatus && !enrollmentStatus.status) {
    const result = await Swal.fire({
      padding: "1rem 3rem 3rem 3rem",
      iconHtml: "<i class='material-icons'>verified_user</i>",
      html: `<h5>Account Security</h5><p>Welcome, ${enrollmentStatus.email}!</p><p>To ensure your account's security we require all users to enroll into multi-factor authentication</p>`,
      confirmButtonText: "CONTINUE TO MULTI-FACTOR",
      confirmButtonColor: "#2196f3",
      customClass: {
        confirmButton: "verify-user",
        icon: "verified-user-icon",
      },
      didOpen: () => {
        Swal.hideLoading();
      },
    });

    if (result.isConfirmed) {
      return true;
    }
  }
};

export const enterPhoneNumber = async () => {
  const result = await Swal.fire({
    title: "Mobile Number",
    text: "Please enter your phone number",
    padding: "1rem 3rem 3rem 3rem",
    confirmButtonText: "CONTINUE",
    confirmButtonColor: "#2196f3",
    customClass: {
      confirmButton: "verify-phone",
    },
    input: "text",
    inputLabel: "Phone Number",
    inputPlaceholder: "e.g +614XXXXXXXX",
    inputAutoTrim: true,
    inputAttributes: { id: "phone-input" },
    inputValidator: (value) => {
      const regex = /^\+\d+/;

      if (
        !value ||
        value.length < 11 ||
        value.length > 19 ||
        !value.match(regex)
      ) {
        return "Invalid Phone Number Format";
      }
    },
  });

  if (result.value) {
    return true;
  }
};

export const sendingSMS = () => {
  Swal.fire({
    title: "Please Wait",
    text: "Sending a verification SMS",
    padding: "3rem",
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const sendSMS = async () => {
  const result = await Swal.fire({
    title: "Multi-Factor Authentication",
    text: "Please enter the SMS Verification Code we've sent to your mobile",
    padding: "3rem",
    confirmButtonText: "SUBMIT",
    confirmButtonColor: "#2196f3",
    customClass: {
      confirmButton: "verify-code",
    },
    input: "text",
    inputLabel: "Verification Code",
    inputAutoTrim: true,
    inputAttributes: { id: "code-input" },
    inputValidator: (value) => {
      const regex = /\d+/g;

      if (!value || value.length !== 6 || !value.match(regex)) {
        return "Invalid Verification Code Format";
      }
    },
  });

  if (result.value) {
    return true;
  }
};

export const sendingCode = () => {
  Swal.fire({
    title: "Please Wait",
    text: "Verifying SMS Verification Code",
    padding: "3rem",
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const success = () => {
  Swal.fire({
    padding: "1rem 3rem 3rem 3rem",
    title: "Account Protected with MFA",
    text: "You are currently being redirected, you may now sign in with your account",
    icon: "success",
    timer: 3000,
    showConfirmButton: false,
    willClose: () => {
      window.location.href = "/login/";
    },
  });
};

//Modal for login feature
export const MFAVerification = async () => {
  const result = await Swal.fire({
    title: "Multi-Factor Authentication",
    text: "Please enter the SMS Verification Code we've sent to your mobile",
    padding: "3rem",
    confirmButtonText: "SUBMIT",
    confirmButtonColor: "#2196f3",
    customClass: {
      confirmButton: "verify-code",
    },
    input: "text",
    inputLabel: "Verification Code",
    inputAutoTrim: true,
    inputAttributes: { id: "sms-input" },
    inputValidator: (value) => {
      const regex = /\d+/g;

      if (!value || value.length !== 6 || !value.match(regex)) {
        return "Invalid Verification Code Format";
      }
    },
  });

  if (result.value) {
    return true;
  }
};

export const logggedIn = () => {
  Swal.fire({
    padding: "1rem 3rem 3rem 3rem",
    title: "Welcome!",
    text: "You are currently being redirected, this should take just a moment",
    icon: "success",
    timer: 3000,
    showConfirmButton: false,
    willClose: () => {
      window.location.href = "/user/";
    },
  });
};

//Modal for forgot password feature
export const forgotPassword = async () => {
  const result = await Swal.fire({
    title: "Forgot Password?",
    text: "We'll email you a link to reset your password",
    padding: "3rem",
    confirmButtonText: "SEND",
    confirmButtonColor: "#2196f3",
    customClass: {
      confirmButton: "reset-btn",
    },
    input: "email",
    inputLabel: "Email",
    inputAutoTrim: true,
    inputAttributes: { id: "reset-input" },
  });

  if (result.value) {
    return true;
  }
};

export const sendingResetPasswordEmail = () => {
  Swal.fire({
    title: "Please Wait",
    text: "Sending a link to reset your password",
    padding: "3rem",
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const sentEmailSuccessful = () => {
  Swal.fire({
    padding: "1rem 3rem 3rem 3rem",
    title: "Forgot Password?",
    text: "We've sent a link to reset your password, this should take just a moment",
    icon: "success",
    timer: 3000,
    showConfirmButton: false,
    willClose: () => {
      window.location.href = "/login/";
    },
  });
};

//Error handler
export const emailExists = () => {
  Swal.fire({
    icon: "error",
    title: "This email already in use",
    text: "Please sign in or choose another email address",
    confirmButtonText: "CLOSE",
    confirmButtonColor: "#2196f3",
    customClass: {
      confirmButton: "email-verification",
    },
  });
};

export const invalidCredential = () => {
  Swal.fire({
    icon: "error",
    title: "Invalid login credentials",
    text: "The username or password you entered is incorrect",
    confirmButtonText: "CLOSE",
    confirmButtonColor: "#2196f3",
    customClass: {
      confirmButton: "reset-btn",
    },
  });
};
