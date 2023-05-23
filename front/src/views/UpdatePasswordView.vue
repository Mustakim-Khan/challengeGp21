<template>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="validate">
    <v-card class="mx-auto my-auto" max-width="500">
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>{{
          isAuthenticated ? "Reset Password" : "Forgot password"
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-if="!isAuthenticated"
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          placeholder="Enter the email address used to log on."
          required
        >
        </v-text-field>
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
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" variant="tonal" type="submit">
          {{ isAuthenticated ? "Reset" : "Submit" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { mapGetters } from "vuex";
import { objectToJson } from "../../utils/utils";
export default {
  data() {
    return {
      user: {},
      valid: true,
      password: "",
      cpassword: "",
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  computed: {
    isAuthenticated() {
      return !!this.$store.getters.getCurrentUser;
    },
    ...mapGetters(["getCurrentUser"]),
  },
  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        if (this.isAuthenticated) {
          this.resetPwd();
        } else {
          this.forgetPwd();
        }
      }
    },
    resetPwd() {
      this.user = objectToJson(this.getCurrentUser);
      this.$store
        .dispatch("updateUserDatas", {
          username: this.user.username,
        })
        .then(
          (response) => {
            if (response.status == 200) {
              this.user["id"] = objectToJson(response.data[0])["id"];
              this.$store
                .dispatch("resetPassword", {
                  userId: this.user.id,
                  userPwd: this.cpassword,
                })
                .then(
                  (response) => {
                    if (response.status !== 200) {
                      console.log("Reset Pwd failed: ", response);
                    }
                  },
                  (error) => {
                    console.log(`Reset Pwd echec: ${error}`);
                  }
                );
            }
          },
          (error) => {
            console.log(`Reset Pwd error =>  ${error}`);
          }
        );
    },
    forgetPwd() {
      this.$store
        .dispatch("forgetPassword", { email: this.email })
        .then((error) => {
          console.log(`Forget Pwd : ${error}`);
        });
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
    // objectToJson(obj) {
    //   if (obj == undefined || obj == "" || obj == null) {
    //     return {};
    //   }
    //   const keysList = Reflect.ownKeys(obj);
    //   const valuesList = Object.values(obj);
    //   const datas = {};
    //   keysList.forEach((values, index) => {
    //     return (datas[values] = valuesList[index]);
    //   });
    //   return datas;
    // },
  },
};
</script>
