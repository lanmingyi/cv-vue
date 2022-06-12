<template>
  <!-- 	<t-modal :title="title" :width="800" :confirmLoading="loading" @ok="() => { $emit('ok')}"
		@cancel="() => { $emit('cancel')}"> -->
  <a-card :title="title ? title : '详情'">
    <a slot="extra" href="#">
      <!-- 			<a-button class="cu-btn-primary" icon="sync" @click="handleUpadte">更新</a-button>
			<a-button class="cu-btn-danger" icon="close" @click="closeRight">关闭</a-button> -->
    </a>
    <a-spin :spinning="spinning">
      <div style="min-height: 200px;" v-if="showItem">
        <a-row v-if="typeId && typeId == 1">
          <a-col :span="24">
            <div class="log-box">
              <div class="log-title">日志标题</div>
              <div class="log-content">{{ logData.logTitle }}</div>
            </div>
            <div class="log-box">
              <div class="log-title">日志内容</div>
              <div class="log-content">{{ logData.logContent }}</div>
            </div>
          </a-col>
        </a-row>

        <a-row v-if="typeId && typeId == 2">
          <a-col :span="24">
            <div class="log-box">
              <div class="log-title">今日完成工作</div>
              <div class="log-content">
                {{ logData.logContent ? logData.logContent : "暂无" }}
              </div>
            </div>
            <div class="log-box">
              <div class="log-title">未完成工作</div>
              <div class="log-content">
                {{ logData.logPlan ? logData.logPlan : "暂无" }}
              </div>
            </div>
          </a-col>
        </a-row>

        <a-row v-if="typeId && typeId == 3">
          <a-col :span="24">
            <div class="log-box">
              <div class="log-title">本周完成工作</div>
              <div class="log-content">
                {{ logData.logContent ? logData.logContent : "暂无" }}
              </div>
            </div>
            <div class="log-box">
              <div class="log-title">本周工作总结</div>
              <div class="log-content">
                {{ logData.logSummary ? logData.logSummary : "暂无" }}
              </div>
            </div>
            <div class="log-box">
              <div class="log-title">下周工作计划</div>
              <div class="log-content">
                {{ logData.logPlan ? logData.logPlan : "暂无" }}
              </div>
            </div>
          </a-col>
        </a-row>

        <a-row v-if="typeId && typeId == 4">
          <a-col :span="24">
            <div class="log-box">
              <div class="log-title">本月完成工作</div>
              <div class="log-content">
                {{ logData.logContent ? logData.logContent : "暂无" }}
              </div>
            </div>
            <div class="log-box">
              <div class="log-title">本月工作总结</div>
              <div class="log-content">
                {{ logData.logSummary ? logData.logSummary : "暂无" }}
              </div>
            </div>
            <div class="log-box">
              <div class="log-title">下月工作计划</div>
              <div class="log-content">
                {{ logData.logPlan ? logData.logPlan : "暂无" }}
              </div>
            </div>
          </a-col>
        </a-row>

        <a-row v-if="typeId && typeId != 1">
          <a-col :span="24">
            <div class="log-box">
              <div class="log-title">需协调工作</div>
              <div class="log-content">
                {{ logData.logCoordinate ? logData.logCoordinate : "暂无" }}
              </div>
            </div>
            <div class="log-box">
              <div class="log-title">备注</div>
              <div class="log-content">
                {{ logData.log ? logData.logContent : "暂无" }}
              </div>
            </div>
          </a-col>
        </a-row>

        <a-col :span="24" v-if="typeId">
          <div class="log-box">
            <div class="log-title">附件</div>
            <div class="log-content">暂无</div>
          </div>
          <div class="log-box border-none">
            <div class="log-title">接收人</div>
            <div class="log-content">
              <div class="tab_table">
                <a-tag v-for="(tag, index) in attendData" :key="index">
                  <a-icon
                    v-if="tag.lookState == 0"
                    type="close-circle"
                    theme="twoTone"
                    two-tone-color="#e7e7e7"
                  />
                  <a-icon
                    v-if="tag.lookState == 1"
                    type="check-circle"
                    theme="twoTone"
                    two-tone-color="#52c41a"
                  />
                  {{ tag.userName }}
                </a-tag>
              </div>
            </div>
          </div>
          <div class="log-box">
            <div class="log-title">评论意见</div>
            <div class="log-content" v-if="commentList.length > 0">
              <div
                class="log-comment"
                v-for="(item, index) in commentList"
                :key="index"
              >
                <div class="log-comment-title">
                  {{ index + 1 }}、 {{ item.creator }} {{ item.createTime }}
                </div>
                <div class="log-comment-content">{{ item.content }}</div>
              </div>
            </div>
            <div class="log-content" v-else>
              暂无
            </div>
          </div>
          <div class="comment-box">
            <div class="comment-content">
              <a-input
                v-model="logContent"
                type="textarea"
                :rows="4"
                placeholder="请输入评论意见"
              />
            </div>
            <a-button class="cu-btn-primary" icon="check" @click="handleUpadte"
              >评论</a-button
            >
          </div>
        </a-col>
      </div>
      <div style="min-height: 200px;" v-else></div>
    </a-spin>
  </a-card>
