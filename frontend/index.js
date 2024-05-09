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
    "intro-questions" : {
        title: "Intro Questions",
        template: "intro-questions"
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
    "congrats" : {
        title: "Congrats",
        template: "congrats"
    }
});

await router.start();
