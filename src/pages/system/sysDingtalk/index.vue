<!--
 * @Description: 
 * @Author: 黄婷
 * @Date: 2021-07-26 17:31:41
 * @LastEditTime: 2021-09-09 17:24:30
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysDingtalk\index.vue
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
            @click="getAttendance()"
            v-action:sysDingtalkGetRecordsDialog
            >获取钉钉打卡记录</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="queryParam.userName" placeholder="打卡人姓名" />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="table"
        :columns="columns"
        :url="url"
        :queryParam="queryParam"
        rowKey="uuid"
        :format-conditions="true"
        :scroll="{ x: 2000 }"
      >
      </DataGrid>
      <userModal
        ref="masterModal"
        :visible.sync="visible"
        :loading="confirmLoading"
        @ok="handleGetAttendance"
      ></userModal>
    </div>
  </div>
</template>

<script>
import { DataGrid } from "@/components";
import { dataGridMixin } from "@/mixins/dataGridMixin";
import userModal from "./userModal";
import { ref } from "vue";
export default {
  name: "Table",
  components: { DataGrid, userModal },
  mixins: [dataGridMixin],
  data() {
    return {
      columns: [
        {
          title: "数据来源",
          dataIndex: "sourceType",
          ellipsis: true,
        },
        {
          title: "基准时间",
          dataIndex: "baseCheckTime",
          ellipsis: true,
        },
        {
          title: "实际打卡时间",
          dataIndex: "userCheckTime",
          ellipsis: true,
        },
        {
          title: "打卡人ID",
          dataIndex: "userId",
          ellipsis: true,
        },
        {
          title: "打卡人姓名",
          dataIndex: "userName",
          ellipsis: true,
        },
        {
          title: "位置结果",
          dataIndex: "locationResuLt",
          ellipsis: true,
        },
        {
          title: "打卡结果",
          dataIndex: "timeResuIt",
          ellipsis: true,
        },
        {
          title: "考勤类型",
          dataIndex: "checkType",
          ellipsis: true,
        },
        {
          title: "工作日",
          dataIndex: "workDate",
          ellipsis: true,
        },
        {
          title: "打卡记录ID",
          dataIndex: "recordId",
          ellipsis: true,
        },
        {
          title: "排班ID",
          dataIndex: "planId",
          ellipsis: true,
        },
        {
          title: "考勤组ID",
          dataIndex: "groupId",
          ellipsis: true,
        },
        {
          title: "流程类型",
          dataIndex: "flowType",
          ellipsis: true,
        },
        {
          title: "流程子类型",
          dataIndex: "sonType",
          ellipsis: true,
        },
      ],
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {},
      url: {
        getPageSet: "/mdata/oaDingdingOpen/getPageSet",
        getUserAttendance: "/mdata/nail/getUserAttendance",
      },
    };
  },
  methods: {
    getAttendance() {
      this.visible = true;
      this.$refs.masterModal.setData();
    },
    handleGetAttendance(val) {
      this.$post(this.url.getUserAttendance, val).then((response) => {
        this.$message.success(response.message, 1.5);
        if (response.statusCode === 200) {
          this.visible = false;
          this.refs.table.refresh();
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.table {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>