</template>

<script>
import pick from "lodash.pick";
import moment from "moment";
import TSelectRole from "@/components/TopVUI/custom/TSelectRole";
import Editor from "@/components/TopVUI/custom/Editor/index.vue";

// 表单字段
const fields = [
  "uuid",
  "logTitle",
  "startTime",
  "endTime",
  "logContent",
  "attendanceUsers",
];

export default {
  components: {
    Editor,
    TSelectRole,
  },
  props: {
    loading: {
      type: Boolean,
      default: () => false,
    },
    model: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 8,
        },
      },
      labelColfull: {
        xs: {
          span: 24,
        },
        sm: {
          span: 4,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
      },
      wrapperColfull: {
        xs: {
          span: 24,
        },
        sm: {
          span: 18,
        },
      },
      form: this.$form.createForm(this),
      url: {
        getListByUuids: "/mdata/user/getListByUuids",
        getDetailByUuid: "/office/oaWorkLog/getDetailByUuid",
        getLogReceiveList: "/office/oaWorkLogReceive/getLogReceiveList",
        saveComment: "/office/oaWorkLogComment/saveCommentData",
        getCommentList: "/office/oaWorkLogComment/getCommentList",
      },
      isClear: true,
      uuid: "",
      logContent: "",
      attendData: [],
      commentList: [],
      title: "",
      typeId: 0,
      logData: "",
      spinning: true,
      logUuid: "",
      showItem: false,
    };
  },
  // updated() {
  // 	this.isClear = false
  // 	this.logContent = this.form.getFieldValue('logContent')
  // },
  methods: {
    moment,
    onLoad(e, uuid) {
      console.log("e, uuid---", e, uuid);
      this.showItem = true;
      if (!uuid) {
        console.log("123");
        this.showItem = false;
        this.spinning = false;
      } else {
        this.showItem = true;
        this.attendData = [];
        this.logContent = "";
        this.logUuid = uuid;
        this.getData(uuid);
        this.getReceiveData(uuid);
        this.getCommentList();
        this.$nextTick(() => {
          // this.typeId = e
          this.title = e;
          if (e == "日志") {
            this.typeId = 1;
          } else if (e == "日报") {
            this.typeId = 2;
          } else if (e == "周报") {
            this.typeId = 3;
          } else if (e == "月报") {
            this.typeId = 4;
          } else {
            this.typeId = 1;
          }
          // if (e == 1) {
          // 	this.title = '日志'
          // } else if (e == 2) {
          // 	this.title = '日报'
          // } else if (e == 3) {
          // 	this.title = '周报'
          // } else if (e == 4) {
          // 	this.title = '月报'
          // }
        });
      }
    },
    getData(uuid) {
      this.$post(this.url.getDetailByUuid, { uuid: uuid }).then((res) => {
        this.logData = res;
        // this.attendData = res.logReceiveName.split(',')
        this.spinning = false;
      });
    },
    getReceiveData(uuid) {
      this.$post(this.url.getLogReceiveList, { logUuid: uuid }).then((res) => {
        this.attendData = res;
      });
    },
    getCommentList() {
      this.$post(this.url.getCommentList, { logUuid: this.logUuid }).then(
        (res) => {
          this.commentList = res;
        }
      );
    },
    handleUpadte() {
      console.log("logContent-----", this.logContent);
      if (!this.logContent) {
        this.$message.warning("请给与评论意见！");
      } else {
        this.$post(this.url.saveComment, {
          logUuid: this.logUuid,
          content: this.logContent,
        }).then((res) => {
          if (res === 1 || res.statusCode === 200) {
            this.logContent = "";
            this.$message.success(res.message ? res.message : "操作成功", 1.5);
            this.commentList = [];
            this.getCommentList();
          } else {
            this.$message.error(res.message, 1.5);
          }
        });
      }
    },
    changeEditor(e) {
      this.logContent = e;
      this.form.setFieldsValue({
        logContent: e,
      });
    },
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
};
</script>

<style lang="less" scoped>
/deep/.ant-input {
  border: none !important;
}
.border-none {
  border: none !important;
}

.log-box {
  padding: 20px 0;
  border-bottom: 1px solid #e7e7e7;
  width: 80%;
  margin-left: 40px;
  text-align: left;

  .log-title {
    font-weight: bold;
    font-size: 18px;
    padding-bottom: 10px;
  }

  .log-content {
  }

  .log-comment {
    .log-comment-title {
      margin-bottom: 5px;
    }
    .log-comment-content {
      padding-left: 25px;
      margin-bottom: 10px;
    }
  }
}

.comment-box {
  width: 90%;
  margin: 20px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .comment-content {
    width: 80%;
  }
}

.tab_table {
  width: 100%;
  background: #ffffff;
  // border-radius: 8px;
  // border-bottom: 1px solid #303030;
  margin-right: 10px;
  padding: 5px 5px 0 5px;
  max-height: 300px;
  overflow: auto;

  & span {
    padding: 3px 8px;
    margin-bottom: 5px;
  }
}

.item-box {
  display: flex;
  align-items: flex-start;
}
</style>
