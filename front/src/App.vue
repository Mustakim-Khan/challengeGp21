<script setup>
import { RouterView } from "vue-router"; // <--- import RouterLink
import NavBar from "./components/NavBar.vue";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import jwtDecode from "jwt-decode";

const store = useStore();
let user = ref(null);
store.dispatch("fetchAccessToken"); // Fetch token in local storage

user = computed(() => {
  return store.getters.getCurrentUser;
});

onMounted(() => {
  store.dispatch("fetchAccessToken"); // App.vue | Mounted | Fetch token in local storage
  if (
    store.state.authToken != null &&
    typeof store.state.authToken != "string"
  ) {
    // Getter user
    const uD = store.getters.getCurrentUser();
    if (uD != null && typeof uD != "string") {
      // Set this user
      // user = uD;
      console.log("App.vue | Mounted | User value updated => ", user);
    } else {
      const uD = jwtDecode(this.$store.state.authToken);
      store.dispatch("updateCurrentUser", user.value);
      console.log(
        "App.vue | Mounted | User value => ",
        user.value,
        " \n\t\t uD => ",
        uD
      );
    }
    user = uD;
  }
  if (user != null && typeof user != "string") {
    store.dispatch("updateCurrentUser", user.value);
  }
});

// watch([user], ([user], [prevUser]) => {
//   if (user != null && typeof user != "string") {
//     if (user !== prevUser) {
//       console.log(
//         "App.vue | prevUser : ",
//         prevUser,
//         " \n\t\t newUser : ",
//         user
//       );
//     }
//   }
// });
</script>

<template>
  <v-app>
    <v-layout>
      <NavBar></NavBar>
      <v-main>
        <RouterView />
      </v-main>
    </v-layout>
  </v-app>
</template>
