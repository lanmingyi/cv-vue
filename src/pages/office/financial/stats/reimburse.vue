<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-range-picker
                  :show-time="{
                    hideDisabledOptions: true,
                    defaultValue: [
                      moment('00:00:00', 'HH:mm:ss'),
                      moment('23:59:59', 'HH:mm:ss'),
                    ],
                  }"
                  format="YYYY-MM-DD HH:mm:ss"
									:value = "createValue"
                  @change="changeTime"
                >
                </a-range-picker>
              </a-form-item>
              <div class="table-page-search-submitButtons flex align-center">
                <a-button class="cu-btn-primary" @click="resetForm()"
                  >查询</a-button
                >
                <a-button class="cu-btn-filter" @click="resetSearchForm()"
                  >重置</a-button
                >
              </div>
            </div>
          </a-form>
        </div>
      </div>
      <!-- /* 报销统计 */ -->
      <iframe
        :src="src"
        style="width: 100%;height: calc(100vh - 200px);border:none;"
      ></iframe>
    </a-card>
  </div>
</template>

<script>
import moment from "moment";
import { baseUrl } from "@/services/baseUrl.js";
import { dataListMixin } from "@/mixins/dataListMixin";
export default {
  name: "TableList",
  mixins: [dataListMixin],
  data() {
    return {
      queryParam: {},
      url: {
        getPageSet: "/system/topicBase/getPageSet",
      },
      mdlUserPost: null,
      masterVisible: false,
      masterMdl: null,
      masterConfirmLoading: false,
      masterSelectedRowKeys: [],
      masterRows: "",
      masterUuids: "",
      statusList: [],
      titleList: [],
      src: "",
			createValue: [],
    };
  },
  mounted() {
    this.src =
      baseUrl +
      "/report/ureport/preview?_u=mysql-协同办公-报销统计表.ureport.xml" +
      "&_t=1,2,3,4,6";
  },
  methods: {
    moment,
    changeTime(data, datastr) {
      console.log("data", data, datastr);
			this.createValue = data;
      this.queryParam.startTime = datastr[0];
      this.queryParam.endTime = datastr[1];
    },
    resetForm() {
      if (this.queryParam.startTime) {
        this.src =
          baseUrl +
          "/report/ureport/preview?_u=mysql-协同办公-报销统计表.ureport.xml" +
          "&startTime=" +
          this.queryParam.startTime +
          "&endTime=" +
          this.queryParam.endTime +
          "&_t=1,2,3,4,6";
      }
      console.log("this.src", this.src);
    },
    resetSearchForm() {
      this.queryParam = {};
			this.createValue = [];
      this.src =
        baseUrl +
        "/report/ureport/preview?_u=mysql-协同办公-报销统计表.ureport.xml" +
        "&_t=1,2,3,4,6";
      console.log("this.src", this.src);
    },
  },
};
</script>

<style lang="less">
.rowColorRed {
  background-color: #ffd2d2;
}

.ant-tag-blue {
  color: white;
  background: #009688;
  border-color: #009688;
}

.ant-tag-red {
  color: white;
  background: #ff5722;
  border-color: #ff5722;
}
</style>
