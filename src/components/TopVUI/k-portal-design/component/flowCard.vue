<!--
 * @Description: 流程
 * @Author: 黄婷
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-09-16 11:11:30
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-portal-design\component\flowCard.vue
-->
<template>
  <a-card
    :hoverable="true"
    class="art-card-15696"
    :style="{overflow:'auto', height: options.height }"
  >
    <template slot="title" v-if="options.titleShow">
      <icon-fonts
        :icon="'icon-' + record.options.iconFont"
        class="card-title-icon"
        :style="{ color: options.iconFontColor }"
      />
      <span>{{ record.options.title }}</span>
    </template>
    <template slot="extra">
      <card-title
        v-if="options.action && options.titleShow"
        :formType="options.formType"
        :formOptions="formOptions"
        @sendCurrent="getArticleData"
      >
      </card-title>
      <a
        v-if="options.isShowList"
        style="margin-left:8px"
        @click="navToListPage()"
        >更多
        <a-icon type="double-right" />
      </a>
    </template>
    <a-list
      class="demo-loadmore-list123456"
      :loading="loading"
      item-layout="horizontal"
      :data-source="flowDataList"
      :pagination="listPagination"
    >
      <a-list-item
        slot="renderItem"
        slot-scope="child, indexChild"
        style="cursor: pointer;"
      >
        <a-list-item-meta>
          <span slot="title" class="list-title">{{ child.formName }}</span>
        </a-list-item-meta>
        <div class="list-action">
          <span>{{ child.flowStartTime }}</span>
          <a-tag
            color="cyan"
            class="margin-left-xs"
						style="overflow: unset;"
            @click="handleTransact(child)"
          >
            办理
          </a-tag>
          <a-tag style="overflow: unset;" color="blue" @click="previewFlowChart(child)"> 流程图 </a-tag>
        </div>
      </a-list-item>
    </a-list>
    <transact-modal
      ref="transactModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="taskMdl"
      @cancel="
        () => {
          visible = false;
        }
      "
      @ok="taskHandleOk"
      @update="taskUpdate"
      @close="
        () => {
          visible = false;
        }
      "
    ></transact-modal>
    <flow-chart ref="flowChatForm"></flow-chart>
  </a-card>
</template>

<script>
import { Ellipsis } from "@/components";
import { getObjectByString } from "@/utils/util";
import cardTitle from "./cardTitle";
import transactModal from "@/pages/workflow/apiFlowableTask/myMission/modal/taskModel";
import flowChart from "@/pages/workflow/apiFlowableTask/myMission/flowChat.vue";

export default {
  name: "articleCard",
  data() {
    return {
      flowDataList: [],
      loading: true,
      visible: false,
      confirmLoading: false,
      taskMdl: {},
      options: {},
      formOptions: {},
      selectValue: {},
      pagination: {
        size: "small",
        onChange: (page) => {
          this.changePage(page);
        },
        current: 1,
        pageSize: 10,
      },
    };
  },
  components: {
    Ellipsis,
    cardTitle,
    transactModal,
    flowChart,
  },
  props: {
    record: {
      type: Object,
    },
  },
  mounted() {
    this.getArticleData();
  },
  watch: {
    //   监听属性配置变化
    record: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.options = newVal.options || {};
        this.formOptions = newVal.options.formOptions || {};
      },
    },
  },
  computed: {
    listPagination(newval) {
      this.pagination.pageSize = this.options.pageSize
        ? this.options.pageSize
        : 7;
      this.getArticleData();
      if (this.options.pagination) {
        return this.pagination;
      } else {
        return false;
      }
    },
  },
  methods: {
    changePage(page) {
      this.pagination.current = page;
      this.getArticleData();
    },
    // 获取列表数据
    getArticleData(val) {
      let params = getObjectByString(this.options.parameter, ",", ":");
      params = {
        ...params,
        pageSize: this.options.pageSize ? this.options.pageSize : 7,
        pageNo: this.pagination.current ? this.pagination.current : 1,
      };
      if (val) {
        params[this.formOptions.params] = val;
      }
      this.$axios(this.options.method, this.options.url, params)
        .then((res) => {
          this.flowDataList = res.rows;
          this.pagination.current = res.pageNo;
          this.pagination.pageSize = res.pageSize;
          this.pagination.total = res.totalCount;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleTransact(e) {
      this.$post("/workflow/apiFlowableProcessInstance/clickStartProcess", {
        modelKey: e.modelKey,
        taskId: e.taskId,
        processInstanceId: e.processInstanceId,
        nodeId: e.nodeId,
        processDefinitionId: e.processDefinitionId,
      }).then((res) => {
        if (!res || res.message) {
          this.$message.error("获取信息出现错误，请稍后再试");
          return;
        }
        this.modelType = res.lists.modelType;
        this.visible = true;
        this.confirmLoading = true;
        const form = this.$refs.transactModal.formOpinion;
        form.resetFields(); // 清理表单数据（可不做）
        this.taskMdl = e;
        const jsonData = res;
        this.$refs.transactModal.loadData(e, jsonData);
        this.confirmLoading = false;
      });
    },
    previewFlowChart(record) {
      this.$post("/workflow/apiFlowableProcessInstance/clickStartProcess", {
        modelKey: record.modelKey,
        taskId: record.taskId,
        processInstanceId: record.processInstanceId,
        nodeId: record.nodeId,
        processDefinitionId: record.processDefinitionId,
      }).then((res) => {
        if (res.statusCode != 300) {
          const jsonData = res;
          // this.$refs.flowChatForm.loadData(jsonData)
          this.$refs.flowChatForm.loadData(
            jsonData,
            jsonData.lists.actDeModelId,
            jsonData.lists.actDeModelKey,
            jsonData.lists.actDeModelName,
            jsonData.lists.flowDesign,
            record
          );
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 同意、驳回
    taskHandleOk(type, drawingList, pramar) {
      const form = this.$refs.transactModal.formOpinion;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          // if (type === 1) {
          //   values.outcome = '同意'
          // } else {
          //   values.outcome = '驳回'
          // }
          if (this.modelType === "2") {
            values.formDesign = JSON.stringify(drawingList);
            values.formModel = JSON.stringify(drawingList.config);
          }
          values = Object.assign(values, pramar);
          this.$post("/workflow/apiFlowableTask/agree", values).then((res) => {
            if (res.statusCode === 200) {
              this.$message.info(res.message);
              this.visible = false;
              this.$refs.table.refresh();
            } else {
              this.confirmLoading = false;
              this.$message.error(res.message);
            }
          });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 更新
    taskUpdate(pramer, pramar) {
      this.confirmLoading = true;
      this.$post("/workflow/flowModel/updateFormDesign", pramer).then((res) => {
        if (res.statusCode === 200) {
          this.$post("/form/formField/commonUpdate", pramar).then((res) => {
            if (res.statusCode === 200) {
              this.$message.info("更新成功！");
              this.confirmLoading = false;
            } else {
              this.$message.info(res.message);
              this.confirmLoading = false;
            }
          });
        } else {
          this.$message.info(res.message);
        }
      });
    },
    navToListPage() {
      if (this.options.isShowList)
        this.$router.push({
          path: this.options.listUrl,
        });
    },
  },
};
</script>

<style lang="less">
.demo-loadmore-list123456 {
  .list-title {
    width: 90%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .ant-list-item-meta-title {
    margin-bottom: 0;
    line-height: 1.5;
  }

  .ant-tag,
  .list-action {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: flex;
  }

  .ant-list-pagination {
    margin: 10px 0;
  }
}
</style>
