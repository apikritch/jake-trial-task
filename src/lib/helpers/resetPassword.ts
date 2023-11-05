import { passwordResetEmailSent } from "../utils/auth";
import { forgotPassword, sentEmailSuccessful } from "../utils/modal";

export const setupReset = async (resetButton: HTMLAnchorElement) => {
  resetButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const enterEmail = await forgotPassword();

    let emailSent;

    if (enterEmail) {
      emailSent = await passwordResetEmailSent();
    }

    if (emailSent) {
      sentEmailSuccessful();
    }
  });
};
