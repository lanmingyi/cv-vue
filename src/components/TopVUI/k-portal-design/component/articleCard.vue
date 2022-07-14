<!--
 * @Description: 卡片列表配置，可用于文章、新闻、公告
 * @Author: lmy
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-09-16 11:04:00
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <a-card
    :hoverable="true"
    class="art-card-15696"
    :style="{overflow:'auto', height: options.height }"
  >
    <!-- 标题 -->
    <template slot="title" v-if="options.titleShow">
      <icon-fonts
        :icon="'icon-' + options.iconFont"
        class="card-title-icon"
        :style="{ color: options.iconFontColor }"
      />
      <span>{{ options.title }}</span>
    </template>
    <!-- 操作 -->
    <template slot="extra">
      <card-title
        v-if="options.titleShow && options.action"
        :formType="options.formType"
        :formOptions="formOptions"
        @sendCurrent="getArticleData"
      ></card-title>
      <a
        v-if="options.isShowList"
        style="margin-left:8px"
        @click="navToListPage()"
        >更多<a-icon type="double-right"
      /></a>
    </template>
    <!-- 列表 -->
    <a-list
      class="demo-loadmore-list156486"
      :loading="loading"
      item-layout="horizontal"
      :data-source="newsList"
      :pagination="listPagination"
    >
      <a-list-item
        slot="renderItem"
        slot-scope="child, indexChild"
        style="cursor: pointer;"
        @click="showDetail(child)"
      >
        <span slot="actions" style="font-size: 12px;">{{
          getTime(child.createTime)
        }}</span>
        <span class="list-title">{{ child.title }}</span>
      </a-list-item>
    </a-list>
    <!-- 动态引入组件 -->
    <component
      v-if="options.detailUrl"
      ref="detailModal"
      :visible="visible"
      :is="plugItem"
      v-for="(plugItem, plugIndex) in plugs"
      :key="plugIndex"
      :uuid="detailUuid"
      @cancel="
        () => {
          visible = false;
        }
      "
    ></component>
  </a-card>
</template>

<script>
import { Ellipsis } from "@/components";
import { getObjectByString } from "@/utils/util";
import cardTitle from "./cardTitle";
export default {
  name: "articleCard",
  data() {
    return {
      visible: false,
      newsList: [],
      loading: true,
      visibleDetail: false,
      options: {},
      formOptions: {},
      selectValue: {},
      plugs: [],
      detailUuid: "",
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
  components: { Ellipsis, cardTitle },
  props: { record: { type: Object } },
  mounted() {
    this.options = this.record.options;
    this.getArticleData();
    this.plugs = [];
    this.plugs.push(() => import(`@/pages` + this.options.detailUrl));
  },
  watch: {
    record(newVal) {
      this.options = newVal.options || {};
      this.plugs = [];
      if (this.options.detailUrl)
        this.plugs.push(() => import(`@/pages` + this.options.detailUrl));
      this.formOptions = newVal.options.formOptions || {};
    },
  },
  // 列表分页
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
          this.newsList = res.rows;
          this.pagination.current = res.pageNo;
          this.pagination.pageSize = res.pageSize;
          this.pagination.total = res.totalCount;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getTime(val) {
      return val.substr(0, 11);
    },
    // 打开详情页面
    showDetail(val) {
      if (!this.options.isShowDetail) return false;
      this.visible = true;
      this.detailUuid = val.uuid;
    },
    // 跳转到列表
    navToListPage() {
      if (this.options.isShowList)
        this.$router.push({ path: this.options.listUrl });
    },
  },
};
</script>

<style lang="less">
.demo-loadmore-list156486 {
  .list-title {
    width: 72%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    color: rgb(7, 78, 158);
  }
  .ant-list-item-action > li {
    line-height: 1.5;
  }
  .ant-list-pagination {
    margin: 10px 0;
  }
}
</style>
