<template>
  <div class='sonone'>
    <!-- (1)子组件1接收data1数据 -->
    <div class='item'>这里是子组件1</div>
    <div class='item item2'>父组件使用props传输的数据为: {{data}}</div>
    <button class='item' @click='sendMsg'>子组件1向父组件传值</button>
    <button class='item' @click='parentsMethod'>调用父组件方法</button>
  </div>
</template>

<script>
export default {
  name: "SonOne",
  props: {
    data: String,
    fatherMethod: {
      type: Function
    }
  },
  data() {
    return {
      msg: "子组件1向父组件传的值"
    };
  },
  methods: {
    sendMsg() {
      // (2) 向父组件传数据
      this.$emit("func1", this.msg);
    },
    parentsMethod() {
      this.$emit("fatherMethod", "我是子组件"); // (4.1) 父组件通过 @fatherMethod 接收；
      this.fatherMethod("我是子组件"); // (4.2) 父组件通过 :fatherMethod接收；
      this.$parent.fatherMethod("我是子组件"); // (4.3) 调用父组件；
    },
    useByFather() {
      alert("子组件1中的方法，等待被父组件调用");
      console.log("子组件1中的方法，等待被父组件调用");
    }
  }
};
</script>

<style scoped>
.sonone {
  background: #cccccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  margin: 10px 0;
}
.item {
  width: 200px;
}
.item2 {
  width: 100%;
}
</style>