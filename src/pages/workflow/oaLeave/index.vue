<!--
 * @Description: 请假流程表单;自定义表单的流程模板案例
 * @Author: lmy
 * @Date: 2021-01-20 11:26:35
 * @LastEditTime: 2021-09-09 16:56:42
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\workflow\oaLeave\index.vue
-->
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
            @click="handleAdd({ isView: false })"
            v-action:oaLeaveAddDialog
            >新增</a-button
          >
          <a-button
            class="cu-btn-default"
            icon="edit"
            @click="
              handleEdit({
                isView: $refs.table.rows.state == '草稿' ? false : true,
                ...$refs.table.rows,
              })
            "
            v-action:oaLeaveEditDialog
            >编辑</a-button
          >
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.table.selectedRowKeys)"
            v-action:oaLeaveDelDialog
            >删除</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="queryParam.title" placeholder="请输入休假标题" />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="table"
        :columns="columns"
        :url="url"
        bordered
        rowKey="uuid"
        :queryParam="queryParam"
      >
        <span slot="sex" slot-scope="{ text }">
          {{ text | sexFilter }}
        </span>
        <span slot="testCombobox" slot-scope="{ text }">
          {{ text | testComboboxFilter }}
        </span>
        <span slot="state" slot-scope="{ text, record, index }">
          <a-tag v-if="text == '草稿'" :color="'blue'">
            {{ text }}
          </a-tag>
          <a-tag v-else-if="text == '审核中'" :color="'orange'">
            {{ text }}
          </a-tag>
          <a-tag v-else-if="text == '已完成'" :color="'green'">
            {{ text }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <template v-if="record.state == '草稿'">
              <a @click="handleEdit({ ...record, isView: false })">编辑</a>
              <a-divider type="vertical" />
              <a @click="submitDraft(record)">提交</a>
              <a-divider type="vertical" />
              <a @click="handleSub(record)">删除</a>
            </template>
            <a-dropdown v-else>
              <a-menu slot="overlay">
                <a-menu-item
                  ><a @click="handleView(record)">查看</a></a-menu-item
                >
                <a-menu-item
                  ><a @click="handleFlow(record)">流程图</a></a-menu-item
                >
                <a-menu-item
                  ><a @click="handleGetListComments(record)"
                    >审批意见</a
                  ></a-menu-item
                >
              </a-menu>
              <a>更多<a-icon type="down"/></a>
            </a-dropdown>
          </template>
        </span>
      </DataGrid>
      <edit-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel()"
        @ok="handleStorage(1)"
        @storage="handleStorage(2)"
      />
      <flowChat ref="flowChatForm"></flowChat>
      <comment-modal ref="commentModal"></comment-modal>
    </div>
  </div>
</template>

<script>
import { dataGridMixin } from "@/mixins/dataGridMixin";
import { DataGrid } from "@/components";
import commentModal from "./comment";
import editForm from "./edit.vue";
import flowChat from "../apiFlowableTask/myMission/flowChat.vue";

export default {
  name: "TableList",
  mixins: [dataGridMixin],
  components: { DataGrid, editForm, flowChat, commentModal },
  data() {
    return {
      columns: [
        { title: "休假标题", dataIndex: "title", width: 200 },
        { title: "请假人", dataIndex: "creatorId" },
        { title: "开始时间", dataIndex: "beginTime", sorter: true },
        { title: "结束时间", dataIndex: "endTime", sorter: true },
        { title: "请假天数", dataIndex: "days", sorter: true },
        {
          title: "休假类型",
          dataIndex: "itemText",
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "state",
          align: "center",
          scopedSlots: { customRender: "state" },
        },
        { title: "备注", dataIndex: "reason" },
        {
          title: "操作",
          width: 150,
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      url: {
        getPageSet: "/workflow/oaLeave/getPageSet",
        save: "/workflow/oaLeave/save",
        update: "/workflow/oaLeave/update",
        deleteBatch: "/workflow/oaLeave/deleteBatch",
      },
      isView: false,
    };
  },
  methods: {
    // 存为草稿
    handleStorage(e) {
      let that = this;
      let url = "";
      if (e === 2) {
        url = "/workflow/oaLeave/draft";
      } else {
        url = "/workflow/oaLeave/save";
      }
      let form = that.$refs.createModal.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          that.confirmLoading = true;
          that
            .$post(url, values)
            .then((res) => {
              if (res.statusCode === 200) {
                that.$message.success(res.message);
                that.$refs.table.refresh();
              } else {
                that.$message.error(res.message);
              }
            })
            .finally(() => {
              that.visible = false;
              that.confirmLoading = false;
            });
        }
      });
    },
    // 提交
    submitDraft(record) {
      const that = this;
      that.$confirm({
        title: "提示",
        content: "确认提交吗？",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          that
            .$post("/workflow/oaLeave/save", record)
            .then((res) => {
              if (res.statusCode === 200) {
                that.$message.success(res.message);
                that.$refs.table.refresh();
              } else {
                that.$message.error(res.message);
              }
            })
            .finally(() => {
              that.visible = false;
              that.confirmLoading = false;
            });
        },
      });
    },
    // 流程图
    handleFlow(record) {
      this.$post("/workflow/oaLeave/clickFlowChart", {
        uuid: record.uuid,
      }).then((res) => {
        if (res.statusCode != 300) {
          const jsonData = res;
          this.$refs.flowChatForm.loadData(
            jsonData,
            jsonData.lists.actDeModelId,
            jsonData.lists.actDeModelKey,
            jsonData.lists.actDeModelName,
            jsonData.lists.flowDesign,
            record
          );
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 预览
    handleView(record) {
      this.visible = true;
      this.mdl = record;
      this.mdl.isView = true;
      if (this.$refs.createModal.edit) this.$refs.createModal.edit(this.mdl);
    },
    handleGetListComments(record) {
      this.$refs.commentModal.getCommentList(record.uuid);
      // this.$post('/workflow/oaLeave/getListCommentsByBusinessKey', {
      // 	businessKey: record.uuid,
      // }).then((res) => {
      // 	if (res.statusCode != 300) {
      // 		console.log(res);
      // 	} else {
      // 		this.$message.error(res.message);
      // 	}
      // });
    },
  },
};
</script>

<style lang="less"></style>
