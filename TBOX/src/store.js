import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

const Store = new Vuex.Store({
  state: {
    TOKEN: null, // sid
    USER: localStorage.getItem("USER") ? JSON.parse(localStorage.getItem("USER")) : null, //用户信息
    GROUPLIST: [], //当前车组组织
    USERLIST: [], //当前用户列表
    KEEPALIVE: ["index"] //keepAlive 页面缓存配置
  },
  mutations: {
    COMMIT_USER(state, val) {
      val ? localStorage.setItem("USER", JSON.stringify(val)) : localStorage.removeItem("USER");
      state.USER = val;
    },
    COMMIT_GROUPLIST(state, val) {
      state.GROUPLIST = Object.freeze(val);
    },
    COMMIT_USERLIST(state, val) {
      state.USERLIST = Object.freeze(val);
    },
    COMMIT_KEEPALIVE(state, val) {
      state.KEEPALIVE = val;
  },
  },
  actions: {
    //清除页面缓存
    async DISPATCH_CLEARCHACE({ commit, state }, { Vue }) {
      await Vue.$nextTick();
      commit("COMMIT_GROUPLIST", []);
      commit("COMMIT_USERLIST", []);
      commit("COMMIT_USER", null);

      const KEEPALIVE = [...state.KEEPALIVE];
      commit("COMMIT_KEEPALIVE", []);
      await Vue.$nextTick();
      commit("COMMIT_KEEPALIVE", KEEPALIVE);
    }
  }
});

export default Store;
