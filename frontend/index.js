import { Router } from "./lib/router.js";

const router = new Router({
    "/" : {
        title: "Home",
        template: "/templates/index.html"
    }
}, {});