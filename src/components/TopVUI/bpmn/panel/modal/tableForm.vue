<!--
 * @Description: 外置表单
 * @Author: 黄婷
 * @Date: 2021-03-05 17:49:41
 * @LastEditTime: 2021-09-02 17:31:54
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\panel\modal\tableForm.vue
-->
<template>
  <div class="tableForm-1249">
    <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
      <div class="table-operator">
        <a-button
          class="cu-btn-success text-xxs"
          icon="plus"
          size="small"
          @click="handleAdd"
          >新增</a-button
        >
        <a-button
          class="cu-btn-danger text-xxs"
          icon="delete"
          size="small"
          @click="handleSub"
          >删除</a-button
        >
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      :rowKey="(record, index) => record.tableName"
      class="components-table-demo-nested"
      size="small"
      :pagination="{ hideOnSinglePage: true }"
      :rowSelection="rowSelection"
    >
      <div slot="expandedRowRender" slot-scope="record, index">
        <a-card class="l-card" title="批量全选" :bordered="false">
          <div slot="extra" href="#">
            <a slot="actions">
              <a-checkbox
                v-model="allStatus[index].allLook"
                @change="
                  (e) => {
                    onChangeEditAll(e.target.checked, 0, index);
                  }
                "
              >
                可读
              </a-checkbox></a
            >
            <!-- <a-divider type="vertical" /> -->
            <a slot="actions">
              <a-checkbox
                v-model="allStatus[index].allEdit"
                :disabled="!allStatus[index].allDisabled"
                @change="
                  (e) => {
                    onChangeEditAll(e.target.checked, 1, index);
                  }
                "
              >
                可写
              </a-checkbox></a
            >
          </div>
          <a-list
            class="demo-loadmore-list"
            :data-source="record.list"
            :rowKey="(item) => item.filed"
            size="small"
          >
            <a-list-item slot="renderItem" slot-scope="item">
              <a slot="actions">
                <a-checkbox
                  v-model="item.isLook"
                  @change="onChangeEdit(item, 0, index)"
                >
                  可读
                </a-checkbox></a
              >
              <a slot="actions">
                <a-checkbox
                  v-model="item.isEdit"
                  :disabled="!item.isLook"
                  @change="onChangeEdit(item, 1, index)"
                >
                  可写
                </a-checkbox></a
              >
              <div
                class="margin-left-sm"
                style="height: 20px;overflow: hidden;"
              >
                <a-tooltip
                  effect="dark"
                  :title="item.filedName"
                  placement="bottom"
                >
                  <ellipsis :length="15">{{ item.filedName }}</ellipsis>
                </a-tooltip>
              </div>
            </a-list-item>
          </a-list>
        </a-card>
      </div>
    </a-table>
    <form-module
      ref="tableForm"
      :visible="visibleTable"
      @cancel="tableHandleCancel"
      @ok="tableHandleOk"
    ></form-module>
  </div>
</template>
<script>
import formModule from "@/pages/form/formModule/formModule";
import { getFormColumns } from "@/utils/formatter";
import { Ellipsis } from "@/components";
import { randomUUID } from "@/utils/util";

const columns = [
  {
    title: "表单名称",
    dataIndex: "tableDesc",
    key: "tableDesc",
  },
  {
    title: "表名",
    dataIndex: "tableName",
    key: "tableName",
  },
  {
    title: "备注",
    dataIndex: "remark",
    key: "remark",
  },
];

