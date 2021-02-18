<template>
  <el-table :data="data" max-height="700px"  highlight-current-row ref="table">
    <el-table-column label="序号" prop="index"></el-table-column>
  </el-table>
</template>
<script>
export default {
  data() {
    return {
      data: [],
      timer: null,
      i: 0
    }
  },
  created() {
    const arr1 = new Array(109);
    for(var i=0;i<arr1.length;i++){
      this.data.push({
        index: i+1
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.timer = setInterval(() => {
        
        if (this.i === this.data.length) clearInterval(this.timer);

        // const row = this.setCurrentRow(this.i - 1);

        // this.i++;

        // row&&row.scrollIntoView();

        // this.$refs.table.$el.getElementsByClassName('el-table__row').forEach((item, index) => {
        //   item.classList.remove('current-row');
        //   console.log(index, this.i);
        //   if (index === this.i) {
        //     this.i++;
        //     item.classList.add('current-row');
        //     item.scrollIntoView();
        //   }
        // });

        const row = this.data.find(({ index }) => index === this.i); 

        this.$refs.table.setCurrentRow(row);

        this.i++;
        const actDom = this.$refs.table.$el.getElementsByClassName(
          "current-row"
        )[0];

        actDom && actDom.scrollIntoView();
      },500)
    });
  },
  methods: {
    setCurrentRow(i) {
      let element = null;
      this.$refs.table.$el.getElementsByClassName('el-table__row').forEach((item, index) => {
        item.classList.remove('current-row');
        if (i === index) {
          item.classList.add('current-row');
          element = item; 
        }
      })
      return element;
    }
  }
}

// import { defineComponent, nextTick, ref } from "vue";

// export default defineComponent({
//   setup() {
//     const data = ref<any[]>([]);

//     const arr1 = new Array(100);
//     for(var i=0;i<arr1.length;i++){
//       data.value.push({
//         index: i+1
//       });
//     }

//     const table = ref();
//     let timer: any = null;;
//     nextTick(() => {
//       let i = 0;
//       timer = setInterval(() => {
        
//         if (i === data.value.length) clearInterval(timer);
//         const row = data.value.find(({ index }) => index === i); 

//         table.value.setCurrentRow(row);

//         i++;
//         const actDom = (table.value as any).$el.getElementsByClassName(
//           "current-row"
//         )[0];

//         actDom && actDom.scrollIntoView();
//       }, 570 / 5)
//     })

//     return {
//       data,
//       table
//     }
//   }
// });
</script>
<style lang="less" scoped>
::v-deep(.el-table__body tr.current-row > td) {
  background-color: #0e60db;
  color: #fff;
}
</style>