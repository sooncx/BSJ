/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @desc   转化树形图
 * @param  {data, attributes}
 * @return {Array}
 */
export function toTreeData(data, attributes) {
  const dataCopy = JSON.parse(JSON.stringify(data));
  //toTree
  const map = new Map(dataCopy.map(item => [item[attributes.id], item]));
  let treeData = [];
  dataCopy.map(item => {
    let parent = map.get(item[attributes.parentId]);
    if (parent) {
      (parent.children || (parent.children = [])).push(item); // parent 引用 item
    } else {
      treeData.push(item);
    }
  });
  return treeData;
}

//防抖
export const debounce = (function(immediate) {
  let timer = null;

  return function(fn, wait) {
    let args = arguments;
    let context = this;

    if (immediate && !timer) {
      fn.apply(context, args);
    }

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
})();

// 节流
export const throttle = (function(immediate) {
  let timer = null;
  let callNow = immediate;

  return function(fn, wait) {
    let context = this,
      args = arguments;

    if (callNow) {
      fn.apply(context, args);
      callNow = false;
    }

    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
        timer = null;
      }, wait);
    }
  };
})();

//获取地图车辆图标
export function getCarIcon({ state = 0, vehicleType = 0 } = {}) {
  const statusObj = {
    0: "online", //行驶
    1: "offline", //离线
    2: "offline", //从未在线
    3: "online", //静止
    4: "offline" //休眠
  };

  const status = statusObj[state];

  const typeObj = {
    0: "truck", //其他
    1: "truck", //货车
    2: "bus", //客车
    3: "bus", //公交车
    4: "bus", //旅游大巴
    5: "SanitationTruck", //环卫车
    6: "PostalCar", //邮政车
    7: "MuckTruck", //渣土车
    8: "bus" //校车
  };

  const type = typeObj[vehicleType];

  return require(`@/assets/img/carIcon/${type}_${status}.png`);
}

//判断一个元素是否在可视区域
export function isElementInViewport(el) {
  if (!el) return false;
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
