<template>
  <div class="developDoc">
    <el-button
      :loading="loading"
      type="primary"
      @click="exportApi"
      style="position:absolute;right: 40px;top: 100px;"
      v-if="DocTag.split('-')[0] != 4"
    >文档下载</el-button>
    <div class="developDoc_box">
      <div class="developDoc_box__left">
        <div class="items title">
          <i class="el-icon-document"></i>平台文档
        </div>
        <div
          class="items title items__btn"
          @click="publicAppointfn"
          :style="{color: publicAppoint ? 'rgb(53, 149, 234)' : '',background: publicAppoint?'#dfdfdf':''}"
        >
          <i class="el-icon-document"></i>公共约定
        </div>
        <a
          v-if="DocTag && DocTag.split('-')[0] == 1"
          class="items title items__btn"
          style="text-decoration: none;color:#333"
          href="http://open.car900.com/demo/docs/byskplayer.api.html"
          target="_blank"
        >
          <i class="el-icon-document"></i>视频服务
        </a>
        <el-menu
          :default-active="active"
          active-text-color="rgb(53, 149, 234)"
          background-color="#F1F3F7"
          :unique-opened="true"
          @select="choice"
          class="developDoc_box__Menu"
        >
          <template v-for="(item,index) in DocMenuTree">
            <el-submenu
              :index="''+index"
              :key="index"
              v-if="item.children.length > 0 && DocTag && DocTag.split('-')[0] == index"
            >
              <template slot="title">
                <span>{{item.name}}</span>
              </template>
              <el-submenu :index="index+'-'+childIndex"  v-for="(childItem,childIndex) in item.children" :key="childIndex+'_child'">
                <template slot="title">{{childItem.name}}</template>
                <el-menu-item
                  :title="childItem.title"
                  :index="index+'-'+childIndex+'-'+childIndex2"
                  v-for="(childItem2,childIndex2) in childItem.children"
                  :key="childIndex2+'_child'"
                >{{childItem2.name}}</el-menu-item>
              </el-submenu>
            </el-submenu>
          </template>
          <template v-for="(item,index) in DocMenu">
            <el-menu-item
              :index="''+index"
              v-if="item.children.length == 0 && DocTag && DocTag.split('-')[0] == index"
              :key="index"
            >
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <!-- 公共约定 -->
      <div
        class="developDoc_box__right"
        v-if="publicAppoint"
      >
        <publicAppBox :scrollFlag.sync="scrollFlag"></publicAppBox>
      </div>
      <!-- AI面板 -->
      <div
        class="developDoc_box__right"
        v-else-if="DocTag.split('-')[0] == 4"
      >
        <DetectPanel />
      </div>
      <!-- 文档内容 -->
      <div
        class="developDoc_box__right"
        v-else
      >
        <div class="header">
          <h2>{{title}}</h2>
          <p>最后更新时间：{{updateTime}}</p>
        </div>

        <div class="content">
          <div class="baseMsg">
            <h2>基本信息</h2>
            <div class="baseMsg__content">
              <p>
                接口方式：
                <span :class="baseMsg.method === 'GET' ? 'get' : 'post'">{{baseMsg.method}}</span>
              </p>
              <p>接口路径：{{baseMsg.path}}</p>
            </div>
          </div>

          <div
            class="params"
            v-if="headersTable.length !== 0 || queryTable.length !== 0 || bodyTable.length !== 0"
          >
            <h2>请求参数</h2>
            <div class="params__classify">
              (1)通用参数
              <div>参见:<span @click="toPublicAppoint">通用参数</span></div>
            </div>
            <div class="params__classify">
              (2)私有参数
            </div>
            <div
              class="params__table"
              v-if="headersTable.length !== 0"
            >
              <h3>Headers:</h3>
              <el-table
                :data="headersTable"
                size="small"
                stripe
                border
              >
                <el-table-column
                  label="参数名称"
                  prop="name"
                  min-width="180"
                ></el-table-column>
                <el-table-column
                  label="参数值"
                  prop="value"
                  min-width="250"
                ></el-table-column>
                <el-table-column
                  label="是否必须"
                  width="80"
                >
                  <template slot-scope="scope">
                    <p>{{scope.row.required == '1' ? '是' : '否'}}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="示例"
                  prop="example"
                ></el-table-column>
                <el-table-column
                  label="备注"
                  prop="desc"
                ></el-table-column>
              </el-table>
            </div>
            <div
              class="params__table"
              style="margin-top:50px"
              v-if="queryTable.length !== 0"
            >
              <h3>Query:</h3>
              <el-table
                :data="queryTable"
                size="small"
                stripe
                border
              >
                <el-table-column
                  label="名称"
                  prop="name"
                ></el-table-column>
                <el-table-column
                  label="是否必须"
                  width="80"
                >
                  <template slot-scope="scope">
                    <p>{{scope.row.required == '1' ? '是' : '否'}}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="示例"
                  width="80"
                  prop="example"
                ></el-table-column>
                <el-table-column
                  label="备注"
                  prop="desc"
                ></el-table-column>
              </el-table>
            </div>
            <div
              class="params__table"
              style="margin-top:50px"
              v-if="bodyTable.length !== 0"
            >
              <h3>Body:</h3>
              <el-table
                :data="bodyTable"
                size="small"
                stripe
                border
              >
                <el-table-column
                  label="名称"
                  width="100"
                  prop="name"
                ></el-table-column>
                <el-table-column
                  label="参数类型"
                  width="80"
                  prop="type"
                ></el-table-column>
                <el-table-column
                  label="是否必须"
                  width="80"
                >
                  <template slot-scope="scope">
                    <p>{{scope.row.required == '1' ? '是' : '否'}}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="示例"
                  prop="example"
                  v-if="!bodyTableFlag"
                ></el-table-column>
                <el-table-column
                  label="默认值"
                  prop="default"
                  v-if="bodyTableFlag"
                ></el-table-column>
                <el-table-column
                  label="备注"
                  prop="desc"
                ></el-table-column>
              </el-table>
            </div>
          </div>

          <div class="returnData">
            <h2>返回数据</h2>
            <el-table
              :data="redateTable"
              size="small"
              stripe
              border
              row-key="id"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
              <el-table-column
                label="名称"
                prop="name"
                min-width="200"
              ></el-table-column>
              <el-table-column
                label="类型"
                prop="type"
                width="80"
              ></el-table-column>
              <el-table-column
                label="是否必须"
                width="80"
              >
                <template slot-scope="scope">
                  <p>{{scope.row.required?'必须':'非必须'}}</p>
                </template>
              </el-table-column>
              <el-table-column
                label="默认值"
                prop="default"
              ></el-table-column>
              <el-table-column
                label="备注"
                prop="remark"
                min-width="200"
              ></el-table-column>
            </el-table>
          </div>

          <div class="remark">
            <h2>备注</h2>
            <div
              v-html="remark"
              class="pre"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div style="display:none">
      <download
        ref="download"
        @data-change="loadPDFdata"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import dayJs from "dayjs";
