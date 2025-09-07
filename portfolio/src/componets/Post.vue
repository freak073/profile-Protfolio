<template>
  <div clas="post">
    <router-link to="/">Back</router-link>
    <div v-if="post">
      <div class="post_header_image max-w-2xl">
          <img :src="post.metadata.image" />
      </div>
      <h1 class="pb-4 max-w-2xl">{{post.metadata.title}}</h1>
      <div class="max-w-2xl">
        <div class="line-numbers language-markup" v-html="mdToHtml"></div>
      </div>
    </div>
  </div>
</template>

<script>

import { ref, computed } from "vue";
import { marked } from "marked";
import prism from "prismjs";

// Add numbering to the Code blocks
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

import "prismjs/plugins/toolbar/prism-toolbar.js"; // required for the following plugins
import "prismjs/plugins/toolbar/prism-toolbar.css"; // required for the following plugins
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js"; // show copy button
import "prismjs/plugins/show-language/prism-show-language.js"; // display the language of the code block
import "prismjs/themes/prism-tomorrow.css"; // you can change


// This is needed for a conflict with other CSS files being used (i.e. Bulma).
import "prismjs/plugins/custom-class/prism-custom-class";
prism.plugins.customClass.map({ number: "prism-number", tag: "prism-tag" });
//marked Options => https://marked.js.org/using_advanced#options
marked.use({
  highlight: (code, lang) => {
    if (prism.languages[lang]) {
      return prism.highlight(code, prism.languages[lang], lang);
    } else {
      return code;
    }
  },
});



import axios from 'axios'
export default {
  name: 'Post',
  props: {
    msg: String
  },
  data(){
    let slug = this.$route.params.id
    return{
      post: null,
      slug: slug,
      mdToHtml: ""
    } 
  },
  mounted() {   
    this.getPost()
    },
  methods:{
    async getPost(){
      let res = await axios.get(`/api/posts/${this.slug}`)
      this.post = res.data
      console.log(this.post)  
      // markDown.value = "asdfasdf"
      this.mdToHtml =  marked.parse(this.post.body)
      // next tick
      this.$nextTick(() => {
        prism.highlightAll();
      });


    }
    
  }
}
</script>

<style>
code[class*="language-"], pre[class*="language-"] {
  font-size:0.9em !important;
}
</style>

<style scoped>
.post_header_image{
  margin:  50px 0;
}

</style>
