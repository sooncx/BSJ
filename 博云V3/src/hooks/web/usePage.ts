import type { RouteLocationRaw } from 'vue-router';

import { useRouter } from 'vue-router';
import { isString } from '@/utils/is';

function handleError(e: Error) {
  console.error(e);
}

// 路由切换
export function useGo() {
  const { push, replace } = useRouter();
  function go(opt: RouteLocationRaw | string, isReplace = false) {
    if (isString(opt)) {
      isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
    } else {
      const o = opt as RouteLocationRaw;
      isReplace ? replace(o).catch(handleError) : push(o).catch(handleError);
    }
  }
  return go;
}
