<template>
  <v-container>
    <v-btn @click="back()" color="teal accent-4 mb-5"> Back </v-btn>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="validate"
    >
      <v-text-field
        label="Title"
        v-model="clip.title"
        :rule="titleRules"
      ></v-text-field>

      <v-file-input
        label="Upload a clip"
        prepend-icon="mdi-video"
        accept="video/mp4"
        v-model="clip.file"
        :rule="fileRules"
      ></v-file-input>

      <div class="d-flex flex-column">
        <v-btn color="success" class="mt-4" @click="validate" block>
          Validate
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    valid: true,
    clip: {
      title: "",
      file: null,
    },
    titleRules: [(v) => !!v || "Title is required"],
    fileRules: [(v) => !!v || "File is required"],
  }),
  mounted() {
    if (this.$route.params.id == "new") {
      return;
    }
    let requestClips = this.$store.dispatch("getAllClips");

    requestClips.then(() => {
      this.clip = this.getClips.find(
        (clip) => clip.id == this.$route.params.id
      );
    });
  },
  computed: {
    ...mapGetters(["getClips"]),
  },
  methods: {
    navigate(route) {
      this.$router.push({ name: route });
    },
    async validate() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        return;
      }

      if (this.$route.params.id == "new") {
        this.$store.dispatch("createClip", this.clip).then((res) => {
          console.log("res", res);
          //this.navigate("clips");
        });
        return;
      }
      this.$store.dispatch("updateClip", this.clip).then(() => {
        this.navigate("clips");
      });
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>
