// =========================================
// NAV AUTH LINK
// Swaps the top-right corner link (.adminLink) between
// "ADMIN" (Overseer/Exec only) and "LOGIN / SIGN UP" (everyone else,
// including logged-out visitors, Viewers, Employees, and Correspondents).
// Include on every page that has the .adminLink element.
// =========================================

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth, can, getUserRole, ensureUserDoc } from "./roles.js";

function setLink(el, { href, text }) {
    if (!el) return;
    el.setAttribute("href", href);
    el.textContent = text;
}

document.addEventListener("DOMContentLoaded", () => {
    const link = document.querySelector(".adminLink");
    if (!link) return;

    // Default state before auth resolves: treat as logged out.
    setLink(link, { href: "login.html", text: "LOGIN / SIGN UP" });

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            setLink(link, { href: "login.html", text: "LOGIN / SIGN UP" });
            return;
        }

        await ensureUserDoc(user);
        const role = await getUserRole(user.uid);

        // Admin link only for Strike Team Overseer or CPI Exec.
        if (can.manageClassifications(role)) {
            setLink(link, { href: "admin.html", text: "ADMIN" });
        } else {
            setLink(link, { href: "login.html", text: "LOGIN / SIGN UP" });
        }
    });
});
