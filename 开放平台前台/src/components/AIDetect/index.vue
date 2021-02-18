<template>
  <div class="DetectBox">
    <div class="DetectBox_experience">
      <div class="imgBox">
        <div class="left">
          <div
            class="showImg"
            v-loading="loading"
          >
            <div>
              <img
                referrer="no-referrer|origin|unsafe-url"
                id="nowShowImg"
                :src="nowImg && nowImg.src"
                alt=""
              >
              <canvas
                id="mycanvas"
                :width="canvasW"
                :height="canvasH"
              ></canvas>
              <canvas
                id="mycanvas2"
                :width="canvasW"
                :height="canvasH"
              ></canvas>
            </div>
          </div>
          <div class="imgBar">
            <div
              class="leftBtn"
              @click="changeImg('prev')"
            >
              <i class="el-icon-arrow-left" />
            </div>
            <div class="content">
              <div class="box">
                <div
                  class="imgItem"
                  v-for="(item, index) in imgs"
                  :key="index"
                  @click="setNowImg(item, index)"
                  :class="nowImg && nowImg.src == item.src?'selectImg':''"
                >
                  <img
                    referrer="no-referrer|origin|unsafe-url"
                    :src="item.src"
                    alt=""
                  >
                </div>
              </div>
            </div>
            <div
              class="rightBtn"
              @click="changeImg('next')"
            >
              <i class="el-icon-arrow-right" />
            </div>
          </div>
          <div class="footer">
            <!-- <el-upload
              v-show="false"
              action=""
              class="upload-demo"
              :show-file-list="false"
              :before-upload="upload"
            >
              <el-button
                size="small"
              >本地上传</el-button>
            </el-upload> -->
            <input
              v-show="false"
              type="file"
              name="avatar"
              @change="changeImage($event)"
              ref="avatarInput"
            >
            <!-- trigger="manual" -->
            <el-popover
              ref="popover"
              placement="top"
              title="点击验证码刷新"
              width="200"
              trigger="manual"
              v-model="popoverVisible"
            >
              <VerifyPOP
                @verifyRes="verifyRes"
                v-if="popoverVisible"
              />
              <el-button
                slot="reference"
                size="small"
                type="primary"
                plain
                @click="popoverVisible = true"
              >本地上传</el-button>
            </el-popover>
            <div class="inputUrl">
              <el-input
                placeholder="图片url"
                v-model="url"
                size="small"
              >
                <template #append>
                  <el-popover
                    ref="popover2"
                    placement="top"
                    title="点击验证码刷新"
                    width="200"
                    trigger="manual"
                    v-model="popoverVisible2"
                  >
                    <VerifyPOP
                      @verifyRes="verifyRes"
                      v-if="popoverVisible2"
                    />
                    <el-button
                      slot="reference"
                      @click="urlCheck"
                    >检测</el-button>
                  </el-popover>
                </template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="nav">
            <div
              @click="navTag = 1"
              :class="navTag == 1?'onSelect':''"
            >分析结果</div>
            <div
              @click="navTag = 2"
              :class="navTag == 2?'onSelect':''"
            >Response JSON</div>
          </div>
          <div class="content">
            <div
              v-if="navTag == 1"
              class="resultBox"
            >
              <div class="header">
                <div
                  class="imgBar2"
                  v-show="cutImgs.length > 0"
                >
                  <div
                    class="imgBar2_leftBtn"
                    @click="changeResImg('prev')"
                  ><i class="el-icon-arrow-left" /></div>
                  <div class="imgBar2_content">
                    <div class="box2">
                      <div
                        class="imgItem"
                        v-for="(item, index) in cutImgs"
                        :key="index"
                        @click="setNowResImg(item, index)"
                        :class="nowResImg && nowResImg.src == item.src?'selectImg':''"
                      >
                        <img
                          referrer="no-referrer|origin|unsafe-url"
                          :src="item.src"
                          alt=""
                        >
                      </div>
                    </div>
                  </div>
                  <div
                    class="imgBar2_rightBtn"
                    @click="changeResImg('next')"
                  ><i class="el-icon-arrow-right" /></div>
                </div>
              </div>
              <div class="content">
                <div
                  v-show="nowResIndex == 0"
                  class="restxt"
                >
                  <div v-if="cutImgs.length > 0">
                    <span>已检测到图中{{cutImgs.length - 1}}张人脸，</span>
                    并生成对应face_token，点击人脸图片查看结果信息。您可将以上信息传给其他API进行后续处理和分析。推荐使用人脸属性和人脸关键点API。
                  </div>
                  <div v-else>
                    暂无数据!
                  </div>
                </div>
                <div
                  v-show="nowResIndex != 0"
                  class="resDetail"
                >
                  <div class="cubeItem">
                    <div class="cubeLabel">头部姿态</div>
                    <div class="cube">
                      <canvas
                        id="cubecanvas"
                        width="327px"
                        height="302px"
                      ></canvas>
                    </div>
                  </div>
                  <div
                    v-show="nowResIndex != 0"
                    class="restxt"
                  >
                    <div>
                      <span>已检测到图中{{cutImgs.length - 1}}张人脸，</span>
                      并生成对应face_token，点击人脸图片查看结果信息。您可将以上信息传给其他API进行后续处理和分析。推荐使用人脸属性和人脸关键点API。
                    </div>
                  </div>
                  <!-- css3绘制立方体 -->
                  <!-- <div class="resItem">
                    <div class="resLabel">年龄</div>
                    <div class="resValue">18</div>
                  </div>
                  <div class="resItem">
                    <div class="resLabel">性别</div>
                    <div class="resValue">女性</div>
                  </div>
                  <div class="resItem">
                    <div class="resLabel">微笑程度</div>
                    <div class="resValue">值：100；阈值：50</div>
                  </div>
                  <div class="percentBar">
                    <el-progress :percentage="100"></el-progress>
                  </div> -->
                  <!-- <div class="resItem">
                    <div class="resLabel">头部姿态</div>
                    <div class="resValue2">
                      <div class="rectangle">
                        <div class="side side1">1</div>
                        <div class="side side2">2</div>
                        <div class="side side3">3</div>
                        <div class="side side4">4</div>
                        <div class="side side5">5</div>
                        <div class="side side6">6</div>
                      </div>
                    </div>
                  </div> -->
                  <!-- <div class="resItem">
                    <div class="resLabel">左眼状态</div>
                    <div class="resValue">睁眼，未戴眼镜</div>
                  </div>
                  <div class="resItem">
                    <div class="resLabel">右眼状态</div>
                    <div class="resValue">睁眼，未戴眼镜</div>
                  </div> -->
                </div>
              </div>
            </div>
            <div
              v-else
              class="JSONBox"
            >
              <pre id="jsonShow"></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Identify from "../Identify/index.vue";
