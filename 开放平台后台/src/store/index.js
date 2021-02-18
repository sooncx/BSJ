import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    USER: localStorage.getItem("USER") ? JSON.parse(localStorage.getItem("USER")) : null, // 用户信息
    APPLIST: localStorage.getItem("APPLIST") ? JSON.parse(localStorage.getItem("APPLIST")) : null, // 应用列表
    USERLIST: localStorage.getItem("USERLIST") ? JSON.parse(localStorage.getItem("USERLIST")) : null, // 用户列表
    RENEWLIST: null,
  },
  mutations: {
    COMMIT_RENEWLIST(state, val) {
      state.RENEWLIST = val;
    },
    COMMIT_USER(state, val) {
      if (val) {
        localStorage.setItem("USER", JSON.stringify(val));
      } else {
        localStorage.removeItem("USER");
      }
      state.USER = val;
    },
    COMMIT_APPLIST(state, val) {
      if (val) {
        localStorage.setItem("APPLIST", JSON.stringify(val));
      } else {
        localStorage.removeItem("APPLIST");
      }
      state.APPLIST = val;
    },
    COMMIT_USERLIST(state, val) {
      if (val) {
        localStorage.setItem("USERLIST", JSON.stringify(val));
      } else {
        localStorage.removeItem("USERLIST");
      }
      state.USERLIST = val;
    },
  },
  actions: {
    async DISPATCH_CLEARCHACE({ commit }) {
      // await Vue.$nextTick();
      console.log("clear");
      commit("COMMIT_RENEWLIST", null);
      commit("COMMIT_USER", null);
      commit("COMMIT_APPLIST", null);
      commit("COMMIT_USERLIST", null);
    }
  },
  modules: {
  },
});
