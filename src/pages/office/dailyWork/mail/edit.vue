<template>
  <t-modal
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
            $emit('ok', 'save');
          }
        "
        >存草稿</a-button
      >
      <a-button
        class="cu-btn-primary"
        icon="delete"
        @click="
          () => {
            $emit('ok', 'signUp');
          }
        "
        >发送</a-button
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
      <a-form :form="form" >
        <a-row :gutter="24" type="flex" justify="start">
          <a-col :span="24">
            <a-form-item
              label="主题"
              :labelCol="labelColfull"
              :wrapperCol="wrapperColfull"
            >
              <a-input
                v-decorator="[
                  'zhuti',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="收件人"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <user-popup
                :visible="visiblePopup"
                style="width: 100%;"
                @change="(value, other) => popupCallback(value, other)"
                @close="() => (visiblePopup = false)"
              />
              <a-input
                @click="() => (visiblePopup = true)"
                v-decorator="[
                  'cleanMan',
                  {
                    initialValue: cleanMan,
                    rules: [{ required: true, message: '必填' }],
                  },
                ]"
                placeholder="收件人"
                readOnly
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
							
							<a-input style = "display:none"
							  v-decorator="[
							    'cleanManId',
							    {
							      initialValue: cleanManId,
							    },
							  ]"
							  placeholder="收件人id"
							>
							</a-input>
							
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item
              label="重要程度"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                v-decorator="[
                  'conferenceRoomName',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              >
                <a-select-option
                  v-for="(item, index) in gradeList"
                  :key="index"
                  :value="item.value"
                  @click="changeGrade(item)"
                >
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="正文"
              :labelCol="labelColfull"
              :wrapperCol="wrapperColfull"
            >
              <a-input v-decorator="['trainContent']" type="hidden" />
              <Editor
                :value="trainContent"
                :isClear="isClear"
                style="text-align:left"
                @onchange="changeEditor"
              ></Editor>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="附件列表"
              :labelCol="labelColfull"
              :wrapperCol="wrapperColfull"
            >
              <a-upload
                :multiple="true"
                :file-list="fileList"
                :remove="handleRemove"
				:headers="headers"
				:data="{bucket: 'vue-office'}"
				:action="getBaseUrl + '/document/minio/uploadfile'"
				@change="handleChange"
              >
                <a-button> <a-icon type="upload" /> 上传 </a-button>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="labelColfull" :wrapperCol="wrapperColfull">
              <a-input
                v-decorator="['uuid', { initialValue: uuid }]"
                type="hidden"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import { axios } from "@/utils/request";
import pick from "lodash.pick";
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";

