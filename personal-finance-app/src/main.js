import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index.js";
import { useTransactionStore } from "./stores/index.js";
import "@/styles/main.scss";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          surface: "#F8F8FF",
          primary: "#1976D2",
          secondary: "#20C997",
          error: "#E74C3C",
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
  },
});

const pinia = createPinia();
app.use(pinia);
app.use(router);

app.use(vuetify);

const transactionStore = useTransactionStore();

transactionStore.loadTransactions().then(() => {
  app.mount("#app");
});
