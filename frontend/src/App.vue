<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
/*
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
*/
import axios from 'axios';

export default {
  data() {
    return {
      message: ''
    };
  },
  mounted() {
    // Appel de l'API au backend
    axios.get('http://localhost:3000/')
        .then(response => {
          this.message = response.data.message;
        })
        .catch(error => {
          console.error("Erreur lors de l'appel à l'API :", error);
        });
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