import VerifyPOP from "../Verify/index.vue";

export default {
  components: {
    // Identify,
    VerifyPOP,
  },
  props: {
    cycleNum: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      popoverVisible: false,
      popoverVisible2: false,
      loading: false,
      canvasW: "300px",
      canvasH: "300px",
      context: null,
      context2: null,
      cubecanvas: null,
      cubecontext: null,
      canvas: null,
      canvas2: null,
      navTag: 1,
      url: "",
      nowImg: null,
      nowResImg: null,
      nowResIndex: 0,
      testJson: "",
      cutImgs: [],
      aiData: null,
      imgs: [
        {
          src: require("@/assets/img/AIPanel/1.png"),
        },
        {
          src: require("@/assets/img/AIPanel/2.png"),
        },
        {
          src: require("@/assets/img/AIPanel/3.png"),
        },
        {
          src: require("@/assets/img/AIPanel/4.png"),
        },
        {
          src: require("@/assets/img/AIPanel/5.png"),
        },
      ],
    };
  },
  mounted() {
    const img = this.imgs[0];
    this.nowImg = img;
    this.$nextTick(() => {
      this.clear();
      this.setNowImg(this.imgs[0], 0);
    });
    document.addEventListener("click", (e) => {
      if (this.$refs.popover && !this.$refs.popover.$el.contains(e.target)) {
        this.popoverVisible = false;
      }
      if (this.$refs.popover2 && !this.$refs.popover2.$el.contains(e.target)) {
        this.popoverVisible2 = false;
      }
    });
  },
  watch: {
    navTag: {
      handler(val) {
        if (val == 2) {
          this.$nextTick(() => {
            const dom = document.getElementById("jsonShow");
            dom.innerHTML = this.jsonShowFn(this.testJson);
          });
        }
      },
    },
  },
  methods: {
    verifyRes(res) {
      if (res) {
        if (this.popoverVisible) {
          this.popoverVisible = false;
          setTimeout(() => {
            this.$refs.avatarInput.dispatchEvent(new MouseEvent("click"));
          }, 100);
        } else if (this.popoverVisible2) {
          this.popoverVisible2 = false;
          setTimeout(() => {
            this.check();
          }, 100);
        }
      }
    },
    clear() {
      this.nowResIndex = 0;
      this.navTag = 1;
      this.cutImgs = [];
      const dom = document.getElementsByClassName("box")[0];
      const dom2 = document.getElementsByClassName("box2")[0];
      dom.style.left = 0;
      dom2.style.left = 0;
    },
    // 把现在的图片连接传进来，返回一个不受限制的路径
    urlReplace(url) {
      return url.replace(
        /^(http)[s]*(\:\/\/)/,
        "https://images.weserv.nl/?url="
      );
    },
    // 轮播图1
    changeImg(type) {
      const dom = document.getElementsByClassName("box")[0];
      const num = parseFloat(dom.style.left.split("px")[0] || 0);
      const MaxL = this.imgs.length;
      if (MaxL <= this.cycleNum) return;
      if (type == "next") {
        if (num - 75 >= -(MaxL - this.cycleNum) * 75) {
          dom.style.left = num - 75 + "px";
        }
      } else if (num + 66 <= 0) {
        dom.style.left = num + 75 + "px";
      }
    },
    // 轮播图2
    changeResImg(type) {
      const dom = document.getElementsByClassName("box2")[0];
      const num = parseFloat(dom.style.left.split("px")[0] || 0);
      const MaxL = this.cutImgs.length;
      if (MaxL <= 5) return;
      if (type == "next") {
        if (num - 75 >= -(MaxL - 5) * 75) {
          dom.style.left = num - 75 + "px";
        }
      } else if (num + 66 <= 0) {
        dom.style.left = num + 75 + "px";
      }
    },
    // 判断数据是否是json格式
    isjson(obj) {
      const isjson =
        typeof obj == "object" &&
        Object.prototype.toString.call(obj).toLowerCase() ==
          "[object object]" &&
        !obj.length;
      return isjson;
    },
    // 将图片url转为file格式
    getCodeFromImg(nowImg) {
      return new Promise((resolve, reject) => {
        const imga = new Image();
        imga.src = nowImg.src;
        imga.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = imga.width;
          canvas.height = imga.height;
          const context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(imga, 0, 0, imga.width, imga.height);
          const ext = imga.src
            .substring(imga.src.lastIndexOf(".") + 1)
            .toLowerCase();
          const dataURL = canvas.toDataURL("image/" + ext);
          const arr = dataURL.split(",");
          const mime = arr[0].match(/:(.*?);/)[1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          resolve(new File([u8arr], "mid_shot.jpg", { type: mime }));
        };
        imga.onerror = function () {
          reject("error，图片文件转file失败");
        };
      });
    },
    // 选择轮播图预存图片
    async setNowImg(item, index) {
      this.clear();
      if (this.cubecontext) {
        this.cubecontext.clearRect(
          0,
          0,
          this.cubecanvas.width,
          this.cubecanvas.height
        );
      }
      if (this.context) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      if (this.context2) {
        this.context2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
      }
      const myimage = document.getElementById("nowShowImg");
      myimage.style.width = "auto";
      myimage.style.height = "auto";
      this.nowImg = item;
      const file = await this.getCodeFromImg(this.nowImg);
      const formdata = new FormData();
      formdata.append("file", file);
      await this.getAiJson(formdata, file);
    },
    // 选择裁剪人脸图片
    setNowResImg(item, index) {
      this.nowResImg = item;
      this.nowImg = item;
      this.nowResIndex = index;
      const myimage = document.getElementById("nowShowImg");
      const rw = myimage.naturalWidth; // 真实图片宽度
      const rh = myimage.naturalHeight; // 真实图片高度
      const nw = myimage.clientWidth; // 当前图片宽度
      const nh = myimage.clientHeight; // 当前图片高度
      myimage.style.width = "auto";
      myimage.style.height = "auto";
      let n = 2; // 缩放倍数
      n =
        Math.min(this.canvasW.split("px")[0], this.canvasH.split("px")[0]) /
        Math.max(item.nw, item.nh);
      if (n >= 4) {
        const m = n / 1.5;
        n = m;
      }
      const that = this;
      const { Hscale, landmark, Wscale, startX, startY } = item;
      if (this.context) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      if (this.context2) {
        this.context2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
      }
      // 设置截图的显示宽高
      if (item.nh && item.nw) {
        myimage.style.width = item.nw * n + "px";
        myimage.style.height = item.nh * n + "px";
      }
      if (index == 0) {
        that.drawRack(Wscale, Hscale, that);
      }
      const centerX = this.canvasW.split("px")[0] / 2; // canvas面板中心x坐标
      const centerY = this.canvasH.split("px")[0] / 2; // canvas面板中心y坐标
      // 绘制人脸关键点
      if (item.landmark) {
        // 绘制步骤 缩放1 -> 偏移1 -> 缩放2
        // 1:因为画布大小等于显示的上传图（不是截取的图片）大小，所以做了缩放1，将原始图片对应的关键点坐标缩放为显示图片的关键点坐标，与人脸框同理
        // 2:截图全部居中显示，所以关键点也要对应移动到中间,做偏移1处理，X,Y分别是横纵坐标的偏移
        // 3:截取的人脸图片可能太小，为了显示效果，缩放一定倍数（n）, 注意缩放的倍不能大于显示全图（即当前画布大小），防止超出画布，缩放2与缩放1不同，需要注意
        // 缩放1是画布和图片一起缩放，所有关键的坐标乘缩放倍数即可（坐标系跟着变），但是缩放2画布大小不变，只缩放图片，所以是以截图中心点为固定位置，整张图片向四周扩散（坐标系没变）所有不是乘缩放倍数
        const X = parseFloat(
          ((this.canvasW.split("px")[0] - item.nw) / 2 - startX).toFixed(5)
        );
        const Y = parseFloat(
          ((this.canvasH.split("px")[0] - item.nh) / 2 - startY).toFixed(5)
        );
        landmark.map((items, i) => {
          if (!items) return;
          that.context.strokeStyle = "red";
          that.context.lineWidth = 1;
          that.context.beginPath();
          that.context.arc(
            (parseFloat((landmark[2 * i] / Wscale + X).toFixed(5)) - centerX) *
              n +
              centerX,
            (parseFloat((landmark[2 * i + 1] / Hscale + Y).toFixed(5)) -
              centerY) *
              n +
              centerY,
            2,
            0,
            Math.PI * 2,
            true
          );
          that.context.fill();
          that.context.stroke();
        });
      }
      if (item.apexs) {
        this.setCube(item.apexs);
      }
    },
    // 绘制人脸方向立方体
    setCube(data) {
      this.cubecanvas = document.getElementById("cubecanvas");
      this.cubecontext = this.cubecanvas.getContext("2d");
      this.cubecontext.strokeStyle = "#999";
      this.cubecontext.fillStyle = "rgba(101, 101, 101, 0.01)";
      this.cubecontext.lineWidth = 1;
      this.cubecontext.clearRect(
        0,
        0,
        this.cubecanvas.width,
        this.cubecanvas.height
      );
      const arr = [
        [8, 9, 10, 11, 12, 13, 14, 15], // 后
        [0, 1, 2, 3, 10, 11, 8, 9], // 上
        [4, 5, 6, 7, 14, 15, 12, 13], // 下
        [0, 1, 6, 7, 14, 15, 8, 9], // 左
        [2, 3, 4, 5, 12, 13, 10, 11], // 右
        [0, 1, 2, 3, 4, 5, 6, 7], // 前 // 这个面最后涂色，所以放在后面
      ];
      const scal = 2; // 缩放倍数
      const move = 90; // 位置偏移，默认在左上角
      arr.map((item, i) => {
        this.cubecontext.lineWidth = 1;
        this.cubecontext.beginPath();
        this.cubecontext.moveTo(
          data[item[0]] / scal + move,
          data[item[1]] / scal + move
        );
        this.cubecontext.lineTo(
          data[item[2]] / scal + move,
          data[item[3]] / scal + move
        );
        this.cubecontext.lineTo(
          data[item[4]] / scal + move,
          data[item[5]] / scal + move
        );
        this.cubecontext.lineTo(
          data[item[6]] / scal + move,
          data[item[7]] / scal + move
        );
        this.cubecontext.lineTo(
          data[item[0]] / scal + move,
          data[item[1]] / scal + move
        );
        if (i == 5) {
          this.cubecontext.fillStyle = "rgba(1, 161, 236, 0.804)";
          this.cubecontext.fill();
          this.cubecontext.stroke();
        } else {
          this.cubecontext.fillStyle = "rgba(101, 101, 101, 0.21)";
          this.cubecontext.fill();
          this.cubecontext.stroke();
        }
      });
      // this.cubecontext.beginPath();
      // this.cubecontext.moveTo(data[0] / scal + move, data[1] / scal + move);
      // this.cubecontext.lineWidth = 1;
      // this.cubecontext.lineTo(data[2] / scal + move, data[3] / scal + move);
      // this.cubecontext.lineTo(data[4] / scal + move, data[5] / scal + move);
      // this.cubecontext.lineTo(data[6] / scal + move, data[7] / scal + move);
      // this.cubecontext.lineTo(data[0] / scal + move, data[1] / scal + move);
      // this.cubecontext.fillStyle = "rgba(1, 161, 236, 0.804)";
      // this.cubecontext.fill();
      // const color = [
      //   "red",
      //   "yellow",
      //   "pink",
      //   "skyblue",
      //   "green",
      //   "blue",
      //   "gray",
      //   "black",
      // ];
      // data.map((items, i) => {
      //   if (!items) return;
      //   this.cubecontext.strokeStyle = color[i];
      //   this.cubecontext.fillStyle = color[i];
      //   this.cubecontext.lineWidth = 1;
      //   this.cubecontext.beginPath();
      //   this.cubecontext.arc(
      //     parseFloat(data[2 * i]),
      //     parseFloat(data[2 * i + 1]),
      //     2,
      //     0,
      //     Math.PI * 2,
      //     true
      //   );
      //   this.cubecontext.fill();
      //   this.cubecontext.stroke();
      // });
    },
    // json数据格式化
    jsonShowFn(json) {
      if (!this.isjson(json)) {
        json = JSON.parse(json);
      }
      if (typeof json != "string") {
        json = JSON.stringify(json, undefined, 2);
      }
      json = json.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
      return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
          let cls = "number";
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = "key";
            } else {
              cls = "string";
            }
          } else if (/true|false/.test(match)) {
            cls = "boolean";
          } else if (/null/.test(match)) {
            cls = "null";
          }
          return '<span class="' + cls + '">' + match + "</span>";
        }
      );
    },
    // 本地图片识别
    async getAiJson(params, file) {
      try {
        this.loading = true;
        this.navTag = 1;
        const res = await this.$API.getAiJson(params);
        if (res && res.flag == 1 && res.obj) {
          setTimeout(() => {
            this.testJson = JSON.stringify(res.obj);
            this.aiData = res.obj;
            const myimage = document.getElementById("nowShowImg");
            myimage.style.width = "auto";
            myimage.style.height = "auto";
            this.setAIData(res.obj);
            this.loading = false;
          }, 100);
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$msg.error("请求失败!");
      }
    },
    async changeImage(e, myfile) {
      const file = myfile || e.target.files[0];
      if (!file) {
        this.$refs.avatarInput.value = null;
        return;
      }
      this.upload(file);
    },
    // 本地上传图片
    async upload(file) {
      this.clear();
      if (this.cubecontext) {
        this.cubecontext.clearRect(
          0,
          0,
          this.cubecanvas.width,
          this.cubecanvas.height
        );
      }
      if (this.context) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      if (this.context2) {
        this.context2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
      }
      const fileName = file.name;
      const regex = /(.jpg|.jpeg|.png)$/;
      if (regex.test(fileName.toLowerCase())) {
        let url = null;
        if (window.createObjectURL != undefined) {
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
          url = window.webkitURL.createObjectURL(file);
        }
        this.nowImg = {
          src: url,
        };
        const formdata = new FormData();
        formdata.append("file", file);
        this.getAiJson(formdata, file);
      } else {
        this.$msg.error("请选择图片文件");
      }
    },
    async urlCheck() {
      if (this.url == "") {
        this.$msg.error("请输入图片链接");
        return;
      }
      this.popoverVisible2 = true;
    },
    // 提交图片链接
    async check() {
      if (this.url == "") {
        this.$msg.error("请输入图片链接");
        return;
      }
      const regex = /(jpg|jpeg|png)$/;
      const ext = this.url
        .substring(this.url.lastIndexOf(".") + 1)
        .toLowerCase();
      if (!regex.test(ext)) {
        this.$msg.error("输入图片链接有误");
        return;
      }
      this.clear();
      if (this.cubecontext) {
        this.cubecontext.clearRect(
          0,
          0,
          this.cubecanvas.width,
          this.cubecanvas.height
        );
      }
      if (this.context) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      if (this.context2) {
        this.context2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
      }
      this.nowImg = {
        src: this.url,
      };
      this.navTag = 1;
      this.loading = true;
      try {
        const res = await this.$API.getAiJsonByUrl({
          url: this.url,
        });
        if (res && res.flag == 1 && res.obj) {
          this.aiData = res.obj;
          setTimeout(() => {
            this.testJson = JSON.stringify(res.obj);
            const myimage = document.getElementById("nowShowImg");
            myimage.style.width = "auto";
            myimage.style.height = "auto";
            this.setAIData(res.obj);
            this.loading = false;
            this.url = "";
          }, 100);
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$msg.error("请求失败!");
      }
    },
    // 绘制人脸框
    drawRack(Wscale, Hscale, that) {
      that.context.strokeStyle = "#52e5ff";
      that.context.fillStyle = "#52e5ff";
      that.context.lineWidth = 2;
      that.aiData.map((item) => {
        const { cubeH, cubeW, cubeX, cubeY } = item;
        that.context.strokeRect(
          parseFloat((cubeX / Wscale).toFixed(5)),
          parseFloat((cubeY / Hscale).toFixed(5)),
          parseFloat((cubeW / Wscale).toFixed(5)),
          parseFloat((cubeH / Hscale).toFixed(5))
        );
      });
    },
    // 处理AI结果数据
    setAIData(pointData) {
      this.cutImgs = [];
      this.nowResImg = this.nowImg;
      const that = this;
      this.$nextTick(() => {
        const myimage = document.getElementById("nowShowImg");
        const rw = myimage.naturalWidth; // 真实图片宽度
        const rh = myimage.naturalHeight; // 真实图片高度
        const nw = myimage.clientWidth; // 当前图片宽度
        const nh = myimage.clientHeight; // 当前图片高度
        const Wscale = parseFloat((rw / nw).toFixed(5)); // 宽缩放比值
        const Hscale = parseFloat((rh / nh).toFixed(5)); // 高缩放比值
        that.cutImgs.push({ ...this.nowImg, Wscale, Hscale });
        that.canvas = document.getElementById("mycanvas");
        that.canvas2 = document.getElementById("mycanvas2");
        this.canvasW = nw + "px"; // 设置canvas画布的宽度
        this.canvasH = nh + "px"; // 设置canvas画布的高度
        that.context = that.canvas.getContext("2d");
        that.context2 = that.canvas2.getContext("2d");
        that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
        that.context2.clearRect(0, 0, that.canvas2.width, that.canvas2.height);
        const a = setInterval(() => {
          //  重复获取
          that.canvas = document.getElementById("mycanvas");
          that.canvas2 = document.getElementById("mycanvas2");
          if (!that.canvas) {
            return false;
          } else {
            clearInterval(a);
            that.context.strokeStyle = "#52e5ff";
            that.context.fillStyle = "#52e5ff";
            that.context.lineWidth = 2;
            if (pointData) {
              that.drawRack(Wscale, Hscale, that);
              pointData.map((item, index) => {
                const { cubeH, cubeW, cubeX, cubeY, landmark, apexs } = item;
                const img = new Image();
                img.crossOrigin = "anonymous"; // 处理图片跨域
                img.src = this.urlReplace(this.nowImg.src);
                img.onload = function () {
                  // 截图方式1
                  that.context2.drawImage(
                    img,
                    cubeX,
                    cubeY,
                    cubeW,
                    cubeH,
                    0,
                    0,
                    nw,
                    nh
                    // nw / 2 - parseFloat((cubeW / Wscale).toFixed(5)),
                    // nh / 2 - parseFloat((cubeW / Wscale).toFixed(5)),
                    // parseFloat((cubeW / Wscale).toFixed(5)) * 2,
                    // parseFloat((cubeH / Hscale).toFixed(5)) * 2
                  );
                  const ext = img.src
                    .substring(img.src.lastIndexOf(".") + 1)
                    .toLowerCase();
                  const cutImgUrl = that.canvas2.toDataURL("image/" + ext);
                  that.cutImgs.push({
                    src: cutImgUrl,
                    nw: parseFloat((cubeW / Wscale).toFixed(5)),
                    nh: parseFloat((cubeH / Hscale).toFixed(5)),
                    landmark: landmark,
                    apexs: apexs,
                    Wscale: Wscale,
                    Hscale: Hscale,
                    startX: parseFloat((cubeX / Wscale).toFixed(5)),
                    startY: parseFloat((cubeY / Hscale).toFixed(5)),
                  });
                  // that.context2.clearRect(
                  //   0,
                  //   0,
                  //   that.canvas2.width,
                  //   that.canvas2.height
                  // );
                  // 截图方式2
                  // const dataImg = that.context2.getImageData(
                  //   nw / 2 - 100,
                  //   nh / 2 - 100,
                  //   200,
                  //   200
                  // );
                  // that.context2.putImageData(dataImg, 0, 0, 0, 0, 200, 200);
                };
                // 绘制人脸框
              });
            }
          }
        }, 100);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.DetectBox {
  position: relative;
  background: red;
  width: 100%;
  &_experience {
    display: flex;
    flex-direction: column;
    align-items: center;
    .imgBox {
      width: 100%;
      height: 600px;
      display: flex;
      background: #fff;
      justify-content: space-between;
      .left {
        width: calc(50% - 5px);
        height: 100%;
        border: 1px solid #dddddd;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .showImg {
          padding: 10px;
          width: calc(100% - 20px);
          height: 60%;
          & > div {
            background: rgb(230, 230, 230);
            position: relative;
            width: 100%;
            height: 100%;
            #nowShowImg {
              transition: all 0.2s;
              position: absolute;
              left: 50%;
              top: 50%;
              max-width: 100%;
              max-height: 100%;
              width: auto;
              height: auto;
              transform: translate(-50%, -50%);
            }
            #mycanvas,
            #mycanvas2 {
              position: absolute;
              left: 50%;
              top: 50%;
              max-width: 100%;
              max-height: 100%;
              transform: translate(-50%, -50%);
              // background: rgba(236, 1, 1, 0.404);
            }
            #mycanvas2 {
              display: none;
            }
          }
        }
        .imgBar {
          width: 100%;
          height: 20%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .leftBtn,
          .rightBtn {
            width: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
              color: cornflowerblue;
            }
          }
          .content {
            width: 86%;
            overflow: hidden;
            .box {
              display: flex;
              align-items: center;
              position: relative;
              left: 0;
              transition: all 0.5s;
              .imgItem {
                display: flex;
                align-items: center;
                opacity: 0.8;
                border: 2px solid transparent;
                width: calc(25% - 7px);
                height: 66px;
                margin-right: 5px;
                background: rgb(230, 228, 228);
                img {
                  width: 66px;
                  max-height: 100%;
                }
                &:nth-last-of-type(1) {
                  margin-right: 0;
                }
                // &:nth-of-type(1) > img {
                //   max-width: 66px;
                //   height: auto;
                // }
              }
            }
          }
        }
        .footer {
          width: 100%;
          height: 13%;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          .inputUrl {
            width: 70%;
          }
        }
      }
      .right {
        width: calc(50% - 5px);
        height: 100%;
        border: 1px solid #dddddd;
        // display: flex;
        // flex-direction: column;
        .nav {
          height: 40px;
          width: 100%;
          display: flex;
          & > div {
            width: 50%;
            cursor: pointer;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .content {
          height: calc(100% - 40px);
          width: 100%;
          .resultBox {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            & > .header {
              width: 100%;
              height: 20%;
              display: flex;
              align-items: center;
              justify-content: center;
              .imgBar2 {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                &_leftBtn {
                  margin-left: 3px;
                }
                &_rightBtn {
                  margin-right: 3px;
                }
                &_leftBtn,
                &_rightBtn {
                  height: 68%;
                  background: rgb(219, 219, 219);
                  width: 18px;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  &:hover {
                    color: cornflowerblue;
                  }
                }
                &_content {
                  width: 86%;
                  overflow: hidden;
                  .box2 {
                    display: flex;
                    align-items: center;
                    position: relative;
                    left: 0;
                    transition: all 0.5s;
                    .imgItem {
                      display: flex;
                      align-items: center;
                      opacity: 0.8;
                      border: 2px solid transparent;
                      width: calc(25% - 7px);
                      height: 66px;
                      max-width: 66px;
                      margin-right: 5px;
                      background: rgb(230, 228, 228);
                      img {
                        width: 66px;
                        height: 100%;
                        max-height: 100%;
                      }
                      &:nth-last-of-type(1) {
                        margin-right: 0;
                      }
                      &:nth-of-type(1) > img {
                        max-width: 66px;
                        height: auto;
                      }
                    }
                  }
                }
              }
            }
            .content {
              width: 100%;
              height: 80%;
              .restxt {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 80%;
                padding: 0 10%;
                color: #666;
                font-size: 14px;
                line-height: 30px;
                span {
                  color: red;
                }
              }
              .resDetail {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                .resItem {
                  padding: 20px 0 20px 25px;
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                  .resLabel {
                    width: 80px;
                    text-align: left;
                  }
                  .resValue2 {
                    position: relative;
                    width: 30px;
                    height: 30px;
                    margin: 0 auto;
                    /**透视效果,越大透视距离越平面，反之亦然 */
                    perspective: 200px;
                    .rectangle {
                      /*3d视图*/
                      transform-style: preserve-3d;
                      /*过度动画*/
                      transition: all 1s linear;
                      width: 30px;
                      height: 30px;
                      transform: rotateX(20deg) rotateY(20deg);
                      &:hover {
                        transform: rotateX(360deg) rotateY(360deg);
                      }
                      .side {
                        position: absolute;
                        height: 30px;
                        width: 30px;
                        border: 1px solid rgb(83, 83, 83);
                        background: rgba(0, 0, 0, 0.3);
                        color: #fff;
                        line-height: 30px;
                        font-size: 12px;
                        font-weight: bold;
                        text-align: center;
                      }
                      .side1 {
                        transform: translateZ(15px);
                        background: rgb(0, 68, 255);
                      }
                      .side2 {
                        transform: rotateX(180deg) translateZ(15px);
                      }
                      .side3 {
                        transform: rotateY(-90deg) translateZ(15px);
                      }
                      .side4 {
                        transform: rotateY(90deg) translateZ(15px);
                      }
                      .side5 {
                        transform: rotateX(90deg) translateZ(15px);
                      }
                      .side6 {
                        transform: rotateX(-90deg) translateZ(15px);
                      }
                    }
                  }
                }
                .percentBar {
                  width: 65%;
                  padding-left: 100px;
                  position: relative;
                  &::after {
                    position: absolute;
                    content: "";
                    width: 2px;
                    height: 10px;
                    background: red;
                    left: 60%;
                    top: 3px;
                  }
                }
                .cubeItem {
                  display: flex;
                  flex-direction: column;
                  width: 100%;
                  height: 100%;
                  padding: 0 10px;
                  .cubeLabel {
                    height: 30px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    padding: 0 10px;
                  }
                  .cube {
                    width: calc(100% - 20px);
                    height: 300px;
                    // border: 1px solid;
                  }
                }
              }
            }
          }
          .JSONBox {
            width: 100%;
            height: 100%;
            text-align: left;
            overflow: auto;
          }
        }
      }
    }
  }
}
.onSelect {
  color: #00b2e0 !important;
  background: #f6f7fb !important;
}
.selectImg {
  border-color: turquoise !important;
  opacity: 1 !important;
}
.popoverBox {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  div {
    padding: 5px 0;
  }
}
</style>
<style lang="scss">
#jsonShow {
  // padding: 5px;
  // margin: 5px;
  .string {
    color: green !important;
  }
  .number {
    color: darkorange !important;
  }
  .boolean {
    color: blue !important;
  }
  .null {
    color: magenta !important;
  }
  .key {
    color: red !important;
  }
}
.inputUrl {
  .el-input-group__append {
    // background: #00b2e0 !important;
    // color: #fff !important;
    cursor: pointer;
    // border: 1px solid #00b2e0;
    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
