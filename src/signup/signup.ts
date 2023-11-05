import { getAuth, onAuthStateChanged, multiFactor } from "firebase/auth";
import { setupSignup } from "../lib/helpers/signup";
import { setupReset } from "../lib/helpers/resetPassword";

import { app } from "../lib/firebase";
import onUgoLogo from "/images/onUgo_Identity_Reversed.svg";
import "./signup.css";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user && multiFactor(user).enrolledFactors.length > 0) {
    window.location.href = "/user/";
  } else {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div>
    <a href="https://www.onugo.com/" target="_blank">
      <img src="${onUgoLogo}" class="logo" alt="Vite logo" />
    </a>

    <div class="card">
      <div class="header">Signup</div>
        <form class="signup-form" id="signup-form">
          <div class="input-field col s6">
            <input id="email" type="email" class="validate" name="email" autocomplete="username" required>
            <label for="email">Email Address</label>
            <span class="helper-text" data-error="Please enter a valid email address"></span>
          </div>

          <div class="input-field col s6">
            <input id="password" type="password" class="validate" name="password" autocomplete="current-password" required>
            <label for="password">Password</label>
            <span class="helper-text" data-error="Please enter your password"></span>
          </div>

          <button type="submit" class="signup-btn waves-effect waves-light btn-large">SIGNUP</button>
          <p>
            Already have an account?
            <a href="/login/" class="register-link">
              Login
            </a>
          </p>
        </form>
        <a class="forgot-btn" id="reset">Forgot Password?</a>
      </div>
      <div id='recaptcha'></div>
    </div>
    `;

    const signupform = document.getElementById(
      "signup-form"
    ) as HTMLFormElement;
    const resetButton = document.getElementById("reset") as HTMLAnchorElement;

    setupSignup(signupform);
    setupReset(resetButton);
  }
});
