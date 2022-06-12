<template>
  <div
    ref="table"
    :id="id"
    class="advanced-table"
    :style="{ height: tableHeight }"
  >
    <!-- 数据表格 -->
    <a-form :form="edForm">
      <a-table
        :class="{ 'table-edit-15468': isEditable }"
        ref="edataGrid"
        v-bind="{
          ...$options.propsData,
          columns: visibleColumns,
          title: undefined,
        }"
        bordered
        :loading="edataGridLoading"
        :data-source="dataSource"
        :size="size"
        @change="handleTableChange"
        :rowClassName="rowClassName"
        :rowSelection="rowSelection"
        :components="this.cellcomponents"
        :customRow="rowClick"
        :pagination="pagination"
        :customHeaderRow="customHeaderRow"
        :scroll="scrollXY"
      >
        <span v-if="rownumbers" slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <template
          v-for="(col, index) in visibleColumns"
          :slot="col.dataIndex"
          slot-scope="text, record, index"
        >
          <!-- 普通文本框 -->
          <div
            :key="col.dataIndex"
            v-if="col.type === 'text'"
            class="td-content"
          >
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
              <span class="td" v-if="scopedSlots.includes(col.dataIndex)">
                <slot :name="col.dataIndex"></slot>
              </span>
              <span class="td" v-else>{{ text }}</span>
            </template>
          </div>
          <!-- 下拉框 -->
          <div
            :key="col.dataIndex"
            v-if="col.type === 'select'"
            class="td-content"
          >
            <!-- 下拉单选 -->
            <a-form-item v-if="record.editable">
              <t-dict-select-tag
                v-decorator="[
                  col.dataIndex,
                  { initialValue: text, rules: getOptionRules(col) },
                ]"
                :dataType="col.option.dataType"
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
                :dataType="col.option.dataType"
                :dictCode="col.option.dictCode"
                v-else-if="col.option.modeType === 'tags'"
                :dataList="col.option.list"
                :style="{
                  width: col.width ? parseInt(col.width) - 20 + 'px' : '150px',
                }"
                @change="(e) => handleChange(e, record.uuid, col.dataIndex)"
              ></t-multi-select-tag>
            </a-form-item>
            <!-- <span class="td" v-else>{{ text }}11</span> -->
            <template v-else>
              <template v-if="col.option.dictCode">
                <span class="td" v-if="scopedSlots.includes(col.dataIndex)">
                  <slot
                    :name="col.dataIndex"
                    v-bind="{ text, record, index }"
                  ></slot>
                </span>
                <span class="td" v-else>{{ text }}</span>
              </template>
              <span class="td" v-else>{{
                getFilterDictText(col.option.dictCode, text)
              }}</span>
            </template>
          </div>
          <!-- 多选下拉框 -->
          <div
            :key="col.dataIndex"
            v-if="col.type === 'checkbox'"
            class="td-content"
          >
            <a-form-item v-if="record.editable">
              <t-multi-select-tag
                v-decorator="[
                  col.dataIndex,
                  { initialValue: text, rules: getOptionRules(col) },
                ]"
                :dataType="col.option.dataType"
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
                <span class="td" v-if="scopedSlots.includes(col.dataIndex)">
                  <slot
                    :name="col.dataIndex"
                    v-bind="{ text, record, index }"
                  ></slot>
                </span>
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
            class="td-content"
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
                <span class="td" v-if="scopedSlots.includes(col.dataIndex)">
                  <slot
                    :name="col.dataIndex"
                    v-bind="{ text, record, index }"
                  ></slot>
                </span>
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
            class="td-content"
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
              <span class="td" v-if="scopedSlots.includes(col.dataIndex)">
                <slot
                  :name="col.dataIndex"
                  v-bind="{ text, record, index }"
                ></slot>
              </span>
              <span class="td" v-else>{{ text }}</span>
            </template>
          </div>
          <!-- 数值框 -->
          <div
            :key="col.dataIndex"
            v-if="col.type === 'numberbox'"
            class="td-content"
          >
            <a-form-item v-if="record.editable">
              <a-input-number
                id="inputNumber"
                v-decorator="[
                  col.dataIndex,
                  { initialValue: text, rules: getOptionRules(col) },
                ]"
                :min="col.option.min ? col.option.min : 0"
                :max="col.option.max ? col.option.max : 100"
                :precision="col.option.precision ? col.option.precision : 0"
                :style="{
                  width: col.width ? parseInt(col.width) - 20 + 'px' : '100px',
                }"
                @change="(e) => handleChange(e, record.uuid, col.dataIndex)"
              />
            </a-form-item>
            <template v-else>
              <span class="td" v-if="scopedSlots.includes(col.dataIndex)">
                <slot
                  :name="col.dataIndex"
                  v-bind="{ text, record, index }"
                ></slot>
              </span>
              <span class="td" v-else>{{ text }}</span>
            </template>
          </div>
          <!-- 文件上传框 -->
          <div
            :key="col.dataIndex"
            v-if="col.type === 'upload'"
            class="td-content"
          >
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
                            <span> <a-icon type="download" />&nbsp;下载 </span>
                          </a-menu-item>
                          <a-menu-item
                            v-if="col.allowRemove !== false"
                            @click="handleClickDelFile(index)"
                          >
                            <span> <a-icon type="delete" />&nbsp;删除 </span>
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
            <div v-else class="td-content">
              <span class="td" v-if="scopedSlots.includes(col.dataIndex)">
                <slot
                  :name="col.dataIndex"
                  v-bind="{ text, record, index }"
                ></slot>
              </span>
              <span class="td" v-else>{{ text }}</span>
            </div>
          </div>
          <!-- 弹窗 -->
          <!-- <div :key="col.dataIndex" v-if="col.type === 'popup'">
							<a-form-item v-if="record.editable">
								<a-input @click="() => handleShowPopup(col.option.ref)" style="margin: -5px 0" />
							</a-form-item>
							<template v-else>
								<span
									class="td"
									@click="() => handleEdit(col, record)"
									v-if="scopedSlots.includes(col.dataIndex)"
									><slot :name="col.dataIndex" v-bind="{ text, record, index }"></slot
								></span>
								<span class="td" @click="() => handleEdit(col, record)" v-else>{{ text }}</span>
							</template>
						</div> -->
        </template>
        <template slot="action" slot-scope="text, record">
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
              <a @click="() => handleSub(record)">删除</a>
              <slot name="actionBtn" v-if="$slots.actionBtn"></slot>
            </span>
          </div>
        </template>
        <!-- <template
          slot-scope="text, record, index"
          :slot="slot"
          v-for="slot in scopedSlots"
        >
          <slot :name="slot" v-bind="{ text, record, index }"></slot>
        </template> -->
        <template :slot="slot" v-for="slot in slots">
          <slot :name="slot"></slot>
        </template>
        <template
          slot-scope="record, index, indent, expanded"
          :slot="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"
        >
          <slot
            v-bind="{ record, index, indent, expanded }"
            :name="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"
          ></slot>
        </template>
      </a-table>
    </a-form>
    <!-- 右键菜单 start -->
    <div
      v-show="showRightMenu"
      :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
      class="right-menu"
      @mouseleave="mouseLeave"
    >
      <action-columns :columns="columns" @reset="onColumnsReset" class="action">
        <template :slot="slot" v-for="slot in slots">
          <slot :name="slot"></slot>
        </template>
      </action-columns>
    </div>
  </div>
