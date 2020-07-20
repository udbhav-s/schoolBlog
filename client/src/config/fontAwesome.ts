import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPencilAlt, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPencilAlt, faTrash, faSearch);

Vue.component("font-awesome-icon", FontAwesomeIcon);
