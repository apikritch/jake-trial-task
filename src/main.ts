import { getAuth, onAuthStateChanged, multiFactor } from "firebase/auth";

import { app } from "./lib/firebase";
import onUgoLogo from "/images/onUgo_Identity_Reversed.svg";
import "./main.css";

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
        <div class="header">Home</div>
        <div class="home-btn-group">
          <a href="/signup/">
              <button type="button" id="go-signup" class="waves-effect waves-light btn-large">Signup</button>
          </a>
          <a href="/login/">
              <button type="button" id="go-login" class="waves-effect waves-light btn-large">Login</button>
          </a>
        </div>
      </div>
      <div id='recaptcha'></div>
    </div>
    `;
  }
});
