<template>
  <div>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-title @click="navigateTo('home')">Home</v-app-bar-title>
      <v-spacer></v-spacer>

      <!-- TODO: check if user is connect display login / logout -->
      <v-btn v-if="!isLoggin" icon @click="navigateTo('login')">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
      <div v-else>
        <v-menu class="mt-5">
          <template v-slot:activator="{ props }">
            <span v-bind="props" style="cursor: pointer" class="mx-5 mr-10">
              <v-badge
                color="error"
                offset-y="1"
                :content="notifications.length"
              >
                <v-icon>mdi-bell</v-icon>
              </v-badge>
            </span>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in notifications"
              :key="index"
              :value="index"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu>
          <template v-slot:activator="{ on, props }">
            <span
              v-bind="props"
              @click="on"
              style="cursor: pointer"
              class="mx-5 mr-10"
            >
              <v-chip style="cursor: pointer" link>
                <v-badge dot bottom color="green" offset-y="20">
                  <v-avatar start>
                    <v-img
                      src="https://cdn.vuetifyjs.com/images/john.png"
                    ></v-img>
                  </v-avatar>
                </v-badge>
                <span class="ml-3">{{ getUsername }}</span>
              </v-chip>
            </span>
          </template>
          <v-card width="250">
            <v-list density="compact">
              <v-list-item two-line>
                <v-list-item-title>{{ getUsername }}</v-list-item-title>
                <v-list-item-subtitle>Logged In</v-list-item-subtitle>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                v-for="(menu, index) in menus"
                :key="index"
                :value="index"
                active-color="primary"
                @click="menu.action"
              >
                <template v-slot:prepend>
                  <v-icon :icon="menu.icon"></v-icon>
                </template>
                <v-list-item-title>{{ menu.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-home"
          title="Dashboard"
          value="userDashboard"
          @click="navigateTo('user-dashboard')"
        >
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-newspaper"
          title="Articles"
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
  </div>
</template>

<script>
import jwtDecode from "jwt-decode";
export default {
  data: () => ({
    user: null,
    drawer: false,
    menus: [],
    notifications: [], // Current user notifications : signalement, email, ...
  }),
  computed: {
    getUsername() {
      return this.$store.getters.getCurrentUser
        ? this.$store.getters.getCurrentUser.username
        : "john Deo";
    },
    isLoggin() {
      return !!this.$store.getters.getCurrentUser;
    },
  },
  methods: {
    navigateTo(route) {
      this.$router.push({ name: route });
    },
    logout() {
      this.user = null;
      this.$store.dispatch("logout").then(this.$router.push({ name: "login" }));
      this.$store.dispatch("updateCurrentUser", null);
    },
  },
  created() {
    this.menus = [
      {
        title: "Change Password",
        icon: "mdi-key",
        action: () => this.$router.push({ name: "user-updatePassword" }),
      },
      { title: "Setting", icon: "mdi-cog", action: () => {} },
      { title: "Logout", icon: "mdi-logout", action: this.logout },
    ];
    this.notifications.push({ title: "New article has been published" });
    this.$store.dispatch("fetchAccessToken");
    this.user = this.$store.getters.getCurrentUser;
    if (
      this.$store.getters.getAuthToken != null &&
      typeof this.$store.getters.getAuthToken != "string"
    ) {
      if (this.user == null || typeof this.user == "string") {
        const userDecode = jwtDecode(this.$store.getters.getAuthToken);
        this.$store.dispatch("updateCurrentUser", userDecode);
      }
    } else {
      this.user = null;
    }
  },
  mounted() {
    this.$store.dispatch("fetchAccessToken");
    if (this.$store.getters.getAuthToken != null) {
      if (this.$store.getters.getCurrentUser != null) {
        this.user = this.$store.getters.getCurrentUser;
      } else {
        const userDecode = jwtDecode(this.$store.getters.getAuthToken);
        this.$store.dispatch("updateCurrentUser", userDecode);
      }
    } else {
      this.user = null;
    }

  },
};
</script>
