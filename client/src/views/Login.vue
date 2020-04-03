<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h2 class="title">Log in</h2>
          <div class="box">
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="text"
                  name="username"
                  v-model="form.username"
                  placeholder="Portal Account"
                />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="password"
                  name="password"
                  v-model="form.password"
                  placeholder="Password"
                />
              </div>
            </div>
            <button @click="login" class="button is-block is-fullwidth is-info">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { LOGIN } from "@/store/actions.type.js";

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    login() {
      // dispatch request to store
      this.$store
        .dispatch(LOGIN, this.form)
        .then(() => this.$router.push("/"))
        .catch(err => {
          console.log(err);
          this.$toasted.error("Couldn't log in");
        });
    }
  }
};
</script>

<style scoped></style>
