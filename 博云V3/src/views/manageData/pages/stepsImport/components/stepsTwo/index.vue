<template>
  <div class="steps">
    <p class="tip error"><ExclamationCircleFilled />不合规数据条{{errorNum}}</p>
    <div class="content">
      <div class="table">
        <a-table :columns="columns" :data-source="tableData" bordered :rowKey="record => record.id">
          <template v-for="col in ['plate', 'sim', 'terminalNo']" #[col]="{ text, record }">
            <div :key="col" class="editInput">
              <a-input
                v-if="record.editable"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChange(e.target.value, record.id, col)"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
          <template #terminalType="{ text, record }">
            <a-select v-if="record.editable" :value="text" @select="e => handleChange(e,record.id,'terminalType')">
              <a-select-option v-for="(item,index) in vehTypes" :key="item.type" :value="item.type" >
                {{item.typemap}}
              </a-select-option>
            </a-select>
            <template v-else>
                {{ text }}
              </template>
          </template>
          <template #remarkSlots="{text}">
            <span class="error">{{text}}</span>
          </template>
          <template #operation="{ text, record }">
            <div class="editable-row-operations">
              <span v-if="record.editable">
                <a-button  size="small" type="primary" @click="save(record.id)">
                  保存
                </a-button>
                <a-button size="small" type="primary" @click="cancel(record.id)">
                  取消
                </a-button>
              </span>
              <span v-else>
                <a-button 
                  size="small"
                  v-bind="editingKey !== '' ? { disabled: 'disabled' } : {}"
                  type="primary"
                  @click="edit(record.id)"
                >
                  修改
                </a-button>
              </span>
            </div>
          </template>
        </a-table>
      </div>
    </div>
    <div class="action">
      <a-button type="primary" @click="next">
        下一步
      </a-button>
      <!-- <a-button @click="back">
        上一步
      </a-button> -->
    </div>
  </div>
</template>
<script lang="ts">  
import columns from './columns';
import API from "@/api/manageData";
import { defineComponent,toRefs,PropType,watch,reactive } from "vue";
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import { ElMessage } from 'element-plus';
import { Modal  } from 'ant-design-vue'; 
import { useStore } from "vuex";
export default defineComponent({
  components: {
    ExclamationCircleFilled,
  },
  props:{
    // 上传成功返回数据集
    uploadData: {
      type: Object as PropType<any>,
      default: {
        data: <any>null
      }
    }
  },
  setup(props, {emit}) {
    const store = useStore();
    const data = reactive({
      tableData : <any>[],      // 表格数据
      errorNum: 0,              // 错误数量 
      rightNum: 0,              // 成功数量
      selectItem: <any>null,    // 选择数据
      columns,                  // 表格头部
      addUserVisible: false,    // 显示添加用户弹层  
      pagination :{             // 分页配置
        showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
        pageSize: 10,           // 分页数量
        total: 0,
        current:1,
      },
      editingKey: '',           // 正在编辑的key
      checkSave: false,         // 判断是否有未保存的数据
      cacheData: <any>[],       // 表格修改中间间
      vehTypes: store.state.vehTypes     // 获取所有终端选项
    });

    // 下一步
    const next = async () => {
      // 判断是否有正确的数据
      if(data.rightNum === 0){
        ElMessage.error('没有可提交的数据,请先处理...！');return false;
      }
      // 判断是否有错误数据
      if(data.errorNum !== 0){
        checkError();return;
      }
      emit('next');
    }

    // 上一步
    const back = () => {
      emit('back');
    }

    // 错误提醒对话框 
    const checkError = () => {
      Modal.confirm({
        title: '导入提交？',
        content: '重要提示：是否忽略不合法的数据进行下一步？！！！',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
          emit('next');
        },
      });
    }
    
    // 监听上传数据 返回数据集
    watch(()=>props.uploadData,(value:any)=>{
      data.errorNum = value.data.errorNum;
      data.rightNum = value.data.rightNum;
      data.tableData = [];
      data.cacheData = [];
      if(value.data.errorNum !== 0){
        data.tableData = value.data.errorData;
        data.cacheData = data.tableData.map((item:any) => ({ ...item }));
      }
    });
    
    // 输入框 改变事件
    const handleChange = (value:any, key:any, column:any) => {
      const newData = [...data.tableData];
      const target = newData.filter(item => key === item.id)[0];
      if (target) {
        target[column] = value;
        data.tableData = newData;
      }
    }

    // 修改功能 代码段来自官方例子
    const edit =(key:any) => {
      data.checkSave = true;
      const newData = [...data.tableData];
      const target = newData.filter(item => key === item.id)[0];
      data.editingKey = key;
      if (target) {
        target.editable = true;
        data.tableData = newData;
      }
    }

    // 保存功能  代码段来自官方例子
    const save = async (key:any) => {
      data.checkSave = false;
      const newData = [...data.tableData];
      const newCacheData = [...data.cacheData];
      let target = newData.filter(item => key === item.id)[0];
      const targetCache = newCacheData.filter(item => key === item.id)[0];
      if (target && targetCache) {
        // 将修改后的数据进行提交
        const { obj,flag } = await API.updateErrorImportVehicle([target]);
        if(flag === 1){
          //判断是否修复成功
          if(obj.data.errorNum === 0){
            data.checkSave = false;
            data.tableData = newData.filter(item => item.id !== key);
            data.errorNum = data.tableData.length;
            data.editingKey = '';
            //如果所有数据错误已解决 获取最新的数据
            if(data.errorNum === 0){
              const { obj } = await API.getImportVehicleData();          
              emit('updateUploadData',obj);
            }
            return false;
          }
          Object.assign(target,obj.data.errorData[0]);
        }
        delete target.editable;
        data.tableData = newData;
        Object.assign(targetCache, target);
        data.cacheData = newCacheData;
      }
      data.editingKey = '';
    }

    // 取消修改功能 代码段来自官方例子
    const cancel = (key:any) =>{
      data.checkSave = false;
      const newData = [...data.tableData];
      const target = newData.filter(item => key === item.id)[0];
      data.editingKey = '';
      if (target) {
        Object.assign(target, data.cacheData.filter((item:any) => key === item.id)[0]);
        delete target.editable;
        data.tableData = newData;
      }
    }
    return {
      edit,
      next,
      cancel,
      save,
      handleChange,
      back,
      ...toRefs(data)
    };
  },
});
</script>
<style lang="less" scoped>
@import "./index.less";
</style>