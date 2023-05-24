<template>
  <div>
    <v-parallax src="img/nba2k.jpg" scale="1" height="400">
      <div
        class="d-flex flex-column fill-height justify-center align-center text-white"
      >
        <h1 class="text-h4 font-weight-thin mb-4">WE Ballin'</h1>
        <h4 class="subheading">Welcome</h4>
      </div>
    </v-parallax>
    <v-container>
      <div v-if="this.articles">
        <SliderItem
          title="New articles"
          :items="getArticlesOrder()"
          linkMore="articles"
        >
          <template v-slot:sliderContent="{ item, selectedClass }">
            <CardArticle
              :class="['ma-4', selectedClass]"
              :article="item"
            ></CardArticle>
          </template>
        </SliderItem>
      </div>
      <div v-if="this.forums">
        <SliderItem
          title="New forums"
          :items="getForumsOrder()"
          linkMore="forums"
        >
          <template v-slot:sliderContent="{ item, selectedClass }">
            <CardForum
              :class="['ma-4', selectedClass]"
              :forum="item"
            ></CardForum>
          </template>
        </SliderItem>
      </div>
      <div v-if="this.clips">
        <SliderItem title="New clips" :items="getClipsOrder()" linkMore="clips">
          <template v-slot:sliderContent="{ item, selectedClass }">
            <video-player
              :class="['ma-4', selectedClass]"
              :src="item.path"
              controls
              disablePictureInPicture
              responsive
              height="200"
            />
          </template>
        </SliderItem>
      </div>
    </v-container>
  </div>
</template>

<script>
import CardArticle from "../components/CardArticle.vue";
import CardForum from "../components/CardForum.vue";
import SliderItem from "../components/SliderItem.vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      user: null,
      articles: [],
      forums: [],
      clips: [],
    };
  },
  components: { CardArticle, SliderItem, CardForum },
  computed: {
    ...mapGetters(["getArticles", "getForums", "getClips"]),
  },
  methods: {
    getArticlesOrder() {
      const articlesSorted = this.articles.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      return articlesSorted.slice(0, 5);
    },
    getForumsOrder() {
      if (this.forums.length > 0) {
        const forumsSorted = this.forums.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return forumsSorted.slice(0, 5);
      }
    },
    getClipsOrder() {
      if (this.clips.length > 0) {
        const clipsSorted = this.clips.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return clipsSorted.slice(0, 5);
      }
      return [];
    },
    navigate(route) {
      this.$router.push({ name: route });
    },
    setDatas() {
      this.$store.dispatch("fetchAccessToken");
      this.user = this.$store.getters.getCurrentUser;
      if (
        this.user != null &&
        !["string", "undefined"].includes(typeof this.user)
      ) {
        this.$store.dispatch("getAllArticles").then(() => {
          this.articles = this.getArticles;
        });
        this.$store.dispatch("getValidForums").then(() => {
          this.forums = this.getForums;
        });
        this.$store.dispatch("getAllClip").then(() => {
          this.clips = this.getClips;
        });
        console.log(`Home.vue | Mounted | User updated => ${this.user}`);
      } else {
        console.log(`Home.vue | Mounted (Null user))| User => ${this.user}`);
      }
    },
  },
  mounted() {
    this.setDatas();
  },
};
</script>
