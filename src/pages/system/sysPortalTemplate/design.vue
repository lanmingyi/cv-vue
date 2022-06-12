<template>
  <!-- <a-card :bordered="false">
		<tool-bar
			@search="$refs.table.refresh(true)"
			@reset="
				() => {
					(this.queryParam = {}), $refs.table.refresh(true);
				}
			"
		>
			<template slot="toolBtn" slot-scope="scope">
				<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()">新增</a-button>
				<a-button class="cu-btn-default"
            icon="edit" @click="handleEdit('all')">编辑</a-button>
				<a-button class="cu-btn-danger" icon="delete" @click="handleSub('all')">删除</a-button>
			</template>
			<template slot="toolForm">
				<a-form-item label="" class="margin-right">
					<a-input v-model="queryParam.name" placeholder="name" />
				</a-form-item>
			</template>
		</tool-bar>
		<s-table
			ref="table"
			:columns="columns"
			:data="loadData"
			bordered
			:pageSize="10"
			:rowSelection="rowSelection"
			rowKey="uuid"
			showPagination="auto"
			:rowClassName="rowClassName"
			:customRow="rowClick"
		>
			<span slot="serial" slot-scope="text, record, index">
				{{ index + 1 }}
			</span>
			<span slot="sex" slot-scope="text">
				{{ text | sexFilter }}
			</span>
			<span slot="action" slot-scope="text, record">
				<template>
					<a @click="handleDesign(record)">设计</a>
					<a-divider type="vertical" />
					<a @click="handleEdit(record)">编辑</a>
					<a-divider type="vertical" />
					<a @click="handleSub(record)">删除</a>
				</template>
			</span>
		</s-table>
		<edit-form ref="createModal" :visible="visible" :model="mdl" @cancel="handleCancel()" @ok="handleOk()" />
	</a-card> -->
  <KPortalDesign></KPortalDesign>
</template>

<script>
import { simpleListMixin } from "@/mixins/simpleListMixin";
import { STable, Ellipsis } from "@/components";

import editForm from "./edit.vue";
import { filterDictTextByCache } from "@/components/TopVUI/dict/JDictSelectUtil";
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
import KPortalDesign from "@/components/TopVUI/k-portal-design/design";
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
  },
  {
    title: "年龄",
    dataIndex: "age",
    align: "center",
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
  },
  {
    title: "注册时间",
    dataIndex: "testDatetime",
    align: "center",
  },
  {
    title: "排序",
    dataIndex: "testCombobox",
    align: "center",
    customRender: (text, record, index) => {
      //字典值替换通用方法
      return filterDictTextByCache("sortFields", text);
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
  name: "TableList",
  mixins: [simpleListMixin],
  components: { STable, Ellipsis, editForm, TDictSelectTag, KPortalDesign },
  data() {
    this.columns = columns;
    return {
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      rows: "", //选中行数据
      url: {
        getPageSet: "/system/testDemo/getPageSet",
        save: "/system/testDemo/save",
        update: "/system/testDemo/update",
        deleteBatch: "/system/testDemo/deleteBatch",
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
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
  filters: {
    sexFilter(sex) {
      const sexMap = {
        0: "女",
        1: "男",
      };
      return sexMap[sex];
    },
  },
  methods: {
    handleDesign() {
      this.visible = true;
    },
  },
};
</script>

<style lang="less"></style>
