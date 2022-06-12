<template>
  <div class="ant-pro-pages-account-projects-cardList">
    <a-list :loading="loading" :data-source="dataSource" :grid="{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card class="ant-pro-pages-account-projects-card" hoverable>
          <img slot="cover" :src="item.cover" :alt="item.title" />
          <a-card-meta :title="item.title">
            <template slot="description">
              <ellipsis :length="50">{{ item.description }}</ellipsis>
            </template>
          </a-card-meta>
          <div class="cardItemContent">
            <span>{{ item.updatedAt | fromNow }}</span>
            <div class="avatarList">
              <avatar-list size="mini">
                <avatar-list-item
                  v-for="(member, i) in item.members"
                  :key="`${item.id}-avatar-${i}`"
                  :src="member.avatar"
                  :tips="member.name"
                />
              </avatar-list>
            </div>
          </div>
        </a-card>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import moment from 'moment'
const TagSelectOption = TagSelect.Option
const AvatarListItem = AvatarList.AvatarItem

const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png'
]
const dataSource = []
dataSource.push({})
for (let i = 0; i < 5; i++) {
  dataSource.push({
    id: i,
    title: 'Alipay',
    cover: covers[i],
    content: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
  })
}
export default {
  name: 'Project',
  components: {
  },
  data () {
    return {
      dataSource,
      form: this.$form.createForm(this),
      loading: false
    }
  },
  filters: {
    fromNow (date) {
      return moment(date).fromNow()
    }
  },
  mounted () {
    // this.getList()
  },
  methods: {
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    getList () {
      this.$http.get('/list/article', { params: { count: 8 } }).then(res => {
        console.log('res', res)
        this.data = res.result
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-pro-pages-account-projects-cardList {
    margin-top: 24px;

    /deep/ .ant-card-meta-title {
      margin-bottom: 4px;
    }

    /deep/ .ant-card-meta-description {
      height: 44px;
      overflow: hidden;
      line-height: 22px;
    }

    .cardItemContent {
      display: flex;
      height: 20px;
      margin-top: 16px;
      margin-bottom: -4px;
      line-height: 20px;

      > span {
        flex: 1 1;
        color: rgba(0,0,0,.45);
        font-size: 12px;
      }

      /deep/ .ant-pro-avatar-list {
        flex: 0 1 auto;
      }
    }
  }
</style>
