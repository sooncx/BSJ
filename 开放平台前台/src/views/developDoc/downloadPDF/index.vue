<template>
  <div class="downloadPDF">
    <div style="text-align: left; margin-top: 40px">
      <h1
        style="
          border-bottom: 1px solid #eeeeee;
          color: #333333;
          padding-bottom: 15px;
          font-size: 24px;
        "
      >
        概述
      </h1>
      <h4
        style="
          margin-top: 20px;
          margin-bottom: 20px;
          font-weight: 400;
          font-size: 16px;
        "
      >
        使用场景
      </h4>
      <p style="line-height: 30px">{{ data.desc }}</p>
    </div>

    <div style="text-align: left; margin-top: 40px">
      <h1
        style="
          border-bottom: 1px solid #eeeeee;
          color: #333333;
          padding-bottom: 15px;
          font-size: 24px;
        "
      >
        调用地址
      </h1>
      <p style="color: rgba(0, 0, 255, 0.85); line-height: 30px">
        http://47.115.157.89:8086
      </p>
    </div>

    <div style="text-align: left; margin-top: 40px">
      <h1
        style="
          border-bottom: 1px solid #eeeeee;
          color: #333333;
          padding-bottom: 15px;
          font-size: 24px;
        "
      >
        协议格式
      </h1>
      <h2 style="margin-top: 30px; margin-bottom: 30px; font-weight: 400">
        公共约定
      </h2>
      <h3 style="margin-top: 20px; font-weight: 400">约定</h3>
      <div
        style="
          padding: 9.5px;
          margin: 10px 0 10px;
          font-size: 13px;
          color: #333;
          border: 1px solid #ccc;
          border-radius: 4px;
        "
      >
        <p style="line-height: 30px">
          <span style="color: #d44950"
            >服务器默认采用UTF-8编码，数据采用JSON格式</span
          >
        </p>
        <p style="line-height: 30px">
          请求：Context-Type:application/x-www-form-urlencoded
        </p>
        <p style="line-height: 30px">
          <span style="color: #d44950"
            >响应：Context-Type:application/json charset=utf-8</span
          >
        </p>
        <p style="line-height: 30px">
          时间统一采用UTC时间，国内是北京时间，格式
          <span style="color: #d44950">yyyy-MM-dd HH:mm:ss</span>
        </p>
      </div>
    </div>

    <div style="text-align: left">
      <h4 style="font-weight: weight; margin-top: 20px; margin-bottom: 20px">
        请求公用参数
        <span style="color: rgba(255, 0, 0, 0.8)"
          >(两种方式任选其一，都传时Headers中的key优先级最高)</span
        >
      </h4>
      <h5>Headers:</h5>
      <table cellpadding="0" cellspacing="0">
        <thead style="display: table-row-group">
          <tr>
            <th style="border: 1px solid #ddd; padding: 5px 10px">参数</th>
            <th style="border: 1px solid #ddd; padding: 5px 10px">类型</th>
            <th style="border: 1px solid #ddd; padding: 5px 10px">是否必须</th>
            <th style="border: 1px solid #ddd; padding: 5px 10px">描述</th>
          </tr>
          <tr v-for="(item, index) in data.table1" :key="index">
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.params }}
            </td>
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.type }}
            </td>
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.type1 }}
            </td>
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.desc }}
            </td>
          </tr>
        </thead>
      </table>
      <h5>Query:</h5>
      <table cellpadding="0" cellspacing="0">
        <thead style="display: table-row-group">
          <tr>
            <th style="border: 1px solid #ddd; padding: 5px 10px">参数</th>
            <th style="border: 1px solid #ddd; padding: 5px 10px">类型</th>
            <th style="border: 1px solid #ddd; padding: 5px 10px">是否必须</th>
            <th style="border: 1px solid #ddd; padding: 5px 10px">描述</th>
          </tr>
          <tr v-for="(item, index) in data.table1" :key="index">
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.params }}
            </td>
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.type }}
            </td>
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.type1 }}
            </td>
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.desc }}
            </td>
          </tr>
        </thead>
      </table>
      <h4>返回数据公共属性</h4>
      <table cellpadding="0" cellspacing="0">
        <thead style="display: table-row-group">
          <tr>
            <th style="border: 1px solid #ddd; padding: 5px 10px">参数</th>
            <th style="border: 1px solid #ddd; padding: 5px 10px">类型</th>
            <th style="border: 1px solid #ddd; padding: 5px 10px">是否必须</th>
            <th style="border: 1px solid #ddd; padding: 5px 10px">描述</th>
          </tr>
          <tr v-for="(item, index) in data.table2" :key="index">
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.params }}
            </td>
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.type }}
            </td>
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.type1 }}
            </td>
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.desc }}
            </td>
          </tr>
        </thead>
      </table>
      <h4>通用状态码</h4>
      <table cellpadding="0" cellspacing="0">
        <thead style="display: table-row-group">
          <tr>
            <th style="border: 1px solid #ddd; padding: 5px 10px">code</th>
            <th style="border: 1px solid #ddd; padding: 5px 10px">值</th>
            <th style="border: 1px solid #ddd; padding: 5px 10px">描述</th>
          </tr>
          <tr v-for="(item, index) in data.table3" :key="index">
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.code }}
            </td>
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.val }}
            </td>
            <td style="border: 1px solid #ddd; padding: 3px 10px">
              {{ item.desc }}
            </td>
          </tr>
        </thead>
      </table>
    </div>

    <div v-for="(item, index) in restaurants" :key="index">
      <h1
        style="
          border-bottom: 1px solid #eeeeee;
          color: #333333;
          padding-bottom: 15px;
          font-size: 24px;
        "
      >
        {{ item.title }}
      </h1>
      <p style="line-height: 30px">最后更新时间：{{ item.updateTime }}</p>
      <div style="margin-top: 25px">
        <div style="margin-top: 20px">
          <h2>基本信息</h2>
          <div
            style="
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              text-align: left;
            "
          >
            <p style="height: 42px; line-height: 42px">
              接口方式：
              <span
                style="
                  width: 40px;
                  height: 20px;
                  line-height: 20px;
                  font-size: 12px;
                  text-align: center;
                  display: inline-block;
                "
                :style="{
                  background:
                    item.method === 'GET'
                      ? 'rgba(180, 255, 236, 1)'
                      : 'rgba(255, 229, 180, 1)',
                  color: item.method === 'GET' ? '#0ab98d' : '#f0a20f',
                }"
                >{{ item.method }}</span
              >
            </p>
            <p style="height: 42px; line-height: 42px">
              接口路径：{{ item.path }}
            </p>
          </div>
        </div>

        <div
          style="margin-bottom: 20px"
          v-if="
            item.headersTable.length !== 0 ||
            item.queryTable.length !== 0 ||
            item.bodyTable.length !== 0
          "
        >
          <h2>请求参数</h2>
          <div style="line-height: 30px; text-align: left">
            (1)通用参数
            <div>
              参见:<span style="color: rgb(72, 159, 221)">通用参数</span>
            </div>
          </div>
          <div style="line-height: 30px; text-align: left">(2)私有参数</div>
          <div v-if="item.headersTable.length !== 0">
            <h3
              style="
                font-weight: 400;
                margin-top: 20px;
                margin-bottom: 10px;
                font-size: 14px;
              "
            >
              Headers:
            </h3>
            <table cellpadding="0" cellspacing="0">
              <thead style="display: table-row-group">
                <tr>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    参数名称
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    参数值
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    是否必须
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    示例
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    备注
                  </th>
                </tr>
                <tr
                  v-for="(_item, _index) in item.headersTable"
                  :key="'headersTable' + _index"
                >
                  <td style="border: 1px solid #ddd; padding: 3px 10px">
                    {{ _item.name }}
                  </td>
                  <td style="border: 1px solid #ddd; padding: 3px 10px">
                    {{ _item.value }}
                  </td>
                  <td style="border: 1px solid #ddd; padding: 3px 10px">
                    <p style="width: 90px; text-align: center">
                      {{ _item.required == "1" ? "是" : "否" }}
                    </p>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 3px 10px">
                    {{ _item.example }}
                  </td>
                  <td style="border: 1px solid #ddd; padding: 3px 10px">
                    {{ _item.desc }}
                  </td>
                </tr>
              </thead>
            </table>
          </div>

          <div style="margin-top: 50px" v-if="item.queryTable.length !== 0">
            <h3
              style="
                font-weight: 400;
                margin-top: 20px;
                margin-bottom: 10px;
                font-size: 14px;
              "
            >
              Query:
            </h3>
            <table cellpadding="0" cellspacing="0">
              <thead style="display: table-row-group">
                <tr>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    名称
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    是否必须
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    示例
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    备注
                  </th>
                </tr>
                <tr
                  v-for="(_item, _index) in item.queryTable"
                  :key="'queryTable' + _index"
                >
                  <td style="border: 1px solid #ddd; padding: 3px 10px">
                    {{ _item.name }}
                  </td>
                  <td style="border: 1px solid #ddd; padding: 3px 10px">
                    <p style="width: 90px; text-align: center">
                      {{ _item.required == "1" ? "是" : "否" }}
                    </p>
                  </td>
                  <td
                    style="
                      border: 1px solid #ddd;
                      padding: 3px 10px;
                      width: 200px;
                    "
                  >
                    <p style="width: 200px; word-wrap: break-word">
                      {{ _item.example }}
                    </p>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 3px 10px">
                    <p style="width: 200px; word-wrap: break-word">
                      {{ _item.desc }}
                    </p>
                  </td>
                </tr>
              </thead>
            </table>
          </div>

          <div style="margin-top: 50px" v-if="item.bodyTable.length !== 0">
            <h3
              style="
                font-weight: 400;
                margin-top: 20px;
                margin-bottom: 10px;
                font-size: 14px;
              "
            >
              Body:
            </h3>
            <table cellpadding="0" cellspacing="0">
              <thead style="display: table-row-group">
                <tr>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    名称
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    参数类型
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    是否必须
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    示例
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    备注
                  </th>
                </tr>
                <tr
                  v-for="(_item, _index) in item.bodyTable"
                  :key="'bodyTable' + _index"
                >
                  <td style="border: 1px solid #ddd; padding: 3px 10px">
                    {{ _item.name }}
                  </td>
                  <td style="border: 1px solid #ddd; padding: 3px 10px">
                    {{ _item.type }}
                  </td>
                  <td style="border: 1px solid #ddd; padding: 3px 10px">
                    <p style="width: 90px; text-align: center">
                      {{ _item.required == "1" ? "是" : "否" }}
                    </p>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 3px 10px">
                    {{ _item.example }}
                  </td>
                  <td style="border: 1px solid #ddd; padding: 3px 10px">
                    {{ _item.desc }}
                  </td>
                </tr>
              </thead>
            </table>
          </div>

          <div style="margin-bottom: 20px" v-if="item.redateTable.length !== 0">
            <h2 style="margin-bottom: 20px">返回数据</h2>
            <table cellpadding="0" cellspacing="0">
              <thead style="display: table-row-group">
                <tr>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    名称
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    类型
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    是否必须
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    默认值
                  </th>
                  <th style="border: 1px solid #ddd; padding: 5px 10px">
                    备注
                  </th>
                </tr>
                <!-- 递归tr组件 -->
                <tr-list
                  v-if="item.redateTable"
                  :list="item.redateTable"
                  :index="0"
                />
              </thead>
            </table>
          </div>

          <div style="margin-bottom: 20px">
            <h2>备注</h2>
            <div
              v-html="item.remark"
              style="
                text-align: left;
                margin: 14px 0 8px;
                padding: 18px;
                background-color: #f5f7f8;
                border: 0;
                border-radius: 0;
                line-height: 160%;
                box-sizing: content-box;
                font-size: 1rem;
              "
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import dayJs from "dayjs";
import handleWindowPrint from "../../../assets/js/windowPrint";
import bycl from "../publicAppoint/bycl";
import bysk from "../publicAppoint/bysk";
import sim from "../publicAppoint/sim";
import point from "../publicAppoint/point";
import trList from "./tr-list.vue";

