<template>
  <v-container>
    <TableAdmin
      :headers="headers"
      :objectValues="getTournaments"
      routeEdit="admin-tournament-edit"
      actionDelete="deleteTournament"
    ></TableAdmin>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
import TableAdmin from "../../components/TableAdmin.vue";

export default {
  data: () => ({
    headers: [
      { name: "Name", value: "name" },
      { name: "Created At", value: "createdAt" },
      { name: "Created By", value: "createdBy", valueKey: "username" },
    ],
  }),
  mounted() {
    this.$store.dispatch("getAllTournaments");
  },
  computed: {
    ...mapGetters(["getTournaments"]),
  },
  components: { TableAdmin },
};
</script>
