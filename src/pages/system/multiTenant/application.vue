<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar
        @search="$refs.masterList.refresh(true)"
        @reset="
          () => {
            (this.queryParam = {}), $refs.masterList.refresh(true);
          }
        "
      >
        <template slot="toolForm">
          <a-form-item label="">
            <a-input
              v-model="queryParam.enterpriseName"
              placeholder="企业名称"
            />
          </a-form-item>
          <a-form-item label="">
            <a-input
              placeholder="联系电话"
              v-model="queryParam.contactsNumber"
            />
          </a-form-item>
        </template>
      </tool-bar>
      <data-grid
        ref="masterList"
        type="master"
        :columns="columns"
        :url="url"
        :pageSize="10"
        :queryParam="queryParam"
        rowKey="uuid"
        showPagination="auto"
      >
        <span slot="businessLicense" slot-scope="{ text }">
          <img
            :src="text"
            alt=""
            class="business-license"
            @click="preViewImg(text)"
          />
        </span>
        <template slot="auditStatus" slot-scope="{ text }">
          <a-tag :color="getDotColor(text)">{{ text }}</a-tag>
        </template>
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleViewDetail(record)">查看详情</a>
          </template>
        </span>
      </data-grid>
      <a-modal
        v-model="visible"
        title="审批详情"
        :confirmLoading="confirmLoading"
      >
        <a-timeline style="width: 80%;margin: 0 auto;padding-top: 20px;">
          <a-timeline-item
            :color="getDotColor(item.auditType)"
            v-for="(item, index) in resultObj"
            :key="index"
          >
            <p>{{ item.createTime }}</p>
            <p>审批{{ item.auditType }}</p>
            <p>{{ item.auditOpinion }}</p>
          </a-timeline-item>
        </a-timeline>
        <template slot="footer">
          <a-button
            key="submit"
            type="primary"
            @click="
              () => {
                visible = false;
              }
            "
          >
            我知道了
          </a-button>
        </template>
      </a-modal>
      <preview-image
        :visible.sync="visibleViewImg"
        :imgSrc="imgSrc"
      ></preview-image>
    </div>
  </div>
</template>

<script>
import { dataGridMixin } from "@/mixins/dataGridMixin";
import { DataGrid } from "@/components";

import previewImage from "@/components/TopVUI/custom/previewImage";
const columns = [
  {
    title: "企业名称",
    dataIndex: "enterpriseName",
    align: "center",
    width: 200,
  },
  {
    title: "信用代码",
    dataIndex: "creditCode",
    align: "center",
    width: 200,
    sorter: true,
  },
  {
    title: "账号",
    dataIndex: "accountNumber",
    align: "center",
    width: 200,
    sorter: true,
  },
  {
    title: "联系人",
    dataIndex: "contacts",
    align: "center",
    width: 100,
  },
  {
    title: "联系电话",
    dataIndex: "contactsNumber",
    align: "center",
    width: 120,
    sorter: true,
  },
  {
    title: "营业执照",
    dataIndex: "businessLicense",
    align: "center",
    width: 120,
    scopedSlots: {
      customRender: "businessLicense",
    },
  },
  {
    title: "审核状态",
    dataIndex: "auditStatus",
    align: "center",
    width: 120,
    scopedSlots: {
      customRender: "auditStatus",
    },
  },
  {
    title: "操作",
    width: 100,
    dataIndex: "action",
    align: "center",
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  name: "TableList",
  mixins: [dataGridMixin],
  components: { DataGrid, previewImage },
  data() {
    return {
      columns: columns,
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      selectedRows: [],
      rows: "", //选中行数据
      url: {
        masterList: "/system/sysEnterpriseRegister/allApplications",
        search: "/system/sysEnterpriseRegister/search",
        audit: "/system/sysEnterpriseRegister/audit",
        getApprovalComments:
          "/system/sysEnterpriseRegisterOpinion/getApprovalComments",
      },
      agreeAndRejectParam: {},
      form: this.$form.createForm(this),
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 13,
        },
      },
      resultObj: "",
      visibleViewImg: false,
      imgSrc: "",
    };
  },
  methods: {
    handleViewDetail(record) {
      this.$post(this.url.getApprovalComments, { uuid: record.uuid }).then(
        (res) => {
          if (res.statusCode === 300) {
            this.$message.success(res.message, 1.5);
            return false;
          }
          this.resultObj = res.data;
          this.visible = true;
          // const that = this
          // const h = this.$createElement;
          // this.$info({
          // 	title: '审批详情',
          // 	content: h('div', {}, [
          // 	  h('p', '审批状态：'+that.resultObj.auditType),
          // 	  h('p', '审批意见：'+that.resultObj.auditOpinion),
          // 	]),
          // });
        }
      );
    },
    preViewImg(val) {
      console.log(val);
      this.imgSrc = val;
      this.visibleViewImg = true;
    },
    getDotColor(val) {
      if (val === "未通过") {
        return "red";
      } else if (val === "审核中") {
        return "blue";
      } else {
        return "green";
      }
    },
  },
};
</script>

<style lang="less">
.business-license {
  width: 100%;
  height: 48px;
  border: none;
}
</style>
