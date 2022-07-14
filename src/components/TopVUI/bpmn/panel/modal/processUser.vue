<!--
 * @Description: 节点人员配置
 * @Author: lmy
 * @Date: 2021-06-01 11:31:33
 * @LastEditTime: 2021-09-02 17:27:39
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <a-card :bordered="false">
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
      bordered
      :pagination="false"
      size="small"
    >
      <span slot="type" slot-scope="text, record, index">
        {{ getTypeText(text, record) }}
      </span>
    </a-table>
    <user-modal
      :visible.sync="visible"
      @ok="addExecuteAssignee"
      ref="userModal"
    ></user-modal>
  </a-card>
</template>

<script>
import userModal from "./userModal";
export default {
  name: "processUser",
  components: { userModal },
  props: {
    element: {
      type: Object,
    },
    modeler: {
      type: Object,
    },
  },
  data() {
    return {
      // table
      columns: [
        {
          title: "人员类型",
          dataIndex: "type",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "人员名称",
          dataIndex: "name",
        },
      ],
      visible: false,
      data: [],
      typeList: [
        {
          value: "assignee",
          label: "指定人员",
        },
        {
          value: "candidateUsers",
          label: "候选人员",
        },
        {
          value: "candidateGroups",
          label: "指定角色",
        },
        {
          value: "processInitiator",
          label: "流程发起人",
        },
        {
          value: "department",
          label: "岗位",
        },
        // {
        //   value: "post",
        //   label: "部门",
        // },
      ],
    };
  },
  watch: {
    //监听元素变化
    element: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal.businessObject?.extensionElements) {
          // 执行监听器
          this.data =
            newVal.businessObject.extensionElements?.values
              .filter((item) => item.$type === "flowable:Assignee")
              .map((item) => {
                // console.log(item);
                return {
                  name: item.name,
                  value: item.value,
                  type: item.type,
                  editable: true,
                  key: Math.ceil(Math.random() * 100),
                };
              }) ?? [];
        }
      },
    },
  },
  methods: {
    // 获取节点人员信息
    getTypeText(val, type) {
      let item = this.typeList.filter((item) => item.value === val);
      return item[0]?.label;
    },
    // 新增
    handleAdd() {
      this.visible = true;
      this.$refs.userModal.data = this.data;
    },
    // 监听器
    addExecuteAssignee(e) {
      this.data = e;
      if (e?.length) {
        let extensionElements = this.element.businessObject.get(
          "extensionElements"
        );
        if (!extensionElements) {
          extensionElements = this.modeler
            .get("moddle")
            .create("bpmn:ExtensionElements");
        }
        // 清除旧值
        extensionElements.values =
          extensionElements.values?.filter(
            (item) => item.$type !== "flowable:Assignee"
          ) ?? [];
        e.forEach((item) => {
          let executionListener = (executionListener = this.modeler
            .get("moddle")
            .create("flowable:Assignee"));
          executionListener["type"] = item.type;
          executionListener["value"] = item.value;
          executionListener["name"] = item.name;
          extensionElements.get("values").push(executionListener);
        });
        this.updateProperties({ extensionElements: extensionElements });
        console.log(extensionElements, "节点人员配置===");
      } else {
        const extensionElements = this.element.businessObject[
          `extensionElements`
        ];
        if (extensionElements) {
          extensionElements.values =
            extensionElements.values?.filter(
              (item) => item.$type !== "flowable:Assignee"
            ) ?? [];
        }
      }
      this.visible = false;
    },
    // 更新节点属性
    updateProperties(properties) {
      this.modeler.get("modeling").updateProperties(this.element, properties);
    },
  },
};
</script>

<style lang="less" scoped></style>
