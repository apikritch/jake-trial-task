import { enterSMSCode, signInUser } from "../utils/auth";
import { MFAVerification, logggedIn } from "../utils/modal";

export const setupLogin = (loginform: HTMLFormElement) => {
  loginform.addEventListener("submit", async (event) => {
    event.preventDefault();

    const response = await signInUser(loginform);

    if (!response) {
      return;
    }

    const phoneNumber = await MFAVerification();

    let result;

    if (phoneNumber) {
      result = await enterSMSCode(response);
    }

    if (result) {
      logggedIn();
    }
  });
};
