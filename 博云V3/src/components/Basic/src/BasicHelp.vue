<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, computed, unref, h } from 'vue';

  import { Tooltip } from 'ant-design-vue';
  import { InfoCircleOutlined } from '@ant-design/icons-vue';

  import { getPopupContainer } from '@/utils';
  import { isString, isArray } from '@/utils/is';
  import { getSlot } from '@/utils/helper/tsxHelper';

  export default defineComponent({
    name: 'BasicHelp',
    components: { Tooltip },
    props: {
      // 最大宽度
      maxWidth: {
        type: String as PropType<string>,
        default: '600px',
      },
      // 是否显示序列号
      showIndex: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      // 文本列表
      text: {
        type: [Array, String] as PropType<string[] | string>,
      },
      // 颜色
      color: {
        type: String as PropType<string>,
        default: '#ffffff',
      },
      fontSize: {
        type: String as PropType<string>,
        default: '14px',
      },
      absolute: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      // 定位
      position: {
        type: [Object] as PropType<any>,
        default: () => ({
          position: 'absolute',
          left: 0,
          bottom: 0,
        }),
      },
    },
    setup(props, { slots }) {
      const getOverlayStyleRef = computed(() => {
        return {
          maxWidth: props.maxWidth,
        };
      });

      const getWrapStyleRef = computed(() => {
        return {
          color: props.color,
          fontSize: props.fontSize,
        };
      });

      const getMainStyleRef = computed(() => {
        return props.absolute ? props.position : {};
      });

      /**
       * @description: 渲染内容
       */
      const renderTitle = () => {
        const list = props.text;
        if (isString(list)) {
          return h('p', list);
        }
        if (isArray(list)) {
          return list.map((item, index) => {
            return h('p', { key: item }, [props.showIndex ? `${index + 1}. ` : '', item]);
          });
        }
        return null;
      }

      return () => {
        return h(
          Tooltip,
          {
            title: h(
              'div',
              {
                style: unref(getWrapStyleRef),
              },
              [renderTitle()]
            ) as any,
            overlayClassName: 'base-help__wrap',
            autoAdjustOverflow: true,
            overlayStyle: unref(getOverlayStyleRef),
            placement: 'right',
            getPopupContainer: () => getPopupContainer(),
          },
          {
            default: () => 
              h(
                'span',
                {
                  class: 'base-help',
                  style: unref(getMainStyleRef)
                },
                getSlot(slots) || h(InfoCircleOutlined)
              )
          }
        );
      };
    }
  });
</script>
<style lang="less">
  .base-help {
    display: inline-block;
    margin-left: 6px;
    font-size: 14px;
    color: #666666;
    cursor: pointer;

    &:hover {
      color: #0E60DB;
    }

    &__wrap {
      p {
        margin-bottom: 0;
      }
    }
  }
</style>