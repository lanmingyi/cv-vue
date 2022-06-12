import TDate from '@/components/TopVUI/custom/TDate'; import { type } from
'../../../../../vite/vben-admin-thin-next/src/components/Cropper/src/typing';
<template>
  <a-card>
    <!-- <TMentions url="/mdata/user/getListByKeywords"></TMentions> -->
    <!-- <TtransferByUser></TtransferByUser> -->
    <a-form :form="form">
      <!-- 弹窗 -->
      <a-row :gutter="24">
        <a-col>
          <a-form-item label="可拖拽弹窗">
            <a-button
              class="cu-btn-primary"
              style="margin-right: 8px;"
              @click="() => (modal.visible = true)"
              >点击弹出JModal</a-button
            >
            <span style="margin-right: 8px;"
              >全屏化： <a-switch v-model="modal.fullscreen"
            /></span>
            <span style="margin-right: 8px;"
              >允许切换全屏： <a-switch v-model="modal.switchFullscreen"
            /></span>
          </a-form-item>
          <t-modal
            :visible.sync="modal.visible"
            :width="800"
            :title="modal.title"
            :fullscreen.sync="modal.fullscreen"
            :switchFullscreen="modal.switchFullscreen"
          >
            <template v-for="(i, k) of 10">
              <p :key="k">这是主体内容，高度是自适应的</p>
            </template>
          </t-modal>
        </a-col>
      </a-row>
      <!--  颜色选择器 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="颜色选择器">
            <color-picker
              :disable="false"
              v-model="color"
              @change="change"
            ></color-picker>
          </a-form-item>
        </a-col>
      </a-row>
      <!--  数据字典集 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="数据字典集">
            <t-dict-select-tag
              v-model="sex"
              type="select"
              dictCode="sex"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!--  数据字典集 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="数据字典集(静态数据)">
            <t-dict-select-tag
              v-model="sex"
              :dataList="dataList"
              placeholder="请选择"
              @change="changeVal"
              dataType="static"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!--  数据字典集 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="数据字典(单选)">
            <t-dict-select-tag
              v-model="sex"
              type="radio"
              dictCode="sex"
              placeholder="请选择"
              @change="changeVal"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!--  数据字典集 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="数据字典(复选框)">
            <t-multi-select-tag
              v-model="formData.selMuti"
              :dataList="dataList"
              type="checkbox"
              placeholder="请选择"
              dataType="static"
            ></t-multi-select-tag>
          </a-form-item>
        </a-col>
      </a-row>
      <!--  数据字典集 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="数据字典集(多选)">
            <t-multi-select-tag
              v-model="formData.selMuti"
              dictCode="sex"
              placeholder="请选择"
            ></t-multi-select-tag>
          </a-form-item>
        </a-col>
      </a-row>
      <!--  树形字典 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="树形字典">
            <tree-dict-select-tag
              v-model="treeCode"
              type="select"
              codeSetId="AAAB"
              :levelId="2"
              placeholder="请选择"
              @change="changeTreeCode"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!--  级联选择器 -->
      <!-- <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="级联选择器">
            <tree-dict-select-tag
              v-model="treeCode"
              type="select"
              codeSetId="AAAB"
              :levelId="2"
              placeholder="请选择"
              @change="changeTreeCode"
            />
          </a-form-item>
        </a-col>
      </a-row> -->
      <!--  选择部门 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="选择部门">
            <TSelectDepart :multi="true"> </TSelectDepart>
          </a-form-item>
        </a-col>
      </a-row>
      <!--  下拉搜索 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="数据字典搜索(同步)">
            <TSearchSelectTag
              v-model="formData.searchValue"
              :dictOptions="searchOptions"
            ></TSearchSelectTag>
          </a-form-item>
        </a-col>
      </a-row>
      <!--  下拉搜索 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="数据字典搜索(异步)">
            <TSearchSelectTag
              v-model="formData.asyncSelectValue"
              :async="true"
              dict="mysqlFileType"
            ></TSearchSelectTag>
          </a-form-item>
        </a-col>
      </a-row>
      <!--  省市区级联 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="省市区级联">
            <t-area-linkage></t-area-linkage>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="省市区级联(下拉框)">
            <TAreaLinkage type="select"></TAreaLinkage>
          </a-form-item>
        </a-col>
      </a-row>
      <!--  通过部门选择用户控件 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="选择用户">
            <t-select-user-by-dep
              v-model="userIds"
              :multi="true"
            ></t-select-user-by-dep>
          </a-form-item>
        </a-col>
      </a-row>
      <!--  自定义树形 -->
      <!-- <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="自定义树形">
            <Tree :treeData="treeData" v-model="userIds" :multi="true"></Tree>
          </a-form-item>
        </a-col>
      </a-row> -->
      <!--  自定义树形 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="树形选择器">
            <tree-select
              v-model="formData.treeSelectSinper"
              :treeValueId="formData.treeSelectSinper.toString()"
              placeholder="请选择"
              :parameter="parameter"
              :url="url"
              idfield="id"
              textfield="text"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!--  树形选择器 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="树形选择器(多选)">
            <tree-select
              v-model="formData.treeSelect"
              :treeValueId="formData.treeSelect.toString()"
              placeholder="请选择"
              :parameter="parameter"
              :url="url"
              idfield="id"
              textfield="text"
              :multiple="true"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 日期选择器 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="日期选择器">
            <t-date type="date" showTime />
          </a-form-item>
        </a-col>
      </a-row>
      <!--  滑块验证码 -->
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="滑块验证码">
            <t-slider @onSuccess="handleJSliderSuccess" />
          </a-form-item>
        </a-col>
      </a-row>

      <!--  代码输入框 -->
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item label="代码输入框" style="min-height: 120px">
            <t-code-editor
              language="javascript"
              v-model="tcodedditor.value"
              :fullScreen="true"
              style="min-height: 100px"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!--  富文本编辑器 -->
      <a-row :gutter="24" style="z-index: 9!important;">
        <a-col :span="24">
          <a-form-item label="富文本编辑器" style="min-height: 120px">
            <Editor
              :value="description"
              :isClear="isClear"
              style="text-align:leftp;"
              @onchange="changeEditor"
            ></Editor>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" style="z-index: 9!important;">
        <a-col :span="24">
          <a-form-item label="图片上传" style="min-height: 120px">
            <t-image-upload :isMultiple="true"></t-image-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>
