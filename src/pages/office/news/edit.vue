<template>
  <a-modal
    title="新增/编辑"
    :width="1000"
    :visible="visible"
    :confirmLoading="loading"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <template slot="footer">
      <a-button
        class="cu-btn-primary"
        icon="edit"
        @click="
          () => {
            $emit('save');
          }
        "
        >保存</a-button
      >
      <a-button
        class="cu-btn-danger"
        icon="delete"
        @click="
          () => {
            $emit('ok');
          }
        "
        >发布</a-button
      >
      <a-button
        key="back"
        @click="
          () => {
            $emit('cancel');
          }
        "
        >关闭</a-button
      >
    </template>
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="新闻标题"
              :labelCol="labelColfull"
              :wrapperCol="wrapperColfull"
            >
              <a-input
                v-decorator="[
                  'newsTitle',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" type="flex" justify="start">
          <a-col :span="12">
            <a-form-item
              label="发布人"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <user-popup
                :visible="visiblePopup"
                style="width: 100%;"
                @change="(value, other) => popupCallback(value, other)"
                @close="() => (visiblePopup = false)"
                :typeNum="1"
              />
              <a-input
                @click="() => (visiblePopup = true)"
                v-decorator="[
                  'publisher',
                  {
                    initialValue: publisher,
                    rules: [{ required: true, message: '必填' }],
                  },
                ]"
                placeholder="发布人"
                readOnly
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="发布部门"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['releaseDeparmentName']" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="发布时间"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <t-date
                v-decorator="[
                  'releaseTime',
                  { rules: [{ required: true, message: '请选择发布时间' }] },
                ]"
                style="width: 100%;"
                dateFormat="YYYY-MM-DD HH:mm:ss"
                :showTime="true"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-row>
            <a-col :span="24">
              <a-form-item
                label="正文"
                :labelCol="labelColfull"
                :wrapperCol="wrapperColfull"
              >
                <a-input v-decorator="['content']" type="hidden" />
                <Editor
                  :value="content"
                  :isClear="isClear"
                  style="text-align:left"
                  @onchange="changeEditor"
                ></Editor>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="备注"
                :labelCol="labelColfull"
                :wrapperCol="wrapperColfull"
              >
                <a-textarea :rows="4" v-decorator="['remark']" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input v-decorator="['uuid']" type="hidden" />
              </a-form-item>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input v-decorator="['releaseDeparment']" type="hidden" />
              </a-form-item>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input v-decorator="['publisherId']" type="hidden" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from "lodash.pick";

import Editor from "@/components/TopVUI/custom/Editor/index.vue";
import UserPopup from "@/components/TopVUI/custom/userPopup";
// 表单字段
const fields = [
  "uuid",
  "newsTitle",
  "publisher",
  "publisherId",
  "releaseTime",
  "remark",
  "content",
  "releaseDeparment",
  "releaseDeparmentName",
];

export default {
  components: {
    Editor,
    UserPopup,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
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
        getOrgTree: "/mdata/organization/getListByLevelId?levelId=1",
        getListByPid: "/mdata/organization/getListByPid",
      },
      isClear: true,
      content: "",
      visiblePopup: false,
      uuid: "",
      titleList: [],
      treeData: [],
      publisher: "",
    };
  },
  updated() {
    this.isClear = false;
    this.content = this.form.getFieldValue("content");
  },
  methods: {
    add(m) {
      console.log("add", m);
      this.publisher = "";
    },
    edit(m) {
      this.form.setFieldsValue(pick(m, fields));
    },
    changeEditor(e) {
      this.content = e;
      this.form.setFieldsValue({
        content: e,
      });
    },
    popupCallback(value, other) {
      console.log(value);
      this.$nextTick(() => {
        this.publisher = value.userName;
        this.form.setFieldsValue({
          publisher: this.publisher,
          publisherId: value.userNameId,
          releaseDeparment: value.orgId,
          releaseDeparmentName: value.orgName,
        });
      });
    },
    onLoadData(treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        this.$post(this.url.getListByPid, {
          pid: treeNode.dataRef.id,
        })
          .then((res) => {
            const treeData = res;
            treeData.forEach((e, index) => {
              treeData[index].title = e.text;
              treeData[index].label = e.text;
              treeData[index].index = index;
              treeData[index].value = e.id;
              treeData[index].levelId = e.levelId;
              treeData[index].key = e.id;
            });
            treeNode.dataRef.children = treeData;
            this.treeData = [...this.treeData];
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    select(value, node, extra) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          releaseDeparment: node.dataRef.id,
          releaseDeparmentName: node.dataRef.text,
        });
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
    this.$post(this.url.getOrgTree).then((res) => {
      this.treeData = res;
      this.treeData.forEach((e, index) => {
        this.treeData[index].title = e.text;
        this.treeData[index].label = e.text;
        this.treeData[index].index = index;
        this.treeData[index].value = e.text;
        this.treeData[index].key = e.id;
        this.treeData[index].levelId = e.levelId;
      });
    });
  },
};
</script>

<style lang="less" scoped>
.tab_table {
  width: 100%;
  min-height: 100px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e7e7e7;
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
