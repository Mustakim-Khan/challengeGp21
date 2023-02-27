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
import store from "../store";

// TODO: Login redirect
const isLog = store.state.authToken != "" || store.state.authToken != null;
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      redirect: isLog ? "" : "/login",
    },
    {
      path: "/admin",
      name: "admin",
      component: DashboardView,
      redirect: isLog ? "" : "/login",
    },
    {
      path: "/admin/articles",
      name: "admin-articles",
      component: AdminArticlesView,
      redirect: isLog ? "" : "/login",
    },
    {
      path: "/admin/articles/:id",
      name: "admin-article-edit",
      component: AdminArticleEditView,
      redirect: isLog ? "" : "/login",
    },
    {
      path: "/admin/forums",
      name: "admin-forums",
      component: AdminForumsView,
      redirect: isLog ? "" : "/login",
    },
    {
      path: "/admin/forums/:id",
      name: "admin-forum-edit",
      component: AdminForumEditView,
      redirect: isLog ? "" : "/login",
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
      redirect: isLog ? "" : "/login",
    },
    {
      path: "/articles",
      name: "articles",
      component: () => import("../views/ArticlesView.vue"),
      redirect: isLog ? "" : "/login",
    },
    {
      path: "/forum/:id",
      name: "forum",
      component: ForumView,
      redirect: isLog ? "" : "/login",
    },
    {
      path: "/forums",
      name: "forums",
      component: ForumsView,
      redirect: isLog ? "" : "/login",
    },
    {
      path: "/forums/edit/:id",
      name: "forum-edit",
      component: ForumEdit,
      redirect: isLog ? "" : "/login",
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/admin/tournaments",
      name: "admin-tournaments",
      component: AdminTournamentsView,
      redirect: isLog ? "" : "/login",
    },
    {
      path: "/tournaments",
      name: "tournaments",
      component: TournamentsView,
      redirect: isLog ? "" : "/login",
    },
    {
      path: "/tournament/:id",
      name: "tournament",
      component: TournamentView,
      redirect: isLog ? "" : "/login",
    },
    {
      path: "/admin/tournaments/:id",
      name: "admin-tournament-edit",
      component: AdminTournamentEditView,
      redirect: isLog ? "" : "/login",
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
