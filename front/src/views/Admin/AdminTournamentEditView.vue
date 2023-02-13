<template>
  <v-container>
    <v-btn @click="navigate('admin-tournaments')" color="teal accent-4 mb-5">
      Back
    </v-btn>
    <v-form>
      <v-text-field label="Name" v-model="tournament.name" required></v-text-field>
      <v-text-field label="Max players" v-model="tournament.maxPlayers" type="number" required></v-text-field>
      <v-radio-group label="Free entry" v-model="tournament.isFree">
        <v-radio label="True" :value="true"></v-radio>
        <v-radio label="False" :value="false"></v-radio>
      </v-radio-group>
      <v-radio-group label="Finished" v-model="tournament.isOver">
        <v-radio label="True" :value="true"></v-radio>
        <v-radio label="False" :value="false"></v-radio>
      </v-radio-group>
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
    tournament: {
      name: "",
      maxPlayers: 0,
      isFree: false,
      isOver: false,
      participationDeadline: new Date(),
      startAt: 0
    },
  }),
  mounted() {
    if (this.$route.params.id == "new") {
      return;
    }
    let requestTournaments = this.$store.dispatch("getAllTournaments");

    requestTournaments.then(() => {
      this.tournament = this.getTournaments.find(
        (tournament) => tournament.id == this.$route.params.id
      );
    });
  },
  computed: {
    ...mapGetters(["getTournaments"]),
  },
  methods: {
    navigate(route) {
      this.$router.push({ name: route });
    },
    validate() {
      if (this.$route.params.id == "new") {
        this.$store.dispatch("createTournament", this.tournament).then(() => {
          this.navigate("admin-tournaments");
        });
        return;
      }
      this.$store.dispatch("updateTournament", this.tournament).then(() => {
        this.navigate("admin-tournaments");
      });
    },
  },
};
</script>
