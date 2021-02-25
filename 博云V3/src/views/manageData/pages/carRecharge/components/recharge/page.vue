<template>
  <div class="page">
    <div class="page__left">
      <a-button type="primary" v-permission="160404" @click="batchRecharge" v-if="renew === 0">批量续费</a-button>
      <a-button type="primary" v-permission="160404" @click="batchIntoNoRecharge">批量转入不续费</a-button>
      <a-button type="primary" v-permission="160408" @click="customNoRecharge(3)">自定义续费</a-button>
      <a-button type="primary" v-permission="160406" @click="customNoRecharge(1)">自定义不续费</a-button>
      <a-button type="primary" v-permission="160407" @click="customNoRecharge(2)">自定义不续费转出</a-button>
    </div>
    <div class="page__right">
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
</template>
<script lang="ts">
import { defineComponent, toRefs,reactive,watch,PropType  } from "vue";
export default defineComponent({
  components: {
  },
  props:{
    // 续费类型
    renew: {
      type: Number,
      default: 0
    },
    // 分页数据
    paginationData: {
      type: Object as PropType<any>,
      default:{
        pageSize:0,
        total:0,
        current:0
      }
    }
  },
  setup(props,{emit}){
    const data = reactive({
      pagination :{                                        // 分页配置
        showTotal: (total:string) => `共 ${total} 条数据`,  // 显示总数
        showSizeChanger: true,                             // 是否允许选中 指定数量
        pageSize: props.paginationData.pageSize,           // 分页数量
        total: props.paginationData.total,
        current: props.paginationData.current,
        pageSizeOptions: ['40','60','80','100'],           // 指定数量
      },
    });

    // 监听分页改变
    watch(()=>props.paginationData.total, () => {
      data.pagination.total = props.paginationData.total;
      data.pagination.pageSize = props.paginationData.pageSize;
      data.pagination.current = props.paginationData.current;
    });

    // 自定义 功能整合
    const customNoRecharge = (type:number) => {
      emit('customNoRecharge', type);
    }

    // 分页事件
    const currentChange = (page: number, pageSize: number) => {
      emit('currentChange', page, pageSize);
    }

    // 批量续费 
    const batchRecharge = () => {
      emit('batchRecharge');
    }

    // 批量转入不续费
    const batchIntoNoRecharge = () => {
      emit('batchIntoNoRecharge');
    }
    return {
      batchRecharge,
      batchIntoNoRecharge,
      customNoRecharge,
      currentChange,
      ...toRefs(data)
    }
  }
})
</script>
<style lang="less" scoped>
@import "../../../../../dataReport/module/css/index";
.page{
  padding: 10px;
  display: flex;
  justify-content: space-between;
  &__left{
    button{
      margin-left: 8px;
    }
  }
  &__right{
    ul{
      line-height: 32px;
    }
  }
}
</style>