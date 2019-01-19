import Vue from "vue";
import ElementUI from "element-ui";
import VCharts from "v-charts";
import App from "./App.vue";
import "./plugins/element.js";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VCharts);

new Vue({
  render: h => h(App)
}).$mount("#app");