export default {
  props: {
    scrollFlag: {
      type: Boolean,
    },
  },
  components: {
    trList,
  },
  data() {
    return {
      data: null,
      List: [],
      restaurants: [],
      redateRequiredArr: [],
    };
  },
  computed: {
    ...mapState(["DocTag", "DocMenu"]),
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
          default:
            break;
        }
      },
      immediate: true,
    },
    DocMenu: {
      handler(val) {
        if (!val) return;
        this.List = [];
        this.restaurants = [];
        val.map((item, index) => {
          this.List.push({
            label: item.name,
            value: [],
          });
          if (item.children && item.children.length > 0) {
            item.children.map((item2, index2) => {
              this.List[index].value.push({
                title: item2.name,
                value: [index, index2].join("-"),
              });
            });
          }
        });
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    exportPDF() {
      this.List[this.DocTag.split("-")[0]].value.forEach((item, index) => {
        this.getData(item.value, index);
      });
    },
    async getData(tag, index) {
      const current = this.DocMenu[tag.split("-")[0]];
      const data = await this.$http.get(
        "http://47.115.157.89:8085/open/platform/doDispatch.json",
        {
          params: {
            toUrl: `http://47.115.157.89:8002/api/interface/get?token=${
              current.token
            }&id=${current.children[tag.split("-")[1]].yapiId}`,
          },
        }
      );
      const item = this.List[this.DocTag.split("-")[0]].value[index];
      const res = data.data.data;
      item.updateTime = dayJs(res && res.up_time * 1000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      item.method = res.method;
      item.path = res.path;
      item.remark = res.desc;

      item.headersTable = res.req_headers;
      item.queryTable = res.req_query;

      if (res.req_body_other) {
        const reqBodyOther = JSON.parse(res.req_body_other);
        const reqBodyArr = [];
        Object.keys(reqBodyOther.properties).forEach(key => {
          reqBodyArr.push({
            name: key,
            type: reqBodyOther.properties[key].type,
            required: reqBodyOther.required.indexOf(key) !== -1,
            desc: reqBodyOther.properties[key].description
          });
        });

        item.bodyTable = reqBodyArr;
      } else {
        item.bodyTable = res.req_body_form;
      }

      const resBody = JSON.parse(res.res_body).properties;

      item.redateTable = this.changeTree(resBody);

      this.restaurants.push(item);
      this.$emit("data-change", this.restaurants.length);
      if (this.restaurants.length > 0) {
        this.restaurants.sort((a, b) => a.value.split('-')[1] - b.value.split('-')[1]);
      }
    },

    // 转换树级结构
    changeTree(data) {
      if (!data) return;
      const arr = [];
      Object.keys(data).forEach((element) => {
        const obj = {
          name: element,
          type: data[element].type,
          remark: data[element].description ? data[element].description : null,
          default: data[element].default ? data[element].default : null,
          id: this.guid(),
        };

        this.redateRequiredArr = this.redateRequiredArr.concat(
          data[element].required
        );
        this.redateRequiredArr.forEach((item) => {
          if (item === element) {
            obj.required = true;
          }
        });

        if (data[element].type === "object") {
          obj.children = this.changeTree(data[element].properties);
        } else if (data[element].type === "array") {
          if (data[element].items.type === "object") {
            obj.type = "object[]";
            obj.children = this.changeTree(data[element].items.properties);
          } else {
            obj.children = data[element].items.properties
              ? this.changeTree(data[element].items.properties)
              : [];
          }
        }
        arr.push(obj);
      });
      return arr;
    },
    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r && 0x3) | 0x8;
        return v.toString(16);
      });
    },
    print() {
      let type = "";
      switch (this.DocTag.split("-")[0]) {
        case "0":
          type = "博云车联";
          break;
        case "1":
          type = "博云视控";
          break;
        case "2":
          type = "sim卡平台";
          break;
        case "3":
          type = "定位服务";
          break;
        default:
          break;
      }
      handleWindowPrint(".downloadPDF", type);
    },
  },
  // mounted() {
  //   setTimeout(() => {
  //     console.log(this.restaurants);
  //     handleWindowPrint(".downloadPDF", "api");
  //   }, 3000);
  // },
};
</script>
<style lang="scss" scoped>
@media print {
  @page {
    size: auto; /* auto is the initial value */
    margin: 0mm; /* this affects the margin in the printer settings */
  }
  body {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
}
.downloadPDF {
  height: 100%;
  margin: 20px auto;
  overflow-y: auto;
}
table tr {
  page-break-before: always;
  page-break-after: always;
  page-break-inside: avoid;
}
</style>
