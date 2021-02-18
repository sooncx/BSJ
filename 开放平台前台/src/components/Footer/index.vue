<template>
  <div class="footer">
    <div class="footer_bottom">
      <div class="footer_bottom_card">
        <ul>
          <li>开发文档</li>
          <li>Development documents</li>
          <li
            v-for="(item, index) in menuList"
            :key="index"
            class="pointer"
            @click="toPath(index)"
          >{{item.name+'接口文档'}}</li>
          <!-- <li
            class="pointer"
            @click="toPath('wlw')"
          >物联网接口文档</li> -->
        </ul>
      </div>
      <div class="footer_bottom_card">
        <ul>
          <li>商务合作</li>
          <li>Business cooperation</li>
          <li
            class="pointer"
            @click="toPath('bsfa')"
          >部署方案</li>
          <li
            class="pointer"
            @click="toPath('ptdzh')"
          >定制化平台</li>
          <li
            class="pointer"
            @click="toPath('kaifa')"
          >APP/H5/WEB开发</li>
        </ul>
      </div>
      <div class="footer_bottom_card">
        <ul>
          <li>常见问题</li>
          <li>Common problem</li>
          <li>常见问题</li>
        </ul>
      </div>
      <div class="footer_bottom_card">
        <ul>
          <li>联系方式</li>
          <li>Contact us</li>
          <li><span>客户热线：</span>
            183-1828-9624</li>
          <li><span>商务合作：</span>
            2853108843@qq.com</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
// @ is an alias to /src

export default {
  name: "Footer",
  data() {
    return {};
  },
  computed: {
    ...mapState(["DocMenu"]),
    menuList() {
      const arr = [];
      this.DocMenu.map(item => {
        arr.push({
          name: item.name
        });
      });
      return arr.splice(0, 4);
    }
  },
  methods: {
    ...mapMutations(["COMMIT_DocTag"]),
    toPath(type) {
      // if (type === 0) {
      //   this.COMMIT_DocTag("0-0");
      //   this.$router.push({
      //     name: "developDoc"
      //   });
      // } else if (type === 1) {
      //   this.COMMIT_DocTag("1-0");
      //   this.$router.push({
      //     name: "developDoc"
      //   });
      // }
      if (typeof type === "number") {
        const tag = [type.toString(), "-0-0"].join("");
        this.COMMIT_DocTag(tag);
        this.$router.push({
          name: "developDoc",
          query: { id: tag }
        });
      } else {
        this.$router.push({
          name: "businessCooperation"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.footer {
  width: 100%;
  min-width: 1080px;
  &_top {
    height: 438px;
    background: url("../../assets/img/home/footer_top.png");
    background-repeat: no-repeat;
    &_title {
      font-size: 20px;
      padding: 40px 0 80px 0;
      color: #fff;
    }
    &_content {
      display: flex;
      flex-wrap: wrap;
      width: 1080px;
      margin: 0 auto;
      //   justify-content: center;
      img {
        padding: 20px;
      }
    }
  }
  &_bottom {
    height: 330px;
    background: #00091a;
    display: flex;
    justify-content: center;
    // align-items: center;
    &_card {
      padding: 0 50px;
      margin-top: 60px;
      ul {
        color: #fff;
        li {
          display: flex;
          font-size: 14px;
          padding: 8px 0;
          span {
            color: #6b7da0;
          }
        }
        li:nth-child(1) {
          font-size: 16px;
        }
        li:nth-child(2) {
          font-size: 12px;
          color: #6b7da0;
          padding-bottom: 15px;
        }
      }
    }
  }
}
.pointer {
  cursor: pointer;
  transition: all 0.2s;
}
.pointer:hover {
  color: #0856ea;
}
</style>
