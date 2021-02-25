/**
 * @desc   转化树形图
 * @param  {data, attributes}
 * @return {Array}
 */
export function toTreeData(data: any, attributes: any) {
  const dataCopy:any = JSON.parse(JSON.stringify(data));
  if(!dataCopy) return [];
  // toTree
  const map = new Map(dataCopy.map((item:any) => [item[attributes.id], item]));
  const treeData:any[] = [];
  dataCopy.map((item:any) => {
    const parent:any = map.get(item[attributes.parentId]);
    if (parent) {
      (parent.children || (parent.children = [])).push(item); // parent 引用 item
    } else {
      treeData.push(item);
    }
  });
  return treeData;
}

let dataList:any[] = []; 
// 将树形节点改为一维数组
export function generateList(data:any[],idAndTitleKey:any){
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const title = node[idAndTitleKey.title];
    const key = node[idAndTitleKey.key];
    dataList.push({ key, title: title });
    if (node.children) {
      generateList(node.children,idAndTitleKey);
    }
  }
  return dataList;
}

export function getgvids (data:any[]) {
  const groupIdAndVehicledId = data.map(({groupId,vehicleId}) => ({
    gvids: groupId + ',' + vehicleId
  }));
  let gvids = '';
  groupIdAndVehicledId.forEach((item:any) => {
    gvids += item.gvids + ';'
  });
  return gvids.substring(0,gvids.length-1);
}

export function getParentKey(key: any, tree: any,replaceFields: any):any{
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item:any) => item[replaceFields.key] === key)) {
          parentKey = node[replaceFields.key] === undefined ? null : node[replaceFields.key];
        } else if (getParentKey(key, node.children,replaceFields)) {
          parentKey = getParentKey(key, node.children, replaceFields);
        }
      }
  }
  return parentKey;
}

// 返回用户对应类型
export function getAccountType(type:number):string {
  let str = '';
  switch(type){
    case 1:
      str = '代理监控';
      break;
    case 2:
      str = '管理员';
      break;
    case 3:
      str = '我的客户';
      break;
    case 4:
      str = '监控客户';
      break;
  }
  return str;
}

// nodes就是树形的最原始数据，query就是关键字，最后会返回满足条件的节点数组
export function filter(nodes:any, query:string,replaceFields: any) {
  // 条件就是节点的title过滤关键字
  let predicate = function (node:any) {
      if (node[replaceFields.title].indexOf(query) > -1) {
          return true;
      } else {
          return false;
      }
  };
  if (!(nodes && nodes.length)) {
      return [];
  }
  let newChildren = [];
  for (let node of nodes) {
      // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
      // 1. 子孙节点中存在符合条件的，即 subs 数组中有值
      // 2. 自己本身符合条件
      let subs = filter(node.children, query, replaceFields);
      if (predicate(node)) {
        newChildren.push(node);
      } else if (subs && subs.length) {
        node.children = subs;
        newChildren.push(node);
      }
  }
  return newChildren.length ? newChildren : [];
}
