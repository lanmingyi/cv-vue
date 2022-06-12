<!--
 * @Description: 生成代码
 * @Author: 黄婷
 * @Date: 2019-12-30 00:37:05
 * @LastEditors: 黄婷
 * @LastEditTime: 2021-09-14 09:16:55
 -->
<template>
  <div>
    <t-drawer
      class="t-drawer-14653"
      title="代码预览"
      @close="onClose"
      :visible="visible"
      width="100%"
    >
      <div style="height:100%">
        <a-row style="height:100%;overflow:auto">
          <a-col :md="24" :lg="24" class="left-editor">
            <!-- <div class="setting" title="资源引用" @click="showResource">
							<a-badge :is-dot="!!resources.length" class="item">
								<i class="el-icon-setting" />
							</a-badge>
						</div> -->
            <a-tabs
              v-model="activeTab"
              class="editor-tabs"
              style="height:100%"
              tabPosition="left"
            >
              <a-tab-pane tab="HTML" key="1">
                <!-- vue code start -->
                <previewCode
                  :editorJson="htmlCode"
                  fileFormat="html"
                  ref="htmlCode"
                  :showFootBtn="false"
                  :height="pHeight"
                />
                <!-- vue code end -->
              </a-tab-pane>
              <a-tab-pane tab="JS" key="2">
                <!-- html code start -->
                <previewCode
                  :editorJson="jsCode"
                  fileFormat="js"
                  ref="jsCode"
                  :showFootBtn="false"
                  :height="pHeight"
                />
                <!-- html code end -->
              </a-tab-pane>
              <a-tab-pane tab="CSS" key="3">
                <!-- html code start -->
                <previewCode
                  :editorJson="cssCode"
                  fileFormat="css"
                  ref="cssCode"
                  :showFootBtn="false"
                  :height="pHeight"
                />
                <!-- html code end -->
              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>
      </div>
      <div
        :style="{
          background: 'rgba(255,255,255,1)',
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button
          type="primary"
          @click="
            () => {
              fileVisible = true;
            }
          "
        >
          导出代码
        </a-button>
      </div>
    </t-drawer>
    <a-modal
      title="导出文件"
      :visible="fileVisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="
        () => {
          fileVisible = false;
        }
      "
    >
      <a-form :form="form">
        <a-form-item label="文件名">
          <a-input
            v-decorator="['fileName', { initialValue: `${+new Date()}.vue` }]"
            placeholder="请输入文件名"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { parse } from "@babel/parser";
import ClipboardJS from "clipboard";
import { saveAs } from "file-saver";
import {
  makeUpHtml,
  vueTemplate,
  vueScript,
  cssStyle,
} from "../../generator/html";
import { makeUpJs } from "../../generator/js";
import { makeUpCss } from "../../generator/css";
import {
  exportDefault,
  beautifierConf,
  titleCase,
} from "../../generator/utils";
import loadMonaco from "@/utils/loadMonaco";
import loadBeautifier from "@/utils/loadBeautifier";
import previewCode from "../../PreviewCode/index";
const editorObj = {
  html: null,
  js: null,
  css: null,
};
const mode = {
  html: "html",
  js: "javascript",
  css: "css",
};
let beautifier;
let monaco;

export default {
  props: ["generateConf"],
  components: { previewCode },
  data() {
    return {
      activeTab: "1",
      htmlCode: "",
      jsCode: "",
      cssCode: "",
      codeFrame: "",
      isIframeLoaded: false,
      isInitcode: false, // 保证open后两个异步只执行一次runcode
      isRefreshCode: false, // 每次打开都需要重新刷新代码
      resourceVisible: false,
      scripts: [],
      links: [],
      monaco: null,
      visible: false,
      confirmLoading: false,
      fileVisible: false,
      formData: {},
      form: this.$form.createForm(this),
    };
  },
  computed: {
    resources() {
      return this.scripts.concat(this.links);
    },
    pHeight() {
      return `calc(100VH - 54px - 45px )`;
    },
  },
  watch: {
    // visible(val) {
    // 	if (val) {
    // 		const { type } = 'dialog';
    // 		this.htmlCode = makeUpHtml(this.formData, type);
    // 		this.jsCode = makeUpJs(this.formData, type);
    // 		this.cssCode = makeUpCss(this.formData);
    // 	}
    // },
  },
  created() {},
  mounted() {
    window.addEventListener("keydown", this.preventDefaultSave, false);
    const clipboard = new ClipboardJS(".copy-btn", {
      text: (trigger) => {
        const codeStr = this.generateCode();
        this.$notify({
          title: "成功",
          message: "代码已复制到剪切板，可粘贴。",
          type: "success",
        });
        return codeStr;
      },
    });
    clipboard.on("error", (e) => {
      this.$message.error("代码复制失败");
    });
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.preventDefaultSave);
  },
  methods: {
    preventDefaultSave(e) {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
      }
    },
    onOpen() {
      this.activeTab = "1";
      const { type } = "dialog";
      this.htmlCode = makeUpHtml(this.formData, "dialog");
      this.jsCode = makeUpJs(this.formData, "dialog");
      this.cssCode = makeUpCss(this.formData);

      loadBeautifier((btf) => {
        beautifier = btf;
        this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html);
        this.jsCode = beautifier.js(this.jsCode, beautifierConf.js);
        this.cssCode = beautifier.css(this.cssCode, beautifierConf.html);
      });
    },
    onClose() {
      this.isInitcode = false;
      this.isRefreshCode = false;
      this.visible = false;
    },
    generateCode() {
      const html = vueTemplate(this.htmlCode);
      const script = vueScript(this.jsCode);
      const css = cssStyle(this.cssCode);
      return beautifier.html(html + script + css, beautifierConf.html);
    },
    exportFile() {
      this.$prompt("文件名:", "导出文件", {
        inputValue: `${+new Date()}.vue`,
        closeOnClickModal: false,
        inputPlaceholder: "请输入文件名",
      }).then(({ value }) => {
        if (!value) value = `${+new Date()}.vue`;
        const codeStr = this.generateCode();
        const blob = new Blob([codeStr], { type: "text/plain;charset=utf-8" });
        saveAs(blob, value);
      });
    },
    handleOk() {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          const codeStr = this.generateCode();
          const blob = new Blob([codeStr], {
            type: "text/plain;charset=utf-8",
          });
          saveAs(blob, values.fileName);
          this.fileVisible = false;
        }
      });
    },
    // showResource() {
    // 	this.resourceVisible = true;
    // },
    // setResource(arr) {
    // 	const scripts = [];
    // 	const links = [];
    // 	if (Array.isArray(arr)) {
    // 		arr.forEach((item) => {
    // 			if (item.endsWith('.css')) {
    // 				links.push(item);
    // 			} else {
    // 				scripts.push(item);
    // 			}
    // 		});
    // 		this.scripts = scripts;
    // 		this.links = links;
    // 	} else {
    // 		this.scripts = [];
    // 		this.links = [];
    // 	}
    // },
  },
};
</script>

<style lang="scss">
.t-drawer-14653 {
  .ant-drawer-body,
  .ant-tabs .ant-tabs-left-content {
    padding: 0 !important;
  }
}
</style>
