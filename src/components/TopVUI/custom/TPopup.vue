<!--
 * @Description: 人员选择器
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-05-21 14:28:14
 * @LastEditors: 黄婷
 * @FilePath: \misboot-cloud-topvui\src\components\TopVUI\custom\TPopup.vue
-->
<template>
  <div>
    <a-input
      @click="openModal"
      :placeholder="placeholder"
      v-model="showText"
      readOnly
      :disabled="disabled"
    >
      <a-icon slot="prefix" type="cluster" :title="title" />
      <a-icon
        v-show="showText"
        slot="suffix"
        type="close-circle"
        @click="handleEmpty"
        title="清空"
      />
    </a-input>
    <t-modal
      :title="title"
      :width="modalWidth"
      :visible="visible"
      :confirmLoading="confirmLoading"
      switchFullscreen
      wrapClassName="t-popup-modal"
      @ok="handleSubmit"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="用户名">
                  <a-input v-model="queryParam.userName" placeholder="" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="手机号码">
                  <a-input-number
                    v-model="queryParam.cellphone"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="(!advanced && 8) || 24" :sm="24">
                <span
                  class="table-page-search-submitButtons"
                  :style="
                    (advanced && { float: 'right', overflow: 'hidden' }) || {}
                  "
                >
                  <a-button
                    class="cu-btn-primary"
                    @click="$refs.table.refresh(true)"
                    >查询</a-button
                  >
                  <a-button
                    class="cu-btn-filter"
                    @click="() => (this.queryParam = {})"
                    >重置</a-button
                  >
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <s-table
          ref="table"
          size="small"
          :columns="columns"
          :data="loadData"
          bordered
          :rowSelection="rowSelection"
          rowKey="uuid"
          showPagination="auto"
        >
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
        </s-table>
      </a-card>
    </t-modal>
  </div>
</template>

<script>
import moment from "moment";
import { STable, Ellipsis } from "@/components";

const columns = [
  {
    title: "#",
    width: 50,
    align: "center",
    scopedSlots: { customRender: "serial" },
  },
  {
    title: "用户名称",
    dataIndex: "userName",
  },
  {
    title: "手机",
    dataIndex: "cellphone",
    sorter: true,
  },
  {
    title: "电子邮箱",
    dataIndex: "email",
    sorter: true,
  },
  {
    title: "年龄",
    dataIndex: "age",
    sorter: true,
  },
  {
    title: "备注",
    dataIndex: "remark",
    sorter: true,
  },
  {
    title: "操作",
    dataIndex: "action",
    width: "150px",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "TPopup",
  components: {
    STable,
    Ellipsis,
  },
  props: {
    code: {
      type: String,
      default: "",
      required: false,
    },
    field: {
      type: String,
      default: "",
      required: false,
    },
    orgFields: {
      type: String,
      default: "",
      required: false,
    },
    destFields: {
      type: String,
      default: "",
      required: false,
    },
    width: {
      type: Number,
      default: 1200,
      required: false,
    },
    placeholder: {
      type: String,
      default: "请选择",
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
    triggerChange: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    multi: {
      type: Boolean,
      required: false,
      default: false,
    },
    /** 分组ID，用于将多个popup的请求合并到一起，不传不分组 */
    groupId: String,
  },
  computed: {
    rowSelection() {
      return {
        onChange: this.onSelectChange,
        // onSelectAll: this.onSelectAll,
        type: "radio",
      };
    },
  },
  data() {
    this.columns = columns;
    return {
      title: "",
      showText: "",
      confirmLoading: false,
      visible: false,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        pageSize: 10,
      },
      modalWidth: 800,
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        console.log("loadData.parameter", parameter);
        return this.$post(
          "/mdata/user/getPageSet",
          Object.assign(parameter, this.queryParam)
        ).then((res) => {
          return res;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
      optionAlertShow: false,
      selectedRowsList: [],
    };
  },
  created() {},
  methods: {
    // 解决分页全选 获取选中的数据
    // onSelectAll (selected, selectedRows, changeRows) {
    //   this.selectedRowsList = this.selectedRowsList.concat(selectedRows)
    //   if (!selected) {
    //     let selectionsRows = []
    //     this.selectedRowsList.forEach((e, index) => {
    //       if (JSON.stringify(changeRows).indexOf(JSON.stringify(e.uuid)) === -1) {
    //         selectionsRows.push(e)
    //       }
    //     })
    //     this.selectedRowsList = selectionsRows
    //   }
    // },
    // show(){
    //   this.visible = true;
    // },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      console.log(selectedRowKeys, selectedRows);
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date()),
      };
    },
    handleCancel() {
      this.close();
    },
    openModal() {
      console.log(111111111111111111);
      this.visible = true;
    },
    handleEmpty() {
      this.showText = "";
      let destFieldsArr = this.destFields.split(",");
      if (destFieldsArr.length === 0) {
        return;
      }
      let res = {};
      for (let i = 0; i < destFieldsArr.length; i++) {
        res[destFieldsArr[i]] = "";
      }
      if (this.triggerChange) {
        this.$emit("callback", res);
      } else {
        this.$emit("input", "", res);
      }
    },
    handleSubmit() {
      if (!this.multi) {
        if (this.selectedRows && this.selectedRows.length > 1) {
          this.$message.warning("请选择一条记录");
          return false;
        }
      }
      if (!this.selectedRows || this.selectedRows.length == 0) {
        this.$message.warning("请选择一条记录");
        return false;
      }
      let orgFieldsArr = this.orgFields.split(",");
      let destFieldsArr = this.destFields.split(",");
      let resetText = false;
      if (this.field && this.field.length > 0) {
        this.showText = "";
        resetText = true;
      }
      let res = {};
      if (orgFieldsArr.length > 0) {
        for (let i = 0; i < orgFieldsArr.length; i++) {
          let tempDestArr = [];
          for (let rw of this.selectedRows) {
            let val = rw[orgFieldsArr[i]];
            if (!val) {
              val = "";
            }
            tempDestArr.push(val);
          }
          res[destFieldsArr[i]] = tempDestArr.join(",");
        }
        if (resetText === true) {
          let tempText = [];
          for (let rw of this.selectedRows) {
            let val = rw[orgFieldsArr[destFieldsArr.indexOf(this.field)]];
            if (!val) {
              val = "";
            }
            tempText.push(val);
          }
          this.showText = tempText.join(",");
          console.log(this.showText);
        }
        // update--end--autor:lvdandan-----date:20200630------for：多选时未带回多个值------
      }
      if (this.triggerChange) {
        //v-dec时即triggerChange为true时 将整个对象给form页面 让他自己setFieldsValue
        this.$emit("callback", res);
      } else {
        //v-model时 需要传一个参数field 表示当前这个字段 从而根据这个字段的顺序找到原始值
        // this.$emit("input",row[orgFieldsArr[destFieldsArr.indexOf(this.field)]])
        this.$emit("input", this.showText, res);
      }
      this.close();
    },
    close() {
      this.$emit("close");
      this.visible = false;
      // this.onClearSelected()
    },
  },
};
</script>
