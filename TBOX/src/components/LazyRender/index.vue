<script>
export default {
  props: {
    delay: {
      type: Number,
      default: 10
    }
  },

  data() {
    return {
      isRender: false
    };
  },

  render() {
    if (!this.isRender) return;
    return this.$slots.default.length ? (
      <div>{this.$slots.default}</div>
    ) : (
      this.$slots.default
    );
  },

  mounted() {
    setTimeout(() => (this.isRender = true), this.delay);
  }
};
</script>
