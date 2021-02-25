<template>
  <div class="carTree">
    <!-- 车组树 -->
    <manageDataTree
      v-model:treeDataArray="treeData"
      searchTitle="车组/车牌/SIM/终端号"
      :checkable="false"
      :parentKey="{id:'gi',parentId: 'pi'}"
      title="gn"
      :replaceFields="{children:'children', title:'gn', key:'gi' }"
      @type="getType"
      @selectTree="selectTree"
    ></manageDataTree>
    <!-- 车组新增和修改弹窗 -->
    <carGroupModal
      v-bind="$attrs"
      v-model:visible="modalVisible"
      :carGroupModelType="carGroupModelType"
      :carGroupModelItem="carGroupModelItem"
      @groupModalHandleOk="getGroup"
    ></carGroupModal>
    <!-- 车辆窗口 -->
    <VehDialog 
      v-model:visible="VehDialogVisible"
      :groupInfo="selectGroupInfo"
      @editOk="vehdialogOk"
    />
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  inject,
  createVNode,
  defineAsyncComponent,
  nextTick,
} from "vue";
import { Modal } from "ant-design-vue";
import APIManage from "@/api/manageData";
import { manageDataTree, carGroupModal } from "../../module/index";
import { ElMessage } from 'element-plus';
import { useStore } from "vuex";
export default defineComponent({
  components: {
    manageDataTree,
    carGroupModal,
    VehDialog: defineAsyncComponent(
      () =>
        import("../../../monitorCenter/LeftContent/dialog/VehDialog.vue")
    ),
  },
  setup() {
    const data = reactive({
      treeData: <any>null,
      modalVisible: false,                      // 车组添加和修改显示状态
      VehDialogVisible: false,                  // 车辆详情显示状态
      selectGroupInfo: {                        // 车组数据
        groupId: '',
        groupName: '',
      },
      carGroupModelItem: <any>null,             // 车组使用类型 新增还是修改
      carGroupModelType: '',                    // 车组使用数据
    });
    const store = useStore();
    // 获取本地缓存数据
    const getGroup = async () => {
      try {
        setTimeout(()=>{
          data.treeData = [...store.state.groupList];
          data.treeData.unshift({ pi: 0, gi: -3, gn: "车辆管理" });
        },100);
      } catch (error) {
        ElMessage.error(error);
      }
    };
    nextTick(()=>{
      getGroup();
    });
    // 更新缓存
    const fnName = inject("updateVehGroupData") as Function;
    // 树选择功能 回调
    const getType = (type: string, item: any) => {
      if (type === "delete") {
        Modal.confirm({
          title: "是否删除该车组？",
          content: createVNode(
            "div",
            { style: "color:red;" },
            "重要提示：删除后，相关设备的数据将会被清空，例如轨迹、数据报表等！！！"
          ),
          okText: "确定",
          cancelText: "取消",
          async onOk() {
            try {
              const {msg,flag} = await APIManage.deleteVehicleGroup({ groupId: item.gi });
              if(flag !== 1) throw msg;
              //更新缓存
              fnName();
              getGroup();
            } catch (error) {
              ElMessage.error(error);
            }
          }
        });
        return false;
      }
      data.carGroupModelItem = item;
      if (type === "add" || type === "edit") {
        data.carGroupModelType = type;
        data.modalVisible = true;
      }
      if (type === "editInfo") {
        data.selectGroupInfo.groupId = item.gi;
        data.selectGroupInfo.groupName = item.gn;
        data.VehDialogVisible = true;
      }
    };
    // 注册注入器
    let updateSelectTreeData = inject("updateSelectTreeData") as Function;
    // 树点击功能 回调
    const selectTree = (item: any) => {
      updateSelectTreeData(item);
    };
    // 车辆详情点击确定 回调
    const vehdialogOk = () => {
      updateSelectTreeData(data.carGroupModelItem);
    }
    return {
      vehdialogOk,
      selectTree,
      getGroup,
      carGroupModal,
      getType,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
.carTree{
  height: 100%;
  padding: 15px;
}
</style>