<template>
  <v-container>
    <TableAdmin :headers="headers" :objectValues="getClips"></TableAdmin>
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
      { name: "Created By", value: "uploadedBy", valueKey: "username" },
      { name: "Validated", value: "isValid" },
    ],
  }),
  mounted() {
    this.$store.dispatch("getAllClip");
  },
  computed: {
    ...mapGetters(["getClips"]),
  },
  components: { TableAdmin },
};
</script>
