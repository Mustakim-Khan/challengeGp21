import { createStore } from "vuex";
import axios from "axios";
import decryptToken from "../../utils/authAPI";
// import { objectToJson } from "../../utils/utils";

// Create instance of axios
const instance = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Refresh token
let refresh = false;
instance.interceptors.response.use(
  (response) => response,
  async function (error) {
    if (
      error.response.status === 401 &&
      refresh == false &&
      localStorage.getItem("refreshToken")
    ) {
      // Delete authorisation
      instance.defaults.headers.common["Authorization"] = "";
      // Fetch refresh token route
      const { status, data } = await instance.post("/api/token/refresh", {
        refresh_token: localStorage.getItem("refreshToken"),
      });
      if (status === 200) {
        // set refresh at true
        refresh = true;
        // Update instance authorisation with new token
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.token}`;
        // Update error authorization token
        error.config.headers["Authorization"] = `Bearer ${data.token}`;
        // update data in storage
        localStorage.setItem("authToken", data.token);
        // Execute last request
        return instance(error.config);
      }
    }
    refresh = false;
    return error;
  }
);

// Fetch current user and his token
let { tokenDecoded, userDecoded, refreshTokenDecoded } = await decryptToken();

instance.interceptors.request.use((config) => {
  if (tokenDecoded) {
    config.headers.Authorization = `Bearer ${tokenDecoded}`;
  }
  return config;
});

const store = createStore({
  state: {
    user: userDecoded,
    status: "",
    authToken: tokenDecoded,
    refreshToken: refreshTokenDecoded,
    userDatas: {},
    userArticles: [],
    userForums: [],
    userComments: [],
    userCommentsSignaled: [],
    userTournaments: [],
    articles: [],
    forums: [],
    comments: [],
    tournaments: [],
    clips: [],
  },
  mutations: {
    setStatus: (state, status) => {
      state.status = status;
    },
    logUser: (state, auth) => {
      state.authToken = auth.token;
      state.refreshToken = auth.refresh_token;
      localStorage.setItem("authToken", state.authToken);
      localStorage.setItem("refreshToken", state.refreshToken);
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${state.authToken}`;
    },
    logout: (state) => {
      state.authToken = null;
      state.user = {};
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      delete instance.defaults.headers.common["Authorization"];
    },
    setUser: (state, userInfo) => {
      state.user = userInfo;
    },
    updateUserToken: (state, accessToken) => {
      state.authToken = accessToken;
    },
    setUserDatas: (state, userDatas) => {
      if (userDatas != null) {
        state.userDatas = userDatas;
        const newUser = {
          ...state.user,
          ...userDatas[0],
        };
        state.user = newUser;
      }
    },
    setUserArticles: (state, articles) => {
      state.userArticles = articles ? articles : [];
    },
    setUserForums: (state, forums) => {
      state.userForums = forums ? forums : [];
    },
    setUserComments: (state, comments) => {
      state.userComments = comments ? comments : [];
    },
    setUserCommentsSignaled: (state, commentsSignaled) => {
      state.userCommentsSignaled = commentsSignaled ? commentsSignaled : [];
    },
    setUserTournaments: (state, tournaments) => {
      state.userTournaments = tournaments ? tournaments : [];
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
    setClips: (state, clips) => {
      state.clips = clips;
    },
  },
  getters: {
    getStatus: (state) => {
      return state.status;
    },
    getAuthToken: (state) => {
      return state.authToken;
    },
    getCurrentUser: (state) => {
      return state.user;
    },
    getUserDatas: (state) => {
      return state.userDatas ? state.userDatas : null;
    },
    getUserArticles: (state) => {
      return state.userArticles;
    },
    getUserForums: (state) => {
      return state.userForums;
    },
    getUserTournaments: (state) => {
      return state.userTournaments;
    },
    getUserComments: (state) => {
      return state.userComments;
    },
    getUserCommentsSignaled: (state) => {
      return state.userCommentsSignaled;
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
    getClips: (state) => {
      return state.clips;
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
            commit("setStatus", "LoggingIn");
            reject(error);
          });
      });
    },
    logout: ({ commit }) => {
      // TODO: login user
      commit("setStatus", "logout");
      return new Promise((resolve) => {
        commit("setStatus", "logout");
        commit("logout");
        resolve();
      });
    },
    fetchAccessToken: ({ commit }) => {
      const res = localStorage.getItem("authToken")
        ? localStorage.getItem("authToken")
        : null;
      commit("updateUserToken", res);
    },
    updateCurrentUser: ({ commit }, data) => {
      commit("setUser", data);
    },
    updateUserDatas: ({ commit }, userInfo) => {
      return new Promise((resolve, reject) => {
        instance
          .get(`/api/users?username=${userInfo.username}`)
          .then((response) => {
            commit("setUserDatas", response.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    resetPassword: ({ commit }, { userId, userPwd }) => {
      return new Promise((resolve, reject) => {
        instance
          .patch(
            `/api/users/${userId}/reset/password`,
            { password: userPwd },
            { headers: { "Content-Type": "application/merge-patch+json" } }
          )
          .then((response) => {
            commit("status", "reset password done.");
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    forgetPassword: ({ commit }, userEmail) => {
      return new Promise((resolve, reject) => {
        instance
          .get(`/api/users/forget/password`, { userEmail })
          .then((response) => {
            commit("status", "forget password done.");
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getUserArticles: ({ commit }, userId) => {
      return new Promise((resolve, reject) => {
        instance
          .get(`/api/users/${userId}/articles`)
          .then((response) => {
            commit("setUserArticles", response.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getUserForums: ({ commit }, userId) => {
      return new Promise((resolve, reject) => {
        instance
          .get(`/api/users/${userId}/forums`)
          .then((response) => {
            commit("setUserForums", response.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getUserTournaments: ({ commit }, userId) => {
      return new Promise((resolve, reject) => {
        instance
          .get(`/api/users/${userId}/tournaments`)
          .then((response) => {
            commit("setUserTournaments", response.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getUserComments: ({ commit }, userId) => {
      return new Promise((resolve, reject) => {
        instance
          .get(`/api/users/${userId}/comments`)
          .then((response) => {
            const signaled = [];
            if (response.data) {
              response.data.forEach((element) => {
                if (element.signaledComments) {
                  signaled.push(...element.signaledComments);
                }
              });
            }
            commit("setUserComments", response.data);
            commit("setUserCommentsSignaled", signaled);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
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
    getAllClip: ({ commit }) => {
      return new Promise((resolve, reject) => {
        instance
          .get("/api/clips")
          .then((response) => {
            commit("setClips", response.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getClipValid: ({ commit }) => {
      return new Promise((resolve, reject) => {
        instance
          .get("/api/clips?isValid=true")
          .then((response) => {
            commit("setClips", response.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    createClip: ({ commit }, clip) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("title", clip.title);
        formData.append("file", clip.file[0], clip.file[0].name);

        instance
          .post("/api/clips/video", clip)
          .then((response) => {
            commit;
            resolve({
              status: response.status,
              message: response.data.message,
            });
          })
          .catch((error) => {
            reject({
              status: error.response.status,
              message: error.response.data.message,
            });
          });
      });
    },
  },
});

export default store;
