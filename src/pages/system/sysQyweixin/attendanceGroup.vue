<template>
  <div class="page-common-layout">
    <div class="page-common-left" style="width:40%">
      <tool-bar
        @search="$refs.masterList.refresh(true)"
        @reset="
          () => {
            (this.masterQueryParam = {}), $refs.masterList.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="{ scope }">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd('master')"
            v-action:sysQyweixinAddDialog
            >新增</a-button
          >
          <!-- <a-button
                class="cu-btn-default"
                icon="edit"
                @click="handleEdit($refs.masterList.rows, 'master')"
                v-action:sysQyweixinEditDialog
                >编辑</a-button
              > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.masterList.selectedRowKeys, 'master')"
            v-action:sysQyweixinDelDialog
            >删除</a-button
          >
        </template>
        <template slot="toolForm"> </template>
      </tool-bar>
      <data-grid
        ref="masterList"
        type="master"
        :columns="masterColumns"
        :url="url"
        bordered
        :queryParam="masterQueryParam"
        rowKey="uuid"
        showPagination="auto"
        @rowClick="
          (e) => {
            masterRowClick(e, { puuid: 'uuid' });
          }
        "
      >
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleEdit(record, 'master')">删除</a>
          </template>
        </span>
      </data-grid>
      <master-form
        ref="masterModal"
        :visible="masterVisible"
        :loading="masterConfirmLoading"
        :model="masterMdl"
        @cancel="handleCancel('master')"
        @ok="handleOk('master')"
      />
    </div>
    <div class="page-common-content">
      <tool-bar>
        <template slot="toolBtn" slot-scope="{ scope }">
          <!-- <a-button class="cu-btn-primary" icon="plus" @click="handleAdd('sub')">新增</a-button>
							<a-button class="cu-btn-default"
            icon="edit" @click="handleEdit('all', 'sub')"
								>编辑</a-button
							>
							<a-button class="cu-btn-danger" icon="delete" @click="handleSub('all', 'sub')"
								>删除</a-button
							> -->
          <t-select-role
            ref="userModal"
            @changeData="selectUser"
            @show="addUser"
            selectButtonIcon="plus"
            selectButtonText="添加组员"
            :isSelect="false"
            style="display: inline-block;"
            v-action:sysQyweixinAddTeamMembers
          />
        </template>
      </tool-bar>
      <data-grid
        ref="subList"
        type="sub"
        :url="url"
        :columns="subColumns"
        bordered
        :queryParam="subQueryParam"
        rowKey="uuid"
        showPagination="auto"
      >
        <span slot="testCombobox" slot-scope="{ text }">
          {{ text | testComboboxFilter }}
        </span>
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleSub($refs.subList.selectedRowKeys, 'sub')">删除</a>
          </template>
        </span>
      </data-grid>
    </div>
  </div>
</template>

<script>
import { masterTableMixin } from "@/mixins/masterTableMixin";
import TSelectRole from "@/components/TopVUI/custom/TSelectRole";
import { DataGrid, Ellipsis } from "@/components";
import masterForm from "./modal/masterEdit.vue";
const masterColumns = [
  {
    title: "考勤名称",
    dataIndex: "atendanceName",
    align: "center",
  },
  {
    title: "负责人",
    dataIndex: "userName",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
    width: 100,
    scopedSlots: {
      customRender: "action",
    },
  },
];
const subColumns = [
  {
    title: "员工姓名",
    dataIndex: "userName",
    align: "center",
  },
  {
    title: "员工工号",
    dataIndex: "userNameId",
    align: "center",
    sorter: true,
  },
  {
    title: "部门",
    dataIndex: "department",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
    width: "150px",
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  name: "TableList",
  mixins: [masterTableMixin],
  components: {
    DataGrid,
    Ellipsis,
    masterForm,
    TSelectRole,
  },
  data() {
    return {
      masterColumns,
      subColumns,
      // create model
      masterVisible: false,
      subVisible: false,
      masterConfirmLoading: false,
      subConfirmLoading: false,
      masterMdl: null,
      subMdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      masterQueryParam: {},
      subQueryParam: {},
      masterSelectedRows: [],
      subSelectedRows: [],
      masterRows: "",
      subRows: "",
      url: {
        masterList: "/system/sysQyweixingAttendanceGroup/getPageSet",
        masterDelete: "/system/sysQyweixingAttendanceGroup/deleteBatch",
        masterAdd: "/system/sysQyweixingAttendanceGroup/save",
        masterUpdate: "/system/sysQyweixingAttendanceGroup/update",
        subList: "/system/sysQyweixingAttendanceUser/getPageSet",
        subDelete: "/system/sysQyweixingAttendanceUser/deleteBatch",
        subAdd: "/system/sysQyweixingAttendanceUser/save",
        subUpdate: "/system/sysQyweixingAttendanceUser/update",
      },
    };
  },
  filters: {
    sexFilter(sex) {
      const sexMap = {
        0: "女",
        1: "男",
      };
      return sexMap[sex];
    },
    testComboboxFilter(val) {
      if (val === "true") {
        return "可排序";
      } else if (val === "false") {
        return "不可排序";
      }
    },
  },
  methods: {
    addUser() {
      if (this.subQueryParam.puuid) {
        this.$refs.userModal.show();
      } else {
        this.$message.info("请选择需要操作的数据");
        return;
      }
    },
    selectUser(data) {
      if (!data.length) {
        this.$message.info("请选择需要操作的数据");
        return false;
      }
      let that = this;
      let uuid = [];
      data.forEach((item) => {
        uuid.push(item.uuid);
      });
      that
        .$post(that.url.subAdd, {
          uuids: uuid.join(),
          puuid: that.subQueryParam.puuid,
        })
        .then((res) => {
          if (res.statusCode === 200) {
            that.$message.success("保存成功！");
            that.$refs.subList.refresh();
          } else {
            that.$message.error(res.message);
          }
        });
    },
  },
};
</script>

<style lang="less"></style>
