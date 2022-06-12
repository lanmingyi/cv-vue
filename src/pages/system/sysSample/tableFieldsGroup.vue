<template>
  <a-table
    :columns="columns"
    :data-source="data"
    bordered
    size="middle"
    :scroll="{ x: 'calc(700px + 50%)', y: 240 }"
  />
</template>
<script>
const columns = [
  {
    title: '物资安全分类1',
    dataIndex: 'wuzianquanfenlei',
    key: 'wuzianquanfenlei',
    width: 100,
    fixed: 'left',
	children: [
	  {
	    title: '化学品/危货',
	    dataIndex: 'huaxue',
	    key: 'huaxue',
	    width: 200
	  },]
  },
  {
    title: '物料俗称',
	dataIndex: 'wuliaosucheng',
	fixed: 'left',
	width: 100
  },
  {
    title: '调度分类',
    children: [
      {
        title: '客户产品名',
        dataIndex: 'kehuchanpinming',
        key: 'kehuchanpinming',
        width: 200,
      },
      {
        title: '客户产品牌号',
        dataIndex: 'kehuchanpinpaihao',
        key: 'kehuchanpinpaihao',
		width: 260
      },
    ],
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    width: 80,
    fixed: 'right',
  },
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    wuzianquanfenlei: '物品分类',
    wuliaosucheng: '物料俗称',
    kehuchanpinming: '客户产品名',
    kehuchanpinpaihao: '客户品牌号',
  });
}

export default {
  data() {
    return {
      data,
      columns,
    };
  },
};
</script>
