<template>
  <div class="home">
    <div class="container">
      <h1  v-if='predictResult'>Prediction :{{`${predictResult.displayName}`}}</h1>
      <h1 v-else>Prediction</h1>
      <div> Hi {{username}}</div>
    </div>
    <div class="container">
      <vue-dropzone
        ref="myVueDropzone"
        id="dropzone"
        :options="dropzoneOptions"
        @vdropzone-complete='onComplete'
      />
    </div>
  </div>
</template>

<script>
import Parse from 'parse'
import vueDropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  name: "secret",
  components: {
    vueDropzone,
  },
  data() {
    return {
      dropzoneOptions: {
          url: '/apis/files/upload',
          thumbnailWidth: 150,
          maxFilesize: 0.5,
          headers: { "My-Awesome-Header": "header value" }
      },
      email: null,
      createdAt: null,
      username: null,
      predictResult: null
    };
  },
  mounted() {
    const user = Parse.User.current()
    const {username, createdAt, email} = user.toJSON()
    this.username = username
    this.createdAt = createdAt
    this.email = email
  },
  methods: {
    onComplete: function (e) {
      try {
        const res = JSON.parse(e.xhr.response)
        console.log(res.payload)
        this.predictResult = res.payload[0]
      }
      catch(e){
        alert(e)
      }
      // if(!res.files || !res.files.length) return 
      
      // this.imageList = [...this.imageList, ...res.files]
    },
  },
};
</script>