import Editor from "@/components/TopVUI/custom/Editor/index.vue";
import UserPopup from "@/components/TopVUI/custom/userPopup";
// 表单字段
const fields = [
  "uuid",
  "postName",
  "status",
  "trainStartTime",
  "trainEndTime",
	"zhuti",
	"cleanMan",
	"cleanManId",
	"conferenceRoomName",
  "trainContent",
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
        getCategorysByTypeAndLevelId:
          "/system/category/getCategorysByTypeAndLevelId",
        getListByPid: "/system/category/getListByPid",
        getTopicBaseDetailByUuid: "/system/topicBase/getDetailByUuid",
        getDetailByUuidAndUser: "/office/oaMeetingsBase/getDetailByUuidAndUser",
        editcontents: "/office/oaMeetingsBase/editcontents",
        getDetail: "/office/oaMeetingsBase/editcontents",
        getListByUuids: "/mdata/user/getListByUuids",
        getDicItemByCode: "/system/dicSet/getDicItemByCode",
      },
      isClear: true,
      uuid: "",
      trainContent: "",
      fileList: [],
      action: "",
      headers: {
        token: Vue.ls.get(ACCESS_TOKEN),
      },
      formData: new FormData(),
      uploadUrl: "",
      visiblePopup: false,
      cleanMan: "",
			cleanManId: "",
      gradeList: [],
    };
  },
  updated() {
    this.isClear = false;
    this.trainContent = this.form.getFieldValue("trainContent");
  },
	computed: {
		getBaseUrl(){
			return baseUrl
		}
	},
  methods: {
    add(m) {
      // console.log("add", m);
      this.fileList = [];
    },
    edit(m) {
			this.fileList = [];
      this.form.setFieldsValue(pick(m, fields));
			this.$post("office/oaEmailAccessory/getAccessorylByUuid", { oaEmailUuid:  m.uuid}).then((res) => {
				let uuids = "";
				for(var i=0; i < res.length; i++){
					// console.log(res[i].accessoryUuid);
					if(i == 0){
						uuids = res[i].accessoryUuid;
					} else{
						uuids = uuids + "," + res[i].accessoryUuid;
					}
				}
				// console.log(uuids)
				if(uuids != ""){
					this.$post("/document/fastdfs/getPageSetUuids", { uuids: uuids}).then((res) => {
						// console.log("res111111=" , res);
						res.rows.map((value,index)=>{
							console.log(value)
							let list={}
							list.uid=value.uuid
							list.name=value.fileName
							list.url=value.url
							list.status = 'done'
							list.response = {
								bucket : 'vue-office',
								dfsFileUuid : value.uuid,
								object : value.fileName,
								url : value.url,
							}
							this.fileList.push(list)
						})
					})
				}
				
			})
			
    },
    changeEditor(e) {
      this.trainContent = e;
      this.form.setFieldsValue({
        trainContent: e,
      });
    },
    popupCallback(value, other) {
      this.$nextTick(() => {
        this.cleanMan = value.userName;
        this.form.setFieldsValue({
          cleanMan: this.cleanMan,
          cleanManId: value.userNameId,
        });
      });
    },
    changeGrade(item) {
      this.form.setFieldsValue({
        // cleanMan: this.cleanMan,
        // cleanManId: value.userNameId
      });
    },
    handleChange(info) {
			this.uploadUuidList = [];
      // console.log("info-----", info);
      let fileList = [...info.fileList];
      fileList = fileList.map((file) => {
        // console.log("file1", file);
        if (file.response) {
					// console.log("file-------", file);
          file.url = file.response.url;
          this.$emit("resTable");
        }
        return file;
      });
      this.fileList = fileList;
      // console.log("this.fileList", this.fileList);
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      console.log("this.fileList--------", this.fileList);
      return false;
    },
    handleUpload() {
      const { fileList } = this;
      fileList.forEach((file) => {
        this.$nextTick(() => {
          this.uploadUrl = this.url;
          const formData = new FormData();
          formData.append("file", file);
          if (this.puuid) formData.append("puuid", this.puuid);
          if (this.data && this.data.keyPrefix) {
            this.uploadUrl =
              this.url +
              `?bucketName=${this.data.bucketName}&endpoint=${
                this.data.endpoint
              }&keyPrefix=${encodeURIComponent(this.data.keyPrefix)}`;
          } else if (this.data) {
            formData.append("bucketName", this.data.bucketName);
            formData.append("endpoint", this.data.endpoint);
            formData.append("keyPrefix", this.data.keyPrefix);
          }
          this.num++;
          this.$nextTick(() => {
            setTimeout(() => {
              this.uploadData(formData);
            }, 200);
          });
        });
      });
    },
    uploadData(e) {
      this.loading = true;
      const that = this;
      axios({
        url: baseUrl + that.uploadUrl,
        method: "post",
        processData: false,
        headers: {
          token: Vue.ls.get(ACCESS_TOKEN),
        },
        data: e,
      }).then((res) => {
        if (res.statusCode === 200 || res === 1) {
          console.log(
            "this.num === this.fileList.length",
            that.num,
            that.fileList.length
          );
          if (that.num === that.fileList.length) {
            that.$message.success("上传成功！");
            that.$emit("ok");
            that.fileList = [];
            this.loading = false;
          }
        } else {
          that.$message.error(res.message);
          this.loading = false;
        }
      });
    },
  },
  created() {
    this.action = baseUrl + this.url;
    this.headers.token = Vue.ls.get(ACCESS_TOKEN);
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
    // 会议保障类型
    this.$post(this.url.getDicItemByCode, {
      code: "grade",
    }).then((res) => {
      if (res.statusCode !== 300) {
        this.gradeList = res;
      }
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
