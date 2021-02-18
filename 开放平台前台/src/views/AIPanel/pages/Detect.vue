<template>
  <div class="DetectBox">
    <div class="DetectBox_header">
      <div class="title">
        人脸检测
      </div>
      <div class="content">
        <div class="detail">
          检测图片中的人脸，返回高精度的人脸坐标。
        </div>
        <div class="btns">
          <div class="btn">马上咨询</div>
          <div class="btn btn2">立即体验</div>
        </div>
      </div>
    </div>
    <div class="DetectBox_experience">
      <div class="title">
        产品体验
      </div>
      <div class="detail">
        即刻体验的人脸检测能力。请上传一张本地图片或提供图片URL。
        该功能演示是基于智能检测 API搭建的。如果您对技术能力有特别要求，请查看下方的产品目录或联系我们。
      </div>
      <div class="imgBox">
        <div class="left">
          <div
            class="showImg"
            v-loading="loading"
          >
            <div>
              <img
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
            >《</div>
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
                    :src="item.src"
                    alt=""
                  >
                </div>
              </div>
            </div>
            <div
              class="rightBtn"
              @click="changeImg('next')"
            >》</div>
          </div>
          <div class="footer">
            <el-upload
              action=""
              class="upload-demo"
              :show-file-list="false"
              :before-upload="upload"
            >
              <el-button size="small">本地上传</el-button>
            </el-upload>
            <div class="inputUrl">
              <el-input
                placeholder="图片url"
                v-model="url"
                size="small"
              >
                <template #append>
                  <el-button @click="check">检测</el-button>
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
                <div class="imgBar2">
                  <div
                    class="imgBar2_leftBtn"
                    @click="changeResImg('prev')"
                  >《</div>
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
                          :src="item.src"
                          alt=""
                        >
                      </div>
                    </div>
                  </div>
                  <div
                    class="imgBar2_rightBtn"
                    @click="changeResImg('next')"
                  >》</div>
                </div>
              </div>
              <div class="content">
                <div
                  v-show="nowResIndex == 0"
                  class="restxt"
                >
                  已检测到图中{{cutImgs.length - 1}}张人脸，并生成对应face_token，点击人脸图片查看结果信息。您可将以上信息传给其他API进行后续处理和分析。推荐使用人脸属性和人脸关键点API。
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
    <div class="scenarios">
      <div class="title">
        应用场景
      </div>
      <div class="content">
        <div class="item">
          驾驶员监控系统
        </div>
        <div class="item">
          人脸3D建模
        </div>
      </div>
    </div>
    <div class="advantage">
      <div class="title">
        技术优势
      </div>
      <div class="content">
        <div class="item">
          检测速度快
        </div>
        <div class="item">
          不限人脸数量
        </div>
        <div class="item">
          识别精度高
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import myjson from "./test.json";
import baseURL from "../../../api/baseURL";

