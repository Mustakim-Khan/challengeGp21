<template>
  <v-container>
    <v-btn @click="back()" color="teal accent-4 mb-5"> Back </v-btn>
    <v-form>
      <v-text-field label="Title" v-model="forum.title" required></v-text-field>
      <QuillEditor
        contentType="html"
        v-model:content="forum.content"
        toolbar="full"
        theme="snow"
      />
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
    forum: {
      title: "",
      content: "",
    },
  }),
  mounted() {
    if (this.$route.params.id == "new") {
      return;
    }
    let requestForums = this.$store.dispatch("getAllForums");

    requestForums.then(() => {
      this.forum = this.getForums.find(
        (forum) => forum.id == this.$route.params.id
      );
    });
  },
  computed: {
    ...mapGetters(["getForums"]),
  },
  methods: {
    navigate(route) {
      this.$router.push({ name: route });
    },
    validate() {
      if (this.$route.params.id == "new") {
        this.$store.dispatch("createForum", this.forum).then(() => {
          this.navigate("forums");
        });
        return;
      }
      this.$store.dispatch("updateForum", this.forum).then(() => {
        this.navigate("forums");
      });
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>
