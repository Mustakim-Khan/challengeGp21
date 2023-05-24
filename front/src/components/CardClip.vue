<template>
  <v-card width="344" class="mb-10">
    <video-player
      :src="clip.path"
      controls
      disablePictureInPicture
      responsive
      height="200"
    />
    <v-card-subtitle>
      Uploaded by {{ clip.uploadedBy.username }}
    </v-card-subtitle>
    <v-card-text> {{ clip.title }} </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    clip: {
      type: Object,
      required: true,
    },
  },
  data: () => ({}),
};
</script>
