<!--
 * @Description: 数据权限
 * @Author: 黄婷
 * @Date: 2021-05-25 13:41:18
 * @LastEditTime: 2021-06-21 15:17:55
 * @LastEditors: 黄婷
 * @FilePath: \vue-antd-admine:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\authGroup\dataPermission.vue
-->
<template>
  <div>
    <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
      <div class="table-operator">
        <a-button class="cu-btn-primary" icon="plus" @click="handleSource(1)"
          >批量授权</a-button
        >
        <a-button class="cu-btn-danger" icon="delete" @click="handleSource(0)"
          >批量取消</a-button
        >
      </div>
    </div>
    <a-spin :spinning="spinning">
      <a-table
        size="small"
        :columns="sourceColumns"
        :data-source="sourceData"
        bordered
        rowKey="id"
        :rowSelection="rowSelection"
        :pagination="false"
      >
        <span slot="status" slot-scope="text, record">
          {{ statusAuthFilter(text, record) }}
        </span>
      </a-table>
    </a-spin>
  </div>
</template>

<script>
import { getFilter } from "@/utils/TopVUI";
export default {
  name: "Table",
  data() {
    return {
      key: "0",
      confirmLoading: false,
      visible: false,
      buttonVisible: false,
      buttonConfirmLoading: false,
      buttonMdl: null,
      mdl: null,
      rows: null,
      selectedRowKeys: [],
      selectedRows: [],
      sourceData: [],
      sourceColumns: [
        {
          title: "名称",
          dataIndex: "text",
          align: "left",
          ellipsis: true,
        },
        {
          title: "资源地址",
          dataIndex: "href",
          ellipsis: true,
        },
        {
          title: "授权状态",
          dataIndex: "status",
          scopedSlots: {
            customRender: "status",
          },
          ellipsis: true,
          customCell: (record, rowIndex) => {
            if (record.status === 1 || record.status === "1") {
              return {
                style: "color: green",
              };
            } else {
              return {
                style: "color: red",
              };
            }
          },
        },
      ],
      url: {
        fathersUrl: "/system/sysDataAuth/getListByPid",
        addRuleUrl: "/system/sysDataAuth/addRule",
        cancelRule: "/system/sysDataAuth/cancelRule",
      },
      spinning: false,
      tLoading: false,
      queryParam: {},
    };
  },
  filters: {
    statusFilter(val) {
      let txt = "";
      if (val === 1 || val === "1") {
        txt = "启用";
      } else {
        txt = "禁用";
      }
      return txt;
    },
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows);
          let index = -1;
          if (!selected) {
            if (record.children) this.cancleCheckedList(record.children);
          } else {
            if (record.children) {
              this.getCheckedList(record.children);
            }
          }
        },
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys;
        },
      };
    },
  },
  mounted() {
    // console.log(this.$refs.masterList.getListData())
    this.getSourceData();
  },
  methods: {
    refreshList(val) {
      this.queryParam = val;
      this.getSourceData();
    },
    statusAuthFilter(val, record) {
      let txt = "";
      if ((val === 1 || val === "1") && record.href) {
        txt = "已授权";
      } else if ((val === 0 || val === "0") && record.href) {
        txt = "未授权";
      } else {
        txt = "";
      }
      return txt;
    },
    // 获取最外层数据
    getSourceData() {
      let that = this;
      that.spinning = true;
      that.$post(this.url.fathersUrl, this.queryParam).then((res) => {
        let sourceData = [];
        let children = [];
        if (res) {
          res.forEach((e) => {
            if (e.pid == 1) {
              e.key = e.id;
              e.children = e.state === "closed" ? [] : "";
              sourceData.push(e);
            } else {
              children.push(e);
            }
          });
          that.sourceData = getFilter(sourceData, children);
        }
        that.spinning = false;
      });
    },
    //勾选被选中的子级数据
    getCheckedList(childre) {
      children.forEach((e) => {
        this.selectedRowKeys.push(e.id);
        if (e.children) this.getCheckedList(e.children);
      });
    },
    //取消被选中的子级数据
    cancleCheckedList(list) {
      let index = -1;
      list.forEach((m) => {
        index = this.selectedRowKeys.indexOf(m.id);
        this.selectedRowKeys.splice(index, 1);
        if (m.children) this.cancleCheckedList(m.children);
      });
    },
    handleSource(type) {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warn("请先选择需要操作的数据");
        return;
      }
      this.spinningData = true;
      let uuid = this.selectedRowKeys.toString();
      let url = "";
      if (type === 0) {
        url = this.url.cancelRule;
      } else {
        url = this.url.addRuleUrl;
      }
      this.$post(url, {
        roleId: this.queryParam.roleId,
        uuid: uuid,
      }).then((res) => {
        if (res.statusCode === 200) {
          this.getSourceData();
          this.selectedRowKeys = [];
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
        this.spinningData = false;
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
