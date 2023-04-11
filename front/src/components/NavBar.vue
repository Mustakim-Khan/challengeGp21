<template>
  <v-app-bar color="primary" density="compact">
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <v-app-bar-title @click="navigateTo('home')">App</v-app-bar-title>

    <v-spacer></v-spacer>

    <div v-if="isRouteLogin">
      <v-btn icon @click="navigateTo('login')">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>

      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </div>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home"
        title="Home"
        value="home"
        @click="navigateTo('home')"
      >
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-newspaper"
        title="Aticles"
        value="articles"
        @click="navigateTo('articles')"
      >
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-forum"
        title="Forums"
        value="forums"
        @click="navigateTo('forums')"
      >
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-tournament"
        title="Tournaments"
        value="tournaments"
        @click="navigateTo('tournaments')"
      >
      </v-list-item>
      <!-- TODO: verify if user is admin -->
      <v-list-item
        prepend-icon="mdi-monitor-dashboard"
        title="admin"
        value="admin"
        @click="navigateTo('admin')"
      >
      </v-list-item>
      <!-- END TODO: verify if user is admin -->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    isRouteLogin: false,
  }),
  methods: {
    navigateTo(route) {
      this.$router.push({ name: route });
    },
    logout() {
      this.$store.dispatch("logout");
      this.navigateTo("login");
    },
    setIsRouteLogin() {
      this.isRouteLogin = this.$route.name == "login";
    },
  },
  mounted() {
    this.setIsRouteLogin();
  },
};
</script>
