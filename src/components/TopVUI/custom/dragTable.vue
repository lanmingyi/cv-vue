<!--
 * @Description: 表格的列拖拽
 * @Author: lmy
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-07-01 15:05:18
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <a-card>
    <s-table
      ref="table"
      :columns="columns"
      :data="loadData"
      bordered
      :pageSize="10"
      rowKey="uuid"
      showPagination="auto"
    >
    </s-table>
  </a-card>
</template>

<script>
import { STable } from "@/components";

const columns = [
  {
    title: "#",
    width: 50,
    align: "center",
    scopedSlots: {
      customRender: "serial",
    },
  },
  {
    title: "姓名",
    width: 100,
    dataIndex: "name",
    align: "center",
  },
  {
    title: "年龄",
    width: 100,
    dataIndex: "age",
    align: "center",
  },
  {
    title: "性别",
    width: 100,
    dataIndex: "sex",
    align: "center",
    scopedSlots: {
      customRender: "sex",
    },
  },
  {
    title: "生日",
    width: 100,
    dataIndex: "testDate",
    align: "center",
  },
  {
    title: "注册时间",
    width: 100,
    dataIndex: "testDatetime",
    align: "center",
  },
  {
    title: "排序",
    width: 100,
    dataIndex: "testCombobox",
    align: "center",
  },
  {
    title: "操作",
    width: 150,
    dataIndex: "action",
    align: "center",
    scopedSlots: {
      customRender: "action",
    },
  },
];

// const resizeableTitle =

export default {
  name: "App",
  components: { STable },
  data() {
    return {
      columns,
      url: {
        getPageSet: "/system/testDemo/getPageSet",
        save: "/system/testDemo/save",
        update: "/system/testDemo/update",
        deleteBatch: "/system/testDemo/deleteBatch",
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
    };
  },
};
</script>

<style lang="less"></style>
