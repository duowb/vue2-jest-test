<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <Form @validate="validate" label="活动名称" btnText="立即创建"/>
    <span class="validate-res">{{validateRes}}</span>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Form from './components/Form.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Form
  },
  data(){
    return {
      validateRes: ''
    }
  },
  methods: {
    validate(res){
      this.validateRes = res
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
