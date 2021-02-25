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
    <!-- 角色表单 -->
    <roleManageModal 
    v-bind="$attrs" 
    v-model:visible="modalVisible" 
    :roleInfo="roleInfo"
    @roleManageHandleOk="roleManageHandleOk"
    ></roleManageModal>
  </div>
</template>

<script lang="ts">
import { defineComponent,toRefs,nextTick,ref,reactive } from "vue";
import { Modal  } from 'ant-design-vue';  
import API from "@/api/manageData";
import { ElMessage } from 'element-plus';
import { roleManageModal } from "@/views/manageData/module/index";
export default defineComponent({
  components: {
    roleManageModal
  },
  setup() {
    const data = reactive({
      search:{ roleName: '',status: 0 },
      tableData : <any>[],      //表格数据
      pagination :{             // 分页配置
        showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
        showSizeChanger: true,  // 是否允许选中 指定数量
        pageSize: 40,           // 分页数量
        total: 0,
        current:1,
        pageSizeOptions: ['40','60','80','100'], //指定数量
      },
      statusOptions: [
        { value: 0,label: '全部' },
        { value: 1,label: '使用' },
        { value: 2,label: '冻结' },
      ],
      modalVisible: false,
      roleInfo: null,
      tableLoading:false,
    });
    // 导出
    const exportData = () => {

    }
    // 查看
    const showData = (record:any) => {
      data.modalVisible = true,
      data.roleInfo = record;
    }

    const tableBox:any = ref(null);
    const offsetHeight = ref();
    nextTick(() => {
      offsetHeight.value = tableBox.value.offsetHeight;  // 减去表头高度
      getData();
    });
    // 获取数据
    const getData = async () => {
      data.tableLoading = true;
      const info = {
        roleName: data.search.roleName,
        status: data.search.status,
        pageSize: data.pagination.pageSize,
        pageNumber: data.pagination.current
      }
      try {
        const { obj, msg, flag} = await API.pageRole(info);
        if(flag !== 1) throw msg;
        data.tableData = obj.data;
        data.pagination.total = obj.total;
      } catch (error) {
        ElMessage.error(error);
      }
      data.tableLoading = false;
    }
    // 角色表单回调
    const roleManageHandleOk = () => {
      getData();
    }

    // 分页
    const currentChange = (page: number, pageSize: number) => {
      data.pagination.current = page;
      data.pagination.pageSize = pageSize;
      getData();
    };

    // 删除
    const deleteData = (record:any) => {
      Modal.confirm({
        title: '删除人员',
        content: '是否删除该用户（该操作不可逆）？',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
          try {
            const { msg, flag } = await API.deleteRole({roleId:record.roleId});
            if(flag !== 1) throw msg;
            ElMessage.success('删除成功');
            getData();
          } catch (error) {
            ElMessage.error(error);
          }
        },
      });
    }
    // 搜索功能
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
@import "../../../dataReport/module/css/index";
.content{
  height: 100%;
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction:column;
  .header{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 15px;
    &__left,&__right{
      display: flex;
      flex-wrap: wrap;
    }
    &__left button:first-child{
      margin-left: 0px;
    }
    input{
      width: 200px;
      margin-right:8px;
    }
    button{
      margin-left: 8px;
    }
  }
  .body{
    flex:1;
    display: flex;
    padding: 10px;
    flex-direction:column;
    &__table{
      flex:1;
      position: relative;
    }
    &__page{
      padding: 10px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

</style>
