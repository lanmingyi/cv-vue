<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar
        @search="$refs.table.refresh(true)"
        @reset="
          () => {
            (this.queryParam = {}), $refs.table.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd()"
            v-action:messageMailAddDialog
            >写邮件</a-button
          >
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.table.selectedRowKeys)"
            v-action:messageMailDelDialog
            >删除</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="queryParam.inMail" placeholder="发件人" />
          </a-form-item>
          <a-form-item label="">
            <a-input
              v-model="queryParam.toMail"
              placeholder="收件人"
              style="width: 100%"
            />
          </a-form-item>
        </template>
      </tool-bar>

      <data-grid
        ref="table"
        :columns="columns"
        :url="url"
        :queryParam="queryParam"
        rowKey="uuid"
        showPagination="auto"
        :scroll="{ x: 1200 }"
      >
        <span slot="flagStatus" slot-scope="{ text }">
          {{ text | flagStatusFilter }}
        </span>
        <!-- <span slot="content" slot-scope="{text}">
					<a-tooltip>
						<template slot="title">
							{{ text }}
						</template>
						<ellipsis :length="42" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{
							text
						}}</ellipsis>
					</a-tooltip>
				</span> -->
      </data-grid>
      <edit-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel()"
        @ok="handleOk()"
      />
    </div>
  </div>
</template>

<script>
import { dataGridMixin } from "@/mixins/dataGridMixin";
import { DataGrid, Ellipsis } from "@/components";
import editForm from "./masterEdit.vue";
const columns = [
  {
    title: "邮件主题",
    width: 150,
    dataIndex: "subject",
    ellipsis: true,
    sorter: true,
  },
  {
    title: "内容",
    width: 420,
    dataIndex: "content",
    scopedSlots: { customRender: "content" },
    sorter: true,
  },
  {
    title: "发件人",
    width: 170,
    dataIndex: "inMail",
    sorter: true,
  },
  {
    title: "收件人",
    width: 260,
    dataIndex: "toMail",
    sorter: true,
  },
  {
    title: "抄送",
    width: 260,
    dataIndex: "wcc",
    sorter: true,
  },
  {
    title: "密送",
    width: 260,
    dataIndex: "bcc",
    sorter: true,
  },
  {
    title: "发送日期",
    width: 160,
    dataIndex: "sendTime",
    sorter: true,
  },
  {
    title: "状态",
    dataIndex: "flagStatus",
    width: 100,
    scopedSlots: { customRender: "flagStatus" },
    fixed: "right",
    customCell: (record, rowIndex) => {
      if (record.flagStatus === 0) {
        return { style: "color: red" };
      } else if (record.flagStatus === 1) {
        return { style: "color: green" };
      }
    },
  },
];
export default {
  name: "TableList",
  mixins: [dataGridMixin],
  components: {
    DataGrid,
    Ellipsis,
    editForm,
  },
  data() {
    return {
      // create model
      columns: columns,
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      masterUuids: "",
      masterRows: "",
      uuid: "",
      uuids: "",
      url: {
        getPageSet: "/message/messageMail/getPageSet",
        save: "/message/messageMail/sendSimpleMail",
        deleteBatch: "/message/messageMail/deleteBatch",
      },
    };
  },
  filters: {
    flagStatusFilter(val) {
      const flagStatusMap = {
        0: "发送失败",
        1: "发送成功",
        2: "未到发送时间",
        default: "未知",
      };
      return flagStatusMap[val];
    },
  },
  methods: {},
};
</script>

<style lang="less"></style>
