<template>
  <v-container>
    <v-btn @click="back()" color="teal accent-4 mb-5"> Back </v-btn>
    <v-form>
      <v-text-field
        label="Title"
        v-model="article.title"
        required
      ></v-text-field>
      <QuillEditor
        contentType="html"
        v-model:content="article.content"
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
    article: {
      title: "",
      content: "",
    },
  }),
  mounted() {
    if (this.$route.params.id == "new") {
      return;
    }
    this.$store.dispatch("getAllArticles").then((response) => {
      if (response) {
        this.article = response.data.find(
          (article) => article.id == this.$route.params.id
        );
      }
    });

    // requestArticles.then(() => {
    //   this.article = this.getArticles.find(
    //     (article) => article.id == this.$route.params.id
    //   );
    // });
  },
  computed: {
    ...mapGetters(["getArticles"]),
  },
  methods: {
    navigate(route) {
      this.$router.push({ name: route });
    },
    back() {
      this.$router.go(-1);
    },
    validate() {
      if (this.$route.params.id == "new") {
        console.log(
          "Article Edit View | validate (new Item) | this.article => ",
          this.article
        );
        this.$store.dispatch("createArticle", this.article).then(() => {
          this.navigate("user-dashboard");
        });
        return;
      }
      this.$store.dispatch("updateArticle", this.article).then(() => {
        this.navigate("user-dashboard");
      });
    },
  },
};
</script>
