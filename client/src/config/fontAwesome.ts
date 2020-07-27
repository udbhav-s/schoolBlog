import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPencilAlt, faTrash, faSearch, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPencilAlt, faTrash, faSearch, faThumbsUp);

Vue.component("font-awesome-icon", FontAwesomeIcon);
