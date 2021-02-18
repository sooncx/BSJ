<template funtional>
  <div class="DynamicArea">
    <div class="DynamicArea__item DynamicArea__item_one"></div>
    <div class="DynamicArea__item DynamicArea__item_two"></div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes posterDrop1 {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 30000% 0;
  }
}

@keyframes posterDrop2 {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 4000% 0;
  }
}

.DynamicArea {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  background-size: 100% 100%;
  background-image: url("../../assets/img/home/beijing.png");

  &__item {
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: repeat-x;
    background-position: 0 0;

    &_one {
      background-image: url("../../assets/img/home/poster-drop-animate1.png");
      animation: posterDrop1 7000s linear infinite;
    }

    &_two {
      background-image: url("../../assets/img/home/poster-drop-animate2.png");
      animation: posterDrop2 1000s linear infinite;
    }
  }
}
</style>
