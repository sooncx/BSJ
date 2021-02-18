<template>
  <div>
    <el-dialog
      class="renewal"
      :visible="visible"
      @close="$emit('update:visible', false)"
      @open="init"
      @closed="clear"
      width="600px"
    >
      <div
        slot="title"
        class="Diatitle"
      >
        <span>{{renewList[0] && renewList[0].comboName || '购买套餐'}}</span>
      </div>
      <div class="mainBox">
        <div class="mainBox_bar">
          <span
            v-for="(item, index) in btns"
            :key="index"
            @click="select(item.value)"
          >
            <span :style="{color:(tag === index+1?'#00BDFF':'')}">
              {{item.label}}
            </span>
            {{index === 0?'/':''}}
          </span>
        </div>
        <div class="mainBox_content">
          <div
            class="renewName"
            v-if="renewList[0] && renewList[0].initPrice"
          >
            <!-- <p>{{renewList[0] && renewList[0].comboName}}</p> -->
            <span class="firstPrice">{{renewList[0] && renewList[0].initPrice}}</span>
            <span class="freePrice">{{renewList[0] && renewList[0].freeCombo}}</span>
          </div>
          <div class="renewBox">
            <span
              class="renewals"
              v-for="(item, index) in renewList"
              :key="index"
              @click="choseRenew(index,item)"
              :style="{color:(renewOption === index?'#00BDFF':''),
            'border-color':(renewOption === index?'#00BDFF':'')}"
            >{{item.desc}}
              <span :class="{myIcon:index === renewOption}">
                <i
                  v-show="index === renewOption"
                  class="el-icon-check"
                ></i>
                <span></span>
              </span>
            </span>
          </div>
          <div class="renewNum">
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
          </div>
        </div>
      </div>
      <template slot="footer">
        <el-button
          type="info"
          plain
          size="small"
          @click="$emit('update:visible', false)"
        >取消</el-button>
        <el-button
          type="primary"
          plain
          size="small"
          @click="renewOk"
        >确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object
    }
  },
  computed: {
    ...mapState(["RENEWLIST"])
  },
  data() {
    return {
      tag: 1,
      onecePrice: null,
      renewOption: null,
      selectRenew: {},
      renewNum: 1,
      normalRenew: [],
      monthRenew: [],
      priceCount: 0,
      btns: [
        { label: "普通套餐", value: 1 },
        { label: "月套餐", value: 2 }
      ],
      renewList: []
    };
  },
  watch: {
    renewNum: {
      handler(val) {
        if (val == undefined) {
          this.renewNum = 1;
          this.priceCount = 0;
        } else {
          this.priceCount = this.selectRenew.price * val || 0;
        }
      }
    },
    tag: {
      handler(val) {
        if (val == 1) {
          this.renewList = this.normalRenew;
        } else {
          this.renewList = this.monthRenew;
        }
      }
    }
  },
  methods: {
    clear() {
      this.monthRenew = [];
      this.normalRenew = [];
      this.renewOption = null;
      this.renewNum = 1;
      this.priceCount = 0;
      this.selectRenew = {};
      this.onecePrice = null;
    },
    init() {
      this.RENEWLIST.map(item => {
        if (item.appId == this.rowData.appId) {
          if (item.comboType == 1) {
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
      if (this.tag == 1) {
        this.renewList = this.normalRenew;
      } else {
        this.renewList = this.monthRenew;
      }
      //   console.log(this.monthRenew, "月");
      //   console.log(this.normalRenew, "次");
      //   console.log(this.RENEWLIST, "总");
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
      //   console.log(this.selectRenew, "selectRenew");
      //   console.log(this.rowData, "this.rowData");
      //   console.log(this.renewNum, "this.renewNum");
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
      if (flag == 1) {
        this.$msg({
          showClose: true,
          message: "购买成功",
          type: "success"
        });
        this.$emit("update:visible", false);
        console.log(this.rowDatam, "roedata");
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
::v-deep .el-dialog__header {
  background: #f3f3f3;
  padding: 15px 20px;
}
::v-deep .el-dialog__headerbtn {
  top: 15px;
}
::v-deep .el-dialog__body {
  padding: 0;
}
.mainBox {
  flex: 1;
  padding: 5px;
  display: flex;
  flex-direction: column;
  &_bar {
    height: 30px;
    width: 100%;
    line-height: 30px;
    text-align: left;
    padding-left: 15px;
    & > span {
      cursor: pointer;
      & > span {
        &:hover {
          color: #00bdff;
        }
      }
    }
  }
  &_content {
    flex: 1;
    border-top: 1px solid rgb(233, 233, 233);
    padding: 15px;
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
        height: 20px;
        line-height: 20px;
        border: 1px solid rgb(202, 202, 202);
        padding: 3px 18px;
        margin-right: 20px;
        margin-bottom: 5px;
        position: relative;
        border-radius: 2px;
        &:hover {
          border-color: #00bdff;
          color: #00bdff;
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
</style>
