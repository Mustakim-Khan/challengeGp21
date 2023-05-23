<template>
  <v-container>
    <v-btn text color="teal accent-4 mb-5" @click="back()"> Back </v-btn>
    <v-card class="text-left">
      <v-card-title>
        <h3 class="text-h3 mb-0 text-wrap">
          {{ tournament.name }}
        </h3>
        <div>
          <v-divider class="pb-2"></v-divider>
          <div v-if="tournament.createdBy">
            <!--pas possible d'accéder à tournament.createdBy.username -->
            Created by : {{ tournament.createdBy.username }}
          </div>
          <div v-if="tournament.maxPlayers">
            Max players allowed : {{ tournament.maxPlayers }}
          </div>
          <div>
            <!--pas possible d'accéder à tournament.participants.length -->
            <div v-if="tournament.participants">
              Current players : {{ tournament.participants.length }}/{{ tournament.maxPlayers }}
              <h3>List of players</h3>
              <v-card variant="outlined" class="pl-3">
                <div v-for="participant in tournament.participants">
                  {{ participant.username }}
                </div>
              </v-card>
            </div>
          </div>
        </div>
      </v-card-title>
      <v-card-actions class="float-right">
        <v-btn @click="joinTournament()">Join</v-btn>
        <v-btn @click="sponsorTournament()">Sponsor</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    tournament: {},
  }),
  mounted() {
    this.$store.dispatch("getAllTournaments");
    this.tournament = this.getTournaments.find(
      (tournament) => tournament.id == this.$route.params.id
    );
  },
  computed: {
    ...mapGetters(["getTournaments"]),
  },
  methods: {
    navigate(route) {
      this.$router.push({ name: route });
    },
    back() {
      this.$router.go(-1);
    },
    sponsorTournament() {
      // TODO si l'utilisateur courant est un sponsor
    },
    joinTournament() {
      // TODO si utilisateur courant n'est pas encore dans le tournoi (admi et modo peuvent s'incrire)
      if (this.tournament.participants) {
        this.tournament.participants.forEach(p => {
         // TODO si l'utilisateur courant est déjà dans le tournoi
        });
      }
    },
  },
};
</script>
