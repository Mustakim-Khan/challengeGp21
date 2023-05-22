<template>
  <v-container class="py-8 px-6" fluid>
    <Sidebar :drawer="drawer" />
    <Topbar @drawerEvent="drawer = !drawer" />
  </v-container>
</template>
<script>
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
export default {
  name: "App",
  components: { Topbar, Sidebar },
  data: () => ({
    drawer: null,
  }),
  methods: {},
};
</script>
