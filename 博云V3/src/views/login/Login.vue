<template>
  <div class="login">
    <!-- 背景 -->
    <div class="login__Bg"></div>

    <!-- 底部二维码 备案信息 -->
    <div class="login__bottom">
      <div class="copyright">
        <a href="http://open.car900.com/" target="_blank"> <img src="../../assets/img/login/footer.png" alt=""></a>
        <span>&copy;2015 car900.com 8gps.cn 版权所有 ICP证：<a href="http://www.beian.miit.gov.cn/" target="_blank">粤ICP备13042057号-3</a></span>
      </div>

      <div class="qrcode">
        <div>
          <img src="../../assets/img/login/Android.png" alt="">
          <p>Android-APP</p>
        </div>
        <div>
          <img src="../../assets/img/login/Ios.png" alt="">
          <p>IOS-APP</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 表单 -->
  <loginBox />
</template>
<script>
import loginBox from './module/LoginBox';

export default {
  components: {
    loginBox
  }
}
</script>
<style lang="less" scoped>
.login {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  flex-flow: column;

  &__Bg {
    width: 100%;
    height: 80%;
    background-size: cover;
    background-repeat: no-repeat;
  }

  &__bottom {
    display: flex;
    height: 20%;
    > div {
      width: 50%;
      height: 100%;
      display: flex;
    }
    .copyright {
      flex-flow: column;
      justify-content: center;
      align-items: flex-end;
    }
    .qrcode {
      justify-content: center;
      > div {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-right: 74px;
      }
      img {
        width: 102px;
        height: 102px;
        margin-bottom: 10px;
      }
    }
  }
}

@media screen and (max-width:1281px) {
  .login__Bg {
    background-image: url(../../assets/img/login/bg.jpg);
  }
}

@media screen and (max-width:1367px) and (min-width:1281px) {
  .login__Bg {
    background-image: url(../../assets/img/login/bg.jpg);
  }
}

@media screen and (max-width:1441px) and (min-width:1367px) {
  .login__Bg {
    background-image: url(../../assets/img/login/bg.jpg);
  }
}

@media screen and (max-width:1537px) and (min-width:1441px) {
  .login__Bg {
    background-image: url(../../assets/img/login/bg.jpg);
  }
}

@media screen and (min-width: 1537px) {
  .login__Bg {
    background-image: url(../../assets/img/login/bg.jpg);
  }
}
</style>