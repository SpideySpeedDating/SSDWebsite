import { Router } from "./lib/router.js";

const router = new Router({
    "/" : {
        title: "Home",
        template: "index"
    },
    "contact-us" : {
        title: "Contact Us",
        template: "contact-us"
    },
    "login" : {
        title: "Login",
        template: "login"
    },
    "info" : {
        title: "Information",
        template: "info"
    },
    "question" : {
        title: "Questions",
        template: "question"
    },
    "dating-screen" : {
        title: "Dating Time!",
        template: "dating-screen"
    },
    "dating-info" : {
        title: "Contact Us",
        template: "dating-info"
    },
});

await router.start();