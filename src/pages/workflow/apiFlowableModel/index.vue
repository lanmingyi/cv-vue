<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar
        @search="$refs.table.refresh(true)"
        @reset="
          () => {
            (this.queryParam = { processModelType: 2 }),
              $refs.table.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd()"
            v-action:apiFlowableModelAddDialog
            >新增</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="queryParam.modelKey" placeholder="流程标识" />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="table"
        size="small"
        :columns="columns"
        :url="url"
        bordered
        :queryParam="queryParam"
        rowKey="id"
        showPagination="auto"
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
        @cancel="releaseHandleCancel()"
        @ok="releaseHandleOk"
      />
      <!-- 流程表单设计 -->
      <design-form
        ref="designForm"
        :isEdit="isEdit"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
				:formDesignUuid="formDesignUuid"
        @cancel="handleCancel(2)"
        @ok="handleOkDesign"
      ></design-form>
      <!-- 版本控制 -->
      <versionForm
        ref="versionForm"
        :visible="visibleVersion"
        :loading="confirmLoadingVersion"
        :model="mdlVersion"
        @cancel="handleCancelVersion()"
        @ok="handleOkVersion"
        @refresh="refreshTable"
      >
      </versionForm>
      <!-- 流程设计 -->
      <flowDesign
        ref="designModal"
        :visible="visibleDesign"
        :loading="confirmLoadingDesign"
        @cancel="handleCancel(1)"
        @ok="handleOkFlowDesign"
      ></flowDesign>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import designForm from "./design.vue";
import flowDesign from "../workflowDesign/index";
import editForm from "./edit.vue";
import versionForm from "./version.vue";
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
    designForm,
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
          align: "center",
        },
        {
          title: "流程标识",
          dataIndex: "modelKey",
          align: "center",
        },
        {
          title: "流程分类",
          dataIndex: "modelType",
          align: "center",
          width: 150,
          scopedSlots: {
            customRender: "modelType",
          },
        },
        {
          title: "流程版本",
          dataIndex: "modelVersion",
          // sorter: true,
          align: "center",
          scopedSlots: {
            customRender: "modelVersion",
          },
          width: 100,
        },
        {
          title: "发布状态",
          dataIndex: "birthday",
          scopedSlots: {
            customRender: "birthday",
          },
          align: "center",
          width: 100,
        },
        {
          title: "更新时间",
          dataIndex: "lastUpdated",
          // sorter: true,
          align: "center",
          width: 150,
        },
        {
          title: "操作",
          width: 180,
          dataIndex: "action",
          scopedSlots: {
            customRender: "action",
          },
          align: "center",
        },
      ],
      visible: false,
      visiblerelease: false,
      confirmLoading: false,
      mdl: null,
      mdlrelease: null,
      queryParam: {
        processModelType: 2,
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
			formDesignUuid: ""
    };
  },
  created() {
    this.getCategory();
  },
  mounted() {},
  methods: {
    // 流程分类
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
    // 获取流程分类
    getCategory() {
      // /workflow/flowCategory/getPageSet
      this.$post("/workflow/flowCategory/getPageSet").then((res) => {
        this.categoryList = res.rows;
      });
    },
    // 新增
    handleAdd() {
      this.visible = true;
      this.isEdit = false;
      this.$refs.designForm.setTable();
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
      that.mdl = {
        ...record,
      };
      that.isEdit = true;

      // 获取表单流程详情
      that.$post("/workflow/flowModel/getDetailByModelKey", {
          modelKey: that.mdl.modelKey,
          procdefId: that.mdl.procdefId,
          type: "mode",
        }).then((res) => {
          if (res.statusCode !== 300) {
						let formTableName = res.flowModel.formTableName
						this.$post("/form/formFieldJson/getDetailByTableName", {tableName: formTableName}).then((res) => {
							this.formDesignUuid = res.uuid
						});
            console.log(res.flowModel.modelType, res.flowModel.modelType == 1);
            if (res.flowModel.modelType === "1") {
              //流程设计详情
              that.visibleDesign = true;
              that.confirmLoadingDesign = true;
              setTimeout(function() {
                that.$refs.designModal.setAllData(res);
              }, 300);
            } else {
              //流程表单设计详情
              that.visible = true;
              that.confirmLoading = true;
              setTimeout(function() {
                that.$refs.designForm.setAllData(res);
              }, 300);
            }
          } else {
            if (res.modelType === "1") {
              that.visibleDesign = false;
            } else {
              that.visible = false;
            }
            // this.$emit('cancel')
            that.$message.error(res.message);
          }
        })
        .finally(() => {
          that.spinLoading = false;
          that.confirmLoadingDesign = false;
          that.confirmLoading = false;
        });
    },
    // 取消
    handleCancel(e) {
      if (e === 1) {
        this.visibleDesign = false;
      } else {
        this.visible = false;
      }
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
    // 关闭版本弹窗
    handleCancelVersion() {
      this.visibleVersion = false;
    },
    // 确定主要版本
    handleOkVersion() {
      this.confirmLoadingVersion = true;
      this.visibleVersion = false;
      this.$refs.table.refresh();
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
          // 在这里调用删除接口
          that
            .$post(that.url.deleteBatch, {
              modelId: record.id,
              procdefId: record.procdefId,
            })
            .then((res) => {
              console.log(res);
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
          this.$post(this.url.deployModelId, values)
            .then((res) => {
              if (res.statusCode === 200) {
								this.$message.success(res.message, 1.5);
                this.visiblerelease = false;
                form.resetFields();
                this.$refs.table.refresh();
              }else{
								this.$message.info(res.message, 1.5);
							}
            })
            .finally(() => {
              this.confirmLoading = false;
              this.$message.info(res.message, 1.5);
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 刷新数据表格
    refreshTable() {
      this.$refs.table.refresh();
    },
    // 表单流程设计提交
    handleOkDesign(bpmData, formData, formTableName, uuid) {
      const that = this;

      if (bpmData.formBtnList.length === 0) {
        that.$message.warn("请先配置节点按钮！");
        return true;
      }
      if (bpmData.formFieldList.length === 0) {
        that.$message.warn("请先配置节点表单字段！");
        return true;
      }
      if (!that.isEdit) {
        that.$confirm({
          title: "提示",
          content: "请修改流程标识和流程名称,便于进行业务处理",
          okText: "已修改,提交",
          cancelText: "去修改",
          onOk() {
            that.handleSubmitXML(bpmData, formData, formTableName, uuid);
          },
          onCancel() {},
        });
      } else {
        that.handleSubmitXML(bpmData, formData, formTableName, uuid);
      }
    },
    // 保存更新流程
    handleSubmitXML(bpmData, formData, formTableName, uuid) {
      let url = "";
      this.confirmLoading = true;
      let parameter = {
        modelType: 2,
        formTableName: formTableName,
        uuid: uuid,
        formBtnList: JSON.stringify(bpmData.formBtnList),
        formModel: formData.formModel,
        formFieldList: JSON.stringify(bpmData.formFieldList),
        formNoticeList: JSON.stringify(bpmData.formNoticeList),
        permissionType: bpmData.permissionType,
        permissionValue: bpmData.permissionValue,
        processModelType: 2, //区分自定义 和可视化
      };
      if (!uuid) {
        //新增参数
        parameter.modelName = bpmData.processName;
        parameter.formJson = formData.fieldJson;
        parameter.flowJson = bpmData.xml;
        parameter.modelKey = bpmData.processKey;
        parameter.modelId = bpmData.processId;
        url = "/workflow/flowModel/save";
      } else {
        //更新参数
        parameter.actDeModelName = bpmData.processName;
        parameter.formDesign = formData.fieldJson;
        parameter.flowDesign = bpmData.xml;
        parameter.actDeModelKey = bpmData.processKey;
        parameter.actDeModelId = bpmData.processId;
        parameter.procdefId = this.mdl.procdefId;
        url = "/workflow/flowModel/updateData";
      }
      this.$post(url, parameter).then((res) => {
        if (res.statusCode === 200) {
          this.confirmLoading = false;
          this.visible = false;
          this.$message.info(res.message);
          this.$refs.table.refresh();
        } else {
          this.confirmLoading = false;
          this.$message.error(res.message);
        }
      });
    },
    // 流程设计提交
    handleOkFlowDesign(bpmData, uuid) {
      let url = "";
      this.confirmLoadingDesign = true;
      let parameter = {
        modelType: 1,
        uuid: uuid,
        formBtnList: JSON.stringify(bpmData.formBtnList),
        formModel: formData.formModel,
        formNoticeList: JSON.stringify(bpmData.formNoticeList),
        permissionType: bpmData.permissionType,
        permissionValue: bpmData.permissionValue,
        processModelType: 1, //区分自定义 和可视化
      };
      if (!uuid) {
        modelName = bpmData.processName;
        flowJson = bpmData.xml;
        modelKey = bpmData.processKey; //efd_ht_task
        modelId = bpmData.processId;
        url = "/workflow/flowModel/save";
      } else {
        actDeModelName = bpmData.processName;
        flowDesign = bpmData.xml;
        actDeModelKey = bpmData.processKey;
        actDeModelId = bpmData.processId;
        procdefId = this.mdl.procdefId;
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

<style lang="less"></style>
