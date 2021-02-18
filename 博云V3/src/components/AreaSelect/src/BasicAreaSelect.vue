<template>
  <Select
    :options="provinceList"
    v-model:value="province"
    placeholder="省"
    :style="{ width: '100px' }"
    @change="onChange($event, 'PROVINCE')"
    dropdownClassName="areaSelectDropDown"
  />
  <Select
    :options="cityList"
    v-model:value="city"
    placeholder="市"
    @change="onChange($event, 'CITY')"
    :style="{ width: '100px', marginLeft: '10px' }"
    dropdownClassName="areaSelectDropDown"
  />
  <Select
    :options="areaList"
    v-model:value="area"
    placeholder="区"
    :style="{ width: '100px', marginLeft: '10px' }"
    dropdownClassName="areaSelectDropDown"
  />
</template>
<script lang="ts">
import { nextTick, PropType, warn } from 'vue';

import { defineComponent, reactive, toRefs, watch, watchEffect } from "vue";
import { Select } from "ant-design-vue";
import APIType from '@/api/type';
import { ElementOf } from '@/utils';

import API from "@/api/httpApi";
interface State {
  provinceList: {
    label: string;
    value: string;
    key: number;
    list: ElementOf<APIType.getAreaBaseInfoRes['obj']['list']>['list']
  }[],
  cityList: {
    label: string;
    value: string;
    key: number;
    list: ElementOf<ElementOf<APIType.getAreaBaseInfoRes['obj']['list']>['list']>['list']
  }[],
  areaList: {
    label: string;
    value: string;
    key: number;
  }[],
}

interface valState {
  province: string | null,
  city: string | null,
  area: string | null,
}

interface resultType {
  province: {
    code: string;
    name: string;
  },
  city: {
    code: string;
    name: string;
  }, 
  area: {
    code: string;
    name: string;
  }, 
}

export default defineComponent({
  name: "BasicAreaSelect",
  components: { Select },
  props: {
    value: {
      type: Object as PropType<resultType>,
      default: null
    }
  },
  setup(props, { emit }) {
    enum TYPES {
      PROVINCE = 'PROVINCE',
      CITY = 'CITY',
    }
    
    // 省市区list
    const data = reactive<State>({
      provinceList: [],
      cityList: [],
      areaList: [],
    });

    // 省市区value
    const result = reactive<valState>({
      province: null,
      city: null,
      area: null,
    })

    // 获取省市区数据
    const getData = async () => {
      const { obj, flag } = await API.getAreaBaseInfo();
      console.log(obj);
      if (flag === 1) {
        data.provinceList = obj.list.map(item => ({
          label: item.name,
          value: item.code,
          key: item.id,
          list: item.list
        }));

        if ('province' in props.value) {
          result.province = props.value.province.code;
          const index = data.provinceList.findIndex((item => item.value === props.value.province.code));
          data.cityList = data.provinceList[index].list.map(item => ({
            label: item.name,
            value: item.code,
            key: item.id,
            list: item.list || []
          }));
        }
        if ('city' in props.value) {
          const index = data.cityList.findIndex((item => item.value === props.value.city.code));
          data.areaList = data.cityList[index].list.map(item => ({
            label: item.name,
            value: item.code,
            key: item.id
          }));
          result.city = props.value.city.code;
        }
        if ('area' in props.value) {
          result.area = props.value.area.code;
        }
      }
    };

    // 省市区选择变化
    const onChange = (e: string, type: TYPES) => {
      if (type === TYPES.PROVINCE) {
        const index = data.provinceList.findIndex((item => item.value === e));
        data.cityList = data.provinceList[index].list.map(item => ({
          label: item.name,
          value: item.code,
          key: item.id,
          list: item.list || []
        }));
        if (data.cityList.length !== 0) {
          result.city = data.cityList[0].value;
          const cityIndex = data.cityList.findIndex((item => item.value === result.city));
          data.areaList = data.cityList[cityIndex].list.map(item => ({
            label: item.name,
            value: item.code,
            key: item.id
          }));
          result.area = data.areaList.length === 0 ? '' : data.areaList[0].value;
        } else {
          result.city = '';
          data.areaList = [];
          result.area = '';
        }
      } else if (type === TYPES.CITY) {
        const index = data.cityList.findIndex((item => item.value === e));
        data.areaList = data.cityList[index].list.map(item => ({
          label: item.name,
          value: item.code,
          key: item.id
        }));
        result.area = data.areaList.length === 0 ? '' : data.areaList[0].value;
      }
    }

    // 监听省市区value变化 回传给结果
    watch(result, (val) => {
      const obj = {
        province: {
          code: result.province,
          name: data.provinceList.filter(item => item.value === result.province)[0].label
        },
        city: {
          code: result.city,
          name: data.cityList.length === 0 ? '' : data.cityList.filter(item => item.value === result.city)[0].label
        },
        area: {
          code: result.area,
          name: data.areaList.length === 0 ? '' : data.areaList.filter(item => item.value === result.area)[0].label
        }
      }

      console.log(obj, 'emit:value')
      emit('update:value', obj);
    });

    nextTick(() => {
      getData();
    });

    return {
      ...toRefs(data),
      ...toRefs(result),
      onChange
    };
  },
});
</script>
<style lang="less">
.areaSelectDropDown {
  z-index: 9999;
}
</style>
