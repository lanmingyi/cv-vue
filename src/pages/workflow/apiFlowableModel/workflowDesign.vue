<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar
        @search="$refs.table.refresh(true)"
        @reset="
          () => {
            (this.queryParam = { processModelType: 1 }),
              $refs.table.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleAddFlow()"
            v-action:apiFlowableModelAddDialog
            >新增</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input
              v-model="queryParam.modelName"
              id="color-picker"
              placeholder="流程名称"
            />
          </a-form-item>
          <a-form-item label="">
            <a-input
              v-model="queryParam.modelKey"
              placeholder="流程标识"
              style="width: 100%"
            />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="table"
        size="small"
        :columns="columns"
        :url="url"
        bordered
        rowKey="id"
        showPagination="auto"
        :queryParam="queryParam"
      >
        <span slot="modelVersion" slot-scope="{ text, record, index }">
          <a-tag v-if="text" :color="'geekblue'">
            {{ "V:" + record.modelVersion }}
          </a-tag>
        </span>
        <span slot="modelType" slot-scope="{ text, record, index }">
          {{ categoryFilters(text) }}
        </span>
        <span slot="birthday" slot-scope="{ text, record, index }">
          <a-tag v-if="record.modelVersion == null" :color="'red'">
            {{ "未发布" }}
          </a-tag>
          <a-tag v-if="record.modelVersion != null" :color="'green'">
            {{ "已发布" }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="release(record)">发布</a>
            <a-divider type="vertical" />
            <!-- <a @click="versionManage(record)">版本管理</a>
            <a-divider type="vertical" />
            <a @click="downloadBpmnXml(record)">导出</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a> -->
            <a-dropdown>
              <a class="ant-dropdown-link">
                更多
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="versionManage(record)">版本管理</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="downloadBpmnXml(record)">导出</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleDel(record)">删除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </span>
      </DataGrid>
      <!-- 编辑 -->
      <edit-form
        ref="createModal"
        :visible="visiblerelease"
        :loading="confirmLoading"
        :model="mdlrelease"
        @cancel="releaseHandleCancel(0)"
        @ok="releaseHandleOk"
      />
      <!-- 版本控制 -->
      <versionForm
        ref="versionForm"
        :visible="visibleVersion"
        :loading="confirmLoadingVersion"
        :model="mdlVersion"
        @cancel="handleCancelVersion()"
        @ok="handleOkVersion"
        @refresh="refreshTable"
      ></versionForm>
      <!-- 流程设计 -->
      <flowDesign
        ref="designModal"
        :isEdit="isEdit"
        :visible="visibleDesign"
        :loading="confirmLoadingDesign"
        @cancel="handleCancel()"
        @ok="handleOkFlowDesign"
      ></flowDesign>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import flowDesign from "./dataModel";
import editForm from "./edit";
import versionForm from "./version";
import { dataGridMixin } from "@/mixins/dataGridMixin";
import { DataGrid } from "@/components";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import Vue from "vue";
import { baseUrl } from "@/services/baseUrl";
export default {
  name: "TableList",
  mixins: [dataGridMixin],
  components: {
    DataGrid,
    editForm,
    versionForm,
    flowDesign,
  },
  data() {
    return {
      columns: [
        {
          title: "流程名称",
          dataIndex: "modelName",
          sorter: false,
          align: "center",
        },
        {
          title: "流程标识",
          dataIndex: "modelKey",
          sorter: false,
          align: "center",
        },
        {
          title: "流程分类",
          dataIndex: "modelType",
          sorter: false,
          align: "center",
          scopedSlots: {
            customRender: "modelType",
          },
          width: 150,
        },
        {
          title: "流程版本",
          width: 100,
          dataIndex: "modelVersion",
          sorter: false,
          align: "center",
          scopedSlots: { customRender: "modelVersion" },
        },
        {
          title: "发布状态",
          dataIndex: "birthday",
          sorter: false,
          scopedSlots: { customRender: "birthday" },
          align: "center",
          width: 100,
        },
        {
          title: "更新时间",
          dataIndex: "lastUpdated",
          sorter: false,
          align: "center",
          width: 200,
        },
        {
          title: "操作",
          width: 180,
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          align: "center",
        },
      ],
      visible: false,
      visiblerelease: false,
      confirmLoading: false,
      mdl: null,
      mdlrelease: null,
      advanced: true,
      queryParam: {
        processModelType: 1,
      },
      url: {
        getPageSet: "/workflow/apiFlowableModel/getPageSet",
        deleteBatch: "/workflow/apiFlowableModel/deleteModel",
        downLoadXmlByModelId: "/workflow/apiFlowableModel/downLoadXmlByModelId",
        deployModelId: "/workflow/apiFlowableModel/deployModelId",
      },
      mdlVersion: null,
      confirmLoadingVersion: false,
      visibleVersion: false,
      visibleDesign: false,
      confirmLoadingDesign: false,
      spinLoading: false,
      isEdit: false,
      categoryList: [],
    };
  },
  created() {
    this.getCategory();
  },
  mounted() {},
  methods: {
    categoryFilters(val) {
      const category = this.categoryList.filter((res) => {
        return res.categoryCode === val;
      });
      if (category.length > 0) {
        return category[0].categoryName;
      } else {
        return "";
      }
    },
    getCategory() {
      // /workflow/flowCategory/getPageSet
      this.$post("/workflow/flowCategory/getPageSet").then((res) => {
        this.categoryList = res.rows;
      });
    },
    handleAddFlow() {
      this.visibleDesign = true;
      this.isEdit = false;
      this.$refs.designModal.setFlowXml();
    },
    // 发布
    release(record) {
      this.mdlrelease = {
        modelId: record.id,
        procdefId: record.procdefId,
      };
      this.visiblerelease = true;
      this.$refs.createModal.getList();
    },
    // 编辑
    handleEdit(record) {
      let that = this;
      that.spinLoading = true;
      that.mdl = { ...record };
      that.isEdit = true;
      // 获取表单流程详情
      that
        .$post("/workflow/flowModel/getDetailByModelKey", {
          modelKey: that.mdl.modelKey,
          procdefId: that.mdl.procdefId,
          type: "mode",
        })
        .then((res) => {
          if (res.statusCode !== 300) {
            that.visibleDesign = true;
            that.confirmLoadingDesign = true;
            setTimeout(function() {
              that.$refs.designModal.setAllData(res);
            }, 300);
          } else {
            that.visibleDesign = false;
            that.$message.error(res.message);
          }
        })
        .finally(() => {
          that.spinLoading = false;
          that.confirmLoading = false;
          that.confirmLoadingDesign = false;
        });
      // this.$refs.designForm.setAllData(this.mdl.modelKey,this.mdl.procdefId)
    },
    handleCancel(e) {
      this.visibleDesign = false;
    },
    // 取消发布
    releaseHandleCancel() {
      this.visiblerelease = false;
    },
    // 版本控制
    versionManage(e) {
      this.visibleVersion = true;
      this.mdlVersion = e.modelKey;
      if (this.$refs.versionForm)
        this.$refs.versionForm.refreshList(e.modelKey);
    },
    handleCancelVersion() {
      this.visibleVersion = false;
    },
    handleOkVersion() {
      this.confirmLoadingVersion = true;
      this.visibleVersion = false;
			this.$refs.table.refresh()
    },
    // 删除
    handleDel(record) {
      const that = this;
      that.$confirm({
        title: "警告",
        content: `确定要执行该操作吗?`,
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          console.log("OK");
          // 在这里调用删除接口
          that
            .$post(that.url.deleteBatch, {
              modelId: record.id,
              procdefId: record.procdefId,
            })
            .then((res) => {
              if (res.statusCode === 200) {
                that.$message.success(res.message);
                that.$refs.table.refresh();
              } else {
                that.$message.error(res.message);
              }
            });
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log("Oops errors!"));
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    // 下载
    downloadBpmnXml(record) {
      window.location.href =
        baseUrl +
        "/workflow/apiFlowableModel/downLoadXmlByModelId?modelId=" +
        record.id +
        "&token=" +
        Vue.ls.get(ACCESS_TOKEN);
    },
    // 确定发布
    releaseHandleOk() {
      const form = this.$refs.createModal.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          this.$post(this.url.deployModelId, values).then((res) => {
            if (res.statusCode === 200) {
              this.visiblerelease = false;
              this.confirmLoading = false;
              form.resetFields();
              this.$refs.table.refresh();
              this.$message.info(res.message);
            } else {
              this.confirmLoading = false;
              this.$message.error(res.message);
            }
          });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    refreshTable() {
      this.visibleVersion = false;
      this.$refs.table.refresh();
    },
    // 流程设计提交
    handleOkFlowDesign(bpmData, uuid) {
      const that = this;
      if (
        bpmData.formBtnList.length === 0 ||
        (bpmData.formBtnList && !bpmData.formBtnList[0].nodeButtonCode)
      ) {
        that.$message.warn("请先配置节点按钮！");
        return true;
      }

      if (!that.isEdit) {
        that.$confirm({
          title: "提示",
          content: "请修改流程标识和流程名称,便于进行业务处理",
          okText: "已修改,提交",
          cancelText: "去修改",
          onOk() {
            that.handleSubmitXML(bpmData, uuid);
          },
          onCancel() {},
        });
      } else {
        that.handleSubmitXML(bpmData, uuid);
      }
    },
    handleSubmitXML(bpmData, uuid) {
      let url = "";
      this.confirmLoadingDesign = true;
      let parameter = {
        modelType: 1,
        uuid: uuid,
        formBtnList: JSON.stringify(bpmData.formBtnList),
        // formModel: formData.formModel,
        formFieldList: JSON.stringify(bpmData.formFieldList),
        formNoticeList: JSON.stringify(bpmData.formNoticeList),
        permissionType: bpmData.permissionType,
        permissionValue: bpmData.permissionValue,
        processModelType: 1, //区分自定义 和可视化
      };
      if (!uuid) {
        parameter.modelName = bpmData.processName;
        parameter.flowJson = bpmData.xml;
        parameter.modelKey = bpmData.processKey; //efd_ht_task
        parameter.modelId = bpmData.processId;
        url = "/workflow/flowModel/save";
      } else {
        parameter.actDeModelName = bpmData.processName;
        parameter.flowDesign = bpmData.xml;
        parameter.actDeModelKey = bpmData.processKey;
        parameter.actDeModelId = bpmData.processId;
        parameter.procdefId = this.mdl.procdefId;
        url = "/workflow/flowModel/updateData";
      }
      this.$post(url, parameter).then((res) => {
        if (res.statusCode === 200) {
          this.confirmLoadingDesign = false;
          this.visibleDesign = false;
          this.$message.info(res.message);
          this.$refs.table.refresh();
        } else {
          this.confirmLoadingDesign = false;
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>

<style scoped="scoped">
/deep/.ant-drawer-body {
  padding: 0 !important;
}
</style>
