<template>
  <div id="app">
    <!-- (1) data1 父组件传数据；
    (2) func1 接收子组件传来的数据；
    (3) ref 定义子组件在父组件的引用；
    (4.1) @fatherMethod 子组件用this.$emit('fatherMethod', 'hello')调用；
    (4.2) :fatherMethod 子组件用 this.fatherMethod('hello')直接调用；-->
    <son-one
      data="this is data1 from top component"
      @func1="getMsgFromSon1"
      ref="sonone"
      @fatherMethod="fatherMethod"
      :fatherMethod="fatherMethod"
    ></son-one>

    <button @click="child1Methods">调用子组件的方法</button>
    <br />
    <son-two></son-two>
    <son-three></son-three>
    <div>
      <router-link :to="{ path: '/first' }" :style="{ 'margin-right': '10px' }"
        >first page</router-link
      >
      <router-link :to="{ path: '/second' }">second page</router-link>
    </div>
    <Content>
      <router-view></router-view>
    </Content>
    <com :age="ages" @patch="message">
      <h3 slot="a">上面</h3>
      <h3 slot="b">下面</h3>
    </com>
    <ev />
  </div>
</template>

<script>
import SonOne from "./components/SonOne";
import SonTwo from "./components/SonTwo";
import SonThree from "./components/SonThree";
import com from "./components/com";
import ev from "./components/events";
import "./components/n";
export default {
  name: "app",
  components: {
    SonOne,
    SonTwo,
    SonThree,
    com,
    ev
  },
  data() {
    return {
      ages: 11
    };
  },
  methods: {
    getMsgFromSon1(msg1) {
      alert("从son1获取到的数据：" + msg1);
    },

    child1Methods() {
      // (3) 使用refs的方式调用子组件1的方法
      this.$refs.sonone.useByFather();
    },

    fatherMethod(str) {
      alert(str + "等待子组件的调用");
    },
    message(ag) {
      this.ages++;
      window.console.log(ag);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
