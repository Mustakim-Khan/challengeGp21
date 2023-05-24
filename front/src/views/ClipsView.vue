<template>
  <v-container>
    <div
      class="d-flex justify-space-between align-center flex-column flex-sm-row fill-height"
    >
      <v-btn color="teal accent-4" @click="navigateTo('home')"> Back </v-btn>
      <v-btn color="primary" @click="navigateEdit('clip-edit', 'new')">
        Add
      </v-btn>
    </div>
    <h1 class="text-h2 text-center mb-10">Clips</h1>
    <div>
      <v-row>
        <v-col v-for="clip in getClips" :key="clip.id" :cols="cols">
          <CardClip :clip="clip" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
import CardClip from "../components/CardClip.vue";

export default {
  mounted() {
    this.$store.dispatch("getClipValid");
  },
  components: { CardClip },
  methods: {
    navigateTo(route) {
      this.$router.push({ name: route });
    },
    navigateEdit(route, id) {
      this.$router.push({ name: route, params: { id: id } });
    },
  },
  computed: {
    ...mapGetters(["getClips"]),
    cols() {
      let col = 12;
      switch (this.$vuetify.display.name) {
        case "xs":
          col = 12;
          break;
        case "sm":
          col = 9;
          break;
        case "md":
          col = 6;
          break;
        case "lg":
          col = 4;
          break;
        case "xl":
          col = 3;
          break;
      }

      return col;
    },
  },
};
</script>
