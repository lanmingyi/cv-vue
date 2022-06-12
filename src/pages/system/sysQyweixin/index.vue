<!--
 * @Description: 企业微信考勤数据
 * @Author: 黄婷
 * @Date: 2021-06-09 18:26:35
 * @LastEditTime: 2021-09-09 17:06:41
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysQyweixin\index.vue
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
            icon="sync"
            @click="handleSynchronization()"
            v-action:sysQyweixinSyncMonthlyReport
            >同步企业微信月报</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <tree-select
              style="width: 120px;"
              v-model="queryParam.orgName"
              placeholder="请选择部门"
              :parameter="parameter"
              :url="url"
              textfield="name"
              @change="seleteOrg"
            />
          </a-form-item>
          <a-form-item label="">
            <!-- <a-input v-model="queryParam.name" placeholder="姓名" /> -->
            <a-select
              v-model="queryParam.userName"
              style="width: 120px;"
              allowClear
              placeholder="请选择用户"
            >
              <a-select-option
                v-for="(item, index) in userList"
                :key="index"
                :value="item.name"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="">
            <t-date
              v-model="queryParam.years"
              style="width: 120px;"
              :trigger-change="true"
              :showTime="false"
              dateFormat="YYYY-MM"
              allowClear
              placeholder="请选择年月"
              type="month"
            />
          </a-form-item>
        </template>
      </tool-bar>
        <data-grid
          ref="table"
          :columns="columns"
          :url="url"
          bordered
          :queryParam="queryParam"
          rowKey="uuid"
          :format-conditions="true"
          :scroll="{ x: 2800 }"
        >
        </data-grid>
      <search-modal
        ref="searchModal"
        :visible.sync="visible"
        @ok="handleOk"
      ></search-modal>
    </div>
  </div>
</template>

<script>
import { dataGridMixin } from "@/mixins/dataGridMixin";
import { DataGrid } from "@/components";
import searchModal from "./modal/searchModal";
import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
const columns = [
  {
    title: "年月",
    dataIndex: "years",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "姓名",
    dataIndex: "name",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "别名",
    dataIndex: "nameEx",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "部门",
    dataIndex: "departsName",
    align: "center",
    width: 200,
  },
  {
    title: "账号",
    dataIndex: "acctid",
    align: "center",
    width: 100,
    sorter: true,
  },
  {
    title: "应打卡天数",
    dataIndex: "workDays",
    align: "center",
    width: 120,
    sorter: true,
  },
  {
    title: "正常天数",
    dataIndex: "regularDays",
    align: "center",
    width: 100,
    sorter: true,
  },
  {
    title: "异常天数",
    dataIndex: "exceptDays",
    align: "center",
    width: 100,
    sorter: true,
  },
  {
    title: "实际工作时长",
    dataIndex: "regularWorkSec",
    align: "center",
    width: 120,
    sorter: true,
  },
  {
    title: "标准工作时长",
    dataIndex: "standardWorkSec",
    align: "center",
    width: 120,
    sorter: true,
  },
  {
    title: "迟到",
    dataIndex: "exceptionLate",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "早退",
    dataIndex: "exceptionLeaveEarly",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "缺卡",
    dataIndex: "exceptionCardMissing",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "旷工",
    dataIndex: "exceptionAbsenteeism",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "地点异常",
    dataIndex: "exceptionAbnormalIocation",
    align: "center",
    width: 100,
  },
  {
    title: "设备异常",
    dataIndex: "exceptionAbnormalequipment",
    align: "center",
    width: 100,
  },
  {
    title: "年假",
    dataIndex: "sitypeannualieave",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "事假",
    dataIndex: "sitypecompassionateIeave",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "病假",
    dataIndex: "siTypeSickIeave",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "调休假",
    dataIndex: "siTypeCompensatoryIeave",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "婚假",
    dataIndex: "siTypeMarriageHoliday",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "产假",
    dataIndex: "siTypeMaternityIeave",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "陪产假",
    dataIndex: "siTypePaternityIeave",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "其他",
    dataIndex: "siTypeOther",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "补卡",
    dataIndex: "siTypeCardReplacement",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "出差",
    dataIndex: "siTypeABusinessTravel",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "外出",
    dataIndex: "siTypeGoOut",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "外勤",
    dataIndex: "siTypeFieldPersonnel",
    align: "center",
    width: 80,
    sorter: true,
  },
  {
    title: "工作日加班时长",
    dataIndex: "workdayOverSec",
    align: "center",
    width: 140,
    sorter: true,
  },
  {
    title: "节假日加班时长",
    dataIndex: "holidaysOverSec",
    align: "center",
    width: 140,
    sorter: true,
  },
  {
    title: "休息日加班时长",
    dataIndex: "restdaysOverSec",
    align: "center",
    width: 140,
    sorter: true,
  },
];
export default {
  name: "TableList",
  components: {
    DataGrid,
    searchModal,
    TreeSelect,
  },
  mixins: [dataGridMixin],
  data() {
    return {
      columns: columns,
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      selectedRows: [],
      rows: "", //选中行数据
      url: {
        fathersUrl: "/system/sysQyweixinOrganization/getDatList",
        expandUrl: "/system/sysQyweixinOrganization/getDatList",
        subList: "/system/sysQyweixinUser/getPageSet",
        getPageSet: "/system/sysQyweixinMonthdata/getPageSet",
      },
      parameter: {
        father: {
          pid: 0,
        },
        children: {},
      },
      userList: [],
      loading: false,
    };
  },
  methods: {
    handleOk() {
      const form = this.$refs.searchModal.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          this.loading = true;
          // 在这里调用删除接口
          this.$post(
            "/system/sysQyweixinMonthdata/synchroQyWexixingMonthdata.api ",
            values
          )
            .then((res) => {
              if (res.statusCode !== 300) {
                this.$refs.table.refresh();
                this.visible = false;
              } else {
                this.$message.error(res.message, 2);
              }
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    handleSynchronization() {
      const that = this;
      that.$confirm({
        title: "警告",
        content: `同步企业微信月报将覆盖本地月报数据，确定执行该操作吗？`,
        okText: "同步",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that.visible = true;
          const form = that.$refs.searchModal.form;
          form.resetFields(); // 清理表单数据（可不做）
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    seleteOrg(value, node) {
      this.queryParam.orgName = node[0];
      this.$post(this.url.subList, {
        orgId: value,
      }).then((res) => {
        this.userList = res.rows;
      });
    },
  },
};
</script>

<style lang="less"></style>
