<template>
  <v-container class="py-8 px-6" fluid>
    <div class="dashboard">
      <div class="py-0 d-flex justify-space-between rounded-lg">
        <h3>Dashboard</h3>
        <v-btn color="error"> View Signalements </v-btn>
      </div>
      <br />
      <v-row>
        <v-col lg="12" cols="12">
          <v-alert dense text type="success">
            Welcome back to <strong>{{ getUser.username }}</strong>
          </v-alert>
          <v-row>
            <v-col
              lg="4"
              cols="12"
              v-for="(item, index) in activitiesCards"
              :key="index"
            >
              <v-card elevation="2" class="rounded-lg">
                <v-card-text class="d-flex justify-space-between align-center">
                  <div>
                    <strong>{{ item.title }}</strong> <br />
                    <span>Last 3 weeks</span>
                  </div>
                  <v-avatar
                    size="60"
                    :color="item.color"
                    style="border: 3px solid #444"
                  >
                    <span style="color: white">{{ item.amount }} +</span>
                  </v-avatar>
                </v-card-text>
                <v-card-actions class="d-flex justify-space-around">
                  <v-btn color="primary" variant="outlined">View</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          lg="6"
          cols="12"
          v-for="(item, index) in tablesDatas"
          :key="index"
        >
          <v-card>
            <CrudTable
              :datas="item"
              ref="crudTable"
              @updateTable="updateTablesDatas"
            />
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
import CrudTable from "../components/CrudTable.vue";

