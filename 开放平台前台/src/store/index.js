import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    USER: localStorage.getItem("USER") ? JSON.parse(localStorage.getItem("USER")) : null, // 用户信息
    LOGINUSER: localStorage.getItem("LOGINUSER") ? JSON.parse(localStorage.getItem("LOGINUSER")) : null, // 登陆信息，包括sessionid
    DocTag: localStorage.getItem("DocTag") ? JSON.parse(localStorage.getItem("DocTag")) : null, // DocTag,
    DocMenu: localStorage.getItem("DocMenu") ? JSON.parse(localStorage.getItem("DocMenu")) : null, // 文档目录
    DocMenuTree: localStorage.getItem("DocMenuTree") ? JSON.parse(localStorage.getItem("DocMenuTree")) : null, // 文档目录树
    RENEWLIST: null,
    registTag: localStorage.getItem("registTag") ? JSON.parse(localStorage.getItem("registTag")) : null,
  },
  mutations: {
    COMMIT_registTag(state, val) {
      if (val) {
        localStorage.setItem("registTag", JSON.stringify(val));
      } else {
        localStorage.removeItem("registTag");
      }
      state.registTag = val;
    },
    COMMIT_RENEWLIST(state, val) {
      state.RENEWLIST = val;
    },
    COMMIT_USER(state, val) {
      console.log(val, "user");

      if (val) {
        localStorage.setItem("USER", JSON.stringify(val));
      } else {
        localStorage.removeItem("USER");
      }
      state.USER = val;
    },
    COMMIT_LOGINUSER(state, val) {
      if (val) {
        localStorage.setItem("LOGINUSER", JSON.stringify(val));
      } else {
        localStorage.removeItem("LOGINUSER");
      }
      state.LOGINUSER = val;
    },
    COMMIT_DocTag(state, val) {
      if (val) {
        localStorage.setItem("DocTag", JSON.stringify(val));
      } else {
        localStorage.removeItem("DocTag");
      }
      state.DocTag = val;
    },
    COMMIT_BUSINESSTag(state, val) {
      state.BusinessTag = val;
    },
    COMMIT_DocMenu(state, val) {
      if (val) {
        localStorage.setItem("DocMenu", JSON.stringify(val));
      } else {
        localStorage.removeItem("DocMenu");
      }
      state.DocMenu = val;
    },
    COMMIT_DocMenuTree(state, val) {
      if (val) {
        localStorage.setItem("DocMenuTree", JSON.stringify(val));
      } else {
        localStorage.removeItem("DocMenuTree");
      }
      state.DocMenuTree = val;
    }
  },
  actions: {
    // 清除页面缓存
    async DISPATCH_CLEARCHACE({ commit }) {
      await Vue.$nextTick();
      commit("COMMIT_USER", null);
      commit("COMMIT_LOGINUSER", null);
    }
  },
  modules: {
  },
});
