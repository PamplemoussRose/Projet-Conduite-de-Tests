import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

let app;

onAuthStateChanged(auth, (user) => {
    if (!app) {
        app = createApp(App).use(router).mount("#app");
    }
    if (user) {
        console.log("Utilisateur connecté :", user.email);
    } else {
        console.log("Aucun utilisateur connecté.");
    }
});



