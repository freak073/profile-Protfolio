<template>
  <div>
    <h3>Notes</h3>
    <div class="text-sm text-gray-500 mb-4">Hope you up-voted these on hackernews</div>
      <div v-if="posts.length">
      <div  v-for="post in posts" :key="post.title" class="mb-3">
        <router-link :to="{name: 'Post', params: {id: post.metadata.slug, fff: post.metadata.title}}">
          <span class=" font-bold">{{post.metadata.title}}</span>
        </router-link>
        <div class="text-sm text-gray-500"> {{ post.date }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'Home',
  props: {
    msg: String
  },
  data(){
    return{
      posts: []
    }
  },
  async mounted() {   
    await this.getPosts()
    },
  methods:{
    async getPosts(){
      let res = await axios.get('/api/posts')
      
      let posts = res.data.map(p => {
        let date = p.metadata.publishedOn.replace(/^'(.*)'$/, '$1')
        // p.d = moment(p.metadata.publishedOn).format('LLL')
        // console.log( moment(p.metadata.publishedOn))
        p.date = moment(date).format('LL')
        return p
      })
      posts = posts.sort((a, b) => {
        return new Date(b.metadata.publishedOn) - new Date(a.metadata.publishedOn)
      })
      this.posts = posts
    }
    
  }
}
</script>

