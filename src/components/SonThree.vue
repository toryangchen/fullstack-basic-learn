<template>
  <div class='contents'>
    <div class='item'>这里是子组件3</div>
    <div>数据将被组件2用Bus修改： {{message1}}</div>
    <div>store中的数据：{{name}} {{age}}</div>
  </div>
</template>

<script>
import bus from "../utils/bus";
export default {
  name: "SonThree",
  data() {
    return {
      message1: "this is origin message1"
    };
  },
  computed: {
    name: function() {
      return this.$store.getters.name;
    },
    age: function() {
      return this.$store.getters.age;
    }
  },
  created() {
    bus.$on("message", this.changeData);
    bus.$on("methods", this.showAlert);
  },
  methods: {
    changeData(data) {
      this.message1 = data;
    },
    showAlert() {
      alert("组件3 alert：被组件2调用");
      console.log("组件3 alert：被组件2调用");
    }
  }
};
</script>

<style>
</style>