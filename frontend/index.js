import { Router } from "./lib/router.js";

const router = new Router({
    "/" : {
        title: "Home",
        template: "index",
        guarded: false
    },
    "login" : {
        title: "Login",
        template: "login",
        guarded: false
    },
    "intro-questions" : {
        title: "Intro Questions",
        template: "intro-questions",
        guarded: true
    },
    "info" : {
        title: "Information",
        template: "info",
        guarded: false
    },
    "question" : {
        title: "Questions",
        template: "question",
        guarded: true
    },
    "dating-screen" : {
        title: "Dating Time!",
        template: "dating-screen",
        guarded: true
    },
    "dating-info" : {
        title: "Dating-info",
        template: "dating-info",
        guarded: true
    },
    "congrats" : {
        title: "Congrats",
        template: "congrats",
        guarded: true
    }
});

await router.start();
