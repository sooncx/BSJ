<template>
  <div>
    <template v-for="item in list">
      <tr :key="item.id">
        <td style="border: 1px solid #ddd; padding: 3px 10px">
          <span
            v-if="childFlag"
            :style="{ marginLeft: (index - 1) * 20 + 'px' }"
            >├─</span
          >{{ item.name }}
        </td>
        <td style="border: 1px solid #ddd; padding: 3px 10px">
          {{ item.type }}
        </td>
        <td style="border: 1px solid #ddd; padding: 3px 10px">
          <p style="width: 90px; text-align: center">
            {{ item.required == "1" ? "是" : "否" }}
          </p>
        </td>
        <td style="border: 1px solid #ddd; padding: 3px 10px">
          {{ item.default }}
        </td>
        <td style="border: 1px solid #ddd; padding: 3px 10px">
          {{ item.remark }}
        </td>
      </tr>
      <tr-list
        :key="item.id + 'children'"
        v-if="item.children && item.children.length !== 0"
        :list="item.children"
        :childFlag="true"
        :index="index + 1"
      ></tr-list>
    </template>
  </div>
</template>
<script>
export default {
  name: "trList",
  props: {
    list: Array,
    childFlag: {
      type: Boolean,
      defalut: false,
    },
    index: Number,
  },
};
</script>
