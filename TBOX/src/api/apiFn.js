import QS from "qs";
import GPS from "@/assets/js/GPS";
import axios from "./apiConfig";
import baseURL from "./baseURL";
import store from "@/store";

const handleApiFn = data => {
  if (data.code === undefined) {
    return Promise.resolve(data);
  }

  if (data.code === 0) {
    return Promise.resolve(data);
  } else {
    return Promise.reject(data);
  }
};

const handleReject = ({ data, status } = {}) => {
  const msg = data ? data.msg : status ? status : "网络异常";
  return Promise.reject({ msg });
};

export async function GET(url, params) {
  try {
    const { data } = await axios.get(url, { params });
    return handleApiFn(data);
  } catch (err) {
    return handleReject(err);
  }
}

export async function POST(url, params) {
  try {
    const { data } = await axios.post(url, QS.stringify(params));
    return handleApiFn(data);
  } catch (err) {
    return handleReject(err);
  }
}

// 处理POSTbody序列化传参
export async function POSTBody(url, params) {
  try {
    const { data } = await axios({
      url,
      data: params,
      method: "post",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return handleApiFn(data);
  } catch (err) {
    return handleReject(err);
  }
}

export async function FORM(url, params) {
  try {
    const { data } = await axios({
      url,
      data: params,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return handleApiFn(data);
  } catch (err) {
    return handleReject(err);
  }
}

export async function JSONP(url, params) {
  try {
    const { data } = await axios({
      adapter: "jsonp",
      url: url,
      params: params,
      callbackName: "JsonCallBack",
      method: "get"
    });
    return handleApiFn(data);
  } catch (err) {
    return handleReject(err);
  }
}

/**
 * @desc   下载文件
 * @param  {String} baseUrl
 * @param  {Object} params
 */
export function exportFile(json, params) {
  //处理json
  if (json[0] === "/") {
    let jsonArr = [...json];
    jsonArr.shift();
    json = jsonArr.join("");
  }
  params.sessionId = store.state.USER.sessionId;
  //处理参数
  const arr = Object.entries(params).map(([key, val]) => `${key}=${val}`);
  const baseUrl = process.env.NODE_ENV === "development" ? baseURL : "/";
  const url = baseUrl + json + "?" + arr.join("&");
  console.log(url);

  window.open(url, "_self");
}

/**
 * @desc 将请求数组切割成50一份 分批获取地址
 * @param {Array} list
 * @return {addressList}
 */

export async function GetGeo(LocationList) {
  const _LocationList = LocationList.map((item, index) => {
    const gps = GPS.gcj_encrypt(item.lat, item.lon);
    gps.tag = item.tag === undefined ? index : item.tag;
    return gps;
  });

  let points = []; //数组切割成50一组的数组
  for (let i = 0; i < _LocationList.length; i += 50) {
    points.push(_LocationList.slice(i, i + 50));
  }

  let addressList = [];
  for (let i = 0; i < points.length; i++) {
    const _addressList = await getLocal(points[i]);
    addressList = [...addressList, ..._addressList];
  }

  return addressList;
}

/**
 * @desc 获取地址 {lat,lon,tag}  经,纬,下标
 * @param {Array} list
 * @return {addressList}
 */
async function getLocal(posList) {
  try {
    const { obj } = await JSONP("http://120.76.69.92:8080/geo/GetGeo.json", {
      param: JSON.stringify({ posList })
    });

    if (obj != null && obj.length > 0) {
      let addressList = [];
      obj.map(item => {
        if (item.regeocode) {
          let address = "";
          if (item.regeocode.roads.length > 0) {
            let road = item.regeocode.roads[0];
            address = `${item.regeocode.formatted_address}(在${road.name}的${
              road.direction
            }方向约${parseInt(road.distance)}米)`;
          } else {
            address = item.regeocode.formatted_address;
          }

          addressList.push({
            address,
            tag: item.tag
          });
        } else {
          addressList.push({
            address: "获取位置失败",
            tag: item.tag
          });
        }
      });
      return Promise.resolve(
        addressList.map(item => ({
          ...item,
          address: item.address === "[]" ? "获取位置失败" : item.address,
          disabled: item.address === "[]" ? true : false
        }))
      );
    } else {
      const addressList = posList.map(item => ({
        ...item,
        address: "获取位置失败",
        disabled: true
      }));
      return Promise.resolve(addressList);
    }
  } catch (error) {
    console.error(error);
    const addressList = posList.map(item => ({
      ...item,
      address: "获取位置失败",
      disabled: true
    }));
    return Promise.resolve(addressList);
  }
}
