<template>
  <el-select
    class="QueryVehOrGroup"
    v-model="activeIndex"
    filterable
    remote
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="print"
    :size="size"
  >
    <i
      class="QueryVehOrGroup__icon el-icon-search"
      slot="prefix"
    />
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="item.label"
      :value="index"
      class="QueryVehOrGroup__option"
    >
      <span
        class="QueryVehOrGroup__label"
        :title="item.label"
      >{{ item.label }}</span>
      <span
        class="QueryVehOrGroup__desc"
        :title="item.desc"
      >{{ item.desc }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { mapState } from "vuex";
import { throttle } from "@/assets/js/base";

export default {
  props: {
    value: [Object, Number],
    size: {
      type: String,
      default: "small"
    },
    showGroup: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      options: [],
      loading: false,
      activeIndex: null,
      checkTypeObj: {
        1: { key: "plate", desc: "车牌号" },
        2: { key: "sim", desc: "SIM卡" },
        3: { key: "equipmentNumber", desc: "终端号" }
      }
    };
  },

  computed: {
    ...mapState(["GROUPLIST"]),
    list() {
      if (!this.showGroup) return [];
      const groupList = this.GROUPLIST.map(item => ({
        label: item.organizationName,
        value: { ...item },
        desc: "车组名"
      }));

      return groupList;
    }
  },

  watch: {
    value: {
      handler(val) {
        if (!val) {
          this.activeIndex = null;
          return;
        }
        let label;
        if (val.vehicleId !== undefined) {
          label =
            val.checkType === undefined
              ? val.plate
              : val[this.checkTypeObj[val.checkType].key];
        } else {
          label = val.organizationName;
        }
        this.activeIndex = label;
      },
      immediate: true
    }
  },

  methods: {
    print(i) {
      console.log(i, this.options[i]);
      this.$emit("input", this.options[i].value);
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        throttle(async () => {
          const groups = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
          const vehs = await this.getVehs(query);
          this.options = [...groups, ...vehs];
          this.loading = false;
        }, 100);
      } else {
        this.options = [];
      }
    },
    async getVehs(query) {
      const { data } = await this.$API.getVehiclesMonitoringByString({
        string: query
      });

      return data.map(item => {
        const { key, desc } = this.checkTypeObj[item.checkType];
        return {
          label: item[key],
          value: { ...item },
          desc
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.QueryVehOrGroup {
  &__icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
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
}
</style>
