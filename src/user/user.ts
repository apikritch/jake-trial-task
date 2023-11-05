import { getAuth, onAuthStateChanged, multiFactor } from "firebase/auth";

import { app } from "../lib/firebase";
import onUgoLogo from "/images/onUgo_Identity_Reversed.svg";

import "./user.css";
import { setupLogout } from "../lib/helpers/logout";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user && multiFactor(user).enrolledFactors.length > 0) {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div>
        <a href="https://www.onugo.com/" target="_blank">
        <img src="${onUgoLogo}" class="logo" alt="Vite logo" />
        </a>

        <div class="card">
            <h4>Welcome,</h4>
            <h5> ${user.email}</h5>
            <button type="button" id="logout" class="logout-btn waves-effect waves-light btn-large">LOGOUT</button>
        </div>
    </div>
    `;

    const logoutButton = document.getElementById("logout") as HTMLButtonElement;

    setupLogout(logoutButton);
  } else {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div>
        <a href="https://www.onugo.com/" target="_blank">
        <img src="${onUgoLogo}" class="logo" alt="Vite logo" />
        </a>

        <div class="card">
            <h6>Please login to access this page</h6>
            <a href="/login/">
                <button type="button" class="login-btn waves-effect waves-light btn-large">LOGIN</button>
            </a>
        </div>
    </div>
    `;
  }
});
