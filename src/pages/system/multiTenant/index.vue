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
        <span slot="auditStatus" slot-scope="{ text }">
          <a-tag :color="getDotColor(text)">{{ text }}</a-tag>
        </span>

        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleAgreeAndReject(record, '同意')">同意</a>
            <a-divider type="vertical" />
            <a @click="handleAgreeAndReject(record, '驳回')">驳回</a>
          </template>
        </span>
      </data-grid>
      <a-modal
        v-model="visible"
        title="审批意见"
        ok-text="确认"
        cancel-text="取消"
        @ok="handleOk"
        :confirmLoading="confirmLoading"
      >
        <a-form :form="form">
          <a-form-item>
            <a-textarea
              placeholder="意见"
              :auto-size="{ minRows: 4, maxRows: 6 }"
              v-decorator="[
                'auditOpinion',
                { rules: [{ required: true, message: '必填！' }] },
              ]"
            />
          </a-form-item>
        </a-form>
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

import previewImage from "@/components/TopVUI/custom/previewImage.vue";
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
    sorter: true,
  },
  {
    title: "联系人",
    dataIndex: "contacts",
    align: "center",
  },
  {
    title: "联系电话",
    dataIndex: "contactsNumber",
    align: "center",
    sorter: true,
  },
  {
    title: "营业执照",
    dataIndex: "businessLicense",
    align: "center",
    scopedSlots: {
      customRender: "businessLicense",
    },
  },
  {
    title: "审核状态",
    dataIndex: "auditStatus",
    align: "center",
    scopedSlots: {
      customRender: "auditStatus",
    },
  },
  {
    title: "操作",
    width: 150,
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
        masterList: "/system/sysEnterpriseRegister/getPageSet",
        audit: "/system/sysEnterpriseRegister/audit",
      },
      agreeAndRejectParam: {},
      form: this.$form.createForm(this),
      visibleViewImg: false,
      imgSrc: "",
    };
  },
  methods: {
    handleAgreeAndReject(record, status) {
      const that = this;
      that.agreeAndRejectParam = {
        uuid: record.uuid,
        status: status,
      };
      that.visible = true;
    },
    handleOk() {
      this.confirmLoading = true;
      this.form.validateFields((errors, values) => {
        this.agreeAndRejectParam.auditOpinion = values.auditOpinion;
        if (!errors) {
          this.$post(this.url.audit, this.agreeAndRejectParam).then((res) => {
            this.$message.success(res.message, 1.5);
            this.visible = false;
            this.confirmLoading = false;
            if (res.statusCode === 200) this.$refs.table.refresh(true);
          });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    preViewImg(val) {
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
  width: 80%;
  // height: 48px;
  border: none;
}
</style>
