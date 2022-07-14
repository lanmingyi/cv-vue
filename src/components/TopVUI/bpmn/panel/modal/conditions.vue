<!--
 * @Description: 流转条件
 * @Author: lmy
 * @Date: 2021-03-08 11:54:58
 * @LastEditTime: 2021-09-02 17:02:29
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <t-modal
    title="流转条件"
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
          v-for="(col, i) in [
            'variable',
            'conditionalOpt',
            'conditionalVal',
            'logic',
          ]"
          :slot="col"
          slot-scope="text, record"
        >
          <div v-if="col == 'conditionalVal'" :key="col">
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
          <div v-if="col == 'variable'" :key="col">
            <a-select
              :key="col"
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns[i].title"
              @change="(e) => handleChange(e, record.key, col)"
            >
              <a-select-option
                :value="item.filed"
                v-for="(item, index) in conditionList"
                :key="index"
              >
                {{ item.filedName }}
              </a-select-option>
            </a-select>
            <template v-else>{{ text }}</template>
          </div>
          <div v-if="col == 'conditionalOpt'" :key="col">
            <a-select
              :key="col"
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns[i].title"
              @change="(e) => handleChange(e, record.key, col)"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in conditionalOpts"
                :key="index"
              >
                {{ item.text }}
              </a-select-option>
            </a-select>
            <template v-else>{{ text }}</template>
          </div>
          <div v-if="col == 'logic'" :key="col">
            <a-select
              :key="col"
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns[i].title"
              @change="(e) => handleChange(e, record.key, col)"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in logicOptions"
                :key="index"
              >
                {{ item.text }}
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
import { randomUUID } from "@/utils/util"; //随机生成uuid
const columns = [
  {
    title: "字段",
    dataIndex: "variable",
    key: "variable",
    width: "20%",
    scopedSlots: {
      customRender: "variable",
    },
  },
  {
    title: "条件",
    dataIndex: "conditionalOpt",
    key: "conditionalOpt",
    width: "20%",
    scopedSlots: {
      customRender: "conditionalOpt",
    },
  },
  {
    title: "值",
    dataIndex: "conditionalVal",
    key: "conditionalVal",
    width: "20%",
    scopedSlots: {
      customRender: "conditionalVal",
    },
  },
  {
    title: "逻辑",
    dataIndex: "logic",
    key: "logic",
    width: "20%",
    scopedSlots: {
      customRender: "logic",
    },
  },
  {
    title: "操作",
    key: "operation",
    width: "20%",
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
    formFieldLists: {
      type: Array,
    },
    updateList: {
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
      conditionList: [],
      conditionalOpts: [
        { text: "等于", value: "==" },
        { text: "不等于", value: "!=" },
        { text: "小于", value: "<" },
        { text: "大于", value: ">" },
        { text: "大于等于", value: ">=" },
        { text: "小于等于", value: "<=" },
      ],
      logicOptions: [
        { text: "无", value: "" },
        { text: "并且", value: "&&" },
        { text: "或者", value: "||" },
      ],
    };
  },
  watch: {
    // 监听数据处理
    visible(val) {
      if (val) {
        this.getFormList(); //获取表单字段值
        this.getFormData(); //获取配置数据
      }
    },
  },
  mounted() {
    this.getFormData();
    // console.log(this.formFieldLists,this.updateList)
  },
  methods: {
    //获取表单字段值
    getFormList() {
      const arr1 = this.formFieldLists;
      const arr2 = this.updateList;
      let arr3 = arr1.concat(arr2);
      let result = [];
      let obj = [];
      result = arr3.reduce(function(prev, cur, index, arr) {
        obj[cur.filed] ? "" : (obj[cur.filed] = true && prev.push(cur));
        return prev;
      }, []);
      this.conditionList = result;
    },
    // 获取数据
    getFormData() {
      let conditionExpression =
        this.element.businessObject?.conditionExpression ?? "";
      console.log(conditionExpression);
      if (conditionExpression) {
        console.log(conditionExpression);
        let condition = conditionExpression.get("body");
        this.parseCondition(condition);
      } else {
        this.dataSource = [];
      }
      // this.dataSource = this.element.businessObject.$attrs?.signalRefList??[]
    },
    //校验条件输入值是否合法
    parseCondition(conditionExpress) {
      let operators = ["!", "=", ">", "<"];
      let logicOperators = ["&", "|"];
      conditionExpress = conditionExpress
        .replace("$", "")
        .replace("{", "")
        .replace("}", "")
        .replace(new RegExp('"', "g"), "");
      this.dataSource = [];
      let self = this;
      console.log(self.dataSource);
      splitConditionExpress(conditionExpress);
      //截取表达时候
      function splitConditionExpress(str) {
        //正查找查找操作符
        let idx = findChar(str, true, true, logicOperators);
        if (idx == -1) {
          let row = createConditionRow(str);
          if (row.variable) self.dataSource.push(row);
          return;
        } else {
          //操作符
          let logic = str.substring(idx, idx + 2);
          let conditionExpress = str.substring(0, idx);
          let row = createConditionRow(conditionExpress, logic);
          self.dataSource.push(row);
          let newStr = str.substring(idx + 2);
          splitConditionExpress(newStr);
        }
      }
      function createConditionRow(conditionExpress, logic) {
        let row = {};
        //纯表达式
        let headOptIdx = findChar(conditionExpress, true, false, operators);
        let footOptIdx = findChar(conditionExpress, false, false, operators);
        console.log(headOptIdx, headOptIdx);
        //变量
        let variable = conditionExpress.substring(0, headOptIdx).trim();
        //值
        let val = conditionExpress
          .substring(footOptIdx + 1, conditionExpress.length)
          .trim();
        //操作符
        let opt = conditionExpress.substring(headOptIdx, footOptIdx + 1).trim();
        // row.id = uuid();
        row.variable = variable;
        row.conditionalOpt = opt;
        row.conditionalVal = val;
        row.logic = logic;
        row.editable = false;
        row.key = randomUUID();
        return row;
      }
      /**
       * @description 检索第一个的操作操作符
       * @param str 需要被检索的字符串
       * @param  type 类型 true:正查找 false:反查找
       * @param report 检索的字符是否需要重复 true | false
       */
      function findChar(str, type, report, operators) {
        let index = -1;
        let len = str.length;
        if (type) {
          for (let i = 0; i < len; i++) {
            let char = str.charAt(i);
            if (operators.includes(char)) {
              //查找第一个
              if (report) {
                if (char == str.charAt(i + 1)) {
                  index = i;
                  break;
                }
              } else {
                index = i;
                break;
              }
            }
          }
        } else if (!type) {
          for (let i = len - 1; i >= 0; i--) {
            let char = str.charAt(i);
            if (operators.includes(char)) {
              //从末尾查找最后一个
              if (report) {
                if (char == str.charAt(i - 1)) {
                  index = i;
                  break;
                }
              } else {
                index = i;
                break;
              }
            }
          }
        }
        return index;
      }
    },
    // 新增
    newMember() {
      this.dataSource.push({
        key: randomUUID(),
        scope: "",
        id: "",
        name: "",
        editable: true,
        isNew: true,
      });
    },
    // 移除
    remove(key) {
      const newData = this.dataSource.filter((item) => item.key !== key);
      this.dataSource = newData;
    },
    // 保存
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
    // 更新
    updateElement() {
      let val = "";
        console.log(this.dataSource);
        // console.log(this.validateConditions(this.dataSource),'this.validateConditions(this.dataSource)')
        if (this.validateConditions(this.dataSource)) {
          this.dataSource.forEach((e, index) => {
            console.log(!e.logic);
            if (!e.logic) {
              val +=
                e.variable + " " + e.conditionalOpt + " " + e.conditionalVal;
            } else {
              val +=
                e.variable +
                " " +
                e.conditionalOpt +
                " " +
                e.conditionalVal +
                e.logic;
            }
          });
          console.log(val);
          let value = "";
					if (this.dataSource?.length) {
						value = "${" + val + "}";
					}
          // 更新节点
          let newCondition = this.modeler
            .get("moddle")
            .create("bpmn:FormalExpression", {
              body: value,
            });
          this.updateProperties({
            conditionExpression: newCondition,
          });
          this.$emit("ok");
        } else {
          return false;
        }
    },
    save() {
      this.updateElement();
    },
    updateProperties(properties) {
      this.modeler.get("modeling").updateProperties(this.element, properties);
    },
    //校验表达式的正确性
    validateConditions(conditions) {
      let flag = true;
      let that = this;
      conditions.forEach((condition, index) => {
        console.log(isBlank(condition.variable), condition.variable);
        index = index + 1;
        if (isBlank(condition.variable)) {
          console.error("第" + index + "个条件,变量不能为空");
          that.$message.error("第" + index + "个条件,变量不能为空");
          flag = false;
          return;
        } else if (isBlank(condition.conditionalOpt)) {
          console.error("第" + index + "个条件,操作符不能为空");
          that.$message.error("第" + index + "个条件,变量不能为空");
          flag = false;
          return;
        } else if (isBlank(condition.conditionalVal)) {
          console.error("第" + index + "个条件,变量值不能为空");
          that.$message.error("第" + index + "个条件,变量不能为空");
          flag = false;
          return;
        } else if (index < conditions.length) {
          if (isBlank(condition.logic)) {
            console.error(
              "配置多个条件时，须配置逻辑,第" + index + "个条件逻辑未配置"
            );
            that.$message.error(
              "配置多个条件时，须配置逻辑,第" + index + "个条件逻辑未配置"
            );
            flag = false;
            return;
          }
        } else if (index === conditions.length) {
          if (!isBlank(condition.logic)) {
            console.error("最后一个条件应为无");
            that.$message.error("逻辑配置错误,最后一个条件逻辑应为无！");
            flag = false;
            return;
          }
        }
      });
      return flag;
    },
  },
};

function isBlank(str) {
  return str === undefined || str.length == 0;
}
</script>

<style scoped></style>