import publicAppBox from "./publicAppoint/index.vue";
import download from "./downloadPDF/index.vue";
import ComparePanel from "../AIPanel/pages/Compare.vue";
import DetectPanel from "../AIPanel/pages/Detect.vue";
// @ is an alias to /src

export default {
  name: "developDoc",
  components: {
    publicAppBox,
    download,
    DetectPanel,
    // ComparePanel
  },
  data() {
    return {
      active: this.DocTag || "0-0-0",
      publicAppoint: false,
      loading: false,
      title: "",
      updateTime: "",
      baseMsg: {
        method: "GET",
        path: "",
      },
      remark: null,
      headersTable: [],
      queryTable: [],
      bodyTableFlag: false,
      bodyTable: [],
      redateTable: [],
      redateRequiredArr: [],
      scrollFlag: false,
    };
  },
  computed: {
    ...mapState(["DocTag", "DocMenuTree", "DocMenu"])
  },
  mounted() {
    console.log(this.DocMenu, "DocMenu");
    // this.active = this.DocTag || "0-0";
    console.log(this.$route.query.id, "this.$route.query.id");
    if (this.$route.query.id) {
      this.COMMIT_DocTag(this.$route.query.id || "0-0-0");
      this.active = this.$route.query.id || "0-0-0";
    } else {
      this.COMMIT_DocTag("0-999");
      this.active = "0-999";
      setTimeout(() => {
        this.publicAppointfn();
      }, 100);
    }
  },
  activated() {
    window.scrollTo(0, 0);
  },
  watch: {
    DocMenu: {
      handler(val) {
        this.active = this.DocTag || "0-999";
        const current = val[this.active.split("-")[0]];
        if (current) {
          console.log(this.active, "this.active");
          const id =
            current.children[this.active.split("-")[1]].children[this.active.split("-")[2]] &&
            current.children[this.active.split("-")[1]].children[this.active.split("-")[2]].yapiId;
          this.getData(current.token, id);
        }
      },
    },
    DocTag: {
      handler(val) {
        this.active = val;
        this.publicAppoint = false;
        const current = this.DocMenuTree[val.split("-")[0]];
        console.log(current);
        if (current) {
          const id =
            current.children[this.active.split("-")[1]].children[this.active.split("-")[2]] &&
            current.children[this.active.split("-")[1]].children[this.active.split("-")[2]].yapiId;
          this.getData(current.token, id);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapMutations(["COMMIT_DocTag"]),
    async getData(_token, _id) {
      const data = await this.$http.get(
        "http://47.115.157.89:8085/open/platform/doDispatch.json",
        {
          params: {
            toUrl: `http://47.115.157.89:8002/api/interface/get?token=${_token}&id=${_id}`,
          },
        }
      );
      const res = data.data.data;
      if (!res) return;
      this.title = res && res.title;
      this.updateTime = dayJs(res && res.up_time * 1000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.baseMsg = {
        method: res.method,
        path: res.path,
      };

      this.remark = res.desc;

      this.headersTable = res.req_headers;
      this.queryTable = res.req_query;

      this.bodyTableFlag = Boolean(res.req_body_other);
      if (res.req_body_other) {
        const reqBodyOther = JSON.parse(res.req_body_other);
        const reqBodyArr = [];
        Object.keys(reqBodyOther.properties).forEach((key) => {
          reqBodyArr.push({
            name: key,
            type: reqBodyOther.properties[key].type,
            required: reqBodyOther.required.indexOf(key) !== -1,
            desc: reqBodyOther.properties[key].description,
          });
        });

        this.bodyTable = reqBodyArr;
      } else {
        this.bodyTable = res.req_body_form;
      }

      const resBody = JSON.parse(res.res_body).properties;
      // console.log(resBody, "resBody");
      this.redateTable = this.changeTree(resBody);

      this.$nextTick(() => {
        this.expandAll();
      });
      // console.log(res);
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
    expandAll() {
      const els = document.getElementsByClassName("el-table__expand-icon"); // 获取点击的箭头元素

      for (let i = 0; i < els.length; i++) {
        els[i].click();
      }
    },
    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r && 0x3) | 0x8;
        return v.toString(16);
      });
    },
    choice(val) {
      this.COMMIT_DocTag(val);
      this.publicAppoint = false;
      this.$router.push({
        path: "/developDoc",
        query: { id: val },
      });
      this.active = val;
    },
    publicAppointfn() {
      this.$router.push({
        path: "/developDoc",
      });
      this.publicAppoint = true;
      this.active = "0-999";
    },
    toPublicAppoint() {
      this.publicAppoint = true;
      this.active = "0-999";
      this.scrollFlag = true;
    },
    exportApi() {
      this.loading = true;
      if (
        this.$refs.download.restaurants.length ===
        this.DocMenu[this.DocTag.split("-")[0]].children.length
      ) {
        this.$refs.download.print();
        this.loading = false;
      } else {
        this.$refs.download.exportPDF();
      }
    },
    loadPDFdata(length) {
      if (length === this.DocMenu[this.DocTag.split("-")[0]].children.length) {
        setTimeout(() => {
          this.$refs.download.print();
          this.loading = false;
        }, 500);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.developDoc {
  min-width: 1080px;
  width: 100%;
  display: flex;
  padding-bottom: 20px;
  font-family: PingFang SC;
  justify-content: center;
  &_box {
    min-width: 1040px;
    max-width: 100%;
    display: flex;
    padding: 0 20px;
    &__Menu {
      text-align: left;
      color: #333;
    }
    &__left {
      .items {
        width: 260px;
        height: 50px;
        line-height: 50px;
        background: #f1f3f7;
        font-size: 14px;
        color: #333;
        font-weight: 400;
        text-align: left;
        box-sizing: border-box;
        cursor: pointer;
        i {
          margin: 0 5px 0 20px;
        }
        &__btn:hover {
          background-color: #dfdfdf;
        }
      }
      .title {
        font-size: 16px;
        cursor: unset;
      }
      .items__btn {
        cursor: pointer;
        display: block;
      }
      ::v-deep .el-menu {
        width: 260px;
        border-right: none;
      }
      ::v-deep .el-submenu .el-menu-item {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &__right {
      width: 740px;
      margin-left: 20px;
      .header {
        text-align: left;
        h2 {
          margin: 15px 0 19px;
          font-size: 24px;
          color: rgba(51, 51, 51, 1);
        }
        p {
          font-size: 12px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }
      }

      .content {
        margin-top: 25px;
        &__items {
          h3 {
            font-size: 20px;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            height: 40px;
            line-height: 40px;
            text-align: left;
            border-bottom: 1px solid #fff0f0f0;
          }
          p {
            color: rgba(102, 102, 102, 1);
            font-size: 14px;
            text-align: left;
            line-height: 30px;
            margin: 25px 0 50px;
          }
        }
        .baseMsg {
          margin-bottom: 20px;
          &__content {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            text-align: left;
            p {
              height: 42px;
              line-height: 42px;
            }
            span {
              width: 40px;
              height: 20px;
              line-height: 20px;
              font-size: 12px;
              text-align: center;
              display: inline-block;
            }
            .get {
              color: #0ab98d;
              background: rgba(180, 255, 236, 1);
            }
            .post {
              color: #f0a20f;
              background: rgba(255, 229, 180, 1);
            }
          }
        }
        .remark {
          margin-bottom: 20px;
          .pre {
            text-align: left;
            margin: 14px 0 8px;
            padding: 18px;
            background-color: #f5f7f8;
            border: 0;
            border-radius: 0;
            line-height: 160%;
            box-sizing: content-box;
            font-size: 1rem;
          }
        }
        .params {
          margin-bottom: 20px;
          &__classify {
            line-height: 30px;
            text-align: left;
            div {
              text-indent: 2rem;
            }
            span {
              color: rgb(72, 159, 221);
              cursor: pointer;
            }
          }
          &__table {
            text-align: left;
            h3 {
              font-weight: 400;
              margin-top: 20px;
              margin-bottom: 10px;
              font-size: 14px;
            }
          }
        }
        .returnData {
          margin-bottom: 20px;
          h2 {
            margin-bottom: 20px;
          }
        }
        h2 {
          text-align: left;
          height: 48px;
          line-height: 48px;
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          border-bottom: 1px solid #f0f0f0;
        }
      }
    }
  }
}
::v-deep pre {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
.el-menu-item.is-active {
  background-color: #dfdfdf !important;
}
::v-deep .el-submenu__title:hover {
  background: #dfdfdf !important;
}
::v-deep .el-menu-item {
  &:hover {
    background: #dfdfdf !important;
  }
}
::v-deep .el-submenu__title {
  font-weight: bold;
}
</style>
