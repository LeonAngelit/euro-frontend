import { createApp } from "vue";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router/index";
import { Buffer } from "buffer";
import "./index.css";

// FontAwesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Google OAuth
import vue3GoogleLogin from "vue3-google-login";
import config from "./config/config";

library.add(faEye, faEyeSlash, faStar);
(window as any).Buffer = (window as any).Buffer || Buffer;

const pinia = createPinia();
pinia.use(createPersistedState());

const app = createApp(App);
app.component("FontAwesomeIcon", FontAwesomeIcon);
app.use(pinia);
app.use(router);
app.use(vue3GoogleLogin, { clientId: config.clientID });
app.mount("#root");
