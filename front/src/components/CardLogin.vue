<template>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="validate">
    <v-card class="mx-auto" max-width="500">
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>Login</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="username"
          :rules="usernameRules"
          label="Username"
          required
          autofocus
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          type="password"
          clearable
          label="Password"
          placeholder="Enter your password"
        ></v-text-field>
      </v-card-text>

      <v-btn color="primary" variant="plain" @click="navigateTo('register')">
        Create Account
      </v-btn>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" type="submit"> Login </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { mapState } from "vuex";
import jwtDecode from "jwt-decode";

export default {
  data: () => ({
    valid: true,
    username: "",
    usernameRules: [(v) => !!v || "Username is required"],
    password: "",
    passwordRules: [(v) => !!v || "Password is required"],
  }),
  mounted() {
    // if (this.$store.state.authToken != "") {
    //   this.$router.push({ name: "home" });
    // }
  },

  computed: {
    ...mapState(["status"], ["user"]),
  },
  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        this.login();
      }
    },
    login() {
      // TODO: Login
      this.$store
        .dispatch("login", {
          username: this.username,
          password: this.password,
        })
        .then(
          () => {
            this.$store.dispatch("fetchAccessToken");
            const userDecode = jwtDecode(this.$store.state.authToken);
            this.username = userDecode ? userDecode.username : "John Doe";
            this.$store.dispatch("updateCurrentUser", userDecode);
            console.log("---------");
            console.log(`Login.vue | Logged | UserDecode => ${userDecode}`);
            console.log(
              `Login.vue | Logged | User => ${this.username} | state => ${this.$store.getters.getCurrentUser}`
            );
            console.log("---------");
            this.navigateTo("home");
          },
          (error) => {
            console.log(error);
          }
        );
    },
    navigateTo(route) {
      this.$router.push({ name: route });
    },
  },
};
</script>

<!-- Fait
 - Mettre à jour l'utilisateur avec le token :
    - Decode token and update user

-->
