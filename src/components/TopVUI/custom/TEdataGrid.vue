<!--
 * @Description: 可编辑表格
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-07-30 11:12:59
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\custom\TEdataGrid.vue
-->
<template>
  <div ref="table" class="advanced-table">
    <a-form :form="edForm">
      <a-table
        ref="table"
        size="small"
        :columns="columns"
        :data-source="dataSource"
        bordered
        :pagination="pagination"
        :rowSelection="rowSelection"
        rowKey="uuid"
        showPagination="auto"
        :customRow="rowClick"
        @change="handleTableChange"
        :rowClassName="rowClassName"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <template
          v-for="(col, index) in columns"
          :slot="col.dataIndex"
          slot-scope="text, record, index"
        >
          <!-- 普通文本框 -->
          <div :key="col.dataIndex" v-if="col.type === 'text'">
            <a-form-item v-if="record.editable">
              <a-input
                v-decorator="[
                  col.dataIndex,
                  { initialValue: text, rules: getOptionRules(col) },
                ]"
                style="margin: -5px 0"
                @change="
                  (e) =>
                    handleChange(e.target.value, record.uuid, col.dataIndex)
                "
              />
            </a-form-item>
            <template v-else>
              <span class="td" v-if="scopedSlots.includes(col.dataIndex)"
                ><slot :name="col.dataIndex"></slot
              ></span>
              <span class="td" v-else>{{ text }}</span>
            </template>
          </div>
          <!-- 下拉框 -->
          <div :key="col.dataIndex" v-if="col.type === 'select'">
            <!-- 下拉单选 -->
            <a-form-item v-if="record.editable">
              <t-dict-select-tag
                v-decorator="[
                  col.dataIndex,
                  { initialValue: text, rules: getOptionRules(col) },
                ]"
                :dictCode="col.option.dictCode"
                v-if="col.option.modeType === 'default'"
                :dataList="col.option.list"
                :style="{
                  width: col.width ? parseInt(col.width) - 20 + 'px' : '150px',
                }"
                @change="(e) => handleChange(e, record.uuid, col.dataIndex)"
              />
              <!-- tag -->
              <t-multi-select-tag
                v-decorator="[
                  col.dataIndex,
                  { initialValue: text, rules: getOptionRules(col) },
                ]"
                :dictCode="col.option.dictCode"
                v-else-if="col.option.modeType === 'tags'"
                :dataList="col.option.list"
                :style="{
                  width: col.width ? parseInt(col.width) - 20 + 'px' : '150px',
                }"
                @change="(e) => handleChange(e, record.uuid, col.dataIndex)"
              ></t-multi-select-tag>
            </a-form-item>
            <template v-else>
              <template v-if="col.option.dictCode">
                <span class="td" v-if="scopedSlots.includes(col.dataIndex)"
                  ><slot
                    :name="col.dataIndex"
                    v-bind="{ text, record, index }"
                  ></slot
                ></span>
                <span class="td" v-else>{{ text }}</span>
              </template>
              <span class="td" v-else>{{
                getFilterDictText(col.list, text)
              }}</span>
            </template>
          </div>
          <!-- 多选下拉框 -->
          <div :key="col.dataIndex" v-if="col.type === 'checkbox'">
            <a-form-item v-if="record.editable">
              <t-multi-select-tag
                v-decorator="[
                  col.dataIndex,
                  { initialValue: text, rules: getOptionRules(col) },
                ]"
                :dictCode="col.dictCode"
                :dataList="col.option.list"
                :type="col.type"
                :style="{
                  width: col.width ? parseInt(col.width) - 20 + 'px' : '150px',
                }"
                @change="(e) => handleChange(e, record.uuid, col.dataIndex)"
              ></t-multi-select-tag>
            </a-form-item>
            <template v-else>
              <template v-if="col.option.dictCode">
                <span class="td" v-if="scopedSlots.includes(col.dataIndex)"
                  ><slot
                    :name="col.dataIndex"
                    v-bind="{ text, record, index }"
                  ></slot
                ></span>
                <span class="td" v-else>{{ text }}</span>
              </template>
              <span class="td" v-else>{{
                getFilterDictText(col.list, text)
              }}</span>
            </template>
          </div>
          <!-- 单选按钮 -->
          <div
            :key="col.dataIndex"
            v-if="col.type === 'radio' || col.type === 'radioButton'"
          >
            <a-form-item v-if="record.editable">
              <t-dict-select-tag
                v-decorator="[
                  col.dataIndex,
                  { initialValue: text, rules: getOptionRules(col) },
                ]"
                :dictCode="col.dictCode"
                :dataList="col.option.list"
                :type="col.type"
                :style="{
                  width: col.width ? parseInt(col.width) - 20 + 'px' : '150px',
                }"
                @change="(e) => handleChange(e, record.uuid, col.dataIndex)"
              />
            </a-form-item>
            <template v-else>
              <template v-if="col.option.dictCode">
                <span class="td" v-if="scopedSlots.includes(col.dataIndex)"
                  ><slot
                    :name="col.dataIndex"
                    v-bind="{ text, record, index }"
                  ></slot
                ></span>
                <span class="td" v-else>{{ text }}</span>
              </template>
              <span class="td" v-else>{{
                getFilterDictText(col.list, text)
              }}</span>
            </template>
          </div>
          <!-- 日期时间输入框 -->
          <div
            :key="col.dataIndex"
            v-if="col.type === 'dateTime' || col.type === 'datebox'"
          >
            <a-form-item v-if="record.editable">
              <t-date
                v-decorator="[
                  col.dataIndex,
                  { initialValue: text, rules: getOptionRules(col) },
                ]"
                style="width: 100%;"
                :trigger-change="true"
                :showTime="col.type === 'dateTime'"
                :dateFormat="
                  col.type === 'datebox' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
                "
                allowClear
                @change="(e) => handleChange(e, record.uuid, col.dataIndex)"
              />
            </a-form-item>
            <template v-else>
              <span class="td" v-if="scopedSlots.includes(col.dataIndex)"
                ><slot
                  :name="col.dataIndex"
                  v-bind="{ text, record, index }"
                ></slot
              ></span>
              <span class="td" v-else>{{ text }}</span>
            </template>
          </div>
          <!-- 数值框 -->
          <div :key="col.dataIndex" v-if="col.type === 'numberbox'">
            <a-form-item v-if="record.editable">
              <a-input-number
                id="inputNumber"
                v-decorator="[
                  col.dataIndex,
                  { initialValue: text, rules: getOptionRules(col) },
                ]"
                :min="col.option.min ? col.option.min : ''"
                :max="col.option.max ? col.option.max : ''"
                :precision="col.option.precision ? col.option.precision : 0"
                :decimalSeparator="
                  col.option.decimalSeparator ? col.option.decimalSeparator : ''
                "
                :style="{
                  width: col.width ? parseInt(col.width) - 20 + 'px' : '100px',
                }"
                @change="(e) => handleChange(e, record.uuid, col.dataIndex)"
              />
            </a-form-item>
            <template v-else>
              <span class="td" v-if="scopedSlots.includes(col.dataIndex)"
                ><slot
                  :name="col.dataIndex"
                  v-bind="{ text, record, index }"
                ></slot
              ></span>
              <span class="td" v-else>{{ text }}</span>
            </template>
          </div>
          <!-- 文件上传框 -->
          <div :key="col.dataIndex" v-if="col.type === 'upload'">
            <a-form-item v-if="record.editable">
              <div>
                <template
                  v-if="uploadValues[index] != null"
                  v-for="(file, fileKey) of [uploadValues[index] || {}]"
                >
                  <a-input :readOnly="true" :value="file.name" :key="fileKey">
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
                      v-decorator="[
                        col.dataIndex,
                        { initialValue: text, rules: getOptionRules(col) },
                      ]"
                      name="file"
                      :accept="col.option.accept ? 'col.option.accept' : ''"
                      :action="getUploadAction(col.option.url)"
                      :showUploadList="false"
                      :headers="uploadHeader"
                      @change="
                        (e) => handleChange(e, record.uuid, col.dataIndex)
                      "
                    >
                      <a-button icon="upload">{{ col.option.btnTxt }}</a-button>
                    </a-upload>
                  </a-tooltip>
                </div>
              </div>
            </a-form-item>
            <template v-else>
              <span class="td" v-if="scopedSlots.includes(col.dataIndex)"
                ><slot
                  :name="col.dataIndex"
                  v-bind="{ text, record, index }"
                ></slot
              ></span>
              <span class="td" v-else>{{ text }}</span>
            </template>
          </div>
          <!-- 弹窗 -->
          <div :key="col.dataIndex" v-if="col.type === 'popup'">
            <a-form-item v-if="record.editable">
              <a-input
                @click="() => handleShowPopup(col.option.ref)"
                style="margin: -5px 0"
              />
            </a-form-item>
            <template v-else>
              <span
                class="td"
                @click="() => handleEdit(col, record)"
                v-if="scopedSlots.includes(col.dataIndex)"
                ><slot
                  :name="col.dataIndex"
                  v-bind="{ text, record, index }"
                ></slot
              ></span>
              <span class="td" @click="() => handleEdit(col, record)" v-else>{{
                text
              }}</span>
            </template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span v-if="record.editable">
              <a style="margin-right: 5px" @click="() => save(record.uuid)"
                >保存</a
              >
              <a style="margin-right: 5px" @click="() => cancel(record.uuid)"
                >取消</a
              >
            </span>
            <span v-else>
              <a
                style="margin-right: 5px"
                :disabled="editingKey !== ''"
                @click="() => edit(record.uuid)"
                >编辑</a
              >
              <a-divider type="vertical" />
              <a @click="() => handleSubRow(record)">删除</a>
            </span>
          </div>
        </template>
      </a-table>
    </a-form>
  </div>
