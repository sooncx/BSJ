<template>
  <Modal v-bind="$attrs" :width="380" title="导出筛选" :footer="null">
    <ul class="exportTypeList">
      <li v-for="(item, index) in list" :key="index">
        <a-checkbox v-model:checked="item.checked" @change="onCheckChange">
          {{ item.name }}
        </a-checkbox>
      </li>
    </ul>
    <div class="exportTypeBtn">
      <a-checkbox v-model:checked="allChecked" @change="onAllChange"
        >全选</a-checkbox
      >
      <a-button type="primary" :disabled="exportFlag" @click="exportAll"
        >确定导出</a-button
      >
    </div>
  </Modal>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from "vue";
import { Modal } from "@/components/Modal/";
import API from "@/api/riskControlCenter/";
import { useStore } from "vuex";

interface listType {
  key: string;
  name: string;
  checked: boolean;
}

export default defineComponent({
  components: { Modal },
  props: {
    /**
     * all    多导出
     * single 单导出
     */
    type: {
      type: String,
      default: "all",
    },
    /**
     * 入参值
     */
    keys: String,
  },
  setup(props, { emit }) {
    const store = useStore();

    const data = reactive({
      allChecked: false,
      exportFlag: false,
      list: computed(() => {
        if (props.type === "all") {
          return [
            {
              key: "plate",
              name: "车牌号",
              checked: true,
            },
            {
              key: "frameNo",
              name: "车架号",
              checked: true,
            },
            {
              key: "alarmTime",
              name: "报警时间",
              checked: true,
            },
            {
              key: "alarmName",
              name: "报警类型",
              checked: true,
            },
            {
              key: "alarmAddress",
              name: "报警地址",
              checked: true,
            },
            {
              key: "nowAddress",
              name: "当前地址",
              checked: true,
            },
            {
              key: "groupName",
              name: "车组名称",
              checked: true,
            },
            {
              key: "nowRemark",
              name: "备注",
              checked: true,
            },
            {
              key: "concernLevel",
              name: "关注度等级",
              checked: true,
            },
            {
              key: "remark",
              name: "关注备注",
              checked: true,
            },
            {
              key: "owner",
              name: "车主",
              checked: false,
            },
            {
              key: "sim",
              name: "sim卡号",
              checked: false,
            },
            {
              key: "terminalType",
              name: "设备类型",
              checked: true,
            },
            {
              key: "installDate",
              name: "安装时间",
              checked: false,
            },
            {
              key: "activationTme",
              name: "激活时间",
              checked: false,
            },
            {
              key: "iccid",
              name: "iccid卡号",
              checked: false,
            },
            {
              key: "speed",
              name: "速度",
              checked: true,
            },
            {
              key: "devTime",
              name: "最后上线时间",
              checked: true,
            },
            {
              key: "pos",
              name: "定位",
              checked: true,
            },
            {
              key: "stateTime",
              name: "离线时长",
              checked: true,
            },
            {
              key: "alarmStr",
              name: "报警类型",
              checked: true,
            },
          ];
        } else if (props.type === "single") {
          let list: listType[] = [];
          console.log(props.keys);
          switch (props.keys?.toString()) {
            case "3":
              list = [
                {
                  key: "plate",
                  name: "车牌号",
                  checked: true,
                },
                {
                  key: "terminalType",
                  name: "设备类型",
                  checked: true,
                },
                {
                  key: "frameNo",
                  name: "车架号",
                  checked: true,
                },
                {
                  key: "alarmName",
                  name: "报警类型",
                  checked: true,
                },
                {
                  key: "nowAddress",
                  name: "当前地址",
                  checked: true,
                },
                {
                  key: "groupName",
                  name: "车组名称",
                  checked: true,
                },
                {
                  key: "nowRemark",
                  name: "备注",
                  checked: true,
                },
                {
                  key: "concernLevel",
                  name: "关注度等级",
                  checked: true,
                },
                {
                  key: "remark",
                  name: "关注备注",
                  checked: true,
                },
                {
                  key: "speed",
                  name: "速度",
                  checked: true,
                },
                {
                  key: "devTime",
                  name: "最后上线时间",
                  checked: true,
                },
                {
                  key: "pos",
                  name: "定位",
                  checked: true,
                },
                {
                  key: "stateTime",
                  name: "离线时长",
                  checked: true,
                },
                {
                  key: "sim",
                  name: "sim卡号",
                  checked: false,
                },
                {
                  key: "installDate",
                  name: "安装时间",
                  checked: false,
                },
                {
                  key: "activationTme",
                  name: "激活时间",
                  checked: false,
                },
                {
                  key: "iccid",
                  name: "iccid卡号",
                  checked: false,
                },
              ];
              break;
            case "4":
              list = [
                {
                  key: "plate",
                  name: "车牌号",
                  checked: true,
                },
                {
                  key: "terminalType",
                  name: "设备类型",
                  checked: true,
                },
                {
                  key: "speed",
                  name: "速度",
                  checked: true,
                },
                {
                  key: "devTime",
                  name: "最后上线时间",
                  checked: true,
                },
                {
                  key: "pos",
                  name: "定位",
                  checked: true,
                },
                {
                  key: "stateTime",
                  name: "离线时长",
                  checked: true,
                },
                {
                  key: "alarmStr",
                  name: "报警类型",
                  checked: true,
                },
                {
                  key: "nowAddress",
                  name: "当前地址",
                  checked: true,
                },
                {
                  key: "concernLevel",
                  name: "关注度等级",
                  checked: true,
                },
                {
                  key: "remark",
                  name: "关注备注",
                  checked: true,
                },
                {
                  key: "frameNo",
                  name: "车架号",
                  checked: true,
                },
                {
                  key: "groupName",
                  name: "车组名称",
                  checked: true,
                },
                {
                  key: "nowRemark",
                  name: "备注",
                  checked: true,
                },
                {
                  key: "sim",
                  name: "sim卡号",
                  checked: false,
                },
                {
                  key: "installDate",
                  name: "安装时间",
                  checked: false,
                },
                {
                  key: "activationTme",
                  name: "激活时间",
                  checked: false,
                },
                {
                  key: "iccid",
                  name: "iccid卡号",
                  checked: false,
                },
              ];
              break;
            case "11":
              list = [
                {
                  key: "plate",
                  name: "车牌号",
                  checked: true,
                },
                {
                  key: "groupName",
                  name: "车组名称",
                  checked: true,
                },
                {
                  key: "frameNo",
                  name: "车架号",
                  checked: true,
                },
                {
                  key: "terminalNo",
                  name: "终端号",
                  checked: true,
                },
                {
                  key: "displayTime",
                  name: "停留时间",
                  checked: true,
                },
                {
                  key: "nowAddress",
                  name: "当前地址",
                  checked: true,
                },
                {
                  key: "owner",
                  name: "车主",
                  checked: false,
                },
                {
                  key: "sim",
                  name: "sim卡号",
                  checked: false,
                },
                {
                  key: "terminalType",
                  name: "设备类型",
                  checked: false,
                },
                {
                  key: "installDate",
                  name: "安装时间",
                  checked: false,
                },
                {
                  key: "iccid",
                  name: "iccid卡号",
                  checked: false,
                },
              ];
              break;
            default:
              list = [
                {
                  key: "plate",
                  name: "车牌号",
                  checked: true,
                },
                {
                  key: "frameNo",
                  name: "车架号",
                  checked: true,
                },
                {
                  key: "alarmTime",
                  name: "报警时间",
                  checked: true,
                },
                {
                  key: "alarmName",
                  name: "报警类型",
                  checked: true,
                },
                {
                  key: "alarmAddress",
                  name: "报警地址",
                  checked: true,
                },
                {
                  key: "nowAddress",
                  name: "当前地址",
                  checked: true,
                },
                {
                  key: "groupName",
                  name: "车组名称",
                  checked: true,
                },
                {
                  key: "nowRemark",
                  name: "备注",
                  checked: true,
                },
                {
                  key: "concernLevel",
                  name: "关注度等级",
                  checked: true,
                },
                {
                  key: "remark",
                  name: "关注备注",
                  checked: true,
                },
                {
                  key: "owner",
                  name: "车主",
                  checked: false,
                },
                {
                  key: "sim",
                  name: "sim卡号",
                  checked: false,
                },
                {
                  key: "terminalType",
                  name: "设备类型",
                  checked: false,
                },
                {
                  key: "installDate",
                  name: "安装时间",
                  checked: false,
                },
                {
                  key: "activationTme",
                  name: "激活时间",
                  checked: false,
                },
                {
                  key: "iccid",
                  name: "iccid卡号",
                  checked: false,
                },
              ];
              break;
          }
          return list;
        }
      }),
      onAllChange() {
        data.list?.forEach((item) => {
          item.checked = data.allChecked;
        });
        data.exportFlag = !data.allChecked;
      },
      onCheckChange() {
        try {
          data.list?.forEach((item) => {
            data.exportFlag = true;
            if (item.checked) {
              throw (data.exportFlag = false);
            }
          });
        } catch (error) {}
        const arr = data.list?.filter((item) => item.checked);
        data.allChecked = arr?.length === data.list?.length;
      },
      exportAll() {
        try {
          API.excelAlarmExport({
            type: props.keys,
            keys: (data.list as listType[])
              .map((item) => {
                if (item.checked) {
                  return item.key;
                }
              })
              .filter(Boolean)
              .join(","),
            sessionId: store.state.sessionId,
          });

          emit("update:visible", false);
        } catch (error) {
          console.log(error);
        }
      },
    });

    return {
      ...toRefs(data),
    };
  },
});
</script>
<style lang="less" scoped>
.exportTypeList {
  display: flex;
  flex-wrap: wrap;

  li {
    width: 50%;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-weight: 400;
    font-size: 14px;
  }
}
.exportTypeBtn {
  padding: 20px 20px 0;
  display: flex;
  justify-content: space-between;
}
</style>
