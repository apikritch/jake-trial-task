import { app } from "../firebase";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(app);

export const setupLogout = async (logoutButton: HTMLButtonElement) => {
  logoutButton.addEventListener("click", async (event) => {
    event.preventDefault();
    await signOut(auth);
    window.location.href = "/login/";
  });
};