</template>

<script>
import { simpleListMixin } from "@/mixins/simpleListMixin";
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag"; //字典
import TMultiSelectTag from "@/components/TopVUI/dict/TMultiSelectTag"; //多选
import moment from "moment";
import { triggerWindowResizeEvent } from "@/utils/util";
import { filterDictText } from "@/utils/TopVUI";
import { baseUrl } from "@/services/baseUrl.js";
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
// import TDate from '@/components/TopVUI/custom/TDate'
import TPopup from "@/components/TopVUI/custom/TPopup";

export default {
  name: "edataGrid",
  mixins: [simpleListMixin],
  components: {
    TDictSelectTag,
    TPopup,
    TMultiSelectTag,
  },
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
      required: true,
    },
    url: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // create model
      pagination: {
        pageSize: this.pageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        onShowSizeChange: (current, pageSize) =>
          this.onShowSizeChange(current, pageSize),
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        pageNo: 1,
        pageSize: this.pageSize,
      },
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      rows: "",
      isNew: false,
      visible: false,
      confirmLoading: false,
      mdl: null,
      editingKey: "",
      edForm: this.$form.createForm(this),
    };
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
    scopedSlots() {
      return Object.keys(this.$scopedSlots).filter(
        (slot) => slot !== "expandedRowRender" && slot !== "title"
      );
    },
  },
  mounted() {
    this.fetch(this.queryParam);
  },
  methods: {
    fetch(params) {
      this.$post(this.url.getPageSet, params).then((res) => {
        const pager = { ...this.pagination };
        pager.total = res.totalCount;
        this.dataSource = res.rows;
        this.cacheData = res.rows;
        this.pagination = pager;
      });
    },
    getFilterDictText(l, val) {
      return filterDictText(l, val);
    },
    getOptionRules(col) {
      return col.option?.rules ?? [];
    },
    refresh() {
      this.queryParam = {
        pageNo: 1,
        pageSize: this.pageSize,
      };
      this.fetch(this.queryParam);
    },
  },
};
</script>

<style lang="less">
// .advanced-table .ant-calendar {
//   position: fixed !important;
// }
</style>
