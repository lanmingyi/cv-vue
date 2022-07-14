<!--
 * @Description: 多实例配置
 * @Author: lmy
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-08-03 12:00:09
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div>
    <t-modal
      title="多实例配置"
      :width="640"
      :visible="visible"
      @ok="save"
      @cancel="
        () => {
          $emit('close');
        }
      "
    >
      <a-alert
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 20px"
      >
        <template slot="description">
          按照BPMN2.0规范的要求，用于为每个实例创建执行的父执行，会提供下列变量:<br />
          nrOfInstances：实例总数。<br />
          nrOfActiveInstances：当前活动的（即未完成的），实例数量。对于顺序多实例，这个值总为1。<br />
          nrOfCompletedInstances：已完成的实例数量。<br />
          loopCounter：给定实例在for-each循环中的index。<br />
        </template>
      </a-alert>
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span slot="label">
            集合
            <a-tooltip
              title="属性会作为表达式进行解析。如果表达式解析为字符串而不是一个集合，<br />不论是因为本身配置的就是静态字符串值，还是表达式计算结果为字符串，<br />这个字符串都会被当做变量名，并从流程变量中用于获取实际的集合。"
            >
              <a-icon type="question-circle-o" theme="twoTone" />
            </a-tooltip>
          </span>
          <a-input v-model="formData.collection" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span slot="label">
            元素变量
            <a-tooltip
              title="每创建一个用户任务前，先以该元素变量为label，集合中的一项为value，<br />创建（局部）流程变量，该局部流程变量被用于指派用户任务。<br />一般来说，该字符串应与指定人员变量相同。"
            >
              <a-icon type="question-circle-o" theme="twoTone" />
            </a-tooltip>
          </span>
          <a-input v-model="formData.elementVariable" />
        </a-form-item>
        <a-form-item
          label="执行方式"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-radio-group name="radioGroup" v-model="formData.isSequential">
            <a-radio :value="true">
              串行
            </a-radio>
            <a-radio :value="false">
              并行
            </a-radio>
            <a-radio :value="2">
              无
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span slot="label">
            完成条件
            <a-tooltip
              title="多实例活动在所有实例都完成时结束，然而也可以指定一个表达式，在每个实例<br />结束时进行计算。当表达式计算为true时，将销毁所有剩余的实例，并结束多实例<br />活动，继续执行流程。例如 ${nrOfCompletedInstances/nrOfInstances >= 0.6 }，<br />表示当任务完成60%时，该节点就算完成"
            >
              <a-icon type="question-circle-o" theme="twoTone" />
            </a-tooltip>
          </span>
          <a-input v-model="formData.completionCondition" />
        </a-form-item>
      </a-form>
    </t-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: true,
      formData: {},
      form: this.$form.createForm(this),
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 4,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 18,
        },
      },
    };
  },
  props: {
    visible: {
      type: Boolean,
    },
    value: {
      type: Array,
    },
    element: {
      type: Object,
      required: true,
    },
    modeler: {
      type: Object,
      required: true,
    },
    // formData: {
    //   type: Object,
    //   required: true
    // },
  },
  mounted() {
    this.getFormData();
  },
  methods: {
    // 获取数据
    getFormData() {
      const cache = JSON.parse(
        JSON.stringify(this.element.businessObject?.loopCharacteristics ?? {})
      );
      cache.completionCondition = cache.completionCondition?.body;
      cache.isSequential = cache.isSequential ? cache.isSequential : false;
      // 移除flowable前缀，格式化数组
      for (const key in cache) {
        if (key.indexOf("flowable:") === 0) {
          const newKey = key.replace("flowable:", "");
          cache[newKey] = cache[key];
        } else {
          cache[key] = cache[key];
        }
      }
      this.formData = cache;
      // }
    },
    // 更新
    updateElement() {
      if (this.formData.isSequential != 2) {
        let multiInstanceLoopCharacteristics = this.element.businessObject.get(
          "loopCharacteristics"
        );
        if (!multiInstanceLoopCharacteristics) {
          multiInstanceLoopCharacteristics = this.modeler
            .get("moddle")
            .create("bpmn:MultiInstanceLoopCharacteristics");
        } else {
          delete this.element.businessObject.loopCharacteristics;
          multiInstanceLoopCharacteristics = this.modeler
            .get("moddle")
            .create("bpmn:MultiInstanceLoopCharacteristics");
        }
        multiInstanceLoopCharacteristics[
          "isSequential"
        ] = this.formData.isSequential;
        multiInstanceLoopCharacteristics[
          "collection"
        ] = this.formData.collection;
        multiInstanceLoopCharacteristics[
          "elementVariable"
        ] = this.formData.elementVariable;
        if (this.formData.completionCondition) {
          const completionCondition = this.modeler
            .get("moddle")
            .create("bpmn:Expression", {
              body: this.formData.completionCondition,
            });
          multiInstanceLoopCharacteristics[
            "completionCondition"
          ] = completionCondition;
        }
        this.updateProperties({
          loopCharacteristics: multiInstanceLoopCharacteristics,
        });
      } else {
        delete this.element.businessObject.loopCharacteristics;
        this.updateProperties({ businessObject: this.element.businessObject });
      }
    },
    // 保存
    save() {
      this.updateElement();
      this.$emit("close");
    },
    // 更新流程属性
    updateProperties(properties) {
      this.modeler.get("modeling").updateProperties(this.element, properties);
    },
  },
};
</script>

<style>
.muti-instance .el-form-item {
  margin-bottom: 22px;
}
</style>
