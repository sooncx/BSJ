<template>
  <div class="publicAppointBox">
    <div class="publicAppointBox__title">
      <h1>概述</h1>
      <h4>使用场景</h4>
      <p>{{data.desc}}</p>
    </div>

    <div class="publicAppointBox__title">
      <h1>调用地址</h1>
      <p style="color:rgba(0, 0, 255, .85)">http://47.115.157.89:8086</p>
    </div>

    <div class="publicAppointBox__title">
      <h1>协议格式</h1>
      <h2>公共约定</h2>
      <h3>约定</h3>
      <div class="appoint">
        <p>
          <span>服务器默认采用UTF-8编码，数据采用JSON格式</span>
        </p>
        <p>请求：Context-Type:application/x-www-form-urlencoded</p>
        <p>
          <span>响应：Context-Type:application/json charset=utf-8</span>
        </p>
        <p>
          时间统一采用UTC时间，国内是北京时间，格式
          <span>yyyy-MM-dd HH:mm:ss</span>
        </p>
      </div>
    </div>
    <div class="tableContainer">
      <h4 id="CommonParameters">请求公用参数
        <span style="color:rgba(255,0,0,.8)">(两种方式任选其一，都传时Headers中的key优先级最高)</span>
      </h4>
      <h5>Headers:</h5><br>
      <el-table
        :data="data.table1"
        border
        style="min-width: 100%;"
      >
        <el-table-column
          prop="params"
          label="参数"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="类型"
        ></el-table-column>
        <el-table-column
          prop="type1"
          label="是否必须"
        ></el-table-column>
        <el-table-column
          prop="desc"
          label="描述"
        ></el-table-column>
      </el-table>

      <br>
      <h5>Query:</h5><br>
      <el-table
        :data="data.table1"
        border
        style="min-width: 100%;"
      >
        <el-table-column
          prop="params"
          label="参数"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="类型"
        ></el-table-column>
        <el-table-column
          prop="type1"
          label="是否必须"
        ></el-table-column>
        <el-table-column
          prop="desc"
          label="描述"
        ></el-table-column>
      </el-table>

      <h4>返回数据公共属性</h4>
      <el-table
        :data="data.table2"
        border
        style="min-width: 100%;"
      >
        <el-table-column
          prop="params"
          label="参数"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="类型"
        ></el-table-column>
        <el-table-column
          prop="type1"
          label="是否必须"
        ></el-table-column>
        <el-table-column
          prop="desc"
          label="描述"
        ></el-table-column>
      </el-table>

      <h4>通用状态码</h4>
      <el-table
        :data="data.table3"
        border
        style="min-width: 100%;"
      >
        <el-table-column
          prop="code"
          label="code"
        ></el-table-column>
        <el-table-column
          prop="val"
          label="值"
        ></el-table-column>
        <el-table-column
          prop="desc"
          label="描述"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import bycl from "./bycl";
import bysk from "./bysk";
import sim from "./sim";
import point from "./point";

export default {
  props: {
    scrollFlag: {
      type: Boolean,
    },
  },
  data() {
    return {
      data: null,
    };
  },
  computed: {
    ...mapState(["DocTag"]),
  },
  watch: {
    DocTag: {
      handler(val) {
        const type = val.split("-")[0];
        switch (type) {
          case "0":
            this.data = bycl;
            break;
          case "1":
            this.data = bysk;
            break;
          case "2":
            this.data = sim;
            break;
          case "3":
            this.data = point;
            break;
          case "4":
            this.data = point;
            break;
          default:
            break;
        }

        if (this.scrollFlag) {
          this.$nextTick(() => {
            this.getlocal();
            this.$emit("update:scrollFlag", false);
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    getlocal() {
      const anel = document.getElementById("CommonParameters");
      anel.scrollIntoView();
    },
  },
};
</script>
<style lang="scss" scoped>
.publicAppointBox {
  margin-top: 20px;
  &__title {
    text-align: left;
    margin-top: 40px;
    h1 {
      border-bottom: 1px solid #eeeeee;
      color: #333333;
      padding-bottom: 15px;
      font-size: 24px;
    }
    h2 {
      margin-top: 30px;
      margin-bottom: 30px;
      font-weight: 400;
    }
    h3 {
      margin-top: 20px;
      font-weight: 400;
    }
    h4 {
      margin-top: 20px;
      margin-bottom: 20px;
      font-weight: 400;
      font-size: 16px;
    }
    > p {
      line-height: 30px;
    }
    .appoint {
      padding: 9.5px;
      margin: 10px 0 10px;
      font-size: 13px;
      line-height: 1.42857143;
      color: #333;
      word-break: break-all;
      word-wrap: break-word;
      background-color: #f5f5f5;
      border: 1px solid #ccc;
      border-radius: 4px;
      p {
        line-height: 30px;
        span {
          color: #d44950;
        }
      }
    }
  }
  &__title:first-child {
    margin: 0;
  }
}
.tableContainer {
  text-align: left;
  h4 {
    font-weight: weight;
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
