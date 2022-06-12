<template>
  <t-modal
    okText="更新"
    cancelText="关闭"
    title="新增/修改"
    :visible="visible"
    :confirmLoading="loading"
    @ok="handleSubmit()"
    :fullscreen="fullscreen"
    :switchFullscreen="fullscreen"
    :width="2000"
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
              <a-select
                v-decorator="[
                  'database',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
                placeholder="所属数据库"
              >
                <a-select-option
                  v-for="(item, index) in codeBaseList"
                  :key="index"
                  :value="item.database"
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
                @change="tableTypeChange"
                v-decorator="[
                  'tableType',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
                placeholder="表类型"
              >
                <a-select-option value="数据表格">
                  数据表格
                </a-select-option>
                <a-select-option value="树形表格">
                  树形表格
                </a-select-option>
                <a-select-option value="可编辑表格">
                  可编辑表格
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
                v-if="showUuid"
                v-decorator="['primaryKeyPolicy']"
                placeholder="主键策略"
              />
              <a-input
                v-else
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
              <a-input
                v-decorator="[
                  'className',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
                placeholder="类名"
              />
            </a-form-item>
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-decorator="['uuid']" type="hidden" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-tabs class="margin-top-xs padding-lg">
        <a-tab-pane tab="字段信息">
          <div
            class="toolbar flex justify-between flex-wrap"
            style="width: 100%;"
          >
            <div class="table-operator">
              <a-button class="cu-btn-primary" icon="plus" @click="handleAdd()"
                >新增</a-button
              >
              <a-button
                class="cu-btn-danger"
                icon="delete"
                @click="handleDelete()"
                >删除</a-button
              >
            </div>
          </div>
          <a-table
            ref="masterList"
            size="small"
            :columns="columns"
            :data-source="dataSource"
            bordered
            :scroll="{ x: 2500 }"
            :pageSize="15"
            :rowKey="(record) => record.listClearly"
            showPagination="auto"
            :rowClassName="rowClassName"
            :customRow="rowClick"
            :rowSelection="rowSelection"
          >
            <template
              v-for="col in [
                'listClearly',
                'length',
                'whetherNull',
                'explain',
                'listClearlyLength',
                'fieldType',
                'primaryKey',
                'javaType',
                'javaFiled',
                'formDisplay',
                'formSort',
                'formType',
                'code',
                'required',
                'parityBit',
                'maximumValue',
                'minimumValue',
                'idField',
                'treeField',
                'levelId',
                'pid',
              ]"
              :slot="col"
              slot-scope="text, record"
            >
              <div :key="col">
                <div v-if="showInput(col, '1')">
                  <a-input
                    :id="col"
                    v-if="record.editable"
                    :class="showRuls(col, text) ? 'redBorder' : ''"
                    style="margin: -5px 0"
                    :value="text"
                    @change="(e) => handleChange(e.target.value, record, col)"
                  />
                  <template v-else>
                    {{ text }}
                  </template>
                </div>
                <div v-if="showInput(col, '2')">
                  <a-select
                    v-if="record.editable"
                    :value="text"
                    @change="(e) => handleChange(e, record, col)"
                    style="width: 100%;"
                  >
                    <a-select-option value="否">
                      否
                    </a-select-option>
                    <a-select-option value="是">
                      是
                    </a-select-option>
                  </a-select>
                  <template v-else>
                    {{ text }}
                  </template>
                </div>
                <div v-else>
                  <div v-if="showInput(col, '3') == 'sqlList'">
                    <div v-if="record.editable">
                      <a-select
                        :value="text"
                        style="width: 100%;"
                        @change="(e) => handleChange(e, record, col)"
                      >
                        <a-select-option
                          v-for="(item, index) in sqlFileTypeList"
                          :key="index"
                          :value="item.value"
                        >
                          {{ item.text }}
                        </a-select-option>
                      </a-select>
                    </div>
                    <template v-else>
                      {{ text }}
                    </template>
                  </div>
                  <div v-if="showInput(col, '3') == 'javaList'">
                    <div v-if="record.editable">
                      <a-select
                        :value="text"
                        style="width: 100%;"
                        @change="(e) => handleChange(e, record, col)"
                      >
                        <a-select-option
                          v-for="(item, index) in javaFileTypeList"
                          :key="index"
                          :value="item.value"
                        >
                          {{ item.text }}
                        </a-select-option>
                      </a-select>
                    </div>
                    <template v-else>
                      {{ text }}
                    </template>
                  </div>
                  <div v-if="showInput(col, '3') == 'formList'">
                    <div v-if="record.editable">
                      <a-select
                        :value="text"
                        style="width: 100%;"
                        @change="(e) => handleChange(e, record, col)"
                      >
                        <a-select-option
                          v-for="(item, index) in topjuiFileTypeList"
                          :key="index"
                          :value="item.value"
                        >
                          {{ item.text }}
                        </a-select-option>
                      </a-select>
                    </div>
                    <template v-else>
                      {{ text }}
                    </template>
                  </div>
                  <div v-if="showInput(col, '3') == 'parityList'">
                    <div v-if="record.editable">
                      <a-select
                        :value="text"
                        style="width: 100%;"
                        @change="(e) => handleChange(e, record, col)"
                      >
                        <a-select-option
                          v-for="(item, index) in topjuiValiTypeList"
                          :key="index"
                          :value="item.value"
                        >
                          {{ item.text }}
                        </a-select-option>
                      </a-select>
                    </div>
                    <template v-else>
                      {{ text }}
                    </template>
                  </div>
                  <div v-if="showInput(col, '3') == 'codeList'">
                    <div v-if="record.editable">
                      <a-select
                        :value="text"
                        style="width: 100%;"
                        @change="(e) => handleChange(e, record, col)"
                      >
                        <a-select-option
                          v-for="(item, index) in codeList"
                          :key="index"
                          :value="item.code"
                        >
                          {{ item.text }}
                        </a-select-option>
                      </a-select>
                    </div>
                    <template v-else>
                      {{ text }}
                    </template>
                  </div>
                </div>
              </div>
            </template>
            <template slot="operation" slot-scope="text, record">
              <div class="editable-row-operations">
                <span v-if="record.editable">
                  <!-- <a style="margin-right: 5px" @click="() => save(record.uuid)">保存</a> -->
                  <a style="margin-right: 5px" @click="() => cancel(record)"
                    >取消</a
                  >
                </span>
                <span v-else>
                  <a style="margin-right: 5px" @click="() => edit(record)"
                    >编辑</a
                  >
                </span>
              </div>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
