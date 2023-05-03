/* eslint-disable prettier/prettier */
import { createStore } from "vuex";
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
});

let authToken = localStorage.getItem("authToken");

instance.interceptors.request.use((config) => {
  if (!authToken) {
    authToken = "";
  } else {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

const store = createStore({
  state: {
    user: undefined,
    status: "",
    authToken: authToken,
    articles: [],
    forums: [],
    comments: [],
    tournaments: [],
  },
  mutations: {
    setStatus: (state, status) => {
      state.status = status;
    },
    logUser: (state, auth) => {
      state.authToken = auth.token;
      localStorage.setItem("authToken", state.authToken);
      instance.defaults.headers.common["Authorization"] = `Bearer ${state.authToken}`;
    },
    setArticles: (state, articles) => {
      state.articles = articles;
    },
    deleteArticle: (state, article) => {
      state.articles = state.articles.filter((a) => a.id !== article.id);
    },
    setForums: (state, forums) => {
      state.forums = forums;
    },
    deleteForum: (state, forum) => {
      state.forums = state.forums.filter((f) => f.id !== forum.id);
    },
    setComments: (state, comments) => {
      state.comments = comments;
    },
    setTournaments: (state, tournaments) => {
      state.tournaments = tournaments;
    },
    deleteTournament: (state, tournament) => {
      state.tournaments = state.tournaments.filter(
        (t) => t.id !== tournament.id
      );
    },
    setAuthJWT: (state, token) => {
      state.authToken = token;
    },
  },
  getters: {
    getStatus: (state) => {
      return state.status;
    },
    getAuthToken: (state) => {
      return state.authToken;
    },
    getArticles: (state) => {
      return state.articles;
    },
    getForums: (state) => {
      return state.forums;
    },
    getComments: (state) => {
      return state.comments;
    },
    getTournaments: (state) => {
      return state.tournaments;
    },
  },
  actions: {
    createAccount: ({ commit }, userInfo) => {
      // TODO: register user
      commit("setStatus", "loading");
      return new Promise((resolve, reject) => {
        instance
          .post("/api/register", userInfo)
          .then((response) => {
            resolve(response);
            commit("setStatus", "createdAccount");
          })
          .catch((error) => {
            commit("setStatus", "errorCreatingAccount");
            reject(error);
          });
      });
    },
    login: ({ commit }, userInfo) => {
      // TODO: login user
      commit("setStatus", "loading");
      return new Promise((resolve, reject) => {
        instance
          .post("/login", userInfo)
          .then((response) => {
            commit("setStatus", "loggedIn");
            commit("logUser", response.data);
            resolve(response);
          })
          .catch((error) => {
            commit("setStatus", "errorLoggingIn");
            reject(error);
          });
      });
    },
    logout: ({commit}) => {
      // TODO: logout user
      commit("setAuthJWT", "");
      localStorage.removeItem("authToken");
      instance.defaults.headers.common["Authorization"] = "";
    },
    getAllArticles: ({ commit }) => {
      return new Promise((resolve, reject) => {
        instance
          .get("/api/articles")
          .then((response) => {
            commit("setArticles", response.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    updateArticle: ({ commit }, article) => {
      return new Promise((resolve, reject) => {
        instance
          .put("/api/articles/" + article.id, article)
          .then((response) => {
            commit;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    createArticle: ({ commit }, article) => {
      return new Promise((resolve, reject) => {
        instance
          .post("/api/articles", article)
          .then((response) => {
            commit;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    deleteArticle: ({ commit }, article) => {
      return new Promise((resolve, reject) => {
        instance
          .delete("/api/articles/" + article.id)
          .then((response) => {
            commit("deleteArticle", article);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getAllForums: ({ commit }) => {
      return new Promise((resolve, reject) => {
        instance
          .get("/api/forums")
          .then((response) => {
            commit("setForums", response.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getForum: ({ commit }, forumId) => {
      return new Promise((resolve, reject) => {
        instance
          .get("/api/forums/" + forumId)
          .then((response) => {
            commit;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getValidForums: ({ commit }) => {
      return new Promise((resolve, reject) => {
        instance
          .get("/api/forums?isValid=true")
          .then((response) => {
            commit("setForums", response.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    createForum: ({ commit }, forum) => {
      return new Promise((resolve, reject) => {
        instance
          .post("/api/forums", forum)
          .then((response) => {
            commit;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    updateForum: ({ commit }, forum) => {
      return new Promise((resolve, reject) => {
        instance
          .put("/api/forums/" + forum.id, forum)
          .then((response) => {
            commit("setForums", response.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    deleteForum: ({ commit }, forum) => {
      return new Promise((resolve, reject) => {
        instance
          .delete("/api/forums/" + forum.id)
          .then((response) => {
            commit("deleteForum", forum);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getAllComments: ({ commit }, forumId) => {
      return new Promise((resolve, reject) => {
        instance
          .get("/api/comments?forum=" + forumId)
          .then((response) => {
            commit("setComments", response.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    createComment: ({ commit }, comment) => {
      return new Promise((resolve, reject) => {
        instance
          .post("/api/comments", comment)
          .then((response) => {
            commit;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getAllTournaments: ({ commit }) => {
      return new Promise((resolve, reject) => {
        instance
          .get("/api/tournaments")
          .then((response) => {
            commit("setTournaments", response.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    deleteTournament: ({ commit }, tournament) => {
      return new Promise((resolve, reject) => {
        instance
          .delete("/api/tournaments/" + tournament.id)
          .then((response) => {
            commit("deleteTournament", tournament);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    updateTournament: ({ commit }, tournament) => {
      return new Promise((resolve, reject) => {
        instance
          .put("/api/tournaments/" + tournament.id, tournament)
          .then((response) => {
            commit;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    createTournament: ({ commit }, tournament) => {
      console.log({
        name: tournament.name,
        maxPlayers: tournament.maxPlayers,
        participationDeadline: tournament.participationDeadline,
        startAt: tournament.startAt,
        isFree: tournament.isFree,
      });
      return new Promise((resolve, reject) => {
        instance
          .post("/api/tournaments", {
            name: tournament.name,
            maxPlayers: tournament.maxPlayers,
            participationDeadline: tournament.participationDeadline,
            startAt: tournament.startAt,
            isFree: tournament.isFree,
          })
          .then((response) => {
            commit;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});

export default store;
