<!--
 * @Description: 可编辑表格，单元格编辑
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-08-10 10:44:22
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\custom\TEdataCell.vue
-->
<template>
  <div @click="handleClickTableRow">
    <a-table
      size="small"
      :columns="columns"
      :data-source="dataBaseList"
      bordered
      :pagination="{
        pageSize: pageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        onShowSizeChange: (current, pageSize) =>
          this.onShowSizeChange(current, pageSize),
      }"
      :rowSelection="rowSelection"
      rowKey="uuid"
      showPagination="auto"
      @change="handleTableChange"
      :scroll="scrollValue"
    >
      <template slot="serial" slot-scope="text, record, index">
        <span>
          {{ index + 1 }}
        </span>
      </template>
      <template
        v-for="(col, index) in columns"
        :slot="col.dataIndex"
        slot-scope="text, record, index"
      >
        <!-- 普通文本框 -->
        <div :key="col.dataIndex" v-if="col.type === 'text'">
          <a-input
            v-model="text"
            v-if="isEditRow(record, col, index)"
            style="margin: -5px 0"
            @blur="
              (e) => {
                handleBlurCommono(e.target, col, index);
              }
            "
          />
          <template v-else>
            <span class="td" @dblclick="() => handleEdit(col, record)">{{
              text
            }}</span>
          </template>
        </div>
        <!-- 下拉框 -->
        <div :key="col.dataIndex" v-if="col.type === 'combbox'">
          <a-select
            v-model="text"
            v-if="isEditRow(record, col, index)"
            :mode="col.option.modeType"
            :style="{
              width: col.width ? parseInt(col.width) - 20 + 'px' : '100px',
            }"
            @change="
              (e) => {
                handleChangeCode(e, index, col, col.option.modeType);
              }
            "
          >
            <a-select-option
              v-if="col.option"
              v-for="item in col.option.list"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <template v-else>
            <span class="td" @dblclick="() => handleEdit(col, record)">{{
              getFilterDictText(col.list, text)
            }}</span>
          </template>
        </div>
        <!-- 日期时间输入框 -->
        <div
          :key="col.dataIndex"
          v-if="col.type === 'dateTime' || col.type === 'datebox'"
        >
          <t-date
            v-model="text"
            v-if="isEditRow(record, col, index)"
            style="width: 100%;"
            :trigger-change="true"
            :showTime="col.type === 'dateTime'"
            :dateFormat="
              col.type === 'datebox' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
            "
            allowClear
            @change="
              (v) =>
                handleChangeJDateCommon(
                  v,
                  record,
                  col,
                  col.type === 'dateTime',
                  index
                )
            "
          />
          <template v-else>
            <span class="td" @dblclick="() => handleEdit(col, record)">{{
              text
            }}</span>
          </template>
        </div>
        <!-- 多选框 -->
        <div :key="col.dataIndex" v-if="col.type === 'checkbox'">
          <a-checkbox-group
            v-model="text"
            name="checkboxgroup"
            v-if="isEditRow(record, col, index)"
            :options="col.list"
            @change="(v) => onChangeCheckbox(v, col, index)"
          ></a-checkbox-group>
          <template v-else>
            <span class="td" @dblclick="() => handleEdit(col, record)">{{
              getFilterDictText(col.list, text)
            }}</span>
          </template>
        </div>
        <!-- 数值框 -->
        <div :key="col.dataIndex" v-if="col.type === 'numberbox'">
          <a-input-number
            id="inputNumber"
            v-if="isEditRow(record, col, index)"
            :default-value="text"
            :min="col.option.min ? col.option.min : 0"
            :max="col.option.max ? col.option.max : null"
            :precision="col.option.precision ? col.option.precision : 0"
            :decimalSeparator="
              col.option.decimalSeparator ? col.option.decimalSeparator : ''
            "
            :style="{
              width: col.width ? parseInt(col.width) - 20 + 'px' : '100px',
            }"
            @change="(v) => changeNumber(v, col, index)"
          />
          <template v-else>
            <span class="td" @dblclick="() => handleEdit(col, record)">{{
              text
            }}</span>
          </template>
        </div>
        <!-- 单选按钮-->
        <div :key="col.dataIndex" v-if="col.type === 'radio'">
          <a-radio-group
            v-model="text"
            v-if="isEditRow(record, col, index)"
            @change="(e) => handleRadioChange(e.target.value, col, index)"
          >
            <a-radio
              v-for="(item, key) in col.list"
              :key="key"
              :value="item.value"
              >{{ item.label }}</a-radio
            >
          </a-radio-group>
          <template v-else>
            <span class="td" @dblclick="() => handleEdit(col, record)">{{
              getFilterDictText(col.list, text)
            }}</span>
          </template>
        </div>
        <!-- 文件上传框 -->
        <div :key="col.dataIndex" v-if="col.type === 'upload'">
          <div v-if="isEditRow(record, col, index)">
            <template
              v-if="uploadValues[index] != null"
              v-for="(file, fileKey) of [uploadValues[index] || {}]"
            >
              <a-input :readOnly="true" :value="file.name">
                <template slot="addonBefore" style="width: 30px">
                  <a-tooltip
                    v-if="file.status === 'uploading'"
                    :title="`上传中(${Math.floor(file.percent)}%)`"
                  >
                    <a-icon type="loading" />
                  </a-tooltip>
                  <a-tooltip
                    v-else-if="file.status === 'done'"
                    title="上传完成"
                  >
                    <a-icon type="check-circle" style="color:#00DB00;" />
                  </a-tooltip>
                  <a-tooltip v-else title="上传失败">
                    <a-icon type="exclamation-circle" style="color:red;" />
                  </a-tooltip>
                </template>
                <template
                  v-if="
                    col.allowDownload !== false || col.allowRemove !== false
                  "
                  slot="addonAfter"
                  style="width: 30px"
                >
                  <a-dropdown :trigger="['click']" placement="bottomRight">
                    <a-tooltip title="操作">
                      <a-icon
                        v-if="file.status !== 'uploading'"
                        type="setting"
                        style="cursor: pointer;"
                      />
                    </a-tooltip>
                    <a-menu slot="overlay">
                      <a-menu-item
                        v-if="col.allowDownload !== false"
                        @click="handleClickDownloadFile(index)"
                      >
                        <span><a-icon type="download" />&nbsp;下载</span>
                      </a-menu-item>
                      <a-menu-item
                        v-if="col.allowRemove !== false"
                        @click="handleClickDelFile(index)"
                      >
                        <span><a-icon type="delete" />&nbsp;删除</span>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </template>
              </a-input>
            </template>
            <div :hidden="uploadValues[index] != null">
              <a-tooltip>
                <a-upload
                  v-model="text"
                  name="file"
                  :accept="col.option.accept ? 'col.option.accept' : ''"
                  :action="getUploadAction(col.option.url)"
                  :showUploadList="false"
                  :headers="uploadHeader"
                  @change="
                    (v) => handleChangeUpload(v, col, index, record.uuid)
                  "
                >
                  <a-button icon="upload">{{ col.option.btnTxt }}</a-button>
                </a-upload>
              </a-tooltip>
            </div>
          </div>
          <template v-else>
            <span class="td" @dblclick="() => handleEdit(col, record)">{{
              text
            }}</span>
          </template>
        </div>
        <!-- 弹窗 -->
        <div :key="col.dataIndex" v-if="col.type === 'popup'">
          <a-input
            @click="() => handleShowPopup(col.option.ref)"
            v-if="isEditRow(record, col, index)"
            style="margin: -5px 0"
          />
          <template v-else>
            <span class="td" @click="() => handleEdit(col, record)">{{
              text
            }}</span>
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <span v-if="isNew">
            <a @click="() => save(index)">保存</a>
            <a-popconfirm
              title="确定取消该操作吗"
              @confirm="() => cancel(record.uuid)"
            >
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="() => handleEdiTableDel(record, 'master')">删除</a>
          </span>
        </div>
      </template>
    </a-table>
  </div>
