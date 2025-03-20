import { createApp } from "vue";
import App from "./App";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";

const app = createApp(App);

app.use(autoAnimatePlugin);

app.mount("#app");
