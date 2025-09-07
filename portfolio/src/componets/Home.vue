<template>
  <div >
    <about></about>
    <br>
    <projects></projects>
    <br>
    <br>
    <posts></posts>
  </div>
</template>

<script>
import About from './About.vue'
import Projects from './Projects.vue'
import Posts from './Posts.vue'
export default {
  components: { Projects,Posts,
     About,
    },
  name: 'Home',
  props: {
    msg: String
  },
  mounted() {   
    }
}
</script>