</template>

<script>
import ActionColumns from "@/components/table/advance/ActionColumns";
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
import { resizeableTitle } from "@/utils/util";
import { eDataGridMixin } from "@/mixins/eDataGridMixin";
export default {
  name: "EdataGrid",
  mixins: [eDataGridMixin],
  components: {
    ActionColumns,
    TDictSelectTag,
    TPopup,
    TMultiSelectTag,
  },
  props: {
    url: Object,
    tableLayout: String,
    bordered: Boolean,
    childrenColumnName: Array[String],
    columns: Array,
    components: Object,
    defaultExpandAllRows: Array[String],
    expandedRowKeys: Array[String],
    expandedRowRender: Function,
    expandIcon: Function,
    expandRowByClick: Boolean,
    expandIconColumnIndex: Number,
    footer: Function,
    indentSize: Number,
    loading: Boolean,
    locale: Object,
    customRow: Function,
    rowKey: [String, Function],
    scroll: Object,
    showHeader: Boolean,
    size: {
      default: "small",
      type: String,
    },
    title: String,
    customCell: Function,
    getPopupContainer: Function,
    transformCellText: Function,
    formatConditions: Boolean,
    rownumbers: {
      default: true,
      type: Boolean,
    },
    pageSize: {
      type: Number,
      default: 20,
    },
    queryParam: {
      type: Object,
    },
    rowSelectionType: {
      type: String,
      default: "checkbox",
    },
  },
  provide() {
    return {
      table: this,
    };
  },
  data() {
    // 表格列拖拽的配置
    this.cellcomponents = {
      header: {
        cell: (h, props, children) =>
          resizeableTitle(h, props, children, this.columns),
      },
    };
    return {
      id: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
      fullScreen: false,
      conditions: {},
      rowKeys: "",
      pagination: {
        //分页配置
        pageSize: this.pageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        hideOnSinglePage: false,
        showTotal: (total, range) => `共 ${total} 条`,
        onShowSizeChange: (current, pageSize) =>
          this.onShowSizeChange(current, pageSize),
      },
      dataSource: [],
      cacheData: [],
      editingKey: "",
      edForm: this.$form.createForm(this),
      selectedRowKeys: [],
      selectedRows: [],
      rows: null,
      showRightMenu: false,
      menuTop: "",
      menuLeft: "",
      isNew: false,
      pageTableBoxHeight: 0, //单个表格高度
      toolbarTableHeight: 0,
      antbar: 0,
      antcontent: 0,
      pageClientHeight: 0, //使用固定的页面布局时的页面高度
      toolbarHeight: 0, //有表格操作按钮时的按钮高度
      paginationtHeight: 34, //分页组件的高度
      edataGridLoading: true, //是否加载中
			arrayCutting: {} // 用于新增时储存被切割的数据
    };
  },
  computed: {
    slots() {
      return Object.keys(this.$slots).filter((slot) => slot !== "title");
    },
    scopedSlots() {
      return Object.keys(this.$scopedSlots).filter(
        (slot) => slot !== "expandedRowRender" && slot !== "title"
      );
    },
    // 显示隐藏表格列
    visibleColumns() {
      let columns = this.columns;
      let serial = {
        title: "#",
        width: 50,
        align: "center",
        type: "serial",
        scopedSlots: {
          customRender: "serial",
        },
      };
      if (
        this.rownumbers &&
        columns.filter((col) => col.type === "serial").length === 0
      ) {
        columns.splice(0, 0, serial);
      }
      return columns.filter((col) => col.visible);
    },
    // 表格勾选
    rowSelection() {
      return {
        columnWidth: 50,
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        onSelectAll: this.onSelectAll,
        onSelectInvert: this.onSelectInvert,
        type: this.rowSelectionType,
      };
    },
    // 是否为编辑  主要处理编辑时 样式问题 如：日期组件显示不全
    isEditable() {
      const list = this.dataSource.filter((col) => col.editable === true);
      if (list.length > 0) return true;
      return false;
    },
    //表格竖向滚动条设置
    scrollXY() {
      let height = "";
      if (this.antcontent && this.antcontent > 0) {
        height =
          this.antcontent -
          this.toolbarHeight -
          this.antbar -
          40 -
          this.paginationtHeight;
      } else {
        height =
          this.pageClientHeight -
          this.toolbarHeight -
          this.antbar -
          40 -
          22 -
          this.paginationtHeight;
      }
      const tdHeight = this.dataSource?.length * 40 ?? 0;
      let scroll = "";
      if (this.scroll)
        scroll = {
          x: this.scroll.x,
          y: height,
        };
			let width = 0;
			this.columns.forEach(item => {
				if(item.width){
					width += item.width
				}
			})
      return this.scroll
        ? scroll
        : this.dataSource?.length >= 20 || height < tdHeight
        ? {
            y: height,
						x: width
          }
        : {};
    },
    tableHeight() {
      let height = "";
      if (!this.toolbarHeight) {
        height = `calc(100% - 40px)`;
      } else {
        height = `calc(100% - ${this.toolbarHeight}px - 40px)`;
      }
      return height;
    },
  },
  // 监听获取表格参数的变化，有时候不能及时更新参数的传递
  watch: {
    queryParam: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.queryParamObj = newVal;
      },
    },
  },
  created() {
    this.addListener();
    this.fetch(this.queryParamObj);
  },
  beforeDestroy() {
    this.removeListener();
    this.destroyResizeEvent();
  },
  mounted() {
    this.resizeHandler();
    this.initResizeEvent();
  },
  methods: {
    // 表格高度自适应
    resizeHandler() {
      let tableId = this.$refs.edataGrid.$parent.$parent.$el.id;
      // 获取菜单按钮的高度
      let toolbar = document.getElementById(tableId)?.previousElementSibling;
      if (toolbar && toolbar.className.indexOf("toolbar") >= 0) {
        this.toolbarHeight = document.getElementById(
          tableId
        )?.previousElementSibling?.clientHeight;
      }
      // 获取页面内容的高度
      this.pageClientHeight = document.getElementsByClassName(
        "page-common-layout"
      )[0]?.clientHeight;
      const paginationt = this.$refs.edataGrid?.$children[0].$children[0]
        .$children[0].$children[1];
      if (paginationt) {
        this.paginationtHeight = document.getElementsByClassName(
          paginationt.$el.className
        )[0]?.clientHeight;
      }

      // // 获取tabs的高度
      let antIdBom = document.getElementById(tableId)?.parentNode.className; //当前数据表格的id
      this.antbar =
        antIdBom == "ant-card-body"
          ? document.getElementsByClassName("ant-tabs-bar")[0]?.clientHeight
          : 0;
      this.antcontent = document.getElementsByClassName(
        "page-common-box-content"
      )[0]?.clientHeight;
    },
    //监听resize
    initResizeEvent() {
      window.addEventListener("resize", this.resizeHandler, false);
    },
    //移除resize
    destroyResizeEvent() {
      window.removeEventListener("resize", this.resizeHandler);
    },
    onSelectAll(selected, selectedRows, changeRows) {
      this.$emit("onSelectAll", selected, selectedRows, changeRows);
    },
    onSelectInvert(selectedRows) {
      this.$emit("onSelectInvert", selectedRows);
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      this.$emit("onSelectChange", selectedRowKeys, selectedRows);
    },
    // 刷新
    refresh() {
      this.edataGridLoading = true;
      this.selectedRowKeys = [];
      this.selectedRows = [];
      this.rows = null;
      this.rowKeys = null;
			this.pagination.current = 1
			if (this.isNew) {
				this.isNew = false
				this.dataSource.splice(0, 1)
				this.editingKey = ''
			}
      setTimeout(() => {
        //延迟加载主要处理更新不及时的问题
        this.fetch(this.queryParamObj);
      }, 100);
    },
    // 获取数据表格数据
    fetch(params) {
			if(JSON.stringify(params) == '{}'){
				params.pageSize = this.pagination.pageSize
				params.pageNo = this.pagination.current || 1
			}
			this.queryParamObj = params
      this.selectedRowKeys = [];
      this.selectedRows = [];
      this.rows = null;
      this.rowKeys = null;
      this.$post(this.url.getPageSet, params).then((res) => {
        const pager = {
          ...this.pagination,
        };
        pager.total = res.totalCount;
        this.dataSource = res.rows;
        this.cacheData = res.rows.map((item) => ({
          ...item,
        }));
        this.pagination = pager;
        this.edataGridLoading = false;
      });
    },
    getFilterDictText(l, val) {
      return filterDictText(l, val);
    },
    getOptionRules(col) {
      return col.option?.rules ?? [];
    },
    // 搜索
    onSearchChange(conditions, searchOptions) {
      this.conditions = conditions;
      this.$refs.AdvanceTable.refresh();
      // this.$emit('search', conditions, searchOptions);
    },
    // 全屏切换
    toggleScreen() {
      if (this.fullScreen) {
        this.outFullScreen();
      } else {
        this.inFullScreen();
      }
    },
    // 行点击事件
    rowClick(record, index) {
      const that = this;
      return {
        on: {
          click: () => {
            that.rowKeys = record[this.rowKey];
            that.rows = record;
            that.$emit("rowClick", record, index);
          },
        },
      };
    },
    // 表格行悬浮样式
    rowClassName(row) {
      return row[this.rowKey] === this.rowKeys ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    // 全屏
    inFullScreen() {
      const el = this.$refs.table;
      el.classList.add("beauty-scroll");
      if (el.requestFullscreen) {
        el.requestFullscreen();
        return true;
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen();
        return true;
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
        return true;
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
        return true;
      }
      this.$message.warn("对不起，您的浏览器不支持全屏模式");
      el.classList.remove("beauty-scroll");
      return false;
    },
    outFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      this.$refs.table.classList.remove("beauty-scroll");
    },
    onColumnsReset(conditions) {
      this.$emit("reset", conditions);
    },
    onExpandedRowsChange(expandedRows) {
      this.$emit("expandedRowsChange", expandedRows);
    },
    onChange(pagination, filters, sorter, options) {
      this.$emit("change", pagination, filters, sorter, options);
    },
    onExpand(expanded, record) {
      this.$emit("expand", expanded, record);
    },
    addListener() {
      document.addEventListener("fullscreenchange", this.fullScreenListener);
      document.addEventListener(
        "webkitfullscreenchange",
        this.fullScreenListener
      );
      document.addEventListener("mozfullscreenchange", this.fullScreenListener);
      document.addEventListener("msfullscreenchange", this.fullScreenListener);
      document.addEventListener(
        "contextmenu",
        this.handleRemoveRightMenu,
        true
      );
    },
    removeListener() {
      document.removeEventListener("fullscreenchange", this.fullScreenListener);
      document.removeEventListener(
        "webkitfullscreenchange",
        this.fullScreenListener
      );
      document.removeEventListener(
        "mozfullscreenchange",
        this.fullScreenListener
      );
      document.removeEventListener(
        "msfullscreenchange",
        this.fullScreenListener
      );
      document.removeEventListener(
        "contextmenu",
        this.handleRemoveRightMenu,
        true
      );
    },
    fullScreenListener(e) {
      if (e.target.id === this.id) {
        this.fullScreen = !this.fullScreen;
      }
    },
    // 右键显示表格列操作的事件
    handleRemoveRightMenu() {
      this.showRightMenu = false;
    },
    customHeaderRow() {
      return {
        on: {
          contextmenu: (e) => {
            e.preventDefault();
            // 显示
            this.showRightMenu = true;
            // 定位
            this.menuTop = e.clientY;
            this.menuLeft = e.clientX;
          },
        },
      };
    },
    mouseLeave(event) {
      this.showRightMenu = false;
      document.removeEventListener(
        "contextmenu",
        this.handleRemoveRightMenu,
        true
      );
    },
  },
};
</script>

<style lang="less">
@import "./index.less";
// .advanced-table .ant-calendar {
//   position: fixed !important;
// }

.table-edit-15468 {
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .td-content {
    overflow: inherit !important;
    white-space: normal !important;
    text-overflow: normal !important;
  }

  .ant-table-small > .ant-table-content > .ant-table-body {
    overflow: inherit;
  }

  .ant-calendar-picker {
    min-width: 100% !important;
  }
}
</style>
