<!--
 * @Description: 新版按钮配置
 * @Author: lmy
 * @Date: 2021-06-11 15:37:03
 * @LastEditTime: 2021-09-02 17:00:16
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div class="padding-bottom-xs">
    <!-- <div
			v-for="(item, index) in btnGroup"
			:key="index"
			class="select-item flex align-center"
			v-if="btnGroup[index].nodeButtonCode"
		>
			<div class="select-line-icon option-drag">
				<a-icon type="menu" />
			</div>
			<a-input readOnly v-model="item.nodeButtonName" placeholder="选项名" />
			<a-input readOnly placeholder="选项值" v-model="item.nodeButtonCode" type="hidden" />
			<div class="close-btn select-line-icon" @click="setBtnGroupItem(index)">
				<a-icon type="minus-circle" />
			</div>
		</div> -->
    <div style="margin-left: 20px;">
      <!-- <a-button style="padding-bottom: 0" icon="plus-circle" type="link" @click="setBtnGroupItem()">
            添加选项
          </a-button> -->
      <a-button
        style="padding-bottom: 5px"
        icon="plus-circle"
        type="link"
        @click="openBtnPop()"
      >
        快速添加
      </a-button>
    </div>
    <a-table
      :columns="columns"
      :dataSource="btnGroup"
      bordered
      :pagination="false"
      size="small"
    >
      <span slot="action" slot-scope="text, record, index">
        <template>
          <a @click="setBtnGroupItem(index)">删除</a>
        </template>
      </span>
    </a-table>
    <!-- 编辑 -->
    <edit-modal
      :visible="visible"
      ref="btnPopList"
      :btnList="btnGroup"
      @change="(value) => setBtnGroupItem(value, 'list')"
      @cancel="() => (visible = false)"
    ></edit-modal>
  </div>
</template>

<script>
import editModal from "./edit";
export default {
  name: "processUser",
  components: { editModal },
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
      btnGroup: [],
      visible: false,
      columns: [
        {
          title: "名称",
          dataIndex: "nodeButtonName",
          align: "center",
        },
        {
          title: "标识",
          dataIndex: "nodeButtonCode",
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 100,
          align: "center",
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
    };
  },
  watch: {
    //   监听元素变化，获取节点按钮数据
    element: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        let businessObject = newVal.businessObject;
        if (newVal.type == "bpmn:UserTask" || newVal.type == "bpmn:EndEvent") {
          this.btnGroup =
            businessObject.extensionElements?.values
              .filter((item) => item.$type === "flowable:Button")
              .map((item) => {
                return item;
              }) ?? [];
        }
      },
    },
  },
  methods: {
    // 按钮配置
    openBtnPop() {
      this.visible = true;
      this.$refs.btnPopList.getBtnList(this.btnGroup);
    },
    // 按钮数据处理
    setBtnGroupItem(index, type) {
      let businessObject = this.element.businessObject;
      if (type === "list") {
        this.btnGroup = [];
        index.forEach((e) => {
          this.btnGroup.push({
            nodeButtonCode: e.buttonCode,
            nodeButtonName: e.buttonName,
            id: businessObject.id,
            modalKey: businessObject.$parent.id,
            nodeFormPath: businessObject.formDesignUrl,
            nodeFormEditPath: businessObject.formDesignDetailUrl,
            whetherUpdate: businessObject.formEditable,
            nodeFormUpdatePath: businessObject.nodeFormUpdatePathUrl,
          });
        });
      } else if (index >= 0) {
        this.btnGroup.splice(index, 1);
      } else {
        if (!this.btnGroup) this.btnGroup = [];
        this.btnGroup.push({
          nodeButtonCode: "",
          nodeButtonName: "",
          id: businessObject.id,
          modalKey: businessObject.$parent.id,
          nodeFormPath: businessObject.formDesignUrl,
          nodeFormEditPath: businessObject.formDesignDetailUrl,
          whetherUpdate: businessObject.formEditable,
          nodeFormUpdatePath: businessObject.nodeFormUpdatePathUrl,
        });
      }
      if (this.btnGroup?.length) {
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
            (item) => item.$type !== "flowable:Button"
          ) ?? [];
        this.btnGroup.forEach((item) => {
          console.log(this.modeler.get("moddle"));
          let executionListener = this.modeler
            .get("moddle")
            .create("flowable:Button");
          executionListener["nodeButtonCode"] = item.nodeButtonCode;
          executionListener["nodeButtonName"] = item.nodeButtonName;
          executionListener["id"] = item.id;
          executionListener["modalKey"] = item.modalKey;
          executionListener["nodeFormPath"] = item.nodeFormPath;
          executionListener["nodeFormEditPath"] = item.nodeFormEditPath;
          executionListener["whetherUpdate"] = item.whetherUpdate;
          executionListener["nodeFormUpdatePath"] = item.nodeFormUpdatePath;
          extensionElements.get("values").push(executionListener);
        });
        this.updateProperties({ extensionElements: extensionElements });
        console.log(console.log(extensionElements, "节点按钮配置==="));
      } else {
        const extensionElements = this.element.businessObject[
          `extensionElements`
        ];
        if (extensionElements) {
          extensionElements.values = extensionElements.values?.filter(
            (item) => item.$type !== "flowable:Button"
          );
        }
      }
    },
    // 更新节点属性
    updateProperties(properties) {
      this.modeler.get("modeling").updateProperties(this.element, properties);
    },
  },
};
</script>

<style lang="scss" scoped></style>