<script>
import {
  TModal,
  TCodeEditor,
  Editor,
  TSelectUserByDep,
  Tree,
  TreeSelect,
  colorPicker,
  TImageUpload,
  TDictSelectTag,
  TMultiSelectTag,
  TSelectDepart,
  TAreaLinkage,
  TreeDictSelectTag,
  TSearchSelectTag,
  TSlider,
  TCascader,
  TMentions,
  TtransferByUser,
  TDate,
} from "@/components";
export default {
  components: {
    TModal,
    TCodeEditor,
    Editor,
    TSelectUserByDep,
    Tree,
    colorPicker,
    TImageUpload,
    TDictSelectTag,
    TMultiSelectTag,
    TreeSelect,
    TSelectDepart,
    TAreaLinkage,
    TreeDictSelectTag,
    TSearchSelectTag,
    TSlider,
    TCascader,
    TMentions,
    TtransferByUser,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      modal: {
        title: "标题",
        visible: false,
        fullscreen: true,
        switchFullscreen: true,
      },
      tcodedditor: {
        value: `function sayHi(word) {
            alert(word)
            }
            sayHi('hello, world!')`,
      },
      description: "",
      isClear: false,
      userIds: "admin",
      color: "rgba(85, 170, 255, 0.5)",
      formData: {
        selMuti: "",
        treeSelectSinper: "3",
        treeSelect: "3",
        searchValue: "",
        asyncSelectValue: "",
        slider: "",
      },
      sex: "male",
      treeData: [
        {
          id: 1,
          key: 1,
          isEdit: false, // 是否处于编辑状态
          isNewItem: false, // 该节点是否是新增节点
          title: "节点名字",
          depth: 1, // 该节点的层级
          scopedSlots: {
            title: "custom",
          }, // 自定义组件需要绑定
          children: [
            {
              id: 2,
              key: 2,
              isEdit: false, // 是否处于编辑状态
              isNewItem: false, // 该节点是否是新增节点
              title: "子节点名字",
              depth: 2, // 该节点的层级
              scopedSlots: {
                title: "custom",
              },
            },
          ],
        },
      ],
      dataList: [
        {
          label: "男",
          value: "male",
        },
        {
          label: "女",
          value: "female",
        },
      ],
      url: {
        fathersUrl: "/mdata/organization/getListByLevelId",
        expandUrl: "/mdata/organization/getListByPid",
      },
      parameter: {
        father: {
          levelId: 1,
          type: "topic",
        },
        children: {
          type: "topic",
        },
      },
      treeCode: "",
      searchOptions: [
        {
          text: "选项一",
          value: "1",
        },
        {
          text: "选项二",
          value: "2",
        },
        {
          text: "选项三",
          value: "3",
        },
      ],
      value: ["china"],
    };
  },
  mounted() {},
  methods: {
    changeEditor(e) {
      console.log(e);
    },
    change(e) {
      console.log(e, this.color);
    },
    changeVal(e) {
      this.sex = e;
    },
    changeTreeCode(e) {
      this.treeCode = e;
    },
    handleJSliderSuccess(value) {
      this.formData.slider = value;
    },
  },
  created() {
    this.$post(this.url.fathersUrl).then((res) => {
      this.treeSeleteData = res;
      this.treeSeleteData.forEach((e, index) => {
        this.treeSeleteData[index].title = e.text;
        this.treeSeleteData[index].label = e.text;
        this.treeSeleteData[index].index = index;
        this.treeSeleteData[index].value = e.text;
        this.treeSeleteData[index].key = e.id;
        this.treeSeleteData[index].levelId = e.levelId;
      });
    });
  },
};
</script>
<style scoped>
/deep/.ant-form-item-control {
  line-height: 1.2 !important;
}
</style>
