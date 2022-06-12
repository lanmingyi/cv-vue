<template>
  <div class="page-common-layout">
    <div class="page-common-left" style="width:30%">
      <tree-grid
        ref="masterList"
        :columns="columns"
        rowKey="uuid"
        :url="url"
        :parameter="parameter"
        :formatConditions="false"
        :showSearch="false"
        @rowClick="
          (e) => {
            masterRowClick(e, { id: 'id' });
          }
        "
      >
      </tree-grid>
    </div>
    <div class="page-common-content">
      <tool-bar
        @search="$refs.subList.refresh(true)"
        @reset="
          () => {
            (subQueryParam = {}), $refs.subList.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd('1', $refs.masterList.data, 'sub')"
            v-action:formModuleAddDialog
            >新增</a-button
          >
          <!-- <a-button
                class="cu-btn-default"
                icon="edit"
                @click="
                  handleEdit($refs.subList.rows, $refs.masterList.data, 'sub')
                "
                v-action:formModuleEditDialog
                >编辑</a-button
              > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleDelSub($refs.subList.selectedRowKeys, 'all')"
            v-action:formModuleDelDialog
            >删除</a-button
          >
        </template>
        <!-- <template slot="toolForm">
              <a-form-item label="">
                <a-input v-model="subQueryParam.tableName" placeholder="表名" />
              </a-form-item>
            </template> -->
      </tool-bar>
      <DataGrid
        ref="subList"
        type="sub"
        :url="url"
        :columns="subColumns"
        bordered
        :queryParam="subQueryParam"
        rowKey="uuid"
        showPagination="auto"
      >
        <span slot="formTableVersion" slot-scope="{ text, record, index }">
          <a-tag v-if="text" :color="'geekblue'">
            {{ "V:" + record.formTableVersion }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a
              @click="handleEdit(record, $refs.masterList.data, 'sub')"
              v-action:formModuleEditDialog
              >编辑</a
            >
            <a-divider type="vertical" />
            <a @click="handleViewDesign(record)">设计</a>
            <a-divider type="vertical" />
            <a @click="handlePreview(record)">预览</a>
            <a-divider type="vertical" />
            <a @click="handleRelease(record)">绑定菜单</a>
            <a-divider type="vertical" />
            <!-- <a @click="handleRelease(record)">发布</a>
                <a-divider type="vertical" />
                <a @click="versionManage(record)">版本管理</a> -->
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
                  <a @click="handlePreviewForm(record)">查看表单</a>
                </a-menu-item>
								<a-menu-item>
								  <a @click="handleCopyForm(record)">复制表单</a>
								</a-menu-item>
                <a-menu-item>
                  <a @click="handleDelSub(record)">删除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </span>
      </DataGrid>
      <edit-form
        ref="subModal"
        :visible="subVisible"
        :loading="subConfirmLoading"
        :model="subMdl"
        @cancel="handleCancel('sub')"
        @ok="handleOk('sub')"
      />
      <detail-form
        ref="detailModal"
        @cancel="handleCancelDetail()"
        @ok="handleOkDetail()"
        :visibleDetail="visibleDetail"
      />
			<!-- 复制表单 -->
			<copy-form
			  ref="copyForm"
			  :visible.sync="copyFormVisible"
			  :loading="copyFormLoading"
			  :model="copyFormMdl"
			  @ok="copyFormOk()"
			/>
      <!-- 发布菜单 -->
      <release-modal
        ref="releaseModal"
        @ok="handleReleaseOk()"
        :visible.sync="visibleRelease"
        :loading="releaseConfirmLoading"
        :mdl="releaseMdl"
      ></release-modal>
      <KFormPreview ref="previewModal"></KFormPreview>
      <!-- 版本控制 -->
      <versionForm
        ref="versionForm"
        :visible="visibleVersion"
        :loading="confirmLoadingVersion"
        :model="mdlVersion"
        @cancel="handleCancelVersion()"
        @ok="handleOkVersion"
      ></versionForm>
    </div>
  </div>
</template>
<script>
import { TreeGrid, DataGrid } from "@/components";
import { treeGridMixin } from "@/mixins/treeGridMixin";
import editForm from "./edit.vue";
import copyForm from "./copyForm.vue";
import KFormPreview from "@/components/TopVUI/k-form-design/packages/KFormPreview/index";
import detailForm from "./design.vue";
import releaseModal from "./releaseModal.vue";
import versionForm from "./version.vue";
export default {
  mixins: [treeGridMixin],
  components: {
    TreeGrid,
    editForm,
		copyForm,
    DataGrid,
    KFormPreview,
    detailForm,
    releaseModal,
    versionForm,
  },
  data() {
    return {
      key: "1",
      columns: [
        {
          title: "分类名称",
          dataIndex: "text",
          ellipsis: true,
        },
      ],
      subColumns: [
        {
          title: "表名",
          align: "center",
          dataIndex: "tableName",
          width: 200,
        },
        {
          title: "表描述",
          align: "center",
          dataIndex: "tableDesc",
        },
        {
          title: "版本",
          align: "center",
          width: 80,
          dataIndex: "formTableVersion",
          scopedSlots: {
            customRender: "formTableVersion",
          },
        },
        {
          title: "排序",
          width: 80,
          align: "center",
          dataIndex: "sort",
          sorter: true,
        },
        {
          title: "操作",
          align: "center",
          dataIndex: "action",
          width: 280,
          scopedSlots: {
            customRender: "action",
          },
          fixed: "right",
        },
      ],
      masterVisible: false,
      subVisible: false,
      masterConfirmLoading: false,
      subConfirmLoading: false,
      visibleVersion: false,
      confirmLoadingVersion: false,
      mdlVersion: null,
      masterMdl: null,
      subMdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      subQueryParam: {},
      url: {
        fathersUrl: "/form/formModule/getListByLevelId",
        expandUrl: "/form/formModule/getListByPid",
        subList: "/form/formTable/getPageSetData",
        subSave: "/form/formTable/save",
        subUpdate: "/form/formTable/update",
        subDelete: "/form/formTable/deleteBatch",
      },
      parameter: {
        father: {
          levelId: 1,
        },
        children: {},
      },
      visibleDetail: false,
      visibleRelease: false,
      releaseConfirmLoading: false,
      releaseMdl: null,
			copyFormVisible: false,
			copyFormLoading: false,
			copyFormMdl: null
    };
  },
  activated() {},
  mounted() {},
  methods: {
    // 设计
    handleViewDesign(e) {
      this.visibleDetail = true;
      this.$refs.detailModal.getData(e.tableName);
    },
    handleOkDetail() {
      this.$refs.subList.refresh();
      this.$refs.subList.selectedRowKeys = [];
      this.$refs.subList.selectedRows = [];
    },
    // 查看表单
    handlePreviewForm(e) {
      let MIS_ACCESS_TOKEN = localStorage.getItem("MIS_ACCESS_TOKEN");
      if (MIS_ACCESS_TOKEN) {
        this.$router.push({
          path: "/form/formDefine/view?tableName=" + e.tableName,
        });
      } else {
        this.$router.push({
          path: "/form/formDefine/index?tableName=" + e.tableName,
        });
      }
    },
    // 预览
    handlePreview(val) {
      if (!val.fieldJson) {
        return this.$message.warn("请先设计表单！", 2);
      }
      this.$refs.previewModal.jsonData = JSON.parse(val.fieldJson);
      // this.$refs.previewModal.previewWidth = this.previewOptions.width;
      this.$refs.previewModal.visible = true;
    },
    handleCancelDetail(e) {
      this.visibleDetail = false;
    },
    handleDelSub(record, type) {
      console.log(record);
      if (!record || record.length === 0) {
        this.$message.warn("请先勾选需要删除的数据", 1.5);
        return false;
      }
      const that = this;
      let tableName = [],
        uuid;
      if (type == "all") {
        uuid = record.toString();
        that.$refs.subList.selectedRows.forEach((res) => {
          tableName.push(res.tableName);
        });
      } else {
        uuid = record.uuid;
        tableName = record.tableName;
      }
      that.$confirm({
        title: "警告",
        content: `确定要执行该操作吗?`,
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          // 在这里调用删除接口
          that
            .$post(that.url.subDelete, {
              uuid: uuid,
              tableName: tableName.toString(),
            })
            .then((res) => {
              if (res.statusCode === 200 || res === 1) {
                that.$message.success("删除成功", 1.5);
                that.$refs.subList.refresh();
              } else {
                that.$message.error(res.message);
              }
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    // 发布菜单
    handleRelease(record) {
      const form = this.$refs.releaseModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.visibleRelease = true;
      this.releaseMdl = {
        tableName: record.tableName,
        tableDesc: record.tableDesc,
      };
      this.$refs.releaseModal.add(this.releaseMdl);
    },
    handleReleaseOk() {
      this.releaseConfirmLoading = true;
      const form = this.$refs.releaseModal.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          this.$post("/system/menu/formPublishing", values)
            .then((res) => {
              if (res.statusCode === 200) {
                this.$message.success(res.message, 1.5);
                this.visibleRelease = false;
              } else {
                this.$message.error(res.message, 1.5);
              }
            })
            .finally(() => {
              this.releaseConfirmLoading = false;
            });
        } else {
          this.releaseConfirmLoading = false;
        }
      });
    },
    // 版本管理
    versionManage(e) {
      this.visibleVersion = true;
      this.mdlVersion = e.tableName;
      if (this.$refs.versionForm)
        this.$refs.versionForm.refreshList(e.tableName);
    },
    handleCancelVersion() {
      this.visibleVersion = false;
    },
    handleOkVersion() {
      this.confirmLoadingVersion = true;
      this.visibleVersion = false;
      this.$refs.subList.refresh();
      this.confirmLoadingVersion = false;
    },
		// 复制表单
		handleCopyForm(e){
			this.copyFormMdl = e
			this.copyFormMdl.newTableName = null
			this.copyFormMdl.oldTableName = e.tableName
			this.$refs.copyForm.treeData = this.$refs.masterList.data
			this.copyFormVisible = true;
		},
		copyFormOk() {
			const form = this.$refs.copyForm.form
			this.copyFormVisible = true
			form.validateFields((errors, values) => {
				let fromValue = {
					...values
				}
				if (!errors) {
					this.$post("/form/formModule/copyForm", fromValue).then((res) => {
						if (res.statusCode === 200 || res === 1) {
							this.$refs.subList.refresh()
							this.copyFormVisible = false
							this.$message.success(res.message || '操作成功', 1.5)
						} else {
							this.$message.error(res.message || '操作失败', 1.5)
						}
					})
				} else {
					this.copyFormVisible = false
				}
			})
		}
  }
};
</script>

<style scope></style>
