class Dependency {
  constructor() {
    this.subscribers = new Set()
  }

  depend(global) {
    global && this.subscribers.add(global)
  }

  notify() {
    [...this.subscribers].map(fn => fn())
  }
}

class Vue {
  constructor() {
    this.global = null;
    this.dep = new Dependency();
  }

  convert(obj) {
    let _this = this;
    Object.keys(obj).map(key => {
      let internalVal = obj[key];

      Object.defineProperty(obj, key, {
        get() {
          _this.dep.depend(_this.global);
          return internalVal;
        },

        set(val) {
          internalVal = val;
          _this.dep.notify();
        }
      })
    })
  }

  watch(update) {
    this.global = update;
    update();
    this.global = null;
  }
}

let vm = new Vue();

let A = {
  a: 1
};
vm.convert(A);

let B = {
  b: 2
};
vm.convert(B);

vm.watch(() => {
  const c = A.a + B.b;
  console.log(c);
})