export default {
  data() {
    return {
      data: [],
      columns,
      innerData: [],
      visibleTable: false,
      drawingList: [],
      formFieldList: [],
      allLook: false,
      allEdit: false,
      allDisabled: false,
      allStatus: [],
      selectedRowKeys: [],
    };
  },
  components: { formModule, Ellipsis },
  props: {
    nodeElement: {
      type: Object,
      required: true,
    },
    modeler: {
      type: Object,
      required: true,
    },
    formData: {
      type: Object,
      // required: true,
    },
    updateList: {
      type: Array,
    },
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
  watch: {
    // 监听元素变化
    nodeElement: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal.type == "bpmn:UserTask") {
          this.data = [];
          let dataArr = [];
          const bpmnModeler = this.modeler;
          const modeling = bpmnModeler.get("modeling");
          const businessObject = newVal.businessObject;
          let list = businessObject?.extensionElements?.get("values") ?? [];
          if (list.length > 0) {
            list.forEach((e) => {
              if (e.$type === "flowable:FormProperty") {
                e.isLook = JSON.parse(e.isLook);
                e.isEdit = JSON.parse(e.isEdit);
                // delete e["id"];
                delete e["modalKey"];
                dataArr.push(e);
              }
            });
          }
          // 数组拆分重组
          dataArr.map((mapItem) => {
            if (this.data.length == 0) {
              this.data.push({
                tableName: mapItem.tableName,
                tableDesc: mapItem.tableDesc,
                remark: mapItem.tableForm,
                list: [mapItem],
              });
              this.allStatus.push({
                allLook: false,
                allEdit: false,
                allDisabled: false,
              });
            } else {
              let res = this.data.some((item) => {
                //判断相同表名，有就添加到当前项
                if (item.tableName === mapItem.tableName) {
                  item.list.push(mapItem);
                  return true;
                }
              });
              if (!res) {
                //如果没找相同表名添加一个新对象
                dataArr.push({
                  tableName: mapItem.tableName,
                  tableDesc: mapItem.tableDesc,
                  remark: mapItem.tableForm,
                  list: [mapItem],
                });
                this.allStatus.push({
                  allLook: false,
                  allEdit: false,
                  allDisabled: false,
                });
              }
            }
          });
          this.data.forEach((e, index) => {
            this.getStatus(e.list, index);
          });
        }
      },
    },
  },
  methods: {
    // 勾选
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleAdd() {
      this.visibleTable = true;
    },
    handleEdit() {},
    // 删除
    handleSub() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning("请选择需要删除的数据");
      } else {
        this.selectedRowKeys.forEach((e) => {
          for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].tableName == e) {
              this.data.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
              i--; // 如果不减，将漏掉一个元素
            }
          }
        });
        this.selectedRowKeys = [];
        this.updateFormListByElment(this.data);
      }
    },
    tableHandleCancel() {
      this.visibleTable = false;
    },
    tableHandleOk(e) {
      this.data.push({
        tableName: e.tableName,
        tableDesc: e.tableDesc,
        remark: e.remark,
      });
      this.$post("/form/formFieldJson/getDetailByTableName", {
        tableName: e.tableName,
      }).then((res) => {
        this.innerData = [];
        this.drawingList = JSON.parse(res.fieldJson);
        this.drawingList?.list.forEach((e, index) => {
          getFormColumns(e, this.innerData);
          console.log(this.innerData);
          let dataIndex = this.data.length - 1;
          // this.innerData.forEach((c) => {
          //   c.isEdit = false;
          //   c.isLook = false;
          // });
          this.allStatus.push({
            allLook: false,
            allEdit: false,
            allDisabled: false,
          });
          this.data[dataIndex].list = this.innerData;
          this.updateFormListByElment(this.data);
        });
      });
      this.visibleTable = false;
    },
    // 更新
    updateFormListByElment(list) {
      console.log(list);
      let businessObject = this.nodeElement.businessObject;
      this.extensionElements =
        businessObject.extensionElements ||
        this.modeler
          .get("moddle")
          .create("bpmn:ExtensionElements", { values: [] });
      let extensionElementsList = this.extensionElements.get("values");
      for (var i = 0; i < extensionElementsList.length; i++) {
        if (
          extensionElementsList[i].$type.indexOf("flowable:FormProperty") === 0
        ) {
          extensionElementsList.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
          i--; // 如果不减，将漏掉一个元素
        }
      }
      list.forEach((m) => {
        m.list.forEach((e) => {
          // e.tableForm = m.remark;
          // e.tableDesc = m.tableDesc;
          // e.tableName = m.tableName;
          // // e["$attrs"] = {};
          // delete e["$attrs"];
          // console.log(e);
          let formProperty = this.modeler
            .get("moddle")
            .create("flowable:FormProperty");

          formProperty["tableForm"] = m.remark;
          formProperty["tableDesc"] = m.tableDesc;
          formProperty["tableName"] = m.tableName;
          formProperty["filed"] = e.filed;
          formProperty["filedName"] = e.filedName;
          formProperty["isEdit"] = e.isEdit;
          formProperty["isLook"] = e.isLook;

          this.extensionElements.get("values").push(formProperty);
          this.updateProperties({
            extensionElements: this.extensionElements,
          });
        });
      });
      console.log(businessObject);
    },
    // 获取编辑、查看
    getStatus(list, index) {
      // console.log(list)
      const flagLook = list.some((item) => {
        return item.isLook === false;
      });
      const flagEdit = list.some((item) => {
        return item.isEdit === false;
      });
      console.log(flagEdit);
      if (flagLook) {
        this.allStatus[index].allLook = false;
        this.allStatus[index].allDisabled = false;
      } else {
        this.allStatus[index].allLook = true;
        this.allStatus[index].allDisabled = true;
      }
      if (flagEdit) {
        this.allStatus[index].allEdit = false;
      } else {
        this.allStatus[index].allEdit = true;
      }
    },
    // 全选
    onChangeEditAll(data, type, index) {
      this.data[index].list.forEach((e) => {
        if (data && type === 0)
          (e.isLook = true), this.getStatus(this.data[index].list, index);
        if (data && type === 1) e.isEdit = true;
        if (!data && type === 0)
          (e.isLook = false),
            (e.isEdit = false),
            this.getStatus(this.data[index].list, index);
        if (!data && type === 1) e.isEdit = false;
      });
      console.log(this.innerData);
      // this.updateProperties({
      //   formFieldList: JSON.stringify(this.innerData)
      // });
      this.updateFormListByElment(this.data);
    },
    // 编辑查看设置
    onChangeEdit(data, type, index) {
      if (type === 1 && data.isEdit) {
        data.isLook = true;
      }
      let formFieldList = this.data[index].list;
      // this.updateProperties({
      //   formFieldList: JSON.stringify(formFieldList)
      // })
      this.updateFormListByElment(this.data);
      this.getStatus(formFieldList, index);
    },
    // 更新流程属性
    updateProperties(properties) {
      this.modeler
        .get("modeling")
        .updateProperties(this.nodeElement, properties);
    },
    expand(expanded, record) {
      console.log(expanded, record);
    },
    getRowKey() {
      let uuid = randomUUID();
      return uuid;
    },
  },
};
</script>
<style scoped="scoped">
/deep/.ant-list-item-action {
  margin-left: 0;
}
</style>
<style lang="less">
.tableForm-1249 {
  .ant-card-head,
  .ant-card-head-title {
    font-size: 14px !important;
    padding: 0;
  }
  .ant-card .ant-card-body,
  .ant-list-item-action > li {
    padding: 0 !important;
  }
  .ant-card-head-title {
    margin-left: 20px !important;
  }
  .ant-card-head {
    min-height: 42px !important;
  }
}
</style>
