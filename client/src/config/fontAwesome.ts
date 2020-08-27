import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPencilAlt, faTrash, faSearch, faThumbsUp, faDownload, faInfoCircle, faCheck, faBell, faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPencilAlt, faTrash, faSearch, faThumbsUp, faGithub, faDownload, faInfoCircle, faGoogle, faCheck, faBell, faAngleDown, faAngleUp);

Vue.component("font-awesome-icon", FontAwesomeIcon);
