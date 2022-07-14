<!--
 * @Description: 页面授权
 * @Author: lmy
 * @Date: 2021-05-25 10:23:15
 * @LastEditTime: 2021-06-01 15:52:38
 * @LastEditors: lmy
 * @FilePath: \misboot-cloud-topvui\src\pages\system\authGroup\jurisdiction.vue
-->
<template>
  <div>
    <!-- <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
			<div class="table-operator">
				<a-button class="cu-btn-primary" icon="plus" @click="handleAccessAuth('all', 1)">批量授权</a-button>
				<a-button class="cu-btn-danger" icon="delete" @click="handleAccessAuth('all', 0)">批量取消</a-button>
			</div>
		</div> -->
    <tool-bar>
      <template slot="toolBtn" slot-scope="scope">
        <a-button
          class="cu-btn-primary"
          icon="plus"
          @click="handleAccessAuth('all', 1)"
          >批量授权</a-button
        >
        <a-button
          class="cu-btn-danger"
          icon="delete"
          @click="handleAccessAuth('all', 0)"
          >批量取消</a-button
        >
      </template>
      <!-- <template slot="toolForm">
				<a-form-item label="" class="margin-right">
					<a-select v-model="queryParam.roleType" default-value="系统角色" style="width:120px" @change="">
						<a-select-option value="系统角色">
							系统菜单
						</a-select-option>
						<a-select-option value="APP角色">
							APP菜单
						</a-select-option>
					</a-select>
				</a-form-item>
			</template> -->
    </tool-bar>
    <a-spin :spinning="spinning">
      <a-table
        size="small"
        :columns="sourceColumns"
        :data-source="sourceData"
        bordered
        rowKey="uuid"
        :rowSelection="rowSelection"
        :pagination="false"
      >
        <span slot="accessAuth" slot-scope="text">
          {{ text | accessAuthFilter }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a v-if="record.accessAuth !== 1" @click="handleAccessAuth(record)"
              >授权</a
            >
            <a v-else @click="handleAccessAuth(record)">取消授权</a>
          </template>
        </span>
      </a-table>
    </a-spin>
    <!--  -->
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
          title: "机构名称",
          dataIndex: "text",
          align: "left",
          ellipsis: true,
        },
        {
          title: "授权状态",
          dataIndex: "accessAuth",
          scopedSlots: {
            customRender: "accessAuth",
          },
          customCell: (record, rowIndex) => {
            if (record.accessAuth === 1) {
              return {
                style: "color: green",
              };
            } else {
              return {
                style: "color: red",
              };
            }
          },
          ellipsis: true,
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 100,
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      url: {
        fathersUrl: "/system/authAccess/getListByRoleIdAllMenu",
        gruntUrl: "/system/authAccess/grant",
        ungruntUrl: "/system/authAccess/ungrant",
      },
      spinning: false,
      tLoading: false,
      queryParam: {},
			selectedRowIds: []
    };
  },
  filters: {
    accessAuthFilter(val) {
      let txt = "";
      if (val === 1 || val === "1") {
        txt = "已授权";
      } else if (val === 0) {
        txt = "未授权";
      } else {
        txt = "未授权";
      }
      return txt;
    },
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onSelect: (record, selected, selectedRows) => {
          if (!selected) {
            if (record.children){
							this.cancleCheckedList(record.children);
						}
						let index = this.selectedRowIds.indexOf(record.id);
						this.selectedRowIds.splice(index,1);
          } else {
            if (record.children) {
              this.getCheckedList(record.children);
            }
						this.setName([record])
						
          }
        },
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys;
        },
				onSelectAll: (selected, selectedRows, changeRows) =>{
					this.selectedRowIds = []
					selectedRows.forEach(item => {
						this.selectedRowIds.push(item.id)
					})
				}
      };
    },
  },
  mounted() {
    // console.log(this.$refs.masterList.getListData())
    this.getSourceData();
  },
  methods: {
		setName(datas){ //遍历树  获取id数组
		  for(var i in datas){
		    this.selectedRowIds.push(datas[i].id)  // 遍历项目满足条件后的操作
		    if(datas[i].children){  //存在子节点就递归
		      this.setName(datas[i].children);
		    }
		  }
		},
    refreshList(val) {
      this.queryParam = val;
			this.selectedRowIds = []
			this.selectedRowKeys = []
      this.getSourceData();
    },
    // 获取最外层数据
    getSourceData() {
      let that = this;
      that.spinning = true;
      that.$post(this.url.fathersUrl, this.queryParam).then((res) => {
        let sourceData = [];
        let children = [];
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
        that.spinning = false;
      });
    },
    //勾选被选中的子级数据
    getCheckedList(children) {
      children.forEach((e) => {
        this.selectedRowKeys.push(e.uuid);
				// this.selectedRowIds.push(e.id);
        if (e.children) this.getCheckedList(e.children);
      });
    },
    //取消被选中的子级数据
    cancleCheckedList(list) {
      let uuidIndex = -1;
      let idIndex = -1;
      list.forEach((m) => {
        uuidIndex = this.selectedRowKeys.indexOf(m.uuid);
        idIndex = this.selectedRowIds.indexOf(m.id);
        this.selectedRowKeys.splice(uuidIndex, 1);
				this.selectedRowIds.splice(idIndex, 1);
        if (m.children) this.cancleCheckedList(m.children);
      });
    },
    handleAccessAuth(e, type) {
      let url = "";
      let uuid = "";
			let id = ""
      if (e === "all") {
        if (this.selectedRowKeys.length === 0) {
          this.$message.warn("请先选择需要操作的数据");
          return;
        }
        if (type === 0) {
          url = this.url.ungruntUrl;
        } else {
          url = this.url.gruntUrl;
        }
        uuid = this.selectedRowKeys.toString();
        id = this.selectedRowIds.toString();
      } else {
        if (e.accessAuth === 1) {
          url = this.url.ungruntUrl;
        } else {
          url = this.url.gruntUrl;
        }
        uuid = e.uuid;
        id = e.id;
      }
      this.spinning = true;
      this.$post(url, {
        roleId: this.queryParam.roleId,
        uuid: uuid,
        attributes: id,
      }).then((res) => {
        if (res.statusCode === 200) {
          this.getSourceData();
          this.selectedRowKeys = [];
          this.selectedRowIds = [];
          this.$message.info(res.message);
        } else {
          this.$message.error(res.message);
        }
        this.spinning = false;
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
