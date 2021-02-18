const DEFAULT_CACHE_TIME = 60* 60 * 24 * 7;

function getKey(key: string) {
  return `${key}`.toUpperCase();
}

/**
 * 添加cookie
 * @param name cookie名字
 * @param value cookie内容
 * @param expire
 * 如果过期时间未设置,默认管理浏览器自动删除
 * 例子:
 *  cookieData.set('name','value',)
 */
export function setCookie (name: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) {
  document.cookie = getKey(name) + '=' + value + '; Max-Age=' + expire;
}

/**
 * 根据名字获取cooki值
 * @param name cookie名
 * @returns {*} cookie值
 */
export function getCookie(name: string) {
  const arr = document.cookie.split('; ');
  for (let i = 0; i < arr.length; i++) {
    const arr2 = arr[i].split('=');
    if (arr2[0] === getKey(name)) {
      return arr2[1];
    }
  }
  return '';
}

/**
 * 根据cookie名字删除cookie
 * @param name cookie名字
 */
export function removeCookie(key: string) {
  setCookie(key, 1, -1);
}

export function clearCookie(): void {
  const keys = document.cookie.match(/[^ =;]+(?==)/g);
  if (keys) {
    for (let i = keys.length; i--; ) {
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
    }
  }
}
