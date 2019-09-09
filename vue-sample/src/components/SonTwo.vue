<template>
  <div class="contents">
    <div class="item">这里是子组件2</div>
    <button class="item" @click="sendMsg1">使用Bus向子组件3传值</button>
    <button class="item" @click="sendMsg2">使用Bus调用组件3方法</button>
    <button class="item" @click="sendMsg3">修改store中的数据</button>
    <div>自定义指令 n</div>
    <div :n="4"></div>
  </div>
</template>

<script>
import bus from "../utils/bus";

export default {
  name: "SonTwo",
  data() {
    return {
      msg: "sontwo 数据"
    };
  },
  methods: {
    sendMsg1() {
      bus.$emit("message", "修改组件3中的数据");
    },
    sendMsg2() {
      bus.$emit("methods");
    },
    sendMsg3() {
      this.$store.dispatch("modifyName", "Torang2");
      this.$store.dispatch("modifyAge", 22);
    }
  }
};
</script>

<style></style>
