<template>
  <div>
    <el-dialog
      class="renewal"
      :visible="visible"
      @close="$emit('update:visible', false)"
      @open="init"
      @closed="clear"
      width="920px"
    >
      <div class="mainBox">
        <div class="mainBox_bar">
          <span
            v-for="(item, index) in btns"
            :key="index"
            @click="select(item.value)"
          >
            <span :style="{color:(tag === index+1?'#0856ea':'')}">
              {{item.label}}
            </span>
          </span>
        </div>
        <div class="mainBox_content">
          <!-- <div
            class="renewName"
            v-if="renewList[0] && renewList[0].initPrice"
          >
            <p>{{renewList[0] && renewList[0].comboName}}</p>
            <span class="firstPrice">{{renewList[0] && renewList[0].initPrice}}</span>
            <span class="freePrice">{{renewList[0] && renewList[0].freeCombo}}</span>
          </div> -->
          <div class="renewBox">
            <div
              class="renewals"
              v-for="(item, index) in renewList"
              :key="index"
              @click="choseRenew(index,item)"
              :style="{'border-color':(renewOption === index?'#0856ea':'')}"
            >
              <div
                class="renewals_bar"
                :style="{background:(renewOption === index?'#0856ea':''),color:(renewOption === index?'#fff':'')}"
              >{{item.name}}</div>
              <div class="renewals_content">
                <div class="box">
                  <div class="top">
                    <p>￥<span>{{descFormatr(item.desc)[0]}}</span></p>
                    <p>{{descFormatr(item.desc)[1]}}</p>
                  </div>
                  <div
                    v-if="(item.price/item.invokeNum)>0.00002"
                    class="bottom"
                  >每次仅{{(item.price/item.invokeNum).toString().split("").length > 6 ?(item.price/item.invokeNum).toFixed(3):item.price/item.invokeNum}}元</div>
                  <!-- <div v-else class="bottom">每次约{{(item.price/item.invokeNum).toFixed(5)}}元</div> -->
                  <div
                    class="bottom"
                    v-else
                  >无次数限制</div>
                </div>
              </div>
              <!-- <span :class="{myIcon:index === renewOption}">
                <i
                  v-show="index === renewOption"
                  class="el-icon-check"
                ></i>
                <span></span>
              </span> -->
            </div>
          </div>
          <!-- <div class="renewNum">
            <span>请输入购买套餐数量：</span>
            <el-input-number
              size="small"
              v-model="renewNum"
              :precision="0"
              :step="1"
              :min="1"
              label="请输入购买数量"
            ></el-input-number>
          </div>
          <div class="price">
            <span>￥{{priceCount}}.00</span>
            <span>{{onecePrice&&'( '+onecePrice+'元 / 次 )'}}</span>
          </div> -->
        </div>
      </div>
      <div class="footer">
        <div
          class="btn"
          @click="confirm"
        >提交</div>
      </div>
      <!-- <template slot="footer"> -->
      <!-- <el-button
          type="info"
          plain
          size="small"
          @click="$emit('update:visible', false)"
        >取消</el-button> -->
      <!-- <el-button
          type="primary"
          plain
          size="small"
          @click="confirm"
        >提交</el-button> -->
      <!-- </template> -->
    </el-dialog>
    <phoneDialog :visabled.sync="phoneShow" />
  </div>
