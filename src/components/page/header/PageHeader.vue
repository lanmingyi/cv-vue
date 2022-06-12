<template>
  <div :class="['page-header', layout, pageWidth]">
    <div class="page-header-wide">
      <div class="breadcrumb">
        <s-breadcrumb />
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Breadcrumb from '@/components/tool/Breadcrumb'
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: [String, Boolean],
      required: false
    },
    breadcrumb: {
      type: Array,
      required: false
    },
    logo: {
      type: String,
      required: false
    },
    avatar: {
      type: String,
      required: false
    },
  },
  components: {
    's-breadcrumb': Breadcrumb
  },
  computed: {
    ...mapState('setting', ['layout', 'showPageTitle', 'pageWidth'])
  }
}
</script>

<style lang="less" scoped>
  @import "index";
</style>
