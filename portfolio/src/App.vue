<template>
  <div class="mx-4 md:mx-auto max-w-screen-lg">
    <snowflake></snowflake>
    <div class="header">
      <router-link to="/">
        <h1 class="italic">mike korostelev</h1>
      </router-link>
      <div class="flex space-x-4 mt-2">
        <a
          href="https://github.com/korostelevm"
          target="_blank"
          class="header_link"
        >
          <i class="fab fa-github"></i>
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/michaelkorostelev/"
          target="_blank"
          class="header_link"
        >
          <i class="fab fa-linkedin-in"></i>
          LinkedIn
        </a>
        <a
          href="https://twitter.com/mike_korostelev"
          target="_blank"
          class="header_link"
        >
          <i class="fab fa-twitter"></i>
          Twitter/X
        </a>
        <a
          href="/blog/resume-2023-pe.pdf"
          target="_blank"
          class="header_link"
        >
        <i class="far fa-file-pdf"></i>
          CV
        </a>
        <a
          href="https://coldlambda.com/"
          target="_blank"
          class="font-bold"
        >
        λ
        </a>
      </div>
      <div class="my-2">
        <a
          href="https://calendly.com/korostelevm/30min"
          target="_blank"
          class="text-gray-500 "
        >
          Schedule a call
        </a>
        
      </div>
    </div>

    
    <router-view class="my-10"></router-view>
    <br>
    <a
          href="https://coldlambda.com/#icecube"
          target="_blank"
          class="font-bold "
        >
        ▣
    </a>
  </div>
</template>

<script>
import Snowflake from './components/Snowflake.vue'
  export default {
    components: { Snowflake },
    name: "App",
    setup () {
    },
    mounted() {
      console.log("App mounted!");
    },
    data: () => ({
    }),
  };
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* color: #2c3e50; */
    margin-top: 60px;
  }
</style>