export default {
  // tableName, headers, content, delete, edit, view
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Dashboard",
  components: { CrudTable },
  data() {
    return {
      user: null,
      userData: {},
      myArticles: [],
      myComments: [],
      myCommentsSignaled: [],
      myForums: [],
      myTournaments: [],
      mySponsors: [],
      activitiesCards: [],
      tablesDatas: [],
    };
  },
  computed: {
    ...mapGetters([
      "getUserArticles",
      "getUserForums",
      "getUserTournaments",
      "getUserComments",
      "getUserCommentsSignaled",
    ]),
    getUser() {
      return this.$store.getters.getCurrentUser
        ? this.$store.getters.getCurrentUser
        : { username: "john Deo" };
    },
  },
  methods: {
    dispatchUserArticles(id) {
      this.$store.dispatch("getUserArticles", id).then((response) => {
        if (response) {
          this.myArticles = this.getUserArticles;
          this.activitiesCards.push(
            this.getMyArticlesTemplate(this.myArticles.length)
          );

          const existingArticle = this.tablesDatas.find(
            (element) => element.tableName == "Articles"
          );
          if (existingArticle) {
            this.tablesDatas.splice(
              this.tablesDatas.indexOf(existingArticle),
              1,
              this.articlesTables(this.myArticles)
            );
          } else {
            this.tablesDatas.push(this.articlesTables(this.myArticles));
          }
        }
      });
    },
    dispatchUserForums(id) {
      this.$store.dispatch("getUserForums", id).then((response) => {
        if (response) {
          this.myForums = this.getUserForums;
          this.activitiesCards.push(
            this.getMyForumsTemplate(this.myForums.length)
          );

          const existingForum = this.tablesDatas.find(
            (element) => element.tableName == "Forums"
          );
          if (existingForum) {
            this.tablesDatas.splice(
              this.tablesDatas.indexOf(existingForum),
              1,
              this.forumsTables(this.myForums)
            );
          } else {
            this.tablesDatas.push(this.forumsTables(this.myForums));
          }
        }
      });
    },
    dispatchUserTournaments(id) {
      this.$store.dispatch("getUserTournaments", id).then((response) => {
        if (response) {
          this.myTournaments = this.getUserTournaments;
          this.activitiesCards.push(
            this.getMyTournamentsTemplate(this.myTournaments.length)
          );
        }
      });
    },
    dispatchUserComments(id) {
      this.$store.dispatch("getUserComments", id).then((response) => {
        if (response) {
          this.myComments = this.getUserComments;
          this.myCommentsSignaled = this.getUserCommentsSignaled;
          this.activitiesCards.push(
            this.getMyCommentsTemplate(this.myComments.length)
          );
          this.activitiesCards.push(
            this.getMyCommentsSignaledTemplate(this.myCommentsSignaled.length)
          );
        }
      });
    },
    getMyArticlesTemplate(size) {
      return {
        title: "Total Articles",
        amount: size,
        icon: "mdi-account",
        color: "cyan lighten-3",
        // action: this.$route.push("", this.myArticles),
      };
    },
    getMyForumsTemplate(size) {
      return {
        title: "Total Forums",
        amount: size,
        icon: "mdi-account-group-outline",
        color: "green darken-2",
        // action: this.$route.push("", this.myForums),
      };
    },
    getMyTournamentsTemplate(size) {
      return {
        title: "Total Tournements",
        amount: size,
        icon: "mdi-account-group-outline",
        color: "blue-grey darken-1",
        // action: this.$route.push("", this.myTournaments),
      };
    },
    getMyCommentsSignaledTemplate(size) {
      return {
        title: "Comments Signaled",
        amount: size,
        icon: "mdi-account-group-outline",
        color: "deep-orange darken-1",
        // action: this.$route.push("", this.mySponsors),
      };
    },
    getMyCommentsTemplate(size) {
      return {
        title: "Total Comments",
        amount: size,
        icon: "mdi-account-group-outline",
        color: "deep-orange darken-1",
        // action: this.$route.push("", this.mySponsors),
      };
    },
    articlesTables(myArticles) {
      return {
        tableName: "Articles",
        tableHeaders: [
          { title: "Title", align: "start", sortable: true, key: "title" },
          { title: "CreatedAt", sortable: true, key: "createdat" },
          { title: "Actions", value: "action", key: "action" },
        ],
        routes: {
          viewRouteName: "article",
          editRouteName: "article-edit",
          deleteAction: "deleteArticle",
        },
        tablesContents: myArticles.map((article) => {
          return {
            datas: article,
            title: article.title,
            createdat: article.createdAt.split("+")[0],
          };
        }),
      };
    },
    forumsTables(myForums) {
      return {
        tableName: "Forums",
        tableHeaders: [
          { title: "Title", align: "start", sortable: true, key: "title" },
          { title: "Content", sortable: true, value: "content" },
          { title: "Comments", sortable: true, value: "comments" },
          { title: "IsValid", sortable: true, value: "isvalid" },
          { title: "Actions", value: "action", key: "action" },
        ],
        routes: {
          viewRouteName: "forum",
          editRouteName: "forum-edit",
          deleteAction: "deleteForum",
        },
        tablesContents: myForums.map((forum) => {
          return {
            datas: forum,
            title: forum.title,
            content: forum.content.slice(0, 15) + "...",
            comments: forum.comments ? forum.comments.length : 0,
            isvalid: forum.isValid ? "Yes" : "No",
          };
        }),
      };
    },
    updateTablesDatas(datasUpdated) {
      // Use in crudTables after each item been deleted
      console.log("Delete => ", datasUpdated);
      switch (datasUpdated.tableName) {
        case "Articles":
          this.dispatchUserArticles(this.$store.getters.getCurrentUser.id);
          break;
        case "Forums":
          this.dispatchUserForums(this.$store.getters.getCurrentUser.id);
          break;
        case "Tournements":
          this.dispatchUserTournaments(this.$store.getters.getCurrentUser.id);
          break;
        case "Comments":
          this.dispatchUserComments(this.$store.getters.getCurrentUser.id);
          break;
      }
    },
  },
  mounted() {
    this.$store
      .dispatch("updateUserDatas", {
        username: this.$store.getters.getCurrentUser.username,
      })
      .then((res) => {
        if (res) {
          this.dispatchUserArticles(this.$store.getters.getCurrentUser.id);
          this.dispatchUserForums(this.$store.getters.getCurrentUser.id);
          this.dispatchUserTournaments(this.$store.getters.getCurrentUser.id);
          this.dispatchUserComments(this.$store.getters.getCurrentUser.id);
        }
      });
  },
};
</script>
