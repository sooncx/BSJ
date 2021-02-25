<template>
  <a-modal
    title="温馨提示"
    :maskClosable="false"
    width="500px"
    class="rechargeMessage"
    :zIndex="zIndex"
  >
  <template #footer>
      <a-button key="submit" type="primary" @click="handleOk">
        确认
      </a-button>
  </template>
    <div>
      <p>1. 加车币<span> 划拨 </span>后将不可撤回，请谨慎操作！</p>
      <p>2. 车辆<span> 续费 </span>后将不可撤回，请谨慎操作！</p>
      <p>3. 服务到期前<span> 删除车辆 </span>，加车币将不予退回！</p>
      <p>4. 1个币=1月， 一次性续费1年优惠后只需5个币！</p>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent,reactive, toRefs} from "vue";
export default defineComponent({
  name: "carRechargeMessageModal",
  setup(props, { emit }) {
    const data = reactive({
      zIndex:2000
    });
    const handleOk = () => {
      emit("update:visible", false);
    }
    return {
      handleOk,
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less">
.rechargeMessage{
  p{
    span{
      color:#F00;
    }
  }
}
</style>