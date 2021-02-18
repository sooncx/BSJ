<template>
  <section class="limitApplyRecord">
    <div class="limitApplyRecord__header">
      <h2>额度申请记录</h2>

      <div class="control">
        <el-date-picker
          size="small"
          v-model="filterTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
        <div class="control__btn" @click="searchBtn">搜索</div>
      </div>
    </div>

    <el-scrollbar class="limitApplyRecord__container" v-if="appList.length !== 0">
      <div style="padding-right:20px">
        <div class="items" v-for="(item, index) in appList" :key="index">
          <div class="items__control">
            <div class="left">
              <h5>{{item.name}}</h5>
            </div>
            <div class="right">
              <div class="arrow" @click="item.isShow=!item.isShow">
                <i
                  class="el-icon-arrow-down"
                  :style="{'transform': item.isShow ? 'rotate(180deg)' : 'rotate(0deg)'}"
                ></i>
              </div>
            </div>
          </div>

          <el-collapse-transition>
            <div v-show="item.isShow" class="items__table">
              <el-table :data="item.tableData" style="width: 100%;" size="mini">
                <el-table-column
                  prop="urlName"
                  label="服务器接口名称"
                  min-width="250"
                  align="center"
                  header-align="center"
                ></el-table-column>
                <el-table-column
                  prop="url"
                  label="url"
                  min-width="250"
                  align="center"
                  header-align="center"
                ></el-table-column>
                <el-table-column
                  prop="toDayLimit"
                  label="配额（次/日）"
                  min-width="250"
                  align="center"
                  header-align="center"
                ></el-table-column>
                <el-table-column
                  prop="toQpsLimit"
                  label="并发（次/秒）"
                  min-width="250"
                  align="center"
                  header-align="center"
                ></el-table-column>
              </el-table>
            </div>
          </el-collapse-transition>
        </div>
      </div>
    </el-scrollbar>
    <div v-else class="nothing">
      <img src="../../../assets/img/controlPanel/none.png">
      <p>暂无数据</p>
    </div>
  </section>
</template>
<script>
import dayJs from "dayjs";

export default {
  data() {
    return {
      activeName: "first",
      filterTime: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      appList: []
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const info = {
        modifyType: 2,
        beginTime: dayJs(this.filterTime[0]).format("YYYY-MM-DD HH:mm:ss"),
        endTime: dayJs(this.filterTime[1]).format("YYYY-MM-DD HH:mm:ss")
      };
      const data = await this.$API.queryLimitRecord(info);
      if (data.flag === 1) {
        const arr = [];
        if (data.obj) {
          Object.keys(data.obj).forEach(key => {
            arr.push({
              name: key,
              isShow: true,
              tableData: data.obj[key]
            });
          });
        }
        this.appList = arr;
      }
    },
    searchBtn() {
      if (!this.filterTime) {
        this.$msg.error("请选择时间");
        return;
      }
      this.getTableData();
    }
  }
};
</script>
<style lang="scss" scoped>
.limitApplyRecord {
  height: 100%;
  position: relative;
  &__header {
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    padding-right: 20px;
    box-sizing: border-box;
    justify-content: space-between;
    h2 {
      font-size: 18px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }

    .control {
      display: flex;
      &__btn {
        margin-left: 20px;
        width: 64px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        background: #0856ea;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: white;
        transition: all .2;
        &:hover {
          opacity: .9;
        }
      }
    }
  }

  &__container {
    margin-top: 17px;
    height: calc(100% - 57px);
    box-sizing: border-box;
    .items {
      width: 100%;
      margin-bottom: 15px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 4px 8px 0px rgba(91, 95, 107, 0.08);
      &__control {
        display: flex;
        justify-content: space-between;
        padding: 0 30px;
        font-size: 14px;
        font-weight: 400;
        height: 60px;
        align-items: center;
        border-bottom: 1px solid #eee;
        .left {
          display: flex;
          justify-self: start;
          align-items: center;
          h5 {
            color: rgba(51, 51, 51, 1);
            font-size: 16px;
            margin-right: 17px;
          }
          span {
            color: rgba(102, 102, 102, 1);
          }
        }
        .right {
          color: rgba(8, 86, 234, 1);
          display: flex;
          justify-self: start;
          .order {
            cursor: pointer;
            width: 80px;
            i {
              margin-right: 5px;
            }
          }
          .arrow {
            cursor: pointer;
            width: 26px;
            text-align: right;
            i {
              transition: all 0.5s;
            }
          }
        }
      }

      &__table {
        .opera {
          display: flex;
          justify-content: center;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(8, 86, 234, 1);
          p {
            width: 50px;
            cursor: pointer;
          }
        }
      }
    }
  }

  &__table {
    font-family: PingFang SC;
    .status {
      padding: 0px 7px;
      box-sizing: border-box;
      display: inline-block;
      font-size: 12px;
      font-weight: 400;
      text-align: center;
    }
    .normal {
      background: rgba(230, 255, 229, 1);
      border: 1px solid rgba(75, 222, 69, 1);
      color: rgba(33, 220, 25, 1);
    }
    .alarm {
      background: rgba(255, 229, 229, 1);
      border: 1px solid rgba(222, 69, 69, 1);
      color: rgba(220, 25, 25, 1);
    }
  }
}
.nothing {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  p {
    padding: 10px;
  }
}
::v-deep .el-table th {
  background: rgba(250, 250, 250, 1);
  color: rgba(51, 51, 51, 1);
}
</style>