import { STable, Ellipsis } from "@/components";

const fields = [
  "uuid",
  "database",
  "tableType",
  "tableName",
  "notes",
  "primaryKeyPolicy",
  "className",
];
const columns = [
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    scopedSlots: {
      customRender: "operation",
    },
  },
  {
    title: "列名",
    dataIndex: "listClearly",
    align: "center",
    width: 200,
    scopedSlots: {
      customRender: "listClearly",
    },
  },
  {
    title: "注释",
    dataIndex: "explain",
    align: "center",
    scopedSlots: {
      customRender: "explain",
    },
  },
  {
    title: "类型",
    dataIndex: "fieldType",
    align: "center",
    scopedSlots: {
      customRender: "fieldType",
    },
  },
  {
    title: "长度",
    dataIndex: "listClearlyLength",
    align: "center",
    scopedSlots: {
      customRender: "listClearlyLength",
    },
  },
  {
    title: "是否null",
    dataIndex: "whetherNull",
    align: "center",
    scopedSlots: {
      customRender: "whetherNull",
    },
  },
  {
    title: "主键",
    dataIndex: "primaryKey",
    align: "center",
    scopedSlots: {
      customRender: "primaryKey",
    },
  },
  {
    title: "Java类型",
    dataIndex: "javaType",
    align: "center",
    scopedSlots: {
      customRender: "javaType",
    },
  },
  {
    title: "Java字段名称",
    dataIndex: "javaFiled",
    align: "center",
    width: 200,
    scopedSlots: {
      customRender: "javaFiled",
    },
  },
  {
    title: "表单显示",
    dataIndex: "formDisplay",
    align: "center",
    scopedSlots: {
      customRender: "formDisplay",
    },
  },
  {
    title: "显示表单类型",
    dataIndex: "formType",
    align: "center",
    scopedSlots: {
      customRender: "formType",
    },
  },
  {
    title: "表单排序",
    dataIndex: "formSort",
    align: "center",
    scopedSlots: {
      customRender: "formSort",
    },
  },
  {
    title: "字典集代码",
    dataIndex: "code",
    align: "center",
    scopedSlots: {
      customRender: "code",
    },
  },
  {
    title: "是否必填",
    dataIndex: "required",
    align: "center",
    scopedSlots: {
      customRender: "required",
    },
  },
  {
    title: "校验类型",
    dataIndex: "parityBit",
    align: "center",
    scopedSlots: {
      customRender: "parityBit",
    },
  },
  {
    title: "最小值",
    dataIndex: "maximumValue",
    align: "center",
    scopedSlots: {
      customRender: "maximumValue",
    },
  },
  {
    title: "最大值",
    dataIndex: "minimumValue",
    align: "center",
    scopedSlots: {
      customRender: "minimumValue",
    },
  },
  {
    title: "是否idField",
    dataIndex: "idField",
    align: "center",
    scopedSlots: {
      customRender: "idField",
    },
  },
  {
    title: "是否treeFiled",
    dataIndex: "treeField",
    align: "center",
    scopedSlots: {
      customRender: "treeField",
    },
  },
  {
    title: "是否levelId",
    dataIndex: "levelId",
    align: "center",
    scopedSlots: {
      customRender: "levelId",
    },
  },
  {
    title: "是否pid",
    dataIndex: "pid",
    align: "center",
    scopedSlots: {
      customRender: "pid",
    },
  },
];
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
    sqlFileTypeList: {
      type: Array,
      default: () => [],
    },
    javaFileTypeList: {
      type: Array,
      default: () => [],
    },
    topjuiFileTypeList: {
      type: Array,
      default: () => [],
    },
    topjuiValiTypeList: {
      type: Array,
      default: () => [],
    },
    codeList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    STable,
    Ellipsis,
  },
  data() {
    this.columns = columns;
    return {
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
          span: 17,
        },
      },
      codeBaseList: [],
      dataSource: [],
      cacheData: [],
      queryParam: {},
      form: this.$form.createForm(this),
      formLayout: "inline",
      masterSelectedRowKeys: [],
      masterSelectedRows: [],
      selectedRowKeys: [],
      selectedRows: [],
      masterUuids: "",
      info: "",
      masterRows: "",
      url: {
        generateCodeMoreSave: "/system/sysGenTable/generateCodeMoreSave",
        getAllDatabases: "/system/sysGenTable/getAllDatabases",
        getByPuuid: "/system/sysGenFiled/getByPuuid",
        getValueType: "/system/sysSample/getValueType",
        formWizardAddSave: "/system/sysGenTable/formWizardAddSave",
        formWizardsUpdate: "/system/sysGenTable/formWizardsUpdate",
        deleteByUuid: "/system/generator/deleteByUuid", //uuid
      },
      isNew: false,
      editingKey: "",
      showUuid: false,
      fullscreen: true,
    };
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
  mounted() {
    this.$post(this.url.getAllDatabases).then((res) => {
      this.codeBaseList = res.rows;
    });
  },
  methods: {
    rowkeyValue(record) {
      this.$nextTick(() => {
        if (this.showUuid) {
          return record.id ? record.id : record.uuid;
        } else {
          return record.formSort;
        }
      });
    },
    showInput(type, value) {
      const inputList = [
        "listClearly",
        "explain",
        "javaFiled",
        "formSort",
        "listClearlyLength",
        "maximumValue",
        "minimumValue",
      ];
      const seletelist = [
        "whetherNull",
        "primaryKey",
        "formDisplay",
        "required",
        "idField",
        "treeField",
        "levelId",
        "pid",
      ];
      const sqlList = ["fieldType"];
      const javaList = ["javaType"];
      const formList = ["formType"];
      const parityList = ["parityBit"];
      const codeList = ["code"];
      if (value === "1") {
        if (inputList.find((val) => type === val)) return true;
        return false;
      } else if (value === "2") {
        if (seletelist.find((val) => type === val)) return true;
        return false;
      } else {
        if (type == sqlList) {
          return "sqlList";
        } else if (type == javaList) {
          return "javaList";
        } else if (type == formList) {
          return "formList";
        } else if (type == parityList) {
          return "parityList";
        } else if (type == codeList) {
          return "codeList";
        }
      }
    },
    showRuls(type, text) {
      const inputList = ["listClearly", "explain", "javaFiled", "formSort"];
      if (!text && inputList.find((val) => type === val)) {
        return true;
      } else {
        return false;
      }
    },
    add(m) {
      console.log("add", m);
      this.showUuid = false;
      this.isNew = false;
      this.dataSource = [];
      this.cacheData = [];
      this.selectedRowKeys = [];
      this.selectedRows = [];
    },
    onLoad(data) {
      console.log("edit", data);
      this.showUuid = true;
      this.isNew = false;
      this.selectedRowKeys = [];
      this.selectedRows = [];
      this.form.setFieldsValue(pick(data, fields));
      this.$post(this.url.getByPuuid, {
        uuid: data.uuid,
      }).then((res) => {
        this.dataSource = res;
        this.cacheData = res;
      });
    },
    rowClassName(row) {
      return row.uuid === this.masterUuids ? "bg-bray" : ""; // 每条数据的唯一识别值
    },

    rowClick(record) {
      return {
        on: {
          click: () => {
            this.info = record;
            this.uuid = record.uuid;
            this.masterRows = record;
            this.masterUuids = record.uuid;
            this.rowClassName(record);
          },
        },
      };
    },
    getData() {
      this.$post(this.url.getValueType, this.queryParam).then((res) => {
        res.forEach((val) => {
          this.dataSource.push(val);
          // if(val['listClearly']) val.listClearly = val.listClearly+ new Date()
          // this.dataSource.push(val)
          this.cacheData.push(val);
          // this.dataSource = JSON.parse(JSON.stringify(val))
          // this.cacheData = JSON.parse(JSON.stringify(val))
        });
      });
    },
    tableTypeChange(value) {
      if (!this.showUuid) {
        this.queryParam.value = value;
        this.dataSource.forEach((val) => {
          val.editable = false;
        });
        this.getData();
      }
    },
    handleSubmit(e) {
      const that = this;
      var url = "";
      that.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          let params = {
            formdata: JSON.stringify(values),
            southTab: JSON.stringify(that.dataSource),
          };
          console.log("Received params of form: ", params);
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
        }
      });
    },
    handleAdd() {
      this.dataSource.forEach((val) => {
        val.editable = false;
      });
      this.selectedRowKeys = [];
      this.selectedRows = [];
      const newData = {
        id: this.dataSource.length + 1,
        uuid: "",
        listClearly: "",
        listClearlyLength: "255",
        whetherNull: "是",
        explain: "",
        fieldType: "varchar",
        primaryKey: "否",
        javaType: "String",
        javaFiled: "",
        formDisplay: "是",
        formSort: !this.showUuid ? this.dataSource.length + 1 : "",
        formType: "textbox",
        code: "",
        required: "是",
        parityBit: "",
        maximumValue: "",
        minimumValue: "",
        idField: "否",
        treeField: "否",
        levelId: "否",
        pid: "否",
        editable: true,
      };
      this.isNew = true;
      this.dataSource.splice(0, 0, newData);
    },
    handleDelete() {
      var that = this;
      if (that.selectedRowKeys.length === 0) {
        that.$message.info("请选择操作的数据！");
      } else {
        that.$confirm({
          title: "警告",
          content: `确定要执行该操作吗?`,
          okText: "删除",
          okType: "danger",
          cancelText: "取消",
          onOk() {
            that.selectedRows.forEach((val) => {
              that.dataSource.forEach((el, index) => {
                if (that.showUuid) {
                  if (el.id && el.id === val.id) {
                    that.dataSource.splice(index, 1);
                  } else if (!el.id && el.uuid === val.uuid) {
                    that
                      .$post(that.url.deleteByUuid, {
                        uuid: el.uuid,
                      })
                      .then((res) => {
                        if (res.statusCode === 200 || res === 1) {
                        } else {
                          that.$message.info(el.listClearly + res.message);
                        }
                      });
                  }
                  that.$nextTick(() => {
                    that.selectedRowKeys = [];
                  });
                } else {
                  if (el.formSort === val.formSort) {
                    that.dataSource.splice(index, 1);
                    that.selectedRowKeys = [];
                  }
                }
              });
            });
          },
        });
      }
    },
    handleChange(value, key, column) {
      const newData = [...this.dataSource];
      var target = "";
      target = newData.filter(
        (item) => key.listClearly === item.listClearly
      )[0];
      console.log(key, target);
      if (target) {
        target[column] = value;
        this.dataSource = newData;
      }
    },
    cancel(key) {
      const newData = [...this.dataSource];
      var target = "";
      if (!this.showUuid) {
        target = newData.filter(
          (item) => key.listClearly === item.listClearly
        )[0];
      } else {
        target = key.listClearly
          ? newData.filter((item) => key.listClearly === item.listClearly)[0]
          : newData.filter((item) => key.listClearly === item.listClearly)[0];
      }
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.cacheData.filter(
            (item) => key.listClearly === item.listClearly
          )[0]
        );
        delete target.editable;
        this.dataSource = newData;
        if (this.isNew) this.dataSource.splice(0, 1), (this.isNew = false);
      }
    },
    edit(key) {
      const newData = [...this.dataSource];
      const target = newData.filter(
        (item) => key.listClearly === item.listClearly
      )[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.dataSource = newData;
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
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

<style lang="less" scoped>
.redBorder {
  border: 1px solid red;
}
</style>
