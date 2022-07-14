<!--
 * @Description: 信号监听器
 * @Author: lmy
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-09-02 17:28:24
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <t-modal
    title="信号定义"
    :width="640"
    :visible="visible"
    @ok="save"
    @cancel="
      () => {
        $emit('close');
      }
    "
  >
    <form :autoFormCreate="(form) => (this.form = form)">
      <a-table :columns="columns" :dataSource="dataSource" :pagination="false">
        <template
          v-for="(col, i) in ['scope', 'id', 'name']"
          :slot="col"
          slot-scope="text, record"
        >
          <div v-if="col != 'scope'">
            <a-input
              :key="col"
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns[i].title"
              @change="(e) => handleChange(e.target.value, record.key, col)"
            />
            <template v-else>{{ text }}</template>
          </div>
          <div v-else>
            <a-select
              :key="col"
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns[i].title"
              @change="(e) => handleChange(e, record.key, col)"
            >
              <a-select-option value="start">
                全局
              </a-select-option>
              <a-select-option value="end">
                流程实例
              </a-select-option>
            </a-select>
            <template v-else>{{ text }}</template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <a @click="saveRow(record.key)">{{ $t("add") }}</a>
              <a-divider type="vertical" />
              <a-popconfirm
                :title="$t('deleteConfirm')"
                @confirm="remove(record.key)"
              >
                <a>{{ $t("delete") }}</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="saveRow(record.key)">{{ $t("save") }}</a>
              <a-divider type="vertical" />
              <a @click="cancle(record.key)">{{ $t("cancel") }}</a>
            </span>
          </template>
          <span v-else>
            <a @click="toggle(record.key)">{{ $t("edit") }}</a>
            <a-divider type="vertical" />
            <a-popconfirm
              :title="$t('deleteConfirm')"
              @confirm="remove(record.key)"
            >
              <a>{{ $t("delete") }}</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        type="dashed"
        icon="plus"
        @click="newMember"
        >{{ $t("newMember") }}</a-button
      >
    </form>
  </t-modal>
</template>

<script>
const columns = [
  {
    title: "scope",
    dataIndex: "scope",
    key: "scope",
    width: "20%",
    scopedSlots: {
      customRender: "scope",
    },
  },
  {
    title: "id",
    dataIndex: "id",
    key: "id",
    width: "20%",
    scopedSlots: {
      customRender: "id",
    },
  },
  {
    title: "name",
    dataIndex: "name",
    key: "name",
    width: "40%",
    scopedSlots: {
      customRender: "name",
    },
  },
  {
    title: "操作",
    key: "operation",
    scopedSlots: {
      customRender: "operation",
    },
  },
];
export default {
  name: "UserForm",
  i18n: require("./i18n-user"),
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
    signalRefList: {
      type: Array,
    },
    refType: {
      type: String,
    },
    messageRefList: {
      type: Array,
    },
    // formData: {
    //   type: Object,
    //   required: true
    // },
  },
  data() {
    return {
      columns,
      dataSource: [],
      formData: [],
    };
  },
  watch: {
    // 监听数据处理
    visible(val) {
      if (this.signalRefList || this.messageRefList) {
        if (this.refType === "msg") {
          this.dataSource = this.messageRefList;
        } else {
          this.dataSource = this.signalRefList;
        }
      } else {
        let eventDefinitions =
          this.element.businessObject?.eventDefinitions ?? "";
        if (this.refType === "msg") {
          this.dataSource =
            this.element.businessObject.$attrs?.messageRefList ?? [];
        } else {
          this.dataSource =
            this.element.businessObject.$attrs?.signalRefList ?? [];
        }
      }
    },
  },
  mounted() {
    this.getFormData();
  },
  methods: {
    // 获取数据
    getFormData() {
      let eventDefinitions =
        this.element.businessObject?.eventDefinitions ?? "";
      this.dataSource = this.element.businessObject.$attrs?.signalRefList ?? [];
      // console.log(eventDefinitions)
    },
    getFormDataList(e) {
      this.dataSource = e;
    },
    handleSubmit(e) {
      e.preventDefault();
    },
    newMember() {
      this.dataSource.push({
        key: this.dataSource.length + 1,
        scope: "",
        id: "",
        name: "",
        editable: true,
        isNew: true,
      });
    },
    remove(key) {
      const newData = this.dataSource.filter((item) => item.key !== key);
      this.dataSource = newData;
    },
    saveRow(key) {
      let target = this.dataSource.filter((item) => item.key === key)[0];
      target.editable = false;
      target.isNew = false;
    },
    toggle(key) {
      let target = this.dataSource.filter((item) => item.key === key)[0];
      target.editable = !target.editable;
    },
    getRowByKey(key, newData) {
      const data = this.dataSource;
      return (newData || data).filter((item) => item.key === key)[0];
    },
    cancle(key) {
      let target = this.dataSource.filter((item) => item.key === key)[0];
      target.editable = false;
    },
    handleChange(value, key, column) {
      const newData = [...this.dataSource];
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.dataSource = newData;
      }
    },
    updateElement() {
      console.log(this.dataSource);
      if (this.dataSource?.length) {
        //  let eventDefinitions = this.element.businessObject.get('eventDefinitions')
        //  if (!eventDefinitions) {
        // // eventDefinitions = this.modeler.get('moddle').create('bpmn:signal')
        //    eventDefinitions = this.modeler.get('moddle').create('bpmn:SignalEventDefinition')
        //  }
        // eventDefinitions.forEach(item=>{
        // 	if(item.$type==='bpmn:SignalEventDefinition'){
        // 		item['signalRef'] = {}
        // 	}
        // })
        // this.updateProperties({ eventDefinitions: eventDefinitions })
        this.updateProperties({ signalRefList: this.dataSource });
        console.log(eventDefinitions); //signalRef   信号属性
        // const length = extensionElements.get('values')?.length
        // for (let i = 0; i < length; i++) {
        //   // 清除旧值
        //   extensionElements.get('values').pop()
        // }
      } else {
        // const eventDefinitions = this.element.businessObject[`eventDefinitions`]
        // if (eventDefinitions) {
        //   eventDefinitions.values = eventDefinitions.values?.filter(item => item.$type !== 'flowable:ExecutionListener')
        // }
      }
    },
    save() {
      this.updateElement();
      this.$emit("ok", this.dataSource, this.refType);
    },
    updateProperties(properties) {
      this.modeler.get("modeling").updateProperties(this.element, properties);
    },
  },
};
</script>

<style scoped></style>