</template>
<script>
import { mapState } from "vuex";
import phoneDialog from "../../../components/renewSubmitDialog/index.vue";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object
    },
    RENEWLIST: {
      type: Array
    }
  },
  components: {
    phoneDialog
  },
  data() {
    return {
      phoneShow: false,
      tag: 1,
      onecePrice: null,
      renewOption: null,
      selectRenew: {},
      renewNum: 1,
      normalRenew: [],
      monthRenew: [],
      priceCount: 0,
      btns: [
        { label: "月套餐", value: 1 },
        { label: "普通套餐", value: 2 }
      ],
      renewList: []
    };
  },
  watch: {
    renewNum: {
      handler(val) {
        if (val === undefined) {
          this.renewNum = 1;
          this.priceCount = 0;
        } else {
          this.priceCount = this.selectRenew.price * val || 0;
        }
      }
    },
    tag: {
      handler(val) {
        if (val === 2) {
          this.renewList = this.normalRenew;
        } else {
          this.renewList = this.monthRenew;
        }
      }
    }
  },
  methods: {
    confirm() {
      if (!this.renewOption) {
        this.$msg({
          showClose: true,
          message: "请选择套餐",
          type: "warning"
        });
        return;
      }
      this.phoneShow = true;
      setTimeout(() => {
        this.$emit("update:visible", false);
      }, 100);
    },
    clear() {
      this.monthRenew = [];
      this.normalRenew = [];
      this.renewOption = null;
      this.renewNum = 1;
      this.priceCount = 0;
      this.selectRenew = {};
      this.onecePrice = null;
    },
    descFormatr(src) {
      if (!src) return;
      const arr = src.split("（");
      let money = 0;
      let count = 0;
      if (arr.length > 1) {
        money = arr[1]
          .split("）")[0]
          .split("/")[0]
          .split("元");
        count = arr[1].split("）")[0].split("/");
      } else if (arr[0].indexOf("次数不限") === -1) {
        money = arr[0].split("/")[0].split("元");
        count = arr[0].split("/");
      } else {
        money = arr[0].split("/")[0].split("元");
        count = ["", "无次数限制"];
      }
      // console.log(money, count);
      return [money[0], count[1]];
    },
    renewFormat(list) {
      const arr = JSON.parse(JSON.stringify(list));
      const renewList = [
        ["体验套餐"],
        ["体验套餐", "进阶套餐"],
        ["体验套餐", "进阶套餐", "大客户套餐"],
        ["体验套餐", "进阶套餐", "合作伙伴套餐", "大客户套餐"],
        ["体验套餐", "体验套餐2", "进阶套餐", "合作伙伴套餐", "大客户套餐"],
        [
          "体验套餐",
          "体验套餐2",
          "进阶套餐",
          "进阶套餐2",
          "合作伙伴套餐",
          "大客户套餐"
        ]
      ];
      list.map((item, index) => {
        if (list.length <= 6) {
          arr[index].name = renewList[list.length - 1][index];
        } else if (index >= 2 && index <= list.length - 3) {
          const myindex = index - 2 > 0 ? index - 2 : "";
          arr[index].name = ["进阶套餐", myindex].join("");
        } else {
          arr[0].name = "体验套餐";
          arr[1].name = "体验套餐2";
          arr[list.length - 2].name = "合作伙伴套餐";
          arr[list.length - 1].name = "大客户套餐";
        }
      });
      console.log(arr, "arrr");
      return arr;
    },
    init() {
      this.RENEWLIST.map(item => {
        if (item.appId === this.rowData.appId) {
          if (item.comboType === 1) {
            this.monthRenew.push(item);
          } else {
            this.normalRenew.push(item);
          }
        }
      });
      this.monthRenew.sort((a, b) => {
        if (a) return a.price - b.price;
      });
      this.normalRenew.sort((a, b) => {
        if (a) return a.price - b.price;
      });
      // 次数套餐
      this.normalRenew = this.renewFormat(this.normalRenew);
      // 月套餐
      this.monthRenew = this.renewFormat(this.monthRenew);
      if (this.tag === 2) {
        this.renewList = this.normalRenew;
      } else {
        this.renewList = this.monthRenew;
      }
    },
    select(data) {
      this.tag = data;
      this.renewOption = null;
      this.renewNum = 1;
      this.priceCount = 0;
      this.selectRenew = {};
      this.onecePrice = null;
    },
    async renewOk() {
      if (!this.selectRenew.appId) {
        this.$msg({
          showClose: true,
          message: "请选择套餐",
          type: "warning"
        });
        return;
      }
      const params = {
        userAppId: this.rowData.userAppId,
        comboDetailId: this.selectRenew.comboDetailId,
        buyNum: this.renewNum
      };
      const { flag } = await this.$API.buyCombos(params);
      if (flag === 1) {
        this.$msg({
          showClose: true,
          message: "购买成功",
          type: "success"
        });
        this.$emit("update:visible", false);
        this.$emit("saveOk");
      }
    },
    choseRenew(index, item) {
      this.onecePrice = item.averagePrice || null;
      this.selectRenew = item;
      this.priceCount = item.price * this.renewNum;
      this.renewOption = index;
    }
  }
};
</script>
<style lang="scss" scoped>
.Diatitle {
  text-align: left;
}
// .renewal {
// ::v-deep .el-dialog__header {
//   background: #f3f3f3;
//   padding: 15px 20px;
// }
// ::v-deep .el-dialog__headerbtn {
//   top: 15px;
// }
// ::v-deep .el-dialog__body {
//   padding: 0;
// }
// }
.mainBox {
  flex: 1;
  padding: 5px;
  display: flex;
  flex-direction: column;
  margin-top: -45px;
  &_bar {
    height: 30px;
    width: 100%;
    line-height: 30px;
    text-align: left;
    padding-left: 15px;
    & > span {
      cursor: pointer;
      padding-right: 20px;
      & > span {
        &:hover {
          color: #00bdff;
        }
      }
    }
  }
  &_content {
    flex: 1;
    // border-top: 1px solid rgb(233, 233, 233);
    padding: 15px;
    padding-top: 40px;
    display: flex;
    flex-direction: column;
    .renewName {
      p {
        font-size: 20px;
        font-weight: bold;
        text-align: left;
        margin-bottom: 10px;
      }
      text-align: left;
      .firstPrice {
        color: rgb(62, 236, 169);
        margin-right: 20px;
      }
      .freePrice {
        color: rgb(251, 140, 35);
      }
      margin-bottom: 20px;
    }
    .renewBox {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .renewals {
        cursor: pointer;
        width: 180px;
        height: 156px;
        margin-right: 36px;
        line-height: 20px;
        border: 1px solid #ebebeb;
        margin-bottom: 40px;
        position: relative;
        border-radius: 1px;
        &:hover {
          border-color: #0856ea;
          // color: #0856ea;
          // .renewals_bar {
          //   background: #0856ea;
          //   color: #fff;
          // }
        }
        &:nth-child(4) {
          margin-right: 0;
        }
        &:nth-child(8) {
          margin-right: 0;
        }
        &_bar {
          width: 100%;
          height: 30px;
          background: #ebebeb;
          line-height: 30px;
          text-align: center;
        }
        &_content {
          flex: 1;
          width: 100%;
          height: 126px;
          display: flex;
          justify-content: center;
          .box {
            height: 100%;
            width: 70%;
            // background: red;
            p {
              padding-bottom: 5px;
              span {
                color: #0856ea;
                font-size: 20px;
              }
            }
            .top {
              width: 100%;
              height: 65%;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              border-bottom: 1px solid #e5e5e5;
            }
            .bottom {
              width: 100%;
              height: 35%;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #999999;
            }
          }
        }
      }
      .myIcon {
        i {
          position: absolute;
          z-index: 99;
          color: #fff;
          bottom: -1px;
          right: 0;
          font-size: 12px;
        }
        span {
          height: 0;
          width: 0;
          content: "";
          position: absolute;
          border-left: 15px solid #00bdff;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
          transform: rotate(45deg);
          right: -3px;
          bottom: -10px;
        }
      }
    }
    // .renewBox:after {
    //   content: "";
    //   width: 400px;
    // }
    .renewNum {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 20px;
    }
    .price {
      & span:nth-child(1) {
        font-size: 36px;
        font-weight: bold;
        color: red;
        margin-right: 5px;
      }
      text-align: left;
    }
  }
}
.footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 60px;
  .btn {
    width: 90px;
    height: 36px;
    background: rgba(8, 86, 234, 1);
    text-align: center;
    line-height: 36px;
    color: #fff;
    cursor: pointer;
    margin-right: 20px;
    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
