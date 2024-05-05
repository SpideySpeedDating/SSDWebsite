import { Router } from "./lib/router.js";

const router = new Router({
    "/" : {
        title: "Home",
        template: "/templates/index.html"
    },
    "contact-us" : {
        title: "Contact Us",
        template: "/templates/contact-us.html"
    },
    "login" : {
        title: "Login",
        template: "/templates/login.html"
    }
}, {});