<template>
  <v-container>
    <v-btn color="teal accent-4" @click="navigateTo('home')"> Back </v-btn>
    <h1 class="text-h2 text-center mb-10">Clips</h1>
    <div>
      <v-row>
        <v-col v-for="clip in getClips" :key="clip.id" :cols="cols">
          <video-player
            :src="clip.path"
            controls
            disablePictureInPicture
            responsive
            height="200"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  mounted() {
    this.$store.dispatch("getAllClip");
  },
  methods: {
    navigateTo(route) {
      this.$router.push({ name: route });
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
