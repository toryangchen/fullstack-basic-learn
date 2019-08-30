export function modifyName({ commit }, name) {
  return commit('modifyName', name);
}

export function modifyAge({ commit }, age) {
  return commit('modifyAge', age);
}
