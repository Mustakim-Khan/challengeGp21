<template>
  <v-container>
    <TableAdmin
      :headers="headers"
      :objectValues="getArticles"
      routeEdit="admin-article-edit"
      actionDelete="deleteArticle"
    ></TableAdmin>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
import TableAdmin from "../../components/TableAdmin.vue";

export default {
  data: () => ({
    headers: [
      { name: "Title", value: "title" },
      { name: "Created At", value: "createdAt" },
      { name: "Created By", value: "createdBy", valueKey: "username" },
    ],
  }),
  mounted() {
    this.$store.dispatch("getAllArticles");
  },
  computed: {
    ...mapGetters(["getArticles"]),
  },
  components: { TableAdmin },
};
</script>
