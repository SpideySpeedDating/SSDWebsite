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
    },
    "intro-questions" : {
        title: "Intro Questions",
        template: "/templates/intro-questions.html"
    },
    "info" : {
        title: "Information",
        template: "/templates/info.html"
    },
    "question" : {
        title: "Questions",
        template: "/templates/question.html"
    },
    "dating-screen" : {
        title: "Dating Time!",
        template: "/templates/dating-screen.html"
    },
    "dating-info" : {
        title: "Contact Us",
        template: "/templates/dating-info.html"
    },
    "congrats" : {
        title: "Contact Us",
        template: "/templates/congrats.html"
    },
}, {});