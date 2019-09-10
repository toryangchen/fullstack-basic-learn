<template>
  <div class="page">
    store
    <ul>
      <li v-for="(item, index) in $store.state.navbar.app" :key="index">
        {{ item }}
      </li>
    </ul>
    page is search
    <ul>
      <li v-for="(item, index) in list" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      list: []
    };
  },
  async asyncData() {
    let {
      status,
      data: { lists }
    } = await axios.get("http://localhost:3000/city/list");
    if (status == 200) {
      return {
        list: lists
      };
    }
  }
};
</script>

<style lang="css" scoped></style>
