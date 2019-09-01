<template>
  <div class="container">
    <v-header></v-header>

    <v-list></v-list>

  </div>
</template>
<script>
import VHeader from './components/VHeader'
import VList from './components/VList'

export default {
  data(){
    return {}
  },
  components:{
    VHeader,
    VList
  }
}
</script>