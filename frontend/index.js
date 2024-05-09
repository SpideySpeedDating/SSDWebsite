import { Router } from "./lib/router.js";

const router = new Router({
    "/" : {
        title: "Home",
        template: "index"
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
        title: "Dating-info",
        template: "dating-info"
    },
    "congrats" : {
        title: "Congrats",
        template: "congrats"
    }
});

await router.start();
