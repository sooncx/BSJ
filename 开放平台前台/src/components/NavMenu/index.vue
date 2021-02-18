<template>
  <div
    class="NavMenu"
    id="main"
    ref="NavMenu"
    :style="{'left':`${menuList?domWidth && domWidth / -2.5:0}px`}"
  >
    <!-- <div class="NavMenu_labels">
      <div
        v-for="(item, index) in menuList"
        :key="index"
      >
        {{item.label}}
      </div>
    </div> -->
    <div class="NavMenu_items">
      <div
        class="card"
        v-for="(item, index) in menuList"
        @click="headerClick(index)"
        :key="index"
      >
        <h3 class="labels">{{item.label}}</h3>
        <ul>
          <template v-for="(item2, index2) in item.value">
            <li
              @click.stop="jump(item2.value)"
              v-if="index2 < 10"
              :key="index2"
              :style="{color:($route.name == 'developDoc' && DocTag &&
              DocTag.split('-')[0] == index && DocTag.split('-')[1] == item2.index2 && DocTag.split('-')[2] == index2?
              '#0856EA':'')}"
            >{{item2.title}}</li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
// @ is an alias to /src

export default {
  name: "NavMenu",
  props: {
    menuList: {
      type: Array
    },
    isShow: {
      type: Boolean
    }
  },
  data() {
    return {
      domWidth: 0
    };
  },
  computed: {
    ...mapState(["DocTag"])
  },
  watch: {
    isShow: {
      handler(val) {
        if (val) {
          this.domWidth = this.$refs.NavMenu.clientWidth;
          // console.log(this.$refs.NavMenu.clientWidth);
        }
      }
    }
  },
  methods: {
    ...mapMutations(["COMMIT_DocTag"]),
    jump(val) {
      this.COMMIT_DocTag(val);
      // console.log(this.DocTag, val, "DocTag&val");
      this.$router.push({
        path: "/developDoc",
        query: { id: val }
      });
    },
    headerClick(index) {
      this.COMMIT_DocTag(`${index}-0`);
      const val = [index, 0].join();
      this.$router.push({
        path: "/developDoc",
        query: { id: val }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.NavMenu {
  box-shadow: 0 0 10px 0 rgba(51, 51, 51, 0.233);
  border-radius: 2px;
  background: #fff;
  position: absolute;
  z-index: 998;
  display: flex;
  color: #333;
  flex-direction: column;
  // padding: 10px; //122行
  line-height: 40px;
  &_labels {
    width: 100%;
    border-bottom: 1px solid rgb(231, 231, 231);
    display: flex;
    justify-content: space-between;
    text-align: left;
    box-sizing: border-box;
    line-height: 30px;
    div {
      padding: 0 10px;
      flex: 1;
      text-align: left;
    }
  }
  &_items {
    display: flex;
    justify-content: space-between;
    text-align: left;
    line-height: 30px;
    padding: 10px; // 101行
    .labels {
      padding: 5px 10px;
      border-bottom: 1px solid rgb(231, 231, 231);
      line-height: 30px;
      font-family: PingFang SC;
      font-weight: 400;
      margin-bottom: 10px;
      color: #0856ea;
    }
    .card {
      // min-width: 150px;
      margin-top: 5px;
      // padding: 5px 2px;
      flex: 1;
      text-align: left;
      ul {
        min-width: 220px !important;
        // max-width: 400px !important;
        li {
          overflow: hidden;
          text-overflow: ellipsis;
          color: rgba(0, 0, 0, 0.8);
          white-space: nowrap;
          padding: 0 10px;
          cursor: pointer;
          height: 32px;
          // margin: 2px 0;
          &:hover {
            background: #f3f7ff;
            color: #333333;
          }
        }
      }
    }
  }
}
</style>