export default {
  data() {
    return {
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
      imgs: [],
    };
  },
  mounted() {
    const img = this.imgs[0];
    this.nowImg = img;
    // this.testJson = myjson;
    // this.testJson =
    //   '{ "name": "小三", "address":"北京路23号","age":16, "email":"123456@qq.com","Object":[{"职位":"经理"}],"del":[] }';
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
    isjson(obj) {
      const isjson =
        typeof obj == "object" &&
        Object.prototype.toString.call(obj).toLowerCase() ==
          "[object object]" &&
        !obj.length;
      return isjson;
    },
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
    async setNowImg(item, index) {
      this.nowResIndex = 0;
      this.navTag = 1;
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
    setNowResImg(item, index) {
      this.nowResImg = item;
      this.nowImg = item;
      this.nowResIndex = index;
      console.log(item, "itemitem");
      const myimage = document.getElementById("nowShowImg");
      const rw = myimage.naturalWidth; // 真实图片宽度
      const rh = myimage.naturalHeight; // 真实图片高度
      const nw = myimage.clientWidth; // 当前图片宽度
      const nh = myimage.clientHeight; // 当前图片高度
      myimage.style.width = "auto";
      myimage.style.height = "auto";
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
        myimage.style.width = item.nw + "px";
        myimage.style.height = item.nh + "px";
      }
      if (index == 0) {
        that.drawRack(Wscale, Hscale, that);
      }
      if (item.landmark) {
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
            parseFloat((landmark[2 * i] / Wscale + X).toFixed(5)),
            parseFloat((landmark[2 * i + 1] / Hscale + Y).toFixed(5)),
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
        [0, 1, 2, 3, 4, 5, 6, 7, 0, 1], // 前
        [8, 9, 10, 11, 12, 13, 14, 15, 8, 9], // 后
        [0, 1, 2, 3, 10, 11, 8, 9, 0, 1], // 上
        [4, 5, 6, 7, 14, 15, 12, 13, 4, 5], // 下
        [0, 1, 6, 7, 14, 15, 8, 9, 0, 1], // 左
        [2, 3, 4, 5, 12, 13, 10, 11, 2, 3], // 右
      ];
      arr.map((item, i) => {
        this.cubecontext.lineWidth = 2;
        this.cubecontext.beginPath();
        this.cubecontext.moveTo(data[item[0]], data[item[1]]);
        this.cubecontext.lineTo(data[item[2]], data[item[3]]);
        this.cubecontext.lineTo(data[item[4]], data[item[5]]);
        this.cubecontext.lineTo(data[item[6]], data[item[7]]);
        this.cubecontext.lineTo(data[item[0]], data[item[1]]);
        this.cubecontext.fillStyle = "rgba(101, 101, 101, 0.21)";
        this.cubecontext.fill();
        this.cubecontext.stroke();
      });
      this.cubecontext.beginPath();
      this.cubecontext.moveTo(data[0], data[1]);
      this.cubecontext.lineWidth = 1;
      this.cubecontext.lineTo(data[2], data[3]);
      this.cubecontext.lineTo(data[4], data[5]);
      this.cubecontext.lineTo(data[6], data[7]);
      this.cubecontext.lineTo(data[0], data[1]);
      this.cubecontext.fillStyle = "rgba(1, 161, 236, 0.904)";
      this.cubecontext.fill();
      const color = [
        "red",
        "yellow",
        "pink",
        "skyblue",
        "green",
        "blue",
        "gray",
        "black",
      ];
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
          this.drawPoints(res.obj);
          this.loading = false;
        }, 100);
      }
      this.loading = false;
    },
    // 本地上传图片
    async upload(file) {
      // if (window.FileReader) {
      //   const reader = new FileReader();
      //   reader.readAsDataURL(file);
      //   reader.onloadend = function (e) {
      //     console.log(e.target.result, "e.target.result");
      //   };
      // }
      this.nowResIndex = 0;
      this.navTag = 1;
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
        this.$msg.error("请选择图片文件");
        return;
      }
      this.nowResIndex = 0;
      this.navTag = 1;
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
          this.drawPoints(res.obj);
          this.loading = false;
          this.url = "";
        }, 100);
      }
      this.loading = false;
    },
    changeImg(type) {
      const dom = document.getElementsByClassName("box")[0];
      const num = parseFloat(dom.style.left.split("px")[0] || 0);
      const MaxL = this.imgs.length;
      if (MaxL <= 4) return;
      if (type == "next") {
        if (num - 75 >= -(MaxL - 4) * 75) {
          dom.style.left = num - 75 + "px";
        }
      } else if (num + 66 <= 0) {
        dom.style.left = num + 75 + "px";
      }
    },
    changeResImg(type) {
      const dom = document.getElementsByClassName("box2")[0];
      const num = parseFloat(dom.style.left.split("px")[0] || 0);
      const MaxL = this.cutImgs.length;
      if (MaxL <= 4) return;
      if (type == "next") {
        if (num - 75 >= -(MaxL - 4) * 75) {
          dom.style.left = num - 75 + "px";
        }
      } else if (num + 66 <= 0) {
        dom.style.left = num + 75 + "px";
      }
    },
    drawRack(Wscale, Hscale, that) {
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
    drawPoints(pointData) {
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
                img.src = this.nowImg.src;
                img.crossOrigin = "anonymous"; // 处理图片跨域
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
  padding: 20px 0 0 0;
  &_header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 20px;
    margin-bottom: 20px;
    .title {
      font-size: 36px;
      font-weight: bold;
      padding-bottom: 20px;
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .detail {
        color: #666;
        font-size: 16px;
      }
      .btns {
        display: flex;
      }
      .btn {
        margin-top: 20px;
        display: block;
        cursor: pointer;
        width: 130px;
        height: 40px;
        background: rgba(8, 86, 234, 1);
        line-height: 40px;
        text-align: center;
        color: #fff;
        &:hover {
          opacity: 0.8;
        }
      }
      .btn2 {
        background: rgb(234, 53, 8);
        margin-left: 20px;
      }
    }
  }
  &_experience {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .detail {
      width: 60%;
      color: #666;
      line-height: 20px;
      margin-bottom: 10px;
    }
    .imgBox {
      width: 100%;
      height: 500px;
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
          // background: gray;
          & > div {
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
                  max-width: 66px;
                  max-height: 66px;
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
                &_leftBtn,
                &_rightBtn {
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
                      margin-right: 5px;
                      background: rgb(230, 228, 228);
                      img {
                        max-width: 66px;
                        height: 100%;
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
                line-height: 20px;
                color: #666;
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
                    border: 1px solid;
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
  .scenarios,
  .advantage {
    padding: 16px 20px;
    background: rgb(233, 233, 233);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 30px;
    }
    .content {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      .item {
        width: 250px;
        height: 150px;
        border: 1px solid;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .advantage {
    margin-bottom: 0;
    .content {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      .item {
        width: 200px;
        height: 120px;
        border: 1px solid;
        display: flex;
        align-items: center;
        justify-content: center;
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
    background: #00b2e0 !important;
    color: #fff !important;
    cursor: pointer;
    border: 1px solid #00b2e0;
    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
