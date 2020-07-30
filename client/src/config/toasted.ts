import Vue from "vue";
import Toasted from "vue-toasted";

Vue.use(Toasted, {
  duration: 1500,
  position: "top-center",
  containerClass: "app-toast-container"
});
