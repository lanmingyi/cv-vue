<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar>
        <template slot="toolBtn" slot-scope="scope">
          <a-dropdown>
            <a-menu
              slot="overlay"
              @click="
                (e) => {
                  handleAdd(e.key, $refs.masterList.data);
                }
              "
            >
              <a-menu-item key="1">
                <a-icon type="plus" /> 新增根节点
              </a-menu-item>
              <a-menu-item key="2">
                <a-icon type="plus" /> 新增子节点
              </a-menu-item>
            </a-menu>
            <a-button class="cu-btn-primary" icon="plus">
              新增
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
          <!-- <a-button
            class="cu-btn-default"
            icon="edit"
            @click="handleEdit($refs.masterList.rows, $refs.masterList.data)"
            >编辑</a-button
          > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.masterList.selectedRowKeys)"
            >删除</a-button
          >
          <a-button icon="bars" @click="createButton()" type="link"
            >生成功能菜单</a-button
          >
        </template>
      </tool-bar>
      <TreeGrid
        ref="masterList"
        :columns="masterColumns"
        :url="url"
        rowKey="uuid"
        :parameter="parameter"
        @rowClick="masterRowClick"
      >
        <span slot="status" slot-scope="{ text }">
          <a-tag :color="text === 1 || text === '1' ? 'green' : 'red'">
            {{ text === 1 || text === "1" ? "启用" : "禁用" }}
          </a-tag>
        </span>
        <span slot="resourceType" slot-scope="{ text }">
          {{ text | resourceTypeFilter }}
        </span>
        <span slot="action" slot-scope="{ record }">
          <template>
            <a @click="handleEdit(record, $refs.masterList.data)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">删除</a>
          </template>
        </span>
      </TreeGrid>
      <!--	新增编辑	 -->
      <edit-form
        :type="key"
        ref="masterModal"
        :visible="masterVisible"
        :loading="masterConfirmLoading"
        :model="masterMdl"
        @cancel="handleCancel()"
        @ok="handleOk()"
      />
      <buttonForm
        ref="buttonModal"
        :visible="buttonVisible"
        :loading="buttonConfirmLoading"
        :model="buttonMdl"
        @cancel="handleButtonCancel()"
        @ok="handleButtonOk()"
      />
    </div>
  </div>
</template>

<script>
import { TreeGrid } from "@/components";
import { treeGridMixin } from "@/mixins/treeGridMixin";
import editForm from "./treeEdit";
import buttonForm from "./button.vue";
export default {
  name: "Table",
  components: { TreeGrid, editForm, buttonForm },
  mixins: [treeGridMixin],
  data() {
    return {
      masterColumns: [
        {
          title: "名称",
          align: "left",
          dataIndex: "text",
          width: 250,
        },
        {
          title: "资源类型",
          dataIndex: "resourceType",
          scopedSlots: { customRender: "resourceType" },
          width: 100,
        },
        {
          title: "菜单路径或标识",
          dataIndex: "url",
        },
        {
          title: "前端组件",
          dataIndex: "remark",
          width: 250,
        },
        // {
        //   title: "编号",
        //   dataIndex: "id",
        // },
        // {
        //   title: "父级编号",
        //   dataIndex: "pid",
        // },
        {
          title: "排序",
          dataIndex: "sort",
          width: 100,
          align: "center",
        },
        {
          title: "状态",
          dataIndex: "status",
          align: "center",
          scopedSlots: { customRender: "status" },
          width: 100,
        },
        {
          title: "操作",
          width: 150,
          align: "center",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      masterVisible: false,
      masterConfirmLoading: false,
      masterMdl: null,
      // 查询参数
      masterQueryParam: {},
      url: {
        fathersUrl: "/system/menu/getListByLevelId",
        expandUrl: "/system/menu/getListByPid",
        masterUpdate: "/system/menu/update",
        masterDelete: "/system/menu/delete",
        masterSaveRoot: "/system/menu/save",
        masterSave: "/system/menu/save",
        menuMenuSave: "/system/menu/functionMenuSave",
      },
      parameter: {
        father: {
          levelId: 1,
        },
        children: {},
      },
      buttonVisible: false,
      buttonConfirmLoading: false,
      buttonMdl: null,
      key: "",
    };
  },
  filters: {
    resourceTypeFilter(val) {
      const resourceTypeMap = {
        menu: "菜单",
        urlNewWindows: "链接-新窗口",
        button: "按钮",
        urlInsidePage: "链接-内页",
        outerChain: "链接-外链",
        APP: "APP菜单",
      };
      return resourceTypeMap[val];
    },
  },
  methods: {
    // 生成功能菜单
    createButton() {
      if (!this.$refs.masterList.rows) {
        this.$message.info("请先选择所要操作的数据");
        return true;
      } else {
        this.buttonVisible = true;
        this.buttonMdl = this.$refs.masterList.rows;
        this.$refs.buttonModal.show(this.buttonMdl);
      }
    },
    /* 取消 */
    handleButtonCancel(type) {
      let form = {};
      this.buttonVisible = false;
      form = this.$refs.buttonModal.form;
      form.resetFields(); // 清理表单数据（可不做）
    },
    /* 提交 */
    handleButtonOk() {
      const form = this.$refs.buttonModal.form;
      this.buttonConfirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          this.$post(this.url.menuMenuSave, values).then((res) => {
            this.buttonConfirmLoading = false;
            if (res.statusCode === 200) {
              this.buttonVisible = false;
              this.$message.success(res.message);
              this.treeData = [];
              this.$refs.masterList.refresh();
            } else {
              this.$message.info(res.message);
            }
          });
        } else {
          this.buttonConfirmLoading = false;
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
