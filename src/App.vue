<template>
  <div id="app">
    <nav><router-link to="/">Main page</router-link></nav>
    <nav><router-link to="/page-2">page-2</router-link></nav>
    <v-runtime-template :template="templateText"/>
    <vue-editor :edit-data-prop.sync="text" :loading="false"/>
    <router-view> </router-view>
  </div>
</template>

<script>
import VueEditor from "@/components/vue-editor";
import vRuntimeTemplate from 'v-runtime-template'

export default {
  name: 'App',
  components: {
    VueEditor,
    vRuntimeTemplate
  },
  data() {
    return {
      text: '<p>value</p> <p> adfasdfasd</p>'
    }
  },
  computed: {
    templateText() {
      return '<div>' + this.text + '</div>';
    }
  },
}
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
