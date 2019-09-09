<template>
  <div class="com">
    <slot name="a"></slot>
    child Components
    {{ name }} {{ age }}
    <button type="button" name="button" @click="$emit('patch', 22)">
      发送到组件
    </button>
    <slot name="b"></slot>
  </div>
</template>

<script>
export default {
  props: ["age"],
  data() {
    return {
      name: "com"
    };
  }
};
</script>

<style lang="css" scoped></style>
