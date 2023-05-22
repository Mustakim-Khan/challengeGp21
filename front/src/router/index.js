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
import ArticleEdit from "../views/ArticleEditView.vue";
import store from "../store";

function adminRouteGuard(to, from, next) {
  store.dispatch("fetchAccessToken");
  if (store.state.authToken) {
    if (store.state.user) {
      let user = store.state.user;
      if (
        user.roles.includes("ROLE_MODERATOR") ||
        user.roles.includes("ROLE_ADMIN")
      ) {
        next();
      }
    }
  }
  next({ name: "login" });
}


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/admin",
      name: "admin",
      component: DashboardView,
      beforeEnter: (to, from, next) => {
        adminRouteGuard(to, from, next);
      },

    },
    {
      path: "/admin/articles",
      name: "admin-articles",
      component: AdminArticlesView,
      beforeEnter: (to, from, next) => {
        adminRouteGuard(to, from, next);
      },
    },
    {
      path: "/admin/articles/:id",
      name: "admin-article-edit",
      component: AdminArticleEditView,
      beforeEnter: (to, from, next) => {
        adminRouteGuard(to, from, next);
      },
    },
    {
      path: "/admin/forums",
      name: "admin-forums",
      component: AdminForumsView,
      beforeEnter: (to, from, next) => {
        adminRouteGuard(to, from, next);
      },

    },
    {
      path: "/admin/forums/:id",
      name: "admin-forum-edit",
      component: AdminForumEditView,

      beforeEnter: (to, from, next) => {
        adminRouteGuard(to, from, next);
      },
    },
    {
      path: "/admin/tournaments",
      name: "admin-tournaments",
      component: AdminTournamentsView,
      beforeEnter: (to, from, next) => {
        store.dispatch("fetchAccessToken");
        if (store.state.authToken == null || store.state.user == null) {
          next("/login");
        } else {
          next();
        }
      },
    },
    {
      path: "/admin/tournaments/:id",
      name: "admin-tournament-edit",
      component: AdminTournamentEditView,
      beforeEnter: (to, from, next) => {
        store.dispatch("fetchAccessToken");
        if (store.state.authToken == null || store.state.user == null) {
          next("/login");
        } else {
          next();
        }
      },
    },
    {
      path: "/article/:id",
      name: "article",
      component: () => import("../views/ArticleView.vue"),
      beforeEnter: (to, from, next) => {
        store.dispatch("fetchAccessToken");
        if (store.state.authToken == null || store.state.user == null) {
          next("/login");
        } else {
          next();
        }
      },

    },
    {
      path: "/articles",
      name: "articles",
      component: () => import("../views/ArticlesView.vue"),
      beforeEnter: (to, from, next) => {
        store.dispatch("fetchAccessToken");
        if (store.state.authToken == null || store.state.user == null) {
          next("/login");
        } else {
          next();
        }
      },
    },
    {
      path: "/articles/edit/:id",
      name: "article-edit",
      component: ArticleEdit,
      beforeEnter: (to, from, next) => {
        store.dispatch("fetchAccessToken");
        if (store.state.authToken == null || store.state.user == null) {
          next("/login");
        } else {
          next();
        }
      },
    },
    {
      path: "/forum/:id",
      name: "forum",
      component: ForumView,
      beforeEnter: (to, from, next) => {
        store.dispatch("fetchAccessToken");
        if (store.state.authToken == null || store.state.user == null) {
          next("/login");
        } else {
          next();
        }
      },

    },
    {
      path: "/forums",
      name: "forums",
      component: ForumsView,
      beforeEnter: (to, from, next) => {
        store.dispatch("fetchAccessToken");
        if (store.state.authToken == null || store.state.user == null) {
          next("/login");
        } else {
          next();
        }
      },
    },
    {
      path: "/forums/edit/:id",
      name: "forum-edit",
      component: ForumEdit,
      beforeEnter: (to, from, next) => {
        store.dispatch("fetchAccessToken");
        if (store.state.authToken == null || store.state.user == null) {
          next("/login");
        } else {
          next();
        }
      },
    },
    {
      path: "/tournaments",
      name: "tournaments",
      component: TournamentsView,
      beforeEnter: (to, from, next) => {
        store.dispatch("fetchAccessToken");
        if (store.state.authToken == null || store.state.user == null) {
          next("/login");
        } else {
          next();
        }
      },

    },
    {
      path: "/tournament/:id",
      name: "tournament",
      component: TournamentView,
      beforeEnter: (to, from, next) => {
        store.dispatch("fetchAccessToken");
        if (store.state.authToken == null || store.state.user == null) {
          next("/login");
        } else {
          next();
        }
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      beforeEnter: (to, from, next) => {
        store.dispatch("fetchAccessToken");
        if (store.state.authToken != null || store.state.user != null) {
          next("/home");
        } else {
          next();
        }
      },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/dashboard",
      name: "user-dashboard",
      component: () => import("../views/UserDashbordView.vue"),
      beforeEnter: (to, from, next) => {
        store.dispatch("fetchAccessToken");
        if (!store.state.authToken || !store.state.user) {
          next("/login");
        }
        next();
      },
    },
    {
      path: "/reset/password",
      name: "user-updatePassword",
      component: () => import("../views/UpdatePasswordView.vue"),
    },
    // {
    //   path: "/verify/email/:token",
    //   name: "verify-email",
    //   component: () => import("../views/EmailView.vue"),
    //   beforeEnter: (to, from, next) => {
    //     store.dispatch("fetchAccessToken");
    //     if (!store.state.authToken || !store.state.user) {
    //       next("/login");
    //     } else {
    //       next();
    //     }
    //   },
    // },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   if (!store.state.accessToken && to.name !== "Home") next({ name: "Login" });
//   else next();
// });

export default router;

// TODO :
// Define route for : forums/edit/new
//
