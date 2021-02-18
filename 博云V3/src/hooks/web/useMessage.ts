import { ElMessage } from 'element-plus';

let messageInstance: any = null;
export function useMessage() {

  function success(options: string) {
    if (messageInstance) {
      messageInstance.close();
    }
    messageInstance = ElMessage.success(options);
  }

  function error(options: string) {
    if (messageInstance) {
      messageInstance.close();
    }
    messageInstance = ElMessage.error(options);
  }

  function warning(options: string) {
    if (messageInstance) {
      messageInstance.close();
    }
    messageInstance = ElMessage.warning(options);

  }

  function info(options: string) {
    if (messageInstance) {
      messageInstance.close();
    }
    messageInstance = ElMessage.info(options);
  }

  return {
    success,
    error,
    warning,
    info
  }
}
