

import {createApp} from 'vue'
import * as VueRouter from 'vue-router'
import './index.css'
import LogRocket from 'logrocket';

const host = window.location.hostname;

if (host !== "localhost") {
  LogRocket.init('00tifr/com',{
      serverURL: "https://d39tjlkpt25kc0.cloudfront.net/i"
    });
}
console.log(LogRocket)


import App from './App.vue'
import Posts from './components/Posts.vue'
import Post from './components/Post.vue'

import Home from './components/Home.vue'
const About = { template: '<div>About</div>' }

const routes = [
  { path: '/', component: Home, 
    meta: {
      title: "Mike Korostelev",
      description: "Cloud Architect."
    }
   },
  { path: '/posts/:id', component: Post, props: true, name: 'Post',
    meta: {
      title: "{subtitle}",
      description: "Cloud Architect."
    } 
   },
]
const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
//   history: VueRouter.createWebHashHistory(),
  routes, 
})

router.beforeEach(async (to, from) => {
  if(to.meta.title){
    document.title = to.meta.title.replace('{subtitle}', to.params.id)
  }else{
    document.title = 'Mike Korostelev'
  }
  window.scrollTo({ top: 0})
})




const app = createApp(App)
app.use(router)
// app.use(useMeta)


app.mount('#app')

