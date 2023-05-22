export function objectToJson(obj) {
  if (obj == undefined || obj == "" || obj == null) {
    return {};
  }
  const keysList = Reflect.ownKeys(obj);
  const valuesList = Object.values(obj);
  const datas = {};
  keysList.forEach((values, index) => {
    return (datas[values] = valuesList[index]);
  });
  return datas;
}

export function objectToArray(obj) {
  if (obj == undefined || obj == "" || obj == null) {
    return [];
  }
  const keysList = Reflect.ownKeys(obj);
  const valuesList = Object.values(obj);
  const datas = [];
  keysList.forEach((values, index) => {
    return datas.push({ values: valuesList[index] });
  });
  return datas;
}
