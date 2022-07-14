<!--
 * @Description: 卡片列表
 * @Author: lmy
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-09-16 11:04:34
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div class="cardList-wrapper">
    <a-row
      :gutter="[record.options.gutters, record.options.vgutters]"
      class="cardList-wrapper-row-159357"
    >
      <a-col
        :xs="record.options.col.xs"
        :md="record.options.col.md"
        :sm="record.options.col.sm"
        :lg="record.options.col.lg"
        :xxl="record.options.col.xxl"
        v-for="(item, index) in record.options.dataList"
        :key="index"
      >
        <div
          :class="['card-item', 'card-item-' + index]"
          :style="{ background: item.backgroundColor }"
        >
          <div class="card-title">
            <a-space :size="8">
              <icon-fonts :icon="'icon-' + item.icon" />{{ item.label }}
            </a-space>
          </div>
          <div class="all-count">
            <count-to
              :startVal="0"
              :endVal="cardData[item.count]"
              :duration="2200"
            />
            <span class="suffix">{{ item.unit }}</span>
          </div>
          <!-- <div class="card-info relative">
						<div class="abs-bottom flex">
							<div style="margin-right:20px" class="inline-block">
								{{ item.explain }}
							</div>
						</div>
					</div> -->
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import countTo from "vue-count-to";
import { axiosRequest } from "@/services/apiByPortal";
import { getObjectByString } from "@/utils/util";
export default {
  name: "cardList",
  components: { countTo },
  data() {
    return {
      cardData: {
        grade: 45,
        staff: 172,
        student: 835,
        teacher: 86,
        tranStudent: 46,
      },
    };
  },
  props: { record: { type: Object } },
  mounted() {
    this.getCardData();
  },
  watch: {
    record: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.getCardData();
        });
      },
    },
  },
  methods: {
    // 获取卡片数据
    getCardData() {
      let params = getObjectByString(this.record.options.parameter, ",", ":");
      axiosRequest(
        this.record.options.method,
        this.record.options.url,
        params
      ).then((res) => {
        this.cardData = res?.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/style/mixin.scss";
.cardList-wrapper {
  .card-item {
    box-sizing: border-box;
    height: 129px;
    padding: 15px 15px 0;
    border-radius: 6px;
    cursor: pointer;
    // margin-bottom: 25px;
    // &.card-item-0 {
    // 	@include cardBg(#5171fd, #c97afd);
    // }
    // &.card-item-1 {
    // 	@include cardBg(#3dadf6, #737bfc);
    // }
    // &.card-item-2 {
    // 	@include cardBg(#ea677c, #ef9b5f);
    // }
    // &.card-item-3 {
    // 	@include cardBg(#42d79b, #a6e25f);
    // }
    // &.card-item-4 {
    // 	@include cardBg(#eb5008, #e02e87);
    // }
    &:hover {
      box-shadow: 3px 5px 15px rgba(40, 40, 40, 0.36);
      transform: scale(1.03);
      transition: all 0.1s ease-out;
    }
    .card-title {
      color: #fff;
      font-size: 1rem;
    }
    .all-count {
      color: #fff;
      font-size: 1.9rem;
      font-weight: bold;
      margin-top: 12px;
      padding-left: 25px;
      .suffix {
        font-size: 0.75rem;
      }
    }
    .card-info {
      color: #fff;
      font-size: 0.85rem;
      height: 46px;
      margin-top: 8px;
      .abs-bottom {
        position: absolute;
        bottom: 7px;
        left: 0;
      }
      .up {
        color: #1afa29;
      }
      .down {
        color: rgb(250, 30, 16);
      }
    }
  }
}
</style>
<style lang="scss">
.cardList-wrapper {
  .cardList-wrapper-row-159357 {
    margin: 0 !important;
    .ant-col {
      // margin-bottom: 24px !important;
    }
  }
}
</style>
