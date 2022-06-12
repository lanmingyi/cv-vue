<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-select
                    v-model="queryParam.job"
                    placeholder="职位"
                    allowClear
                    style="width: 200px;"
                    @change="
                (value) => {
                  (queryParam.job = value);
                }
              "
                >

                  <a-select-option value="董事长">
                    董事长
                  </a-select-option>
                  <a-select-option value="经理">
                    经理
                  </a-select-option>
                  <a-select-option value="分析师">
                    分析师
                  </a-select-option>
                  <a-select-option value="文员">
                    文员
                  </a-select-option>
                  <a-select-option value="销售员">
                    销售员
                  </a-select-option>
                </a-select>
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
      <iframe
        :src="src"
        style="width: 100%;height: calc(100vh - 200px);border:none;"
      ></iframe>
    </a-card>
  </div>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import { mapGetters } from "vuex";
export default {
  name: "TableList",
  data() {
    return {
      queryParam: {},
      src: "",
      visiblePopup: false,
    };
  },
  computed: {
  },
  mounted() {
    this.$nextTick(() => {
      this.src =
        baseUrl +
        "/report/ureport/preview?_u=mysql-A图表.ureport.xml&_t=0"
    });
  },
  methods: {
    popupCallback(value, other) {
      this.$nextTick(() => {
        this.queryParam.job = value.job;
      });
    },
    resetForm() {
      if (this.queryParam.job) {
        this.src =
          baseUrl +
          "/report/ureport/preview?_u=mysql-A图表.ureport.xml&_t=0" +
          "&job=" +
          this.queryParam.job;
      }
    },
    resetSearchForm() {
      this.queryParam = {};
      this.src =
        baseUrl + "/report/ureport/preview?_u=mysql-A图表.ureport.xml&_t=0";
    },
  },
};
</script>

<style lang="less"></style>
