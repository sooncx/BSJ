import QS from "qs";
import GPS from "@/assets/js/GPS";
import axios from "./apiConfig";
import baseURL from "./baseURL";

const handleApiFn = data => {
  if (data.flag === undefined) {
    return Promise.resolve(data);
  }

  if (data.flag === 1) {
    return Promise.resolve(data);
  }

  return Promise.reject(data);
};

const handleReject = err => {
  console.log(err, "err");
  return Promise.reject(err.flag ? { msg: err.msg } : { msg: "网络异常" });
};

export async function GET(url, params) {
  try {
    const data = await axios.get(url, { params });
    return handleApiFn(data);
  } catch (err) {
    return handleReject(err);
  }
}

export async function POST(url, params) {
  try {
    const data = await axios.post(url, QS.stringify(params));
    return handleApiFn(data);
  } catch (err) {
    return handleReject(err);
  }
}

// 处理POSTbody序列化传参
export async function POSTBody(url, params) {
  try {
    const data = await axios({
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
    const data = await axios({
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
    const data = await axios({
      adapter: "jsonp",
      url,
      params,
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
  //  处理baseUrl
  const baseUrl = process.env.NODE_ENV === "development" ? baseURL : "/";
  const lastIndex = baseUrl.length - 1;
  const newBaseUrl = baseUrl[lastIndex] === "/" ? baseUrl.slice(0, lastIndex) : baseUrl;
  //  处理json
  const newJson = json[0] === "/" ? json.slice(1) : json;

  //  处理参数
  const arr = Object.entries(params).map(([key, val]) => `${key}=${val}`);

  //  生成url
  const url = `${newBaseUrl}/${newJson}?${arr.join("&")}`;

  window.open(url);
}

/**
 * @desc 将请求数组切割成50一份 分批获取地址
 * @param {Array} list
 * @return {Promise}
 */

export async function GetGeo(LocationList) {
  const newLocationList = LocationList.map((item, index) => {
    const gps = GPS.gcj_encrypt(item.lat, item.lon);
    gps.tag = item.tag === undefined ? index : item.tag;
    return gps;
  });

  const chunks = []; // 数组切割成50一组的数组
  for (let i = 0; i < newLocationList.length; i += 50) {
    chunks.push(newLocationList.slice(i, i + 50));
  }

  const result = await Promise.all(chunks.map(chunk => getLocal(chunk)));
  return result.flat();
}

/**
 * @desc 获取地址 {lat,lon,tag}  经,纬,下标
 * @param {Array} list
 * @return {Promise}
 */
async function getLocal(posList) {
  try {
    const { obj } = await JSONP("https://lbsserver.car900.com/geo/GetGeo.json", {
      param: JSON.stringify({ posList })
    });

    if (obj != null && obj.length > 0) {
      const addressList = obj.map(item => {
        if (item.regeocode) {
          let address = "";
          if (item.regeocode.roads.length > 0) {
            const road = item.regeocode.roads[0];
            address = `${item.regeocode.formatted_address}(在${road.name}的${
              road.direction
            }方向约${parseInt(road.distance)}米)`;
          } else {
            address = item.regeocode.formatted_address;
          }

          return {
            address: address === "[]" ? "获取位置失败" : address,
            tag: item.tag
          };
        }

        return {
          address: "获取位置失败",
          tag: item.tag
        };
      });

      return Promise.resolve(addressList);
    }

    const addressList = posList.map(item => ({ ...item, address: "获取位置失败" }));
    return Promise.resolve(addressList);
  } catch (error) {
    console.error(error);
    const addressList = posList.map(item => ({ ...item, address: "获取位置失败" }));
    return Promise.resolve(addressList);
  }
}
