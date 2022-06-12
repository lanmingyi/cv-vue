<template>
  <a-card :bordered="false">
    <tool-bar
      @search="fetch(queryParam)"
      @reset="
        () => {
          (queryParam = { pageNo: 1, pageSize: 10 }), fetch(queryParam);
        }
      "
    >
      <template slot="toolBtn" slot-scope="scope">
        <a-button class="cu-btn-primary" icon="plus" @click="handleAddRow()"
          >新增</a-button
        >
        <a-button class="cu-btn-default" icon="edit" @click="handleEditRow()"
          >编辑</a-button
        >
        <a-button
          class="cu-btn-danger"
          icon="delete"
          @click="handleSubRow('all')"
          >删除</a-button
        >
      </template>
      <template slot="toolForm">
        <a-form-item label="">
          <a-input v-model="queryParam.name" placeholder="name" />
        </a-form-item>
      </template>
    </tool-bar>
    <a-form :form="edForm">
      <a-table
        ref="table"
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
          v-for="col in [
            'name',
            'sex',
            'age',
            'testDate',
            'testDatetime',
            'testCombobox',
          ]"
          :slot="col"
          slot-scope="text, record"
        >
          <div :key="col" v-if="col === 'name'">
            <a-form-item v-if="record.editable">
              <a-input
                v-decorator="[
                  col,
                  {
                    initialValue: text,
                    rules: [{ required: true, message: '必填' }],
                  },
                ]"
                style="margin: -5px 0"
                @change="
                  (e) =>
                    handleChange(e.target.value, record.uuid, col.dataIndex)
                "
              />
            </a-form-item>
            <template v-else> {{ text }} </template>
          </div>
          <div :key="col" v-if="col === 'age'">
            <a-form-item v-if="record.editable">
              <a-input-number
                v-decorator="[
                  col,
                  {
                    initialValue: text,
                    rules: [{ required: true, message: '必填' }],
                  },
                ]"
                :min="1"
                @change="(e) => handleChange(e, record.uuid, col)"
              />
            </a-form-item>
            <template v-else> {{ text }} </template>
          </div>
          <div :key="col" v-if="col === 'sex'">
            <a-form-item v-if="record.editable">
              <a-select
                v-decorator="[
                  col,
                  {
                    initialValue: text,
                    rules: [{ required: true, message: '必填' }],
                  },
                ]"
                @change="(e) => handleChange(e, record.uuid, col)"
              >
                <a-select-option value="0">
                  女
                </a-select-option>
                <a-select-option value="1">
                  男
                </a-select-option>
              </a-select>
            </a-form-item>
            <template v-else> {{ text | sexFilter }} </template>
          </div>
          <div :key="col" v-if="col === 'testCombobox'">
            <a-form-item v-if="record.editable">
              <TDictSelectTag
                dictCode="sortFields"
                v-decorator="[
                  col,
                  {
                    initialValue: text,
                    rules: [{ required: true, message: '必填' }],
                  },
                ]"
                @change="(e) => handleChange(e, record.uuid, col)"
              ></TDictSelectTag>
            </a-form-item>
            <template v-else> {{ text | testComboboxFilter }} </template>
          </div>
          <div :key="col" v-if="col === 'testDate'">
            <a-form-item v-if="record.editable">
              <t-date
                v-decorator="[
                  col,
                  {
                    initialValue: text,
                    rules: [{ required: true, message: '必填' }],
                  },
                ]"
                @change="(e) => handleChange(e, record.uuid, col)"
                style="width: 100%;"
                :trigger-change="true"
                dateFormat="YYYY-MM-DD"
                allowClear
              />
            </a-form-item>
            <template v-else> {{ text }} </template>
          </div>
          <div :key="col" v-if="col === 'testDatetime'">
            <a-form-item v-if="record.editable">
              <t-date
                v-decorator="[
                  col,
                  {
                    initialValue: text,
                    rules: [{ required: true, message: '必填' }],
                  },
                ]"
                @change="(e) => handleChange(e, record.uuid, col)"
                style="width: 100%;"
                :showTime="true"
                :trigger-change="true"
                dateFormat="YYYY-MM-DD HH:mm:ss"
                allowClear
              />
            </a-form-item>
            <template v-else> {{ text }} </template>
          </div>
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
              <a @click="() => handleSubRow(record)">删除</a>
            </span>
          </div>
        </template>
      </a-table>
    </a-form>
  </a-card>
</template>

<script>
import { simpleListMixin } from "@/mixins/simpleListMixin";
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag"; //字典
const columns = [
  {
    title: "#",
    width: 50,
    align: "center",
    scopedSlots: {
      customRender: "serial",
    },
  },
  {
    title: "姓名",
    dataIndex: "name",
    align: "center",
    scopedSlots: {
      customRender: "name",
    },
  },
  {
    title: "年龄",
    dataIndex: "age",
    align: "center",
    scopedSlots: {
      customRender: "age",
    },
  },
  {
    title: "性别",
    dataIndex: "sex",
    align: "center",
    scopedSlots: {
      customRender: "sex",
    },
  },
  {
    title: "生日",
    dataIndex: "testDate",
    align: "center",
    scopedSlots: {
      customRender: "testDate",
    },
  },
  {
    title: "注册时间",
    dataIndex: "testDatetime",
    align: "center",
    scopedSlots: {
      customRender: "testDatetime",
    },
  },
  {
    title: "排序",
    dataIndex: "testCombobox",
    align: "center",
    scopedSlots: {
      customRender: "testCombobox",
    },
  },
  {
    title: "操作",
    width: 150,
    dataIndex: "action",
    align: "center",
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  name: "edataGrid",
  mixins: [simpleListMixin],
  components: {
    TDictSelectTag,
  },
  data() {
    this.columns = columns;
    return {
      // create model
      pagination: {
        pageSize: 10,
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
        pageSize: 10,
      },
      selectedRowKeys: [],
      selectedRows: [],
      dataSource: [],
      editingKey: "",
      isNew: false,
      rows: "",
      visible: false,
      confirmLoading: false,
      mdl: null,
      url: {
        getPageSet: "/system/exampleSingleDatagrid/getPageSet",
        save: "/system/exampleSingleDatagrid/save",
        update: "/system/exampleSingleDatagrid/update",
        deleteBatch: "/system/exampleSingleDatagrid/deleteBatch",
      },
      edForm: this.$form.createForm(this),
      cacheData: [],
    };
  },
  filters: {
    sexFilter(sex) {
      switch (sex) {
        case "male":
          return "男";
        case "female":
          return "女";
        case "unknown":
          return "未知";
      }
    },
    testComboboxFilter(val) {
      if (val === "true") {
        return "可排序";
      } else {
        return "不可排序";
      }
    },
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
    this.fetch(this.queryParam);
  },
  methods: {
    fetch(params) {
      this.$post(this.url.getPageSet, params).then((res) => {
        const pager = { ...this.pagination };
        pager.total = res.totalCount;
        this.dataSource = res.rows;
        // this.cacheData = res.rows
        this.cacheData = JSON.parse(JSON.stringify(res.rows));
        this.pagination = pager;
      });
    },
  },
};
</script>

<style lang="less"></style>
