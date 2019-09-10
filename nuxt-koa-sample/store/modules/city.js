const state = () => ({
  list: ["a", "b"]
});

const mutation = {
  add(state, text) {
    state.list.push(text);
  }
};

const actions = {
  add: ({ commit }, text) => {
    commit("add", text);
  }
};

export default {
  nameSpaced: true,
  state,
  mutation,
  actions
};
