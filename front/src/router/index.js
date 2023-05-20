import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import TournamentView from "../views/TournamentView.vue";
import TournamentsView from "../views/TournamentsView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/Admin/DasboardView.vue";
import AdminArticlesView from "../views/Admin/AdminArticlesView.vue";
import AdminTournamentsView from "../views/Admin/AdminTournamentsView.vue";
import AdminArticleEditView from "../views/Admin/AdminArticleEditView.vue";
import AdminTournamentEditView from "../views/Admin/AdminTournamentEditView.vue";
import ForumsView from "../views/ForumsView.vue";
import ForumView from "../views/ForumView.vue";
import AdminForumsView from "../views/Admin/AdminForumsView.vue";
import AdminForumEditView from "../views/Admin/AdminForumEditView.vue";
import ForumEdit from "../views/ForumEditView.vue";
import ClipsView from "../views/ClipsView.vue";
import store from "../store";

// TODO: Login redirect
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/admin",
      name: "admin",
      component: DashboardView,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/admin/articles",
      name: "admin-articles",
      component: AdminArticlesView,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/admin/articles/:id",
      name: "admin-article-edit",
      component: AdminArticleEditView,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/admin/forums",
      name: "admin-forums",
      component: AdminForumsView,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/admin/forums/:id",
      name: "admin-forum-edit",
      component: AdminForumEditView,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/article/:id",
      name: "article",
      component: () => import("../views/ArticleView.vue"),
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/articles",
      name: "articles",
      component: () => import("../views/ArticlesView.vue"),
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/forum/:id",
      name: "forum",
      component: ForumView,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/forums",
      name: "forums",
      component: ForumsView,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/forums/edit/:id",
      name: "forum-edit",
      component: ForumEdit,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/admin/tournaments",
      name: "admin-tournaments",
      component: AdminTournamentsView,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/tournaments",
      name: "tournaments",
      component: TournamentsView,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/tournament/:id",
      name: "tournament",
      component: TournamentView,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/admin/tournaments/:id",
      name: "admin-tournament-edit",
      component: AdminTournamentEditView,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/clips",
      name: "clips",
      component: ClipsView,
      redirect:
        store.state.authToken == "" ||
        store.state.authToken === null ||
        store.state.authToken === undefined
          ? "/login"
          : "",
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
