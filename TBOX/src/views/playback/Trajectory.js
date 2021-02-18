export default class Trajectory {
  constructor({
    car,
    map,
    startMarker,
    endMarker,
    trackLine,
    passedLine,
    trackPath = [],
    speed = 500
  }) {
    const props = {
      car,
      map,
      startMarker, //开始点
      endMarker, //结束点
      trackLine, //轨迹样式
      passedLine, //经过样式
      trackPath, //轨迹
      speed
    };

    const state = {
      isPlay: false, //播放状态
      passedIndex: 0 //已经走过的轨迹trajectory index索引
    };

    Object.assign(this, props, state);

    this.car.on("moving", ({ passedPath }) => {
      this.passedLine.setPath([...this.trackPath.slice(0, this.passedIndex + 1), ...passedPath]);

      //出区域聚焦
      const position = passedPath[passedPath.length - 1];
      !Trajectory.IsContainPoint(position, map) && map.panTo(position);
    });

    this.car.on("moveend", () => {
      this.passedIndex < this.trackPath.length - 1 && this.passedIndex++;
      this.passedIndex < this.trackPath.length - 1 && this.play();
    });
  }

  setPath(path) {
    this.pause();

    const {
      startMarker, //开始点
      endMarker, //结束点
      trackLine, //轨迹样式
      passedLine, //经过样式
      car //轨迹
    } = this;

    const overlay = {
      startMarker, //开始点
      endMarker, //结束点
      trackLine, //轨迹样式
      passedLine, //经过样式
      car //轨迹
    };

    if (path.length) {
      startMarker.setPosition(path[0]);
      path.length > 1 && endMarker.setPosition(path[path.length - 1]);
      this.trackLine.setPath(path);
      this.trackPath = path;
      this.jumpTo(0);
      Object.values(overlay).map(item => item && item.show());
      this.map.setFitView();
    } else {
      Object.values(overlay).map(item => item && item.hide());
    }
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  jumpTo(passedIndex) {
    if (!this.trackPath.length) return;
    if (passedIndex > this.trackPath.length - 1) {
      console.error("该索引数值不在范围内");
      return;
    }

    this.car.stopMove();
    this.passedIndex = passedIndex;
    this.passedLine.setPath(this.trackPath.slice(0, this.passedIndex + 1));
    this.car.setPosition(this.trackPath[this.passedIndex]);

    //获取经过点与结束点的角度
    const startIndex =
      this.passedIndex === this.trackPath.length - 1 && this.passedIndex !== 0
        ? this.passedIndex - 1
        : this.passedIndex;
    const endIndex =
      this.passedIndex + 1 >= this.trackPath.length - 1
        ? this.trackPath.length - 1
        : this.passedIndex + 1;

    startIndex !== endIndex &&
      this.car.setAngle(
        Trajectory.TwoCoordinateAzimuth(this.trackPath[startIndex], this.trackPath[endIndex])
      );

    //如果正在播放继续播放
    this.isPlay && this.play();
  }

  play() {
    const startIndex = this.passedIndex;
    const endIndex = this.passedIndex + 1;
    const { trackPath, car, speed } = this;

    const distance = AMap.GeometryUtil.distance(trackPath[startIndex], trackPath[endIndex]);

    //距离小于1m时跳过该点
    if (distance <= 1) {
      this.passedIndex = endIndex;
      this.play();
    } else {
      //大于 1m 则播放
      car.setAngle(Trajectory.TwoCoordinateAzimuth(trackPath[startIndex], trackPath[endIndex]));
      car.moveTo(trackPath[endIndex], speed);
      this.isPlay = true; //通知播放开始
    }
  }

  pause() {
    this.isPlay = false;
    this.car.stopMove();
  }

  watch(key, callback) {
    let _this = this;
    let internalVal = _this[key];
    Object.defineProperty(this, key, {
      get() {
        return internalVal;
      },
      set(val) {
        if (val === internalVal) return;
        callback(val);
        internalVal = val;
      }
    });
  }

  // 出区域自动聚焦
  static IsContainPoint(position, map) {
    const doubleZoom = map.getZoom() * 2;
    let Bounds = map.getBounds();
    let SouthWest = Bounds.getSouthWest();
    let NorthEast = Bounds.getNorthEast();
    SouthWest = new AMap.LngLat(
      SouthWest.getLng() + 0.04 / doubleZoom,
      SouthWest.getLat() + 0.025 / doubleZoom
    );
    NorthEast = new AMap.LngLat(
      NorthEast.getLng() - 0.04 / doubleZoom,
      NorthEast.getLat() - 0.025 / doubleZoom
    );
    Bounds = new AMap.Bounds(SouthWest, NorthEast);
    return Bounds.contains(position);
  }

  //获取两点之间的角度
  static TwoCoordinateAzimuth(start, end) {
    let d = 0,
      lat_a = (start.lat * Math.PI) / 180,
      lng_a = (start.lng * Math.PI) / 180,
      lat_b = (end.lat * Math.PI) / 180,
      lng_b = (end.lng * Math.PI) / 180;

    d =
      Math.sin(lat_a) * Math.sin(lat_b) +
      Math.cos(lat_a) * Math.cos(lat_b) * Math.cos(lng_b - lng_a);
    d = Math.sqrt(1 - d * d);
    d = (Math.cos(lat_b) * Math.sin(lng_b - lng_a)) / d;
    d = (Math.asin(d) * 180) / Math.PI;
    d = d % 360;

    //判断在终点在第几象限
    const x = end.lng - start.lng,
      y = end.lat - start.lat;
    if (x < 0 && y > 0) {
      d = 360 + d;
    } else if (y < 0) {
      d = 180 - d;
    }

    d = d >= 0 ? d : 360 + d;
    return d;
  }
}
