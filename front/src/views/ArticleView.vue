<template>
  <v-container>
    <v-btn text color="teal accent-4 mb-5" @click="back()"> Back </v-btn>
    <v-card class="text-center">
      <v-card-title>
        <div>
          <h3 class="text-h3 mb-0">{{ article.title }}</h3>
          <div>{{ article.author }}</div>
          <v-divider></v-divider>
        </div>
      </v-card-title>
      <v-card-text>
        <div v-html="article.content"></div>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    article: {},
  }),
  mounted() {
    this.$store.dispatch("getAllArticles").then((response) => {
      if (response) {
        this.article = response.data.find(
          (article) => article.id == this.$route.params.id
        );
      }
    });
    // this.article = this.getArticles.find(
    //   (article) => article.id == this.$route.params.id
    // );
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
  },
};
</script>
