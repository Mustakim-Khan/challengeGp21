<template>
  <v-container>
    <v-btn color="teal accent-4" @click="navigateTo('home')"> Back </v-btn>
    <h1 class="text-h2 text-center mb-10">Tournaments</h1>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Start Date</th>
          <th class="text-left">Participation deadline</th>
          <th class="text-left">Entry type</th>
          <th class="text-left">Status</th>
          <th class="text-left">Number of participants</th>
          <th class="text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tournament in getTournaments" :key="tournament.id"
          :style="[tournament.isOver ? { backgroundColor: '#90A4AE' } : '']">
          <td>{{ tournament.name }}</td>
          <td>{{ new Date(tournament.startAt).getDate() }}/{{ new Date(tournament.startAt).getMonth() + 1 }}/{{ new Date(tournament.startAt).getFullYear() }}</td>
          <td>{{ new Date(tournament.participationDeadline).getDate() }}/{{ new Date(tournament.participationDeadline).getMonth() + 1 }}/{{ new Date(tournament.participationDeadline).getFullYear() }}</td>
          <td v-if="tournament.isFree">Free entry</td>
          <td v-else>Paid entry</td>
          <td v-if="tournament.isOver">Finished</td>
          <td v-else>On-going</td>
          <td>{{ tournament.participants.length }}/{{ tournament.maxPlayers }}</td>
          <td>
            <v-btn color="info" @click="linkTournament('tournament', tournament.id)">
              See more
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
<script>
import CardArticle from "../components/CardArticle.vue";
import { mapGetters } from "vuex";

export default {
  components: { CardArticle },
  mounted() {
    this.$store.dispatch("getAllTournaments");
  },
  methods: {
    navigateTo(route) {
      this.$router.push({ name: route });
    },
    linkTournament(route, id) {
      this.$router.push({ name: route, params: { id: id } });
    },
  },
  computed: {
    ...mapGetters(["getTournaments"]),
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
