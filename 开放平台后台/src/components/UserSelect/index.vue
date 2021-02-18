<template>
  <el-select
    class="userSelect"
    v-model="searvhValue"
    :value="value"
    size="small"
    filterable
    remote
    style="width:250px"
    :clearable="true"
    reserve-keyword
    :placeholder="title"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="print"
    @clear="clear"
  >
    <i
      class="userSelect__icon el-icon-user"
      slot="prefix"
    />
    <el-option
      v-for="(item,index) in options"
      :key="index"
      :label="item.label"
      :value="index"
      class="userSelect__option"
    >
      <span
        class="userSelect__label"
        :title="item.label"
      >{{ item.label }}</span>
      <span
        class="userSelect__desc"
        :title="item.desc"
      >{{ item.desc }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { mapState } from "vuex";
import { throttle } from "@/assets/js/utils"; // 节流

export default {
  name: "UserSelect",
  props: {
    value: [Object, Number],
    title: {
      type: String,
      default: "请输入用户名"
    },
    showRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
      searvhValue: null,
      loading: false,
      test: []
    };
  },
  computed: {
    ...mapState(["USERLIST"]),
    list() {
      return this.USERLIST.map(item => ({
        label: item.username,
        value: { ...item },
        desc: "用户名"
      }));
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val === null) {
          this.searvhValue = null;
        }
      },
      deep: true
    }
  },
  mounted() {
    // this.list();
  },
  methods: {
    // list() {
    //   for (let i = 0; i < 20; i++) {
    //     this.test.push({
    //       name: ["name", i].join(""),
    //       userId: i
    //     });
    //   }
    //   this.test = this.test.map(item => ({
    //     label: item.name,
    //     value: { ...item },
    //     desc: "用户名"
    //   }));
    //   // if (!this.showRoot) {
    //   //   userList = userList.filter(item => {
    //   //     if (item) {
    //   //       return item.value.userId !== this.USER.userId;
    //   //     }
    //   //   });
    //   // }
    //   console.log(this.test, "test");
    // },
    // 弹窗显示/隐藏时触发
    showTaggle(data) {
      if (data) {
        this.$emit("input", null);
        this.searvhValue = null;
      }
    },
    clear() {
      this.$emit("input", null);
    },
    print(i) {
      if (this.searvhValue === null || this.searvhValue === "") {
        this.$emit("input", null);
        return;
      }
      this.$emit("input", this.options[i].value);
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        throttle(async () => {
          this.options = this.list.filter(item => {
            if (item) {
              return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
          });
        });

        this.loading = false;
      } else {
        this.options = [];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.userSelect {
  &__icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
  }

  &__option {
    display: flex;
  }

  &__label {
    @include ellipsis();
    flex: 1;
  }

  &__desc {
    @include ellipsis();
    margin-left: 5px;
    flex: 1;
    color: #8492a6;
    font-size: 13px;
    text-align: right;
  }
  ::v-deep .el-input--small .el-input__inner {
    border-radius: 0;
  }
}
</style>