</template>
<script>
import moment from "moment";
import { triggerWindowResizeEvent } from "@/utils/util";
import { filterDictText } from "@/utils/TopVUI";
import { dataListMixin } from "@/mixins/dataListMixin";
import { STable, Ellipsis } from "@/components";

import { baseUrl } from "@/services/baseUrl.js";
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
// import TDate from '@/components/TopVUI/custom/TDate'
import TPopup from "@/components/TopVUI/custom/TPopup";
export default {
  name: "TEdataGrid",
  mixins: [dataListMixin],
  components: { STable, Ellipsis, TPopup },
  props: {
    // 列信
    columns: {
      type: Array,
      required: true,
    },
    // 数据源
    dataList: {
      type: Array,
      default: () => [],
    },
    // 是否显示操作按钮
    actionButton: {
      type: Boolean,
      default: false,
    },
    // 是否显示行号
    rowNumber: {
      type: Boolean,
      default: false,
    },
    // // 页面是否在加载中
    // loading: {
    //   type: Boolean,
    //   default: false
    // },
    // 页面是否在加载中
    maxHeight: {
      type: Number,
      default: 400,
    },
    scrollValue: {
      type: Object,
      default() {
        return {};
      },
    },
    // 要禁用的行
    disabledRows: {
      type: Object,
      default() {
        return {};
      },
    },
    // 是否禁用全部组件
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否可拖拽排序
    dragSort: {
      type: Boolean,
      default: false,
    },
    dragSortKey: {
      type: String,
      default: "orderNum",
    },
    interface: {
      type: Object,
      default() {
        return {};
      },
    },
    pageSize: {
      type: Number,
      default: 20,
    },
    queryParams: {
      type: Object,
    },
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      mdl: null,
      editingKey: "",
      alwaysEdit: false,
      currentEditRows: {},
      masterSelectedRowKeys: [],
      masterSelectedRows: [],
      inputValues: [],
      editIndex: -1,
      editCol: "",
      flag: false,
      dataBaseList: [],
      inputValues: "",
      isNew: false,
      uploadValues: [],
      uploadHeader: {
        token: Vue.ls.get(ACCESS_TOKEN),
      },
      jdateValues: [],
      checkboxValues: [],
      radioValues: [],
      masterUuids: "",
    };
  },
  created() {
    this.refresh(this.queryParams);
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.masterSelectedRowKeys,
        onChange: this.onSelectChangeMaster,
      };
    },
  },
  mounted() {
    window.addEventListener("click", this.clickOther, false);
  },
  methods: {
    // 获取表格数据
    refresh(params) {
      console.log(params);
      this.$post(this.interface.masterList, params).then((res) => {
        const pager = { ...this.pagination };
        pager.total = res.totalCount;
        this.dataBaseList = res.rows;
        this.cacheData = res.rows;
        this.$emit("pagination", pager);
      });
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.$emit("pagination", pager);
      this.refresh({
        pageSize: pagination.pageSize,
        pageNo: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },
    onShowSizeChange(current, pageSize) {
      const pager = { ...this.pagination };
      pager.pageSize = pageSize;
      this.pagination = pager;
      this.refresh({
        pageSize: pageSize,
        pageNo: current,
      });
    },
    // 勾选事件
    onSelectChangeMaster(selectedRowKeys, selectedRows) {
      selectedRows.forEach((e, index) => {
        if (index === 0) {
          this.masterUuids = e.uuid;
        } else {
          this.masterUuids = this.masterUuids + "," + e.uuid;
        }
      });
      this.masterSelectedRowKeys = selectedRowKeys;
      this.masterSelectedRows = selectedRows;
    },
    customCell(record, index) {
      console.log(record, index);
    },
    moment,
    handleChangeCode(value, index, col, type) {
      this.dataBaseList[index][col.dataIndex] =
        type === "default" ? value : value.toString();
    },
    getFilterDictText(l, val) {
      return filterDictText(l, val);
    },
    /** 上传请求地址 */
    getUploadAction(value) {
      if (!value) {
        return baseUrl + "/system/attachment/upload";
      } else {
        return baseUrl + value;
      }
    },
    /* 文件上传*/
    handleChangeUpload(v, col, index, uuid) {
      console.log(v);
      const file = v.file;
      let value = {
        name: file.response.filePath,
        type: file.type,
        size: file.size,
        status: file.status,
        percent: file.percent,
      };
      // if (column.responseName && file.response) {
      //   value['responseName'] = file.response[column.responseName]
      // }
      // if (file.status === 'done') {
      //   value['path'] = file.response[column.responseName]
      // } else if (file.status === 'error') {
      //   value['message'] = file.response.message || '未知错误'
      // }
      this.uploadValues = this.bindValuesChange(value, index, "uploadValues");
      console.log(this.uploadValues);
      this.dataBaseList[index][col.dataIndex] = file.response.filePath;
    },
    // 删除
    handleClickDelFile(index) {
      const value = null;
      this.uploadValues = this.bindValuesChange(value, index, "uploadValues");
    },
    // 下载
    handleClickDownloadFile(index) {
      let { path } = this.uploadValues[index] || {};
      if (path) {
        let url = baseUrl + path;
        window.open(url);
      }
    },
    // 时间日期
    handleChangeJDateCommon(value, row, column, showTime, index) {
      console.log(value);
      this.dataBaseList[index][column.dataIndex] = value;
      // this.jdateValues = this.bindValuesChange(value, index, 'jdateValues')
      // this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')
      // 触发valueChange 事件
      // if (showTime) {
      //   this.elemValueChange('dateTime', row, column, value)
      // } else {
      //   this.elemValueChange('datebox', row, column, value)
      // }
    },
    // 复选框
    onChangeCheckbox(value, column, index) {
      console.log(value);
      this.dataBaseList[index][column.dataIndex] = value.toString();
    },
    /* 单选框*/
    handleRadioChange(value, column, index) {
      this.dataBaseList[index][column.dataIndex] = value;
      // this.radioValues = this.bindValuesChange(value, index, 'radioValues')
    },
    //数值
    changeNumber(v, col, index) {
      this.dataBaseList[index][col.dataIndex] = v;
      console.log(v);
    },
    /** 记录用到数据绑定的组件的值 */
    bindValuesChange(value, index, key) {
      this.$set(this[key], index, value);
      return this[key];
    },
    onPanelChange(value, mode) {
      console.log(value, mode);
    },
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    // 单元格编辑
    handleEdit(c, r) {
      this.alwaysEdit = true;
      this.flag = true;
      this.currentEditRows = {
        [r.uuid]: {
          [c.dataIndex]: true,
        },
      };
      if (c.type === "text") {
        this.$nextTick(() => {
          // this.forceUpdateFormValues()
          // 自动获取焦点
          let el = document.getElementById(`${c.dataIndex}${r.uuid}`);
          if (el) {
            el.focus();
          }
        });
      }
    },
    // 编辑状态
    isEditRow(row, col, index) {
      // if (this.alwaysEdit) {
      //   return true
      // }
      triggerWindowResizeEvent();
      if (this.isNew && index === 0) return true;

      let current = this.currentEditRows[row.uuid];
      let cu = !!(current && current[col.dataIndex] === true);
      if (cu === true) {
        this.editIndex = index;
        this.editCol = col.dataIndex;
        return true;
      } else {
        if (this.flag) {
          if (this.editIndex === index && this.editCol === col.dataIndex) {
            this.editIndex = -1;
            if (!this.isNew) {
              this.handleEdiTableEdit(this.dataBaseList[index]);
              this.refresh();
            }
          }
        }
      }
      return !!(current && current[col.dataIndex] === true);
    },
    // 失焦
    handleBlurCommono(target, column, index) {
      this.dataBaseList[index][column.dataIndex] = target.value;
    },
    // 添加一行数据
    add() {
      if (this.isNew) return true;
      // this.mdl = null
      // this.visible = true
      const newData = {
        name: "",
        code: "",
        value: "",
        description: "",
        creator: "",
        createTime: "",
        editable: true,
      };
      this.dataBaseList = [newData, ...this.dataBaseList];
      this.isNew = true;
    },
    // 清空编辑状态
    handleClickTableRow(event) {
      console.log(event);
      let { target } = event;
      if (
        target.nodeName === "TH" ||
        target.nodeName === "TD" ||
        target.nodeName === "TR"
      ) {
        // 清空编辑状态
        this.currentEditRows = {};
      }
    },
    edit(key) {
      // this.handleEdiTableEdit(this.dataBaseList[index])
      const newData = [...this.dataBaseList];
      const target = newData.filter((item) => key === item.key)[0];
      console.log(target);
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.dataBaseList = newData;
        console.log(this.dataBaseList);
      }
    },
    save(index) {
      this.handleEdiTableAdd(this.dataBaseList[index]);
      this.isNew = false;
      // const newData = [...this.data]
      // const newCacheData = [...this.cacheData]
      // const target = newData.filter(item => key === item.key)[0]
      // const targetCache = newCacheData.filter(item => key === item.key)[0]
      // if (target && targetCache) {
      //   delete target.editable
      //   this.data = newData
      //   Object.assign(targetCache, target)
      //   this.cacheData = newCacheData
      // }
      // this.editingKey = ''
    },
    cancel(key) {
      this.isNew = false;
      this.dataBaseList.splice(0, 1);
    },
    /** 辅助方法：指定a-select 和 j-data 的父容器 */
    getParentContainer(node) {
      let element = (() => {
        // nodeType 8	: Comment	: 注释
        if (this.$el && this.$el.nodeType !== 8) {
          return this.$el;
        }
        let doc = document.getElementById(this.caseId + "inputTable");
        if (doc != null) {
          return doc;
        }
        return node.parentNode.parentNode.parentNode.parentNode.parentNode
          .parentNode;
      })();

      // 递归判断是否带有 overflow: hidden；的父元素
      const ifParent = (child) => {
        let currentOverflow = null;
        if (child["currentStyle"]) {
          currentOverflow = child["currentStyle"]["overflow"];
        } else if (window.getComputedStyle) {
          currentOverflow = window.getComputedStyle(child)["overflow"];
        }
        if (currentOverflow != null) {
          if (currentOverflow === "hidden") {
            // 找到了带有 hidden 的标签，判断它的父级是否还有 hidden，直到遇到完全没有 hidden 或 body 的时候才停止递归
            let temp = ifParent(child.parentNode);
            return temp != null ? temp : child.parentNode;
          }
          // 当前标签没有 hidden ，如果有父级并且父级不是 body 的话就继续递归判断父级
          else if (
            child.parentNode &&
            child.parentNode.tagName.toLocaleLowerCase() !== "body"
          ) {
            return ifParent(child.parentNode);
          } else {
            // 直到 body 都没有遇到有 hidden 的标签
            return null;
          }
        } else {
          return child;
        }
      };

      let temp = ifParent(element);
      return temp != null ? temp : element;
    },
    clickOther: function(event) {
      // console.log(event);
      if (
        event.target.nodeName !== "INPUT" ||
        event.target.className !== "ant-select-selection__rendered"
      ) {
        // this.currentEditRows = {}
      } else {
        console.log("qw12313223432");
      }
    },
  },
  beforeDestroy() {
    // 实例销毁之前对点击事件进行解绑
    window.removeEventListener("click", this.clickOther);
  },
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.td {
  display: inline-block;
  width: 100%;
  min-height: 20px;
}
</style>
