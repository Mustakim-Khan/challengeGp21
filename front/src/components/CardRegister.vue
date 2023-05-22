<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-card class="mx-auto" max-width="500">
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>Create Account</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="username"
          :counter="10"
          :rules="usernameRules"
          label="Username"
          required
        ></v-text-field>

        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="[required, passwordField]"
          type="password"
          clearable
          label="Password"
          placeholder="Enter your password"
        ></v-text-field>

        <v-text-field
          v-model="cpassword"
          :rules="[required, passwordField, matchingPasswords]"
          type="password"
          clearable
          label="Confirm Password"
          placeholder="Confirm your password"
          required
        ></v-text-field>

        <v-checkbox
          v-model="checkbox"
          :rules="[(v) => !!v || 'You must agree to continue!']"
          label="Do you agree?"
          required
        ></v-checkbox>
      </v-card-text>

      <v-btn color="primary" variant="plain" @click="navigateTo('login')">
        Login
      </v-btn>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="createAccount"> create Account </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    valid: true,
    username: "",
    usernameRules: [
      (v) => !!v || "Username is required",
      (v) => (v && v.length <= 10) || "Userame must be less than 10 characters",
    ],
    password: "",
    // passwordRules: [
    //   (v) => !!v || "Password is required",
    //   (v) => (v && v.length >= 8) || "Password must be equal or greater than 8",
    // ],
    cpassword: "",
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    checkbox: false,
  }),

  computed: {
    ...mapState(["status"]),
  },
  mounted() {
    // if (this.$store.state.user.id != "") {
    if (this.$store.state.user) {
      console.log(`user : ${this.$store.state.user}`);
      // this.$router.push({ name: "home" });
    }
  },
  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        if (this.password !== this.cpassword) {
          console.log(`${this.password} different ${this.cpassword}`);
        } else {
          this.createAccount();
        }
      }
    },
    createAccount() {
      // TODO: Register user
      this.$store
        .dispatch("createAccount", {
          username: this.username,
          email: this.email,
          password: this.password,
        })
        .then(
          (response) => {
            console.log(response);
            this.navigateTo("login");
          },
          (error) => {
            console.log(error);
          }
        );
    },
    required(value) {
      if (value) {
        return true;
      } else {
        return "This field is required.";
      }
    },
    passwordField(value) {
      if (value.length >= 8 && value.length <= 20) {
        return true;
      } else {
        return "Password should have more than 8 characters and les than 20.";
      }
    },
    matchingPasswords() {
      if (this.password === this.cpassword) {
        return true;
      } else {
        return "Passwords does not match.";
      }
    },
    navigateTo(route) {
      this.$router.push({ name: route });
    },
  },
};
</script>
