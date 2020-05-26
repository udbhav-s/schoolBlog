<template>
  <div>
    <input v-model="form.username" type="text" />
    <input v-model="form.password" type="password" />
    <button @click="login">Login</button>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent } from "@vue/composition-api";
import { userStore } from "@/store";

export default defineComponent({
  name: "Login",

  setup(props, { root }) {
    const form = reactive({
      username: "",
      password: ""
    });

    function login() {
      userStore.mutations
        .login(form)
        .then(() => root.$router.push("/"))
        .catch(err => {
          root.$toasted.error("Error logging in: " + err.message);
        });
    }

    return {
      form,
      login
    };
  }
});
</script>
