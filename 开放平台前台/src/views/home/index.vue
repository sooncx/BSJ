<template>
  <div class="home">
    <div class="carouselBox">
      <el-carousel height="calc(33vw)">
        <el-carousel-item
          v-for="(item,index) in carouselImgs"
          :key="index"
        >
          <div
            v-if="index === 1"
            class="myBtn"
          >
            <div @click="$router.push({
          name: 'developDoc'
        });">立即查看</div>
          </div>
          <img
            style="width:100%"
            v-lazy="item.src"
            alt=""
          >
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="products">
      <div class="products_title">产品与服务</div>
      <div class="products_imgs">
        <ul>
          <li
            v-for="(item, index) in products"
            :key="index"
            @mouseenter="enter(index,item)"
            @mouseleave="selectProduct = null"
          >
            <img
              v-lazy="selectProduct === index?item.src2:item.src"
              alt=""
            >
            <div>{{item.label}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="productsDetail">
      <div
        class="productsDetail_left"
        v-show="selectProductBg === 0"
      >
        <img
          v-lazy="imgURL[0]"
          alt=""
        >
        <span class="productsDetail_left_img">
          <img
            v-lazy="imgURL[1]"
            alt=""
          >
          <span class="cycle1"></span>
          <span class="cycle2"></span>
        </span>
        <span class="productsDetail_left_img2">
          <img
            v-lazy="imgURL[1]"
            alt=""
          >
          <span class="cycle1"></span>
          <span class="cycle2"></span>
        </span>
      </div>
      <div
        class="productsDetail_left"
        v-show="selectProductBg === 1"
      >
        <img
          v-lazy="imgURL[2]"
          alt=""
        >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 260 30"
          id="svg"
        ></svg>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 260 30"
          id="svg2"
        >
        </svg>
      </div>
      <div
        class="productsDetail_left"
        v-show="selectProductBg === 2"
      >
        <img
          v-lazy="imgURL[3]"
          alt=""
        >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 260 30"
          id="svg3"
        >
        </svg>
        <div class="svgVideo">
          <div class="svgVideo_header">
          </div>
          <div class="svgVideo_footer">
            <div class="svgVideo_footer_top"></div>
            <div class="svgVideo_footer_left"></div>
            <div class="svgVideo_footer_right"></div>
          </div>
        </div>
      </div>
      <div
        class="productsDetail_left"
        v-show="selectProductBg === 3"
      >
        <img
          v-lazy="imgURL[4]"
          alt=""
        >
        <span class="productsDetail_left_img3">
          <img
            v-lazy="imgURL[5]"
            alt=""
          >
          <span class="shadow"></span>
        </span>
      </div>
      <div
        class="productsDetail_left"
        v-show="selectProductBg === 4"
      >
        <img
          v-lazy="imgURL[6]"
          alt=""
        >
        <span class="productsDetail_left_img4">
          <img
            v-lazy="imgURL[7]"
            alt=""
          >
          <span class="cycle3"></span>
          <span class="cycle4"></span>
        </span>
      </div>
      <div class="productsDetail_right">
        <div>{{productsDetail.title}}</div>
        <ul>
          <li
            v-for="(item, index) in productsDetail.value"
            :key="index"
          ><span></span>{{item}}</li>
        </ul>
      </div>
    </div>
    <div class="solution">
      <div class="solution_bar">
        <div class="solution_bar_left">
          <ul>
            <li
              v-for="(item, index) in solutions"
              :key="index"
              :class="{solution_bar_left_enter:selectSolutions === index}"
              @mouseenter="enterSolutions(index,item)"
              @mouseleave="selectSolution = false"
            >
              {{item.label}}
            </li>
          </ul>
        </div>
        <div class="solution_bar_right">
          <span
            class="title"
            :class="{active:selectSolution}"
          >{{solutionsDetail.title}}</span>
          <div class="secondTitle">{{solutionsDetail.secondTitle}}</div>
          <ul>
            <li
              v-for="(item, index) in solutionsDetail.value"
              :key="index"
            ><span></span>{{item}}</li>
          </ul>
        </div>
      </div>
      <div class="solution_bg">
        <img
          :class="{myshow:selectSolutions === index}"
          v-show="selectSolutions === index"
          v-for="(item, index) in solutionImg"
          :key="index"
          v-lazy="item"
          alt=""
        >
        <span></span>
      </div>
    </div>
    <div class="introduce">
      <div
        id="particles"
        style="width:100%; overflow:hidden; height:100%"
      >
        <div class="introduce_show">
          <div class="introduce_show_title">技术简介</div>
          <div class="introduce_show_content">
            <div
              class="introduce_show_content_card"
              v-for="(item, index) in introduce"
              :key="index"
            >
              <img
                v-lazy="item.src"
                alt=""
              >
              <div class="data">{{item.data}}</div>
              <div>{{item.text}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="project">
      <div class="project_title">开发方案</div>
      <div class="project_content">
        <div
          class="project_content_card"
          v-for="(item, index) in projects"
          :key="index"
        >
          <div>{{item.label}}</div>
          <ul>
            <li
              :class="{active:i === selectProject && selectProjectCard === index}"
              @mouseenter="projectEnter(i,index)"
              @mouseleave="selectProject = null"
              v-for="(items, i) in item.value"
              :key="i"
              :title="items.title"
              @click="toDoc(items)"
            ><span class="project_items">{{items.title}}</span></li>
          </ul>
        </div>
      </div>
    </div>
    <!-- <div class="footer">
      <div class="footer_top">
        <div class="footer_top_title">合作伙伴</div>
        <div class="footer_top_content">
          <img
            :src="item"
            alt=""
            v-for="(item, index) in footer_top"
            :key="index"
          >
        </div>
      </div>
    </div> -->
    <Footer />
    <!-- <el-dialog
      :visible="true"
      width="400px"
      @close="clearFirst"
    >
    <h3>建议您立刻修改账户密码</h3>
    <div>修改密码</div>
    </el-dialog> -->
    <el-dialog
      :visible="(registTag && registTag=='first' && LOGINUSER)?true:false"
      width="400px"
      @close="clearFirst"
    >
      <template slot="title">
        <h3 style="text-align:left;font-weight:400">建议您立刻修改账户密码</h3>
        <div class="line"></div>
      </template>
      <div class="changePW">
        <div @click="changePW">
          修改密码
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";
import { mapState, mapMutations } from "vuex";
import Footer from "../../components/Footer/index.vue";
import imgLazy from "./lazyimg";
// @ is an alias to /src

export default {
  name: "home",
  components: {
    Footer
  },
  data() {
    return {
      imgURL: imgLazy,
      selectSolution: false,
      selectProduct: null,
      selectProductBg: 0,
      selectSolutions: 0,
      selectProject: null,
      selectProjectCard: null,
      carouselImgs: [
        { src: require("@/assets/img/home/banner.png") },
        { src: require("@/assets/img/home/banner2.png") },
        { src: require("@/assets/img/home/banner3.png") }
      ],
      products: [
        {
          label: "设备定位",
          src: require("@/assets/img/home/location.png"),
          src2: require("@/assets/img/home/location2.png"),
          title: "精准定位服务",
          content: [
            "千万级平台承载能力",
            "支持GPS、WIFI、基站融合定位",
            "平台支持API调用,定制化需求"
          ]
        },
        {
          label: "物联网",
          src: require("@/assets/img/home/IOT.png"),
          src2: require("@/assets/img/home/IOT2.png"),
          title: "高效快捷服务",
          content: [
            "高效准确的流量预警",
            "流量规则的设置",
            "可灵活调用的API接口"
          ]
        },
        {
          label: "智能视频服务",
          src: require("@/assets/img/home/videoProducT.png"),
          src2: require("@/assets/img/home/videoProducT2.png"),
          title: "高速稳定视频服务,支持千万级承载能力",
          content: [
            "支持多摄像头同时进行稳定的监控",
            "支持容纳TB级存储得轨迹数据，便捷的回放历史轨迹",
            "智能的获取车辆报警视频实时获取推送",
            "平台支持API调用,定制化需求"
          ]
        },
        {
          label: "智能监护",
          src: require("@/assets/img/home/monitor.png"),
          src2: require("@/assets/img/home/monitor2.png"),
          title: "高效精准的定位服务",
          content: [
            "微型定位器",
            "适用场景面广",
            "支持通用API接口/专属定制/联合建模等多种交付方式"
          ]
        },
        {
          label: "基站/wifi定位",
          src: require("@/assets/img/home/stationmanage.png"),
          src2: require("@/assets/img/home/stationmanage2.png"),
          title: "复杂场景定位方式",
          content: ["智能切换定位方式", "基站位置", "开放API接口"]
        }
      ],
      productsDetail: {
        title: "精准定位服务",
        value: [
          "千万级平台承载能力",
          "支持GPS、WIFI、基站融合定位",
          "平台支持API调用,定制化需求"
        ]
      },
      solutions: [
        {
          label: "金融风控",
          value: 0,
          content: [
            "博云致力于为各类汽车金融机构提供全流程风控管理解决方案。",
            "在行业数字化转型过程中，为客户量身定制数学化转型咨询方案。"
          ]
        },
        {
          label: "校车",
          value: 1,
          content: [
            "校车智能监控平台集视频监控、北斗定位、人脸识别、人体体温检测、智能IC卡识别于一体的大数据定位分析系统，实现数据的可视化呈现与监控，提高车辆运行的安全性和管理水平"
          ]
        },
        {
          label: "货车",
          value: 2,
          content: [
            "博云视频监控管理平台主要实现集中监控、实时视频、录像存储、录像管理历史轨迹查询、音频输入输出、语音对讲广播功能、报警功能、检索回放、数据转发、定位、云台控制、抓拍、轮询等相关功能。"
          ]
        },
        {
          label: "智能监护",
          value: 3,
          content: [
            "为各个行业提供智能定位，集个人使用的GPS跟踪定位仪，车辆、规则货物、宠物的定位监控。使用基于阿里云平台进行数据分析，实现数据可视化呈现与设备轨迹回放，提高用户的监控效率和管理水平。"
          ]
        },
        {
          label: "物联网",
          value: 4,
          content: [
            "高速的物联网服务平台，致力于打造符合用户需求的物联网产品，实现万物互联。"
          ]
        }
      ],
      solutionImg: [
        require("@/assets/img/home/solutionImg1.png"),
        require("@/assets/img/home/solutionImg3.png"),
        require("@/assets/img/home/solutionImg5.png"),
        require("@/assets/img/home/solutionImg4.png"),
        require("@/assets/img/home/solutionImg2.png")
      ],
      solutionsDetail: {
        title: "金融风控",
        secondTitle: "简介",
        value: [
          "博云致力于为各类汽车金融机构提供全流程风控管理解决方案。",
          "在行业数字化转型过程中，为客户量身定制数学化转型咨询方案。"
        ]
      },
      introduce: [
        {
          src: require("../../assets/img/home/introduce1.png"),
          data: "500万",
          text: "数据处理"
        },
        {
          src: require("../../assets/img/home/introduce2.png"),
          data: "3000万",
          text: "响应次数"
        },
        {
          src: require("../../assets/img/home/introduce3.png"),
          data: "650",
          text: "支持拓展协议"
        }
      ],
      projects: [],
      footer_top: [
        require("@/assets/img/home/alilogo.png"),
        require("@/assets/img/home/alilogo.png"),
        require("@/assets/img/home/alilogo.png"),
        require("@/assets/img/home/alilogo.png"),
        require("@/assets/img/home/alilogo.png"),
        require("@/assets/img/home/alilogo.png"),
        require("@/assets/img/home/alilogo.png"),
        require("@/assets/img/home/alilogo.png"),
        require("@/assets/img/home/alilogo.png"),
        require("@/assets/img/home/alilogo.png"),
        require("@/assets/img/home/alilogo.png"),
        require("@/assets/img/home/alilogo.png")
      ]
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawSvg();
      this.showHide();
    });
  },
  computed: {
    ...mapState(["DocMenu", "LOGINUSER", "registTag", "DocMenuTree"])
  },
  watch: {
    $route: {
      async handler(to) {
        if (to.name === "home") {
          this.draw();

          this.projects = [];
          if (this.DocMenuTree) {
            this.DocMenuTree.map((item, index) => {
              this.projects.push({
                label: item.name,
                value: []
              });
              if (item.children && item.children.length > 0) {
                item.children.map((item2, index2) => {
                  if (item2.children && item2.children.length > 0) {
                    item2.children.map((item3, index3) => {
                      if (this.projects[index].value.length <= 4) {
                        this.projects[index].value.push({
                          title: item3.name,
                          value: [index, index2, index3].join("-")
                        });
                      }
                    });
                  }
                });
              }
            });
          }
          this.projects.push({
            label: "其他服务",
            value: [{ title: "敬请期待" }]
          });
        } else {
          console.log("other");
          window.closeCanvas();
        }
      },
      immediate: true,
      deep: true
    },
    DocMenuTree: {
      handler(val) {
        if (!val) return;
        this.projects = [];
        val.map((item, index) => {
          this.projects.push({
            label: item.name,
            value: []
          });
          if (item.children && item.children.length > 0) {
            item.children.map((item2, index2) => {
              if (item2.children && item2.children.length > 0) {
                item2.children.map((item3, index3) => {
                  if (this.projects[index].value.length <= 4) {
                    this.projects[index].value.push({
                      title: item3.name,
                      value: [index, index2, index3].join("-")
                    });
                  }
                });
              }
            });
          }
        });
        this.projects.push({
          label: "其他服务",
          value: [{ title: "敬请期待" }]
        });
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(["COMMIT_DocTag", "COMMIT_registTag"]),
    async changePW() {
      await this.COMMIT_registTag('twice');
      setTimeout(() => {
        const routeData = this.$router.resolve({ name: "userCenter" });
        window.open(routeData.href, "_blank");
      }, 200);
    },
    clearFirst() {
      this.COMMIT_registTag('twice');
    },
    toDoc(item) {
      if (!item || item.title === "敬请期待") return;
      this.COMMIT_DocTag(item.value);
      this.$router.push({
        name: "developDoc",
        query: {
          id: item.value
        }
      });
    },
    showHide() {
      $.each($("circle"), (i, el) => {
        $(el).css({
          opacity: 0
        });
        setTimeout(() => {
          $(el).animate(
            {
              opacity: 1.0
            },
            850
          );
        }, 50 + i * 35);
      });
      $.each($("circle"), (i, el) => {
        setTimeout(() => {
          $(el).animate(
            {
              opacity: 0
            },
            850
          );
        }, 50 + i * 35);
      });
      setTimeout(() => {
        this.showHide();
      }, 4000);
    },
    drawSvg() {
      const a = [];
      for (let i = 0; i < 22; i++) {
        a.push(100 + i * 4);
      }
      a[0] = 101;
      const b = [
        -20,
        -25,
        -29.6,
        -33.6,
        -37,
        -39.6,
        -42,
        -44,
        -45.6,
        -46.8,
        -47.6,
        -48,
        -48.2,
        -48.1,
        -47.9,
        -47.2,
        -46,
        -44.4,
        -42.6,
        -40.3,
        -38,
        -34.2
        // -50.1,
        // -50.2,
        // -50.2,
        // -50.1,
        // -49.7,
        // -49.3,
        // -48.4,
        // -47.8,
        // -46.8,
        // -45.6,
        // -44,
        // -42.6,
        // -40.8,
        // -38.8,
        // -36.8
      ];
      const c = [
        [99, 44],
        [99.8, 40],
        [101.2, 36],
        [102.8, 32],
        [104.4, 28],
        [106.2, 24],
        [107.8, 20],
        [109.6, 16],
        [111.6, 12],
        [113.4, 8],
        [115.6, 4],
        [117.8, 0],
        [120.4, -4],
        [123.4, -8],
        [126, -12],
        [129.4, -16],
        [132.6, -19],
        [136.4, -22.4],
        [141.4, -25.5],
        [146.6, -28.6],
        [152.6, -31],
        [157, -32.4],
        [162, -33.2],
        [168, -34],
        [174, -34.2],
        [180, -34.4],
        [184, -34.2]
        // [200, -40],
        // [206, -38],
        // [210, -36]
      ];
      const d = [
        [130, 23],
        [134, 21],
        [138, 19.4],
        [142, 18],
        [146, 16.8],
        [150, 16],
        [154, 15.4],
        [158, 15.4],
        [162, 15.6],
        [166, 16.4],
        [170, 17.6],
        [174, 19.4],
        [178, 21.6],
        [182, 24.4],
        [186, 28.6],
        [189, 32.4],
        [191, 36],
        [193, 40],
        [195, 45],
        [197, 50],
        [199, 56]
      ];
      // console.log(a, b);
      const dom = document.getElementById("svg");
      const dom2 = document.getElementById("svg2");
      const dom3 = document.getElementById("svg3");
      for (let i = 0; i < 22; i++) {
        const cdom = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        cdom.setAttribute("fill", "#0856EA");
        cdom.setAttribute("cx", a[i]);
        cdom.setAttribute("cy", b[i]);
        cdom.setAttribute("r", 1);
        dom.appendChild(cdom);
      }
      for (let i = 0; i < 27; i++) {
        const cdom2 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        cdom2.setAttribute("fill", "#0856EA");
        cdom2.setAttribute("cx", c[i][0]);
        cdom2.setAttribute("cy", c[i][1]);
        cdom2.setAttribute("r", 1);
        dom2.appendChild(cdom2);
      }
      for (let i = 0; i < 21; i++) {
        const cdom3 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        cdom3.setAttribute("fill", "#0856EA");
        cdom3.setAttribute("cx", d[i][0]);
        cdom3.setAttribute("cy", d[i][1]);
        cdom3.setAttribute("r", 1);
        dom3.appendChild(cdom3);
      }
    },
    draw() {
      this.$nextTick(() => {
        const container = document.getElementById("banner-canvas");
        if (container) {
          document.getElementById("particles").removeChild(container);
        }
        setTimeout(() => {
          window.drawCanvas();
          console.log("drawCanvas");
        }, 400);
      });
    },
    enter(index, item) {
      this.selectProduct = index;
      this.selectProductBg = index;
      this.productsDetail.title = item.title;
      this.productsDetail.value = item.content;
    },
    enterSolutions(index, item) {
      this.selectSolutions = index;
      this.selectSolution = true;
      this.solutionsDetail.title = item.label;
      this.solutionsDetail.value = item.content;
    },
    projectEnter(i, index) {
      this.selectProject = i;
      this.selectProjectCard = index;
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  .carouselBox {
    width: 100%;
    min-width: 1080px;
    box-sizing: border-box;
  }
  .products {
    width: 100%;
    min-width: 1080px;
    height: 300px;
    background: #fff;
    &_title {
      padding: 50px 0;
      color: #333333;
      font-size: 24px;
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
    &_imgs {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      padding: 0 100px;
      ul {
        display: flex;
        li {
          cursor: pointer;
          padding: 0 50px;
          img {
            width: 100px;
          }
        }
      }
    }
  }
  @keyframes toTop {
    0% {
      opacity: 0;
      margin-top: 100px;
    }
    100% {
      opacity: 1;
      margin-top: 0;
    }
  }
  .productsDetail {
    width: 100%;
    min-width: 1080px;
    height: 520px;
    background: #eef3ff;
    display: flex;
    justify-content: center;
    align-items: center;
    &_left {
      width: 590px;
      height: 374px;
      position: relative;
      overflow: hidden;
      animation: toTop 0.5s;
      #svg,
      #svg2,
      #svg3 {
        position: absolute;
        top: 0;
        left: 0;
      }
      #svg3 {
        left: -36px;
      }
      .svgVideo {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 180px;
        left: 394px;
        &_header {
          width: 50px;
          height: 50px;
          top: -10px;
          border: 2px solid blue;
          border-radius: 50%;
          position: relative;
          animation: svgheaderShow 4s linear infinite;
          &::after {
            content: "";
            position: absolute;
            border-left: 22px solid blue;
            border-top: 13px solid transparent;
            border-bottom: 13px solid transparent;
            width: 0px;
            height: 0px;
            top: 12px;
            left: 18px;
          }
        }
        &_footer {
          width: 60px;
          height: 140px;
          position: relative;
          bottom: 80px;
          left: 10px;
          &_top {
            position: absolute;
            // bottom: 55px;
            left: -7px;
            width: 55px;
            height: 30px;
            background: #95b4e5;
            opacity: 0.1;
            animation: grow0 4s linear infinite;
            // animation: grow1 1s linear infinite;
            transform: perspective(100px) rotateX(-40deg);
          }
          &_left {
            position: absolute;
            bottom: 2px;
            left: 0;
            width: 35px;
            height: 60px;
            background: #4d78d4;
            opacity: 0.4;
            animation: grow1 4s linear infinite;
            transform: perspective(100px) rotateX(-40deg) rotateY(-10deg)
              rotateZ(-3deg);
          }
          &_right {
            position: absolute;
            width: 15px;
            // height: 60px;
            background: #819eee;
            opacity: 0.3;
            bottom: 5px;
            right: 13px;
            animation: grow1 4s linear infinite;
            transform: perspective(100px) rotateX(-50deg) rotateY(60deg)
              rotateZ(9deg);
          }
        }
        @keyframes grow0 {
          0% {
            bottom: -15px;
            opacity: 0;
          }
          60% {
            bottom: -15px;
            opacity: 0;
          }
          70% {
            bottom: 55px;
            opacity: 0.1;
          }
          100% {
            bottom: 55px;
            opacity: 0.1;
          }
        }
        @keyframes grow1 {
          0% {
            height: 0;
          }
          60% {
            height: 0;
          }
          70% {
            height: 60px;
          }
          100% {
            height: 60px;
          }
        }
        @keyframes svgheaderShow {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0;
          }
          70% {
            opacity: 0;
          }
          80% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            opacity: 1;
          }
        }
      }
      img {
        height: 100%;
        width: 100%;
      }
      &_img,
      &_img2 {
        position: relative;
        left: -360px;
        top: 25px;
        img {
          position: absolute;
          top: -235px;
          left: -45px;
          width: 20px;
          height: 40px;
          animation: upDown 1.5s linear infinite;
        }
        .cycle1 {
          position: absolute;
          width: 20px;
          height: 10px;
          left: -46px;
          top: -198px;
          border-radius: 50%;
          border: 1px solid #2961f7;
          animation: scal 1.5s linear infinite;
        }
        .cycle2 {
          position: absolute;
          width: 30px;
          height: 15px;
          left: -51px;
          top: -200px;
          border-radius: 50%;
          border: 1px solid #2961f7;
          animation: scal 1.5s linear infinite;
        }
      }
      &_img2 {
        img {
          top: -220px;
          left: 227px;
          width: 15px;
          height: 30px;
          animation: upDown2 1.2s linear infinite;
        }
        .cycle1 {
          top: -192px;
          left: 225px;
          width: 16px;
          height: 8px;
        }
        .cycle2 {
          width: 24px;
          height: 12px;
          top: -194px;
          left: 221px;
        }
      }
      &_img3 {
        position: relative;
        left: -350px;
        top: 20px;
        img {
          position: absolute;
          width: 20px;
          height: 25px;
          margin-top: -13px;
          animation: move 3.5s linear infinite;
        }
        .shadow {
          position: absolute;
          width: 35px;
          height: 20px;
          border-radius: 50%;
          margin-left: -8px;
          background: radial-gradient(
            rgba(0, 0, 255, 0.746),
            rgba(0, 0, 255, 0)
          );
          animation: scal2 1s linear infinite, move 3.5s linear infinite;
          // animation: move 2.5s linear infinite;
        }
      }
      &_img4 {
        position: relative;
        left: -320px;
        top: 10px;
        img {
          position: absolute;
          width: 50px;
          height: 60px;
          margin-top: -13px;
          top: -165px;
          left: -10px;
        }
        .cycle3 {
          position: absolute;
          width: 20px;
          height: 20px;
          top: -173px;
          left: 4px;
          border-radius: 50%;
          border: 1px solid #2961f7;
          animation: scal 1.5s linear infinite;
        }
        .cycle4 {
          position: absolute;
          width: 30px;
          height: 30px;
          top: -178px;
          left: -1px;
          border-radius: 50%;
          border: 1px solid #2961f7;
          animation: scal 1.5s linear infinite;
        }
      }
    }
    &_right {
      width: 450px;
      height: 374px;
      margin: 100px 0 0 50px;
      // background: red;
      div {
        color: #0856ea;
        font-size: 24px;
        margin-bottom: 20px;
        text-align: left;
      }
      ul {
        li {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #4be6c7;
            display: inline-block;
            margin-right: 15px;
          }
          padding: 10px 0;
        }
      }
    }
  }
  .solution {
    width: 100%;
    min-width: 1080px;
    height: 480px;
    background: #0a2e76;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &_bar {
      width: 50%;
      display: flex;
      height: 100%;
      justify-content: flex-end;
      &_left {
        white-space: nowrap;
        display: inline-block;
        height: 320px;
        width: 100px;
        border-right: 1px solid #3c61ad;
        margin-top: 50px;
        color: #3c61ad;
        &_enter {
          color: #fff;
          border-right: 1px solid #fff;
          transition: all 0.5s;
        }
        ul {
          margin-right: -1px !important;
          li {
            padding: 0 25px;
            margin: 40px 0;
            cursor: pointer;
          }
        }
      }
      &_right {
        white-space: nowrap;
        display: inline-block;
        height: 320px;
        width: 300px;
        margin-top: 90px;
        color: #fff;
        text-align: left;
        padding-left: 70px;
        .title {
          color: #fff;
          font-size: 24px;
          margin-bottom: 50px;
          position: relative;
          display: inline-block;
          &::after {
            position: absolute;
            content: "";
            width: 25px;
            height: 2px;
            bottom: -10px;
            background: #679bff;
            left: 0;
            transition: all 0.3s;
          }
        }
        .active {
          &::after {
            width: 100% !important;
            transition: all 0.3s;
          }
        }
        .secondTitle {
          color: #508cff;
          font-size: 20px;
          margin-bottom: 20px;
        }
        ul {
          li {
            padding: 10px 0;
            white-space: normal;
            line-height: 20px;
            span {
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: #4be6c7;
              display: inline-block;
              margin-right: 15px;
            }
          }
        }
      }
    }
    &_bg {
      width: 50%;
      height: 100%;
      overflow: hidden;
      display: flex;
      img {
        height: 100%;
      }
    }
  }
}
.introduce {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-width: 1080px;
  height: 400px;
  &_show {
    position: absolute;
    width: 100%;
    height: 100%;
    &_title {
      font-size: 24px;
      padding: 40px;
    }
    &_content {
      margin-top: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      &_card {
        padding: 0 80px;
        img {
          width: 35px;
          margin-bottom: 15px;
        }
        div {
          padding: 5px 0;
        }
        .data {
          color: #0856ea;
          font-size: 24px;
        }
      }
    }
  }
}
.project {
  width: 100%;
  min-width: 1080px;
  background: #f3f5f8;
  height: 500px;
  &_title {
    padding: 60px;
    font-size: 24px;
  }
  &_items {
    position: relative;
    &::after {
      content: "";
      transition: all 0.3s;
      position: absolute;
      width: 0;
      height: 3px;
      bottom: -10px;
      background: #679bff;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  &_content {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin-left: calc(10% + 5px);
    // background: lemonchiffon;
    &_card {
      cursor: pointer;
      border-radius: 2px;
      box-shadow: 0 1px 20px 0 rgba(97, 97, 97, 0.24);
      display: inline-block;
      height: 300px;
      width: 220px;
      background: #f4f9ff;
      // margin: 0 50px;
      color: rgb(122, 122, 122);
      div {
        font-size: 18px;
        padding: 20px;
      }
      &:hover {
        background: #fff;
        opacity: 0.9;
        transition: all 0.5s;
      }
      ul {
        li {
          padding: 10px;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .active {
          .project_items::after {
            width: 100%;
          }
        }
      }
    }
  }
}
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
.myshow {
  opacity: 1;
  transition: all 1s;
  animation: imgShow 1s;
}
@keyframes imgShow {
  0% {
    transition: all 0.5s;
    opacity: 0;
  }
  100% {
    transition: all 0.5s;
    opacity: 1;
  }
}
.myBtn {
  position: absolute;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  & > div {
    width: 120px;
    height: 32px;
    background: #01c8f1;
    color: #fff;
    text-align: center;
    line-height: 32px;
    position: relative;
    border-radius: 20px;
    bottom: 50px;
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  }
}
.changePW {
  width: 100%;
  display: flex;
  justify-content: center;
  div {
    width: 150px;
    height: 30px;
    background: #0856ea;
    color: #fff;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
}
@media screen and (max-width: 1480px) {
  .project_content {
    width: 90%;
    margin-left: calc(5% + 5px);
  }
  .project_content_card {
    width: 200px !important;
  }
}
@media screen and (max-width: 1160px) {
  .project_content_card {
    width: 180px !important;
  }
}
</style>
