<template>
  <div class="loginBox" :style="{ left: left, top: top }">
    <div class="logonBox__form">
      <div class="loginBox__title">
        <p>博云车联2.0 公测版</p>
        <span>Welcome to login</span>
      </div>

      <div class="loginBox__content">
        <p>账号</p>
        <div class="loginBox__content__item">
          <input
            type="text"
            placeholder="请输入账号"
            v-model="username"
            @keyup.enter="doLogin"
          />
        </div>

        <p>密码</p>
        <div class="loginBox__content__item">
          <input
            type="password"
            placeholder="请输入密码"
            v-model="password"
            @keyup.enter="doLogin"
          />
        </div>

        <div
          style="
            width: 90%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          "
        >
          <el-button
            class="loginBox__btn"
            type="primary"
            @click="doLogin"
            :loading="loading"
            >登录</el-button
          >

          <el-button type="text" @click="toOldLogin">使用旧版</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PropType } from "vue";
import { ref, reactive, toRefs, defineComponent } from "vue";
import { useGo } from "@/hooks/web/usePage";
import { ElMessage } from "element-plus";
import API from "@/api/httpApi";
import { useStore } from "vuex";
import { useInit } from "@/hooks/web/useInit";

export default defineComponent({
  name: "loginBox",
  props: {
    left: {
      type: String as PropType<string>,
      default: "50%",
    },
    top: {
      type: String as PropType<string>,
      default: "35%",
    },
  },
  setup() {
    const store = useStore();
    const Init = useInit();
    const loginInfo = reactive({
      username: "",
      password: "",
      scope: "carWeb",
    });

    const go = useGo();
    const loading = ref(false);

    async function doLogin() {
      try {
        if (loginInfo.username === "") throw "请输入账号";
        if (loginInfo.password === "") throw "请输入密码";
        loading.value = true;
        const { obj, flag, msg } = await API.login(loginInfo);

        if (flag === 1) {
          store.commit("COMMIT_SESSIONID", obj.sessionId);
          store.commit("COMMIT_EXCLUDECONFIG", ["riskCenter"]);

          await Init.init(true);

          go("/monitorCenter", true);
          setTimeout(() => {
            loading.value = false;
          }, 500);
        } else {
          ElMessage.error(msg);
          setTimeout(() => {
            loading.value = false;
          }, 500);
        }
      } catch (error) {
        ElMessage.error(error.msg ? error.msg : error);
        setTimeout(() => {
          loading.value = false;
        }, 500);
      }
    }

    function toOldLogin() {
      window.location.href = "http://yun.car900.com/login/";
    }
    return {
      doLogin,
      loading,
      ...toRefs(loginInfo),
      toOldLogin,
    };
  },
});
</script>
<style lang="less" scoped>
.loginBox {
  position: absolute;
  width: 520px;
  background: rgba(255, 255, 255, 1);
  padding: 60px 80px;
  transform: translate(-50%, -50%);

  &__form {
    height: 100%;
    width: 100%;
  }

  &__title {
    height: 80px;
    width: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    padding-left: 20px;

    p {
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: bold;
      margin-bottom: 10px;
      color: rgba(24, 116, 229, 1);
    }

    span {
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(170, 180, 193, 1);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-top: 40px;
    padding-left: 20px;
    height: calc(100% - 80px);

    &__item {
      margin-bottom: 35px;
      display: flex;
      background-color: #f0f3f8;
      border: none;
      width: calc(100% - 20px);
      position: relative;

      input {
        width: 100%;
        height: 40px;
        line-height: 40px;
        background-color: #f0f3f8;
        border: none;
        outline: none;
        margin-left: 10px;
      }
    }

    p {
      margin-bottom: 10px;
    }
  }

  &__btn {
    width: 172px;
    height: 44px;
    background: rgba(24, 116, 229, 1);
    box-shadow: 0px 6px 10px 0px rgba(22, 98, 191, 0.2);
    color: rgba(255, 255, 255, 1);
    border: none;
    outline: none;
    cursor: pointer;
  }
}

@media screen and (max-height: 700px) {
  .loginBox {
    width: auto;
    padding: 30px 40px;

    &__title {
      p {
        font-size: 24px;
      }
    }
  }
}
@media screen and (max-width: 980px) {
  .loginBox {
    width: auto;
    &__title {
      p {
        font-size: 24px;
      }
    }
  }
}
</style>