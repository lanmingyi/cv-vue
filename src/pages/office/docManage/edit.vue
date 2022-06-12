<template>
  <t-modal
    :visible="visible"
    :width="800"
    title="公文预览"
    :fullscreen="fullscreen"
    :switchFullscreen="fullscreen"
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
            $emit('return');
          }
        "
        >退回</a-button
      >
      <a-button
        class="cu-btn-primary"
        icon="delete"
        @click="
          () => {
            $emit('sign');
          }
        "
        >签收</a-button
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
    <a-col :md="6" :sm="24">
      <a-card :bordered="false">
        <div class="box_title">文件清单</div>
        <div class="box_container">
          <div class="box_art">
            <div class="box_name">正文：</div>
            <div class="box_filename" @click="showView(fileName)">
              {{ fileName }}
            </div>
          </div>
          <div class="box_art">
            <div class="box_name">附件：</div>
            <div class="box_filelist">
              <div
                v-for="(item, index) in fileList"
                :key="index"
                @click="showView(item.fileName)"
              >
                {{ item.fileName }}
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </a-col>
    <a-col :md="18" :sm="24">
      <a-card :bordered="false">
        <div class="box_title">内容预览</div>
        <iframe width="100%" height="800" :src="viewUrl"></iframe>
      </a-card>
    </a-col>
  </t-modal>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
export default {
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
      form: this.$form.createForm(this),
      fullscreen: true,
      viewUrl: "",
      fileName: "工作方案.pdf",
      fileList: [
        {
          fileName: "附件1",
        },
        {
          fileName: "附件2",
        },
      ],
    };
  },
  watch: {},
  created() {
    this.viewUrl =
      "http://view.officeapps.live.com/op/view.aspx?src=http%3a%2f%2fvideo.ch9.ms%2fbuild%2f2011%2fslides%2fTOOL-532T_Sutter.pptx";
  },
  methods: {},
};
</script>

<style scoped lang="less">
.box_title {
  padding-bottom: 30px;
}
.box_container {
  padding: 40px 30px;
  background: #fafafa;
  border-radius: 10px;
  .box_art {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    .box_name {
      width: 20%;
      text-align: right;
      padding-right: 10px;
      white-space: nowrap;
    }
    .box_filename,
    .box_filelist {
      width: 65%;
      div {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
