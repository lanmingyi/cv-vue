<!--
 * @Description: 流转条件
 * @Author: 黄婷
 * @Date: 2021-06-11 16:20:04
 * @LastEditTime: 2021-09-16 09:17:50
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\panel\conditionsPanel.vue
-->
<template>
  <div class="">
    <a-form :form="form">
      <!--sequenceFlow-->
      <template v-if="element.type == 'bpmn:SequenceFlow'">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="流转条件"
          v-if="formDesinType !== 'custom'"
        >
          <a-radio-group
            v-model="element.conditionType"
            @change="changeConditionType"
          >
            <a-radio-button value="form">
              表单字段
            </a-radio-button>
            <a-radio-button value="expression">
              表达式
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="
            element.conditionType == 'expression' || formDesinType === 'custom'
          "
          label="分支条件"
        >
          <a-input
            v-model="sequenceFlow"
            @change="
              (e) => {
                updateSequenceFlow(e.target.value);
              }
            "
          ></a-input>
        </a-form-item>
        <template v-if="element.conditionType == 'form'">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="分支条件"
          >
            <a-input
              v-model="sequenceFlow"
              @click="
                () => {
                  conditionVisible = true;
                }
              "
              readOnly
              placeholder="分支条件"
              @change="
                (e) => {
                  updateSequenceFlow(e.target.value);
                }
              "
            ></a-input>
          </a-form-item>
          <conditions
            ref="condition"
            :formFieldLists="formFieldLists"
            :updateList="updateList"
            :visible="conditionVisible"
            :element="element"
            :modeler="modeler"
            @ok="
              () => {
                conditionVisible = false;
              }
            "
            @close="
              () => {
                conditionVisible = false;
              }
            "
          ></conditions>
        </template>
      </template>
    </a-form>
  </div>
</template>

<script>
import conditions from "./modal/conditions.vue";
export default {
  name: "processUser",
  props: {
    element: {
      type: Object,
    },
    modeler: {
      type: Object,
    },
    formDesinType: {
      type: String,
    },
    formFieldLists: { type: Array },
    updateList: { type: Array },
  },
  components: { conditions },
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      conditionVisible: false,
      sequenceFlow: "",
    };
  },
  watch: {
    element: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.sequenceFlow =
          newVal.businessObject?.conditionExpression?.body ?? "";
      },
    },
  },
  methods: {
    // 更新流程属性
    updateProperties(properties) {
      this.modeler.get("modeling").updateProperties(this.element, properties);
    },
    changeConditionType(e) {
      let conditionExpression = this.element.businessObject.get(
        "conditionExpression"
      );
      // if(conditionExpression) delete this.nodeElement.businessObject.conditionExpression
      let val = e.target.value;
      this.updateProperties({ conditionType: val });
    },
    // 更新节点
    updateSequenceFlow(val) {
      let newCondition = this.modeler
        .get("moddle")
        .create("bpmn:FormalExpression", {
          body: val,
        });
      this.sequenceFlow = val;
      this.updateProperties({
        conditionExpression: newCondition,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
