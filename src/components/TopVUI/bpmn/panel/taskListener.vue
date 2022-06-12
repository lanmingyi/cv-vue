<!--
 * @Description: 任务监听器
 * @Author: 黄婷
 * @Date: 2021-06-11 15:58:13
 * @LastEditTime: 2021-09-16 10:32:40
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\panel\taskListener.vue
-->
<template>
  <div class="">
    <tool-bar>
      <template slot="toolBtn" slot-scope="scope">
        <a-button class="cu-btn-primary" icon="plus" @click="handleAdd()"
          >新增</a-button
        >
      </template>
    </tool-bar>
    <a-table
      :columns="columns"
      :dataSource="data"
      :pagination="false"
      bordered
      size="small"
    >
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDel(index)">删除</a>
        </span>
      </template>
      <a-table
        size="small"
        slot="expandedRowRender"
        slot-scope="record"
        :columns="innerColumns"
        :data-source="record.params"
        :pagination="false"
      ></a-table>
    </a-table>
    <event-listener-edit
      ref="eventListenerEdit"
      :visible.sync="visible"
      :model="mdl"
      @ok="handleOk"
    ></event-listener-edit>
  </div>
</template>

<script>
import eventListenerEdit from "./modal/eventListenerEdit";
const columns = [
  {
    title: "事件",
    dataIndex: "event",
    ellipsis: true,
  },
  {
    title: "类型",
    dataIndex: "type",
    ellipsis: true,
  },
  {
    title: "java类名",
    dataIndex: "className",
    ellipsis: true,
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    width: 100,
    scopedSlots: {
      customRender: "operation",
    },
  },
];

const innerColumns = [
  {
    title: "类型",
    dataIndex: "type",
    ellipsis: true,
  },
  {
    title: "名称",
    dataIndex: "name",
    ellipsis: true,
  },
  {
    title: "值",
    dataIndex: "value",
    ellipsis: true,
  },
];
export default {
  name: "eventListener",
  components: { eventListenerEdit },
  props: { modeler: { type: Object }, element: { type: Object } },
  data() {
    return {
      columns,
      data: [],
      mdl: null,
      visible: false,
      innerColumns,
    };
  },
  mounted() {
    // 获取任务监听器配置
    this.data =
      this.element.businessObject.extensionElements?.values
        .filter((item) => item.$type === "flowable:TaskListener")
        .map((item) => {
          let type;
          if ("class" in item) type = "class";
          if ("expression" in item) type = "expression";
          if ("delegateExpression" in item) type = "delegateExpression";
          return {
            event: item.event,
            type: type,
            className: item[type],
            params:
              item.fields?.map((field) => {
                let fieldType;
                if ("stringValue" in field) fieldType = "stringValue";
                if ("expression" in field) fieldType = "expression";
                return {
                  name: field.name,
                  type: fieldType,
                  value: field[fieldType],
                };
              }) ?? [],
          };
        }) ?? [];
  },
  methods: {
    //新增
    handleAdd() {
      this.visible = true;
      const form = this.$refs.eventListenerEdit.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.$refs.eventListenerEdit.add();
    },
    // 编辑
    handleEdit(record) {
      this.visible = true;
      this.mdl = record;
      this.$refs.eventListenerEdit.edit();
    },
    // 删除
    handleDel(index) {
      this.data.splice(index, 1);
    },
    handleOk(params) {
      const form = this.$refs.eventListenerEdit.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          values.params = params;
          this.data.push(values);
          this.updateElement();
          this.visible = false;
        }
      });
    },
    // 更新属性
    updateElement() {
      if (this.data?.length) {
        let extensionElements = this.element.businessObject.get(
          "extensionElements"
        );
        if (!extensionElements) {
          extensionElements = this.modeler
            .get("moddle")
            .create("bpmn:ExtensionElements");
        }
        console.log(extensionElements);
        // 清除旧值
        extensionElements.values =
          extensionElements.values?.filter(
            (item) => item.$type !== "flowable:TaskListener"
          ) ?? [];
        this.data.forEach((item) => {
          console.log(this.modeler.get("moddle"));
          const TaskListener = this.modeler
            .get("moddle")
            .create("flowable:TaskListener");
          TaskListener["event"] = item.event;
          TaskListener[item.type] = item.className;
          if (item.params && item.params.length) {
            item.params.forEach((field) => {
              const fieldElement = this.modeler
                .get("moddle")
                .create("flowable:Field");
              fieldElement["name"] = field.name;
              fieldElement[field.type] = field.value;
              // 注意：flowable.json 中定义的string和expression类为小写，不然会和原生的String类冲突，此处为hack
              // const valueElement = this.modeler.get('moddle').create(`flowable:${field.type}`, { body: field.value })
              // fieldElement[field.type] = valueElement
              TaskListener.get("fields").push(fieldElement);
            });
          }
          extensionElements.get("values").push(TaskListener);
        });
        this.updateProperties({ extensionElements: extensionElements });
      } else {
        const extensionElements = this.element.businessObject[
          `extensionElements`
        ];
        if (extensionElements) {
          extensionElements.values =
            extensionElements.values?.filter(
              (item) => item.$type !== "flowable:TaskListener"
            ) ?? [];
        }
      }
    },
    updateProperties(properties) {
      this.modeler.get("modeling").updateProperties(this.element, properties);
    },
  },
};
</script>

<style>
.bpmn-panel tr.ant-table-expanded-row td > .ant-table-wrapper {
  margin: 0 !important;
}
</style>
