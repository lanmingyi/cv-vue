<template>
  <t-modal
    title="新增/编辑"
    :width="640"
    :visible="visible"
    :fullscreen="true"
    :confirmLoading="loading"
    @ok="handleSubmit()"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-row>
          <a-col :lg="{ span: 8 }">
            <a-form-item
              label="库名"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <!-- <a-select v-decorator="['database', {rules: [{required: true, message: '必填'}]}]" placeholder="所属数据库">
								<a-select-option v-for="(item,index) in codeBaseList" :key="index" :value="item.database">
									{{item.database}}
								</a-select-option>
							</a-select> -->
              <a-select
                show-search
                placeholder="数据库名"
                v-decorator="[
                  'database',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              >
                <a-select-option
                  v-for="(item, index) in codeBaseList"
                  :value="item.database"
                  :key="index"
                >
                  {{ item.database }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="{ span: 8 }">
            <a-form-item
              label="类型"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                v-decorator="[
                  'tableType',
                  {
                    initialValue: '数据表格',
                    rules: [{ required: true, message: '必填' }],
                  },
                ]"
                placeholder="表类型"
                @change="changTabletype"
              >
                <a-select-option
                  v-for="(item, index) in tableTypeList"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="{ span: 8 }">
            <a-form-item
              label="表名"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'tableName',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
                placeholder="表名"
                @blur="changeClassName"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="{ span: 8 }">
            <a-form-item
              label="注释"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'notes',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
                placeholder="注释"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="{ span: 8 }">
            <a-form-item
              label="主键"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-input
                v-decorator="['primaryKeyPolicy', { initialValue: 'uuid' }]"
                placeholder="主键策略"
                readOnly
              />
            </a-form-item>
          </a-col>
          <a-col :lg="{ span: 8 }">
            <a-form-item
              label="类名"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-input v-decorator="['className']" placeholder="类名" />
            </a-form-item>
            <a-form-item class="hiddenItem">
              <a-input v-decorator="['uuid']" type="hidden" />
            </a-form-item>
          </a-col>
          <a-col :lg="{ span: 8 }">
            <a-form-item
              label="表单风格"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-select
                v-decorator="['formStyle', { initialValue: '24' }]"
                placeholder="表单风格"
              >
                <a-select-option
                  v-for="(item, index) in formTypeList"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="{ span: 8 }">
            <a-form-item
              label="滚动条"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-select
                v-decorator="['scrollBar', { initialValue: '0' }]"
                placeholder="滚动条"
              >
                <a-select-option value="1"> 有 </a-select-option>
                <a-select-option value="0"> 无 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="{ span: 8 }">
            <a-form-item
              label="复选框"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-select
                v-decorator="['checkBox', { initialValue: '1' }]"
                placeholder="复选框"
              >
                <a-select-option value="1"> 有 </a-select-option>
                <a-select-option value="0"> 无 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-tabs
        v-model="currentIndex"
        class="padding-sm"
        @change="changeCurrentIndex"
      >
        <a-tab-pane tab="数据库属性" key="1" :forceRender="true">
          <t-editable-table
            ref="tabel1"
            :columns="columns"
            :dataSource="dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"
            @valueChange="valueChange"
            @added="added"
            @deleted="deleted"
          />
        </a-tab-pane>
        <a-tab-pane tab="JAVA实体类" key="2" :forceRender="true">
          <t-editable-table
            ref="tabel2"
            :columns="columns2"
            :dataSource="dataSource1"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"
            @valueChange="valueChange"
            @added="added"
            @deleted="deleted"
          />
        </a-tab-pane>
        <a-tab-pane tab="页面属性" key="3" :forceRender="true">
          <t-editable-table
            ref="tabel3"
            :columns="columns3"
            :dataSource="dataSource2"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"
            @valueChange="valueChange"
            @added="added"
            @deleted="deleted"
          />
        </a-tab-pane>
        <a-tab-pane tab="校验字段" key="4" :forceRender="true">
          <t-editable-table
            ref="tabel4"
            :columns="columns4"
            :dataSource="dataSource3"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"
            @valueChange="valueChange"
            @added="added"
            @deleted="deleted"
          />
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
// 表单字段
const fields = [
  "uuid",
  "database",
  "tableType",
  "tableName",
  "notes",
  "primaryKeyPolicy",
  "className",
  "scrollBar",
  "checkBox",
  "formStyle",
];
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
import { mergeArry } from "@/utils/util";
import { camelCase } from "@/utils/index";
import {
  FormTypes,
  validateFormAndTables,
  getRefPromise,
  VALIDATE_NO_PASSED,
} from "@/utils/TEditableTableUtil";
import TEditableTable from "./genTable";
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    model: {
      type: Object,
      default: () => null,
    },
  },
  components: {
    TDictSelectTag,
    TEditableTable,
  },
  data() {
    return {
      title: "",
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 5,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 16,
        },
      },
      form: this.$form.createForm(this),
      codeBaseList: [],
      currentIndex: "1",
      url: {
        generateCodeMoreSave: "/system/sysGenTable/generateCodeMoreSave",
        getAllDatabases: "/system/sysGenTable/getAllDatabases",
        getByPuuid: "/system/sysGenFiled/getByPuuid",
        getValueType: "/system/sysSample/getValueType",
        formWizardAddSave: "/system/sysGenTable/formWizardAddSave",
        formWizardsUpdate: "/system/sysGenTable/formWizardsUpdate",
        deleteByUuid: "/system/generator/deleteByUuid", //uuid
        getPageSetByDatabaseAll: "/system/sysGenTable/getPageSetByDatabaseAll",
      },
      dataSource: [],
      dataSource1: [],
      dataSource2: [],
      dataSource3: [],
      tableTypeList: [
        { text: "数据表格", value: "数据表格" },
        { text: "可编辑表格", value: "可编辑表格" },
        { text: "树形表格", value: "树形表格" },
      ],
      formTypeList: [
        { text: "一列", value: "24" },
        { text: "二列", value: "12" },
        { text: "三列", value: "8" },
        { text: "四列", value: "6" },
      ],
      type: true,
      columns: [
        {
          title: "字段名称",
          key: "listClearly",
          align: "center",
          type: FormTypes.input,
          defaultValue: "",
          placeholder: "请输入${title}",
          validateRules: [{ required: true, message: "${title}不能为空" }],
        },
        {
          title: "注释",
          key: "explain",
          align: "center",
          type: FormTypes.input,
          defaultValue: "",
          placeholder: "请输入${title}",
          validateRules: [{ required: true, message: "${title}不能为空" }],
        },
        {
          title: "字段类型",
          key: "fieldType",
          align: "center",
          type: FormTypes.select,
          options: [
            { title: "varchar", value: "varchar" },
            { title: "int", value: "int" },
            { title: "timestamp", value: "timestamp" },
            { title: "datetime", value: "datetime" },
            { title: "text", value: "text" },
            { title: "tinyint", value: "tinyint" },
          ],
          defaultValue: "varchar",
          placeholder: "请选择${title}",
          validateRules: [{ required: true, message: "${title}不能为空" }],
        },
        {
          title: "长度",
          key: "listClearlyLength",
          align: "center",
          type: FormTypes.inputNumber,
          defaultValue: 0,
          placeholder: "请输入${title}",
          validateRules: [{ required: true, message: "${title}不能为空" }],
        },
        {
          title: "默认值",
          key: "fieldDefaultvalue",
          align: "center",
          type: FormTypes.input,
          defaultValue: "",
          placeholder: "请输入${title}",
        },
        {
          title: "小数点",
          key: "decimalPoint",
          align: "center",
          type: FormTypes.inputNumber,
          defaultValue: 0,
          placeholder: "请输入${title}",
        },
        {
          title: "允许空值",
          key: "whetherNull",
          align: "center",
          type: FormTypes.checkbox,
          defaultValue: false,
          placeholder: "请输入${title}",
        },
        {
          title: "主键",
          key: "primaryKey",
          align: "center",
          type: FormTypes.checkbox,
          defaultValue: false,
          placeholder: "请输入${title}",
        },
      ],
      columns2: [
        {
          title: "列名",
          key: "listClearly",
          align: "center",
          type: FormTypes.input,
          defaultValue: "",
          placeholder: "请输入${title}",
          validateRules: [{ required: true, message: "${title}不能为空" }],
        },
        {
          title: "说明",
          key: "explain",
          align: "center",
          type: FormTypes.input,
          defaultValue: "",
          placeholder: "请输入${title}",
          validateRules: [{ required: true, message: "${title}不能为空" }],
        },
        {
          title: "java类型",
          key: "javaType",
          align: "center",
          type: FormTypes.select,
          defaultValue: "",
          placeholder: "请输入${title}",
          validateRules: [{ required: true, message: "${title}不能为空" }],
          options: [
            { text: "String", value: "String" },
            { text: "Integer", value: "Integer" },
            { text: "Double", value: "Double" },
            { text: "Date", value: "Date" },
            { text: "BigDecimal", value: "BigDecimal" },
            { text: "Text", value: "Text" },
            { text: "Blob", value: "Blob" },
          ],
        },
        {
          title: "java属性名称",
          key: "javaFiled",
          align: "center",
          type: FormTypes.input,
          defaultValue: "",
          placeholder: "请输入${title}",
          validateRules: [{ required: true, message: "${title}不能为空" }],
        },
      ],
      columns3: [
        {
          title: "字段名称",
          key: "listClearly",
          align: "center",
          type: FormTypes.input,
          defaultValue: "",
          placeholder: "请输入${title}",
          validateRules: [{ required: true, message: "${title}不能为空" }],
        },
        {
          title: "注释",
          key: "explain",
          align: "center",
          type: FormTypes.input,
          defaultValue: "",
          placeholder: "请输入${title}",
          validateRules: [{ required: true, message: "${title}不能为空" }],
        },
        {
          title: "控件类型",
          key: "controlType",
          align: "center",
          type: FormTypes.select,
          defaultValue: "",
          options: [
            { text: "文本框", value: "textbox" },
            { text: "多行文本框", value: "textare" },
            { text: "数字框", value: "numberbox" },
            { text: "日期", value: "datetimebox" },
            { text: "日期时间", value: "datetime" },
            { text: "下拉框", value: "combobox" },
            { text: "下拉框多选", value: "comboTag" },
          ],
          placeholder: "请输入${title}",
					validateRules: [{ required: true, message: "${title}不能为空" }],
        },
        {
          title: "控件长度",
          key: "controlLength",
          align: "center",
          type: FormTypes.inputNumber,
          defaultValue: 0,
          placeholder: "请输入${title}",
        },
        {
          title: "控件默认值",
          key: "controlDefaultvalue",
          align: "center",
          type: FormTypes.input,
          defaultValue: "",
          placeholder: "请输入${title}",
        },
        {
          title: "表单排序",
          key: "formSort",
          align: "center",
          type: FormTypes.inputNumber,
          defaultValue: 0,
          placeholder: "请输入${title}",
					validateRules: [{ required: true, message: "${title}不能为空" }],
        },
        {
          title: "列表显示",
          key: "listDisplay",
          align: "center",
          type: FormTypes.checkbox,
          defaultValue: false,
          placeholder: "请输入${title}",
        },
        {
          title: "列表是否排序",
          key: "listWhetherSort",
          align: "center",
          type: FormTypes.checkbox,
          defaultValue: false,
          placeholder: "请输入${title}",
        },
        {
          title: "是否只读",
          key: "whetherReadOnly",
          align: "center",
          type: FormTypes.checkbox,
          defaultValue: false,
          placeholder: "请输入${title}",
        },
        {
          title: "是否查询",
          key: "whetherSearch",
          align: "center",
          type: FormTypes.checkbox,
          defaultValue: false,
          placeholder: "请输入${title}",
        },
        {
          title: "必填",
          key: "whetherRequired",
          align: "center",
          type: FormTypes.checkbox,
          defaultValue: false,
          placeholder: "请输入${title}",
        },
      ],
      columns4: [
        {
          title: "字段名称",
          key: "listClearly",
          align: "center",
          type: FormTypes.input,
          defaultValue: "",
          placeholder: "请输入${title}",
					validateRules: [{ required: true, message: "${title}不能为空" }],
        },
        {
          title: "注释",
          key: "explain",
          align: "center",
          type: FormTypes.input,
          defaultValue: "",
          placeholder: "请输入${title}",
					validateRules: [{ required: true, message: "${title}不能为空" }],
        },
        {
          title: "验证规则",
          key: "validationRules",
          align: "center",
          type: FormTypes.select,
          defaultValue: "",
          options: [
            { text: "无", value: "0" },
            {
              text: "邮箱",
              value: "/^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$/",
            },
            // { text:'url', value: /^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$/ },
            {
              text: "手机号",
              value: "/^1(3\\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\\d|9[0-35-9])\\d{8}$/",
            },
						// /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\\d{8}$/
            // { text:'电话号码', value:/^(\(\d{3,4}-)|\d{3.4}-)?\d{7,8}$/ },
            {
              text: "身份证",
              value: "/(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)/",
            },
            { text: "邮政编码", value: "/^[1-9]\\d{5}$/" }, // /[1-9]\\d{5}(?!\\d)/
            { text: "6到18个字符之间", value: "/^.{6,18}$/" },
            { text: "字母", value: "/^[A-Za-z]+$/" },
            { text: "包含字母，数字，下划线和横线", value: "/^([a-z_A-Z—0-9]+)$/" }, ///^\\w+$/
            { text: "包含字母，数字", value: "/^[A-Za-z0-9]+$/" },
            { text: "日期格式", value: "/^\\d{4}-\\d{1,2}-\\d{1,2}/" },
          ],
          placeholder: "请输入${title}",
        },
        {
          title: "字典code",
          key: "dictionariesCode",
          align: "center",
          type: FormTypes.sel_search,
          defaultValue: "",
          options: this.dicSetCodeList,
          placeholder: "请输入${title}",
          valueFeild: "code",
        },
      ],
      dicSetCodeList: [],
    };
  },
  mounted() {
    this.getDicSetCode();
  },
  methods: {
    // 新增
    add(m) {
      this.type = true;
      this.currentIndex = "1";
      this.getAllDatabases();
      this.dataSource = [];
      this.dataSource1 = [];
      this.dataSource2 = [];
      this.dataSource3 = [];
      this.getfeiledList("数据表格");
    },
    added(val) {
      this.setDataSource(val.target.dataSource);
      getRefPromise(this, `tabel${this.currentIndex}`).then((editableTable) => {
        editableTable.resetScrollTop();
      });
    },
    getDicSetCode() {
      this.$post("/system/dicSet/selectAll", { text: this.codeTxt }).then(
        (res) => {
          this.dicSetCodeList = res;
          this.columns4[3].options = this.dicSetCodeList;
          console.log(this.columns4);
        }
      );
    },
    deleted(val, a, b) {
      console.log(val, a, b);
      let newData = this.dataSource;
      console.log(newData);
      if (b && b > 0) this.setDataSource(newData.splice(b, 1));
    },
    // 编辑
    edit(m) {
      this.type = false;
      this.currentIndex = "1";
      this.getByPuuid(m.uuid);
    },
    // 获取数据库数据列表
    getAllDatabases() {
      this.$post(this.url.getAllDatabases).then((res) => {
        this.codeBaseList = res.rows;
      });
    },
    // 编辑获取字段列表
    getByPuuid(uuid) {
      this.$post(this.url.getByPuuid, {
        uuid: uuid,
      }).then((res) => {
        this.dataSource = res;
        this.dataSource1 = res;
        this.dataSource2 = res;
        this.dataSource3 = res;
      });
    },
    // 获取字段列表
    getfeiledList(e) {
      this.$post(this.url.getValueType, { value: e }).then((res) => {
        this.dataSource = res;
        this.dataSource1 = res;
        this.dataSource2 = res;
        this.dataSource3 = res;
      });
    },
    //查询获取数据库
    kumingChange(value) {
      this.codeBaseList = [];
      this.$post(this.url.getAllDatabases, {
        database: value,
      }).then((res) => {
        this.codeBaseList = res.row;
      });
    },
    changTabletype(e) {
      if (this.type) this.getfeiledList(e);
    },
    // 字段的新增删除
    changeRows(val) {
      this.dataSource = val;
    },
    // 切换tab
    changeCurrentIndex(key) {
      getRefPromise(this, `tabel${key}`).then((editableTable) => {
        editableTable.resetScrollTop();
      });
    },
    getAllTable() {
      return Promise.all([
        getRefPromise(this, "tabel1"),
        getRefPromise(this, "tabel2"),
        getRefPromise(this, "tabel3"),
        getRefPromise(this, "tabel4"),
      ]);
    },
    // 保存数据
    handleSubmit() {
      let that = this;
      that
        .getAllTable()
        .then((tables) => {
          /** 一次性验证主表和所有的次表 */
          return validateFormAndTables(that.form, tables);
        })
        .then((allValues) => {
          let url = "";
          that.form.validateFields((errors, values) => {
            if (!errors) {
              let params = {
                formdata: JSON.stringify(allValues.formValue),
                southTab: JSON.stringify(this.dataSource),
              };
              // console.log('Received params of form: ', params)
              if (values.uuid) {
                url = that.url.formWizardsUpdate;
              } else {
                url = that.url.formWizardAddSave;
              }
              that.$post(url, params).then((res) => {
                if (res.statusCode === 200 || res === 1) {
                  that.$message.success(res.message);
                  that.$emit("ok");
                } else {
                  that.$emit("ok");
                  that.$message.info(res.message);
                }
              });
              console.log("no errors", values);
            } else {
              console.log("have errors");
            }
          });
        })
        .catch((e) => {
          if (e.error === VALIDATE_NO_PASSED) {
            // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
            this.currentIndex =
              e.index == null ? this.currentIndex : (e.index + 1).toString();
            getRefPromise(this, `tabel${this.currentIndex}`).then(
              (editableTable) => {
                editableTable.resetScrollTop();
              }
            );
            this.$message.warn("请完善信息");
          } else {
            console.error(e);
          }
        });
    },
    //类名转换 驼峰命名
    changeClassName(e) {
      let val = camelCase(e.target.value);
      this.form.setFieldsValue({ className: val });
    },
    // 修改
    handleChange(value, key, column, index) {
      const newData = [...this.dataSource];
      const target = newData[index];
      if (target) {
        target[column] = value;
        if (column === "listClearly") {
          target.javaFiled = camelCase(value);
        }
        this.setDataSource(newData);
      }
    },
    valueChange(val) {
      console.log(val);
      this.handleChange(
        val.value,
        val.row.listClearly,
        val.column.key,
        val.index
      );
    },
    setDataSource(newData) {
      if (this.currentIndex == "1") {
        this.dataSource1 = newData;
        this.dataSource2 = newData;
        this.dataSource3 = newData;
      } else if (this.currentIndex == "2") {
        this.dataSource = newData;
        this.dataSource2 = newData;
        this.dataSource3 = newData;
      } else if (this.currentIndex == "3") {
        this.dataSource = newData;
        this.dataSource1 = newData;
        this.dataSource3 = newData;
      } else {
        this.dataSource = newData;
        this.dataSource1 = newData;
        this.dataSource2 = newData;
      }
    },
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
};
</script>
