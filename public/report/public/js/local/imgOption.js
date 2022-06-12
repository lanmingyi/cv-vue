
function concat (prop, count, type, extend = [], defaults) {
  let list = [];
  for (let i = 1; i <= count; i++) {
    list.push({
      label: prop + i,
      value: `./report/public/img/${prop}/${prop}${i}.${extend.includes(i) ? defaults : type}`
    })
  }
  return list;
}
var imgTabs = [{
  title: '背景'
}, {
  title: '边框'
}, {
  title: '素材'
}, {
  title: '其他'
}]
var imgOption = [
  concat('bg', 38, 'png', [5,13,28,32,33,34,35,36,37,38,39], 'jpg'),
  concat('border', 67, 'png'),
  concat('source', 253, 'svg', [1,2, 15, 16, 20,121,122,123,124,125,126,127,128,129,239.240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252], 'png'),
  concat('banner', 14, 'png'),
]