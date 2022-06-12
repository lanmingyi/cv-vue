<!--
 * @Description: 组织机构
 * @Author: 黄婷
 * @Date: 2021-06-09 18:35:43
 * @LastEditTime: 2021-09-09 17:07:05
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysQyweixin\organization.vue
-->
<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar>
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="sync"
            @click="handleSynchronization()"
            v-action:organizationQyweixinSync
            >同步企业微信机构</a-button
          >
        </template>
      </tool-bar>
        <tree-grid
          ref="masterList"
          :columns="columns"
          rowKey="uuid"
          :url="url"
          :parameter="parameter"
          @rowClick="masterRowClick"
        >
        </tree-grid>
    </div>
  </div>
</template>

<script>
import { TreeGrid } from "@/components";
import { treeGridMixin } from "@/mixins/treeGridMixin";
export default {
  name: "Table",
  mixins: [treeGridMixin],
  components: {
    TreeGrid,
  },
  data() {
    return {
      key: "0",
      masterConfirmLoading: false,
      masterVisible: false,
      masterMdl: null,
      masterRows: null,
      masterSelectedRowKeys: [],
      masterSelectedRows: [],
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          align: "left",
          ellipsis: true,
        },
      ],
      url: {
        fathersUrl: "/system/sysQyweixinOrganization/getDatList",
        expandUrl: "/system/sysQyweixinOrganization/getDatList",
      },
      parameter: {
        father: {
          pid: 0,
        },
        children: {},
      },
      masterQueryParam: {},
      loading: false,
    };
  },
  created() {},
  methods: {
    handleSynchronization() {
      const that = this;
      that.$confirm({
        title: "警告",
        content: `同步企业微信机构数据将覆盖本地机构数据，确定执行该操作吗？`,
        okText: "同步",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that.loading = true;
          // 在这里调用删除接口
          that
            .$post(
              "/system/sysQyweixinOrganization/synchroQyWexixingOrganization"
            )
            .then((res) => {
              if (res.statusCode === 200) {
                that.$message.success(res.message, 1.5);
                that.$refs.masterList.refresh();
              } else {
                that.$message.error(res.message, 1.5);
              }
            })
            .finally(() => {
              that.loading = false;
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
  },
};
</script>

<style scoped lang="less"></style>
