<!--
 * @Description: 小卡片
 * @Author: lmy
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-09-16 11:12:40
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div class="mini-card-1598357132" :style="{}">
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
        v-for="(item, index) in options.columns"
        :key="index"
      >
        <div class="mini-card-horizontal" v-if="options.layout === 'vertical'">
          <div
            class="mini-card-iconBox"
						@click="navTo(item)"
            :style="{
              background: item.background,
              width: options.width,
              height: options.height,
              borderRadius: options.borderRadius,
            }"
          >
            <icon-fonts
              :icon="'icon-' + item.iconFont"
              :style="{ fontSize: options.iconFontSize + 'px' }"
              class="mini-card-icon"
            />
          </div>
          <div
            class="mini-card-title"
            :style="{
              fontSize: options.fontSize + 'px',
              width: options.width,
            }"
          >
            {{ item.title }}
          </div>
        </div>
        <div
          class="mini-card-vertical"
          v-else
          :style="{
            background: item.background,
            width: options.width,
            height: options.height,
            borderRadius: options.borderRadius,
          }"
					@click="navTo(item)"
        >
          <div class="mini-card-vertical-iconBox">
            <icon-fonts
              :icon="'icon-' + item.iconFont"
              :style="{ fontSize: options.iconFontSize + 'px' }"
              class="mini-card-vertical-icon"
            />
          </div>
          <div
            class="mini-card-vertical-title"
            :style="{
              fontSize: options.fontSize + 'px',
              fontWeight: options.fontWeight,
            }"
          >
            {{ item.title }}
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "miniCard",
  data() {
    return {
      options: {},
    };
  },
  props: { record: { type: Object } },
  watch: {
    record: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.options = newVal.options || {};
      },
    },
  },
  methods: {
    // 跳转页面
    navTo(val) {
      if (val.url) this.$router.push(val.url);
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin layoutFlex() {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mini-card-1598357132 {
  .ant-col {
    // margin-bottom: 10px;
  }
  .mini-card-horizontal {
    .mini-card-iconBox {
      @include layoutFlex();
      .mini-card-icon {
        color: #fff;
      }
      margin: 0 auto;
    }
    .mini-card-title {
      width: 100%;
      text-align: center;
      margin: 10px auto;
    }
  }
  .mini-card-vertical {
    @include layoutFlex();
    justify-content: space-around;
    margin: 0 auto;
    .mini-card-vertical-title,
    .mini-card-vertical-icon {
      color: #fff;
    }
  }
}
</style>
