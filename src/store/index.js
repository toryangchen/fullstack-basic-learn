import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters';
import * as actions from './actions';
import * as mutations from './mutations';

Vue.use(Vuex);
const state = {
  name: 'Toryang',
  age: 25,
};

// 注册各个模块
const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
export default store;
