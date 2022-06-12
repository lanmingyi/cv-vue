<!--
 * @Description: 
 * @Author: 黄婷
 * @Date: 2021-07-26 17:32:39
 * @LastEditTime: 2021-08-04 19:45:20
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysDingtalk\userModal.vue
-->
<template>
  <t-modal
    title="用户信息"
    :width="1000"
    :visible="visible"
    switchFullscreen
    wrapClassName="t-popup-modal"
    @ok="handleSubmit"
    @cancel="cancelModal"
    cancelText="关闭"
  >
    <a-row :gutter="10">
      <a-col :md="6" :sm="24">
        <a-card :bordered="false">
          <a-tree
            v-if="orgTree.length"
            showLine
            :load-data="onLoadData"
            :tree-data="orgTree"
            @select="selectTree"
						:defaultSelectedKeys="defaultSelectedKeys"
            default-expand-all
          />
        </a-card>
      </a-col>
      <a-col :md="18" :sm="24">
        <a-card :bordered="false">
          <div class="toolbar table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="12" type="flex" justify="start">
                <a-col :md="6" :sm="24">
                  <a-form-item label="">
                    <t-date
                      type="month"
                      v-model="queryParam.years"
                      placeholder="月份"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
					<div class="page-common-sub-box">
						<s-table
						  ref="table"
						  :columns="columns"
						  bordered
						  rowKey="uuid"
						  :data="loadData"
						  :pageSize="10"
						  :rowSelection="rowSelection"
						  @rowClick="rowClick"
							:scroll="scrollXY"
							v-if="queryParam.orgId"
						>
						  <span slot="serial" slot-scope="text, record, index">
						    {{ index + 1 }}
						  </span>
						</s-table>
					</div>
        </a-card>
      </a-col>
    </a-row>
  </t-modal>
</template>

<script>
import { STable } from "@/components";

export default {
  name: "TreeList",
  components: {
    STable,
  },
  props: {
    visible: {
      type: Boolean,
    },
    userList: {
      type: String,
    },
  },
  data() {
    return {
      mdl: null,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: "#",
          align: "center",
          width: 50,
          scopedSlots: {
            customRender: "serial",
          },
          fixed: "left",
        },
        {
          title: "员工号",
          align: "center",
          width: 300,
          dataIndex: "userid",
        },
        {
          title: "姓名",
          align: "center",
          dataIndex: "name",
        },
      ],
      orgTree: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getUserList, requestParameters).then(
          (res) => {
            if (res.statusCode === 300) res = [];
            var list = {
              rows: res,
              pageNo: 1,
              pageSize: 20,
              totalCount: 10,
              totalPage: 1,
            };
            return list;
          }
        );
      },
			defaultSelectedKeys: [],
      selectedRowKeys: [],
      selectedRows: [],
      info: "",
      url: {
        getUserList: "/mdata/nail/getORGUserAllList",
        getOrgTree: "/mdata/nail/getORG?orgId=1",
        getTreeListByPid: "/mdata/nail/getORG",
      },
    };
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        type: "checkbox",
      };
    },
		scrollXY(){
			let subHeight = this.subHeight ? this.subHeight : 500
			let height = subHeight - 40 - 40
			return { y : height};
		},
    currentMonth() {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth();
      if (month == 0) {
        year = year - 1;
        month = 12;
      }
      let date = year + "-" + month;
      return date;
    },
  },
  watch: {
    // visible(){
    //   console.log(this.userList)
    //   // this.selectedRowKeys = this.userList.split(',')
    //   // this.selectedRows = this.selectedRowKeys
    //   console.log(this.selectedRowKeys)
    // }
  },
  created() {
    this.getListData();
		this.$nextTick(()=>{
			this.subHeight = document.getElementsByClassName("page-common-sub-box")[0]?.clientHeight;
		})
  },
  methods: {
    getListData() {
      this.$post(this.url.getOrgTree).then((res) => {
        // 获取树形第一层级
        this.orgTree = res;
        this.orgTree.forEach((e, index) => {
          e.title = e.name;
          e.index = index;
          e.key = e.dept_id;
        });	
				this.defaultSelectedKeys.push(res[0].dept_id)
				this.queryParam.orgId = res[0].dept_id
      });
    },
    setData() {
			this.orgTree = [];
      this.selectedRows = [];
      this.selectedRowKeys = [];
      this.getListData();
    },
    rowClick(record, index) {
      // 数据表格行点击事件
      this.selectedRows = [];
      this.selectedRows.push(record);
      this.selectedRowKeys = index;
    },
    // 加载树形子级数据
    onLoadData(treeNode) {
      return new Promise((resolve) => {
        // 判断是否有子级
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        this.$post(this.url.getTreeListByPid, {
          orgId: treeNode.dataRef.dept_id,
        })
          .then((res) => {
            const orgTree = res;
            orgTree.forEach((e, index) => {
              orgTree[index].title = e.name;
              orgTree[index].index = index;
              orgTree[index].key = e.dept_id;
            });
            treeNode.dataRef.children = orgTree;
            this.orgTree = [...this.orgTree];
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    // 树形选择事件
    selectTree(value, node, extra) {
      const tree = node.node.dataRef;
      this.queryParam.orgId = tree.dept_id;
      this.queryParam.pageNo = 1;
      this.$refs.table.refresh();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
		cancelModal(){
			this.queryParam = {}
			this.$refs.table.refresh()
			this.$emit('update:visible', false)
		},
    handleSubmit() {
      // debugger
      if (!this.selectedRows || this.selectedRows.length == 0) {
        this.$message.warning("请选择一条数据");
        return false;
      }
      if (this.typeNum === 1) {
        this.$emit("change", this.selectedRows[0]);
      } else {
        let selectedRows = {};
        this.selectedRows.forEach((e, index) => {
          if (index === 0) {
            selectedRows.userid = e.userid;
            selectedRows.userName = e.name;
          } else {
            selectedRows.userid += "," + e.userid;
            selectedRows.userName += "," + e.name;
          }
        });
        let values = {
          userId: selectedRows.userid,
          userName: selectedRows.userName,
          years: this.queryParam.years
            ? this.queryParam.years
            : this.currentMonth,
        };
        console.log("selectedRows", values);
        this.$emit("ok", values);
      }
      this.close();
    },
    close() {
      this.$emit("close");
    },
    handleCancel() {
      this.close();
    },
    resetSearchForm() {
      this.queryParam = {};
      this.queryParam.id = this.orgId;
      this.$refs.table.refresh();
    },
  },
};
</script>

<style lang="less">
.custom-tree {
  /deep/ .ant-menu-item-group-title {
    position: relative;

    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .ant-menu-item {
    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .btn {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    width: 20px;
    height: 40px;
    line-height: 40px;
    z-index: 1050;

    &:hover {
      transform: scale(1.2);
      transition: 0.5s all;
    }
  }
}
</style>
