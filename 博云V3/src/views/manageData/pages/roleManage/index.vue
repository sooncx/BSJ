<template>
  <div class="content">
    <div class="header">
      <div class="header__left">
        <a-button type="primary" @click="showData(null)">新建角色</a-button>
      </div>
      <div class="header__right">
        <a-input v-model:value="search.roleName" placeholder="请输入角色名称"></a-input>
        <a-button type="primary" @click="onSearch">
          <template #icon><i class="iconfont icon icon-sousuo"></i></template>
          查询</a-button>
      </div>
    </div>
    <div class="body">
      <div class="body__table detailTable" ref="tableBox">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          style="width: 100%;position:absolute;"
          :height="offsetHeight"
          border
          size="small"
        >
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色信息"></el-table-column>
          <el-table-column
            prop="button"
            label="操作"
            width= "200"
            >
            <template #default="scope">
              <div class="setting">
                <span @click="showData(scope.row)">修改</span>
                <span @click="deleteData(scope.row);">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="body__page">
        <a-pagination
          show-size-changer
          :page-size-options="pagination.pageSizeOptions"
          :total="pagination.total"
          :show-total="(total) => `共: ${pagination.total} 条`"
          size="small"
          v-model:pageSize="pagination.pageSize"
          v-model:current="pagination.current"
          @change="currentChange"
          @showSizeChange="currentChange"
        />
      </div>
    </div>
    <roleManageModal 
    v-bind="$attrs" 
    v-model:visible="modalVisible" 
    :modalData="modalData"
    @roleManageHandleOk="roleManageHandleOk"
    ></roleManageModal>
  </div>
</template>

<script lang="ts">
import { defineComponent,toRefs,nextTick,ref } from "vue";
import { Modal  } from 'ant-design-vue';  
import API from "@/api/manageData";
import { ElMessage } from 'element-plus';
import { roleManageModal } from "@/views/manageData/module/index";
import { 
  data,
  showData,
  exportData,
} from "./index";
export default defineComponent({
  components: {
    roleManageModal
  },
  setup() {
    const tableBox:any = ref(null);
    const offsetHeight = ref();
    nextTick(() => {
      offsetHeight.value = tableBox.value.offsetHeight;  // 减去表头高度
      getData();
    });

    const getData = async () => {
      data.tableLoading = true;
      const info = {
        roleName: data.search.roleName,
        status: data.search.status,
        pageSize: data.pagination.pageSize,
        pageNumber: data.pagination.current
      }
      const { obj, msg, flag} = await API.pageRole(info);
      data.tableData = obj.data;
      data.pagination.total = obj.total;
      data.tableLoading = false;
    }
    const roleManageHandleOk = () => {
      getData();
    }

    const currentChange = (page: number, pageSize: number) => {
      data.pagination.current = page;
      data.pagination.pageSize = pageSize;
      getData();
    };

    const deleteData = (record:any) => {
      Modal.confirm({
        title: '删除人员',
        content: '是否删除该用户（该操作不可逆）？',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
          try {
            const { msg, flag } = await API.deleteRole({roleId:record.roleId});
            if(flag !== 1){
              throw msg;
            }
            ElMessage.success('删除成功');
            getData();
          } catch (error) {
            ElMessage.error(error);
          }
        },
      });
    }

    const onSearch = () => {
      data.pagination.current = 1;
      getData();
    }
    return {
      onSearch,
      roleManageHandleOk,
      getData,
      tableBox,
      offsetHeight,
      showData,
      deleteData,
      exportData,
      currentChange,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
@import "../../../dataReport/module/css/index";
</style>
