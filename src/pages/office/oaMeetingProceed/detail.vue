<template>
  <t-modal
    :visible="visible"
    :width="800"
    title="详情"
    :fullscreen="fullscreen"
    :switchFullscreen="fullscreen"
    :confirmLoading="loading"
    @ok="onClose"
    @cancel="onClose"
    :footer="null"
  >
    <a-card :bordered="false">
      <div class="account-center-avatarHolder" v-if="dataList.oaMeetingsBase">
        <table
          class="table-ant"
          style="table-layout: fixed; word-break: break-all;"
        >
          <thead>
            <tr>
              <th colspan="6" style="text-align: center">会议详细页面</th>
            </tr>
          </thead>
          <tr>
            <td>会议名称：</td>
            <td colspan="2">{{ dataList.oaMeetingsBase.name }}</td>
            <td>主办人：</td>
            <td colspan="2">{{ dataList.oaMeetingsBase.participantName }}</td>
          </tr>
          <tr>
            <td>会议室：</td>
            <td colspan="2">{{ dataList.oaMeetingsBase.meetingRoom }}</td>
            <td>会议类型：</td>
            <td colspan="2">{{ dataList.oaMeetingsBase.typeName }}</td>
          </tr>
          <tr>
            <td>会议状态：</td>
            <td colspan="5">{{ dataList.oaMeetingsBase.stateName }}</td>
          </tr>

          <tr>
            <td>开会时间：</td>
            <td colspan="2">{{ dataList.oaMeetingsBase.meetingTime }}</td>
            <td>截止时间：</td>
            <td colspan="2">{{ dataList.oaMeetingsBase.blocking }}</td>
          </tr>

          <tr>
            <td height="50">有牌人员：</td>
            <td
              height="50"
              colspan="5"
              style="clear:both;word-wrap:break-word;white-space: normal;"
            >
              <div class="data-box">
                <div v-for="item in haveData" :key="item">
                  <span>{{ item }}</span>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td height="50">无牌人员：</td>
            <td
              height="50"
              colspan="5"
              style="clear:both;word-wrap:break-word;white-space: normal;"
            >
              <div class="data-box">
                <div v-for="item in noData" :key="item">
                  <span>{{ item }}</span>
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td height="150">会议内容：</td>
            <td height="150" colspan="5">
              <div>
                {{ dataList.oaMeetingsBase.content }}
              </div>
            </td>
          </tr>
          <tr>
            <th colspan="6" style="text-align: center">已签到人员</th>
          </tr>
          <tr>
            <td
              height="50"
              colspan="6"
              style="clear:both;word-wrap:break-word;white-space: normal;text-align: left;padding-left: 20px;
						"
            >
              <div v-if="signData.length != 0">
                <div v-for="item in signData" :key="item">
                  <span>{{ item }}</span>
                </div>
              </div>
              <span v-else>暂无</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="account-center-footer">
        <a-button class="cu-btn-primary" @click="addComment">签到</a-button>
      </div>
    </a-card>
  </t-modal>
</template>
<script>
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
      form: this.$form.createForm(this),
      dataList: [],
      fullscreen: false,
      url: {
        updateSarte: "/office/oaMeetingSingu/updateSarte", // puuid  签到
        contentdetails: "/office/oaMeetingsBase/Contentdetails", // ?uuid={uuid}&puuid={uuid}   获取详情
      },
      puuid: "",
      haveData: [],
      noData: [],
      signData: [],
    };
  },
  methods: {
    afterVisibleChange(val) {
      console.log("visible", val);
    },
    onClose() {
      this.$emit("cancel");
    },
    addComment() {
      console.log("this.puuid", this.puuid);
      this.$post(this.url.updateSarte, {
        puuid: this.puuid,
      }).then((res) => {
        console.log("res======", res);
        if (res.statusCode === 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    onLoadData(e) {
      this.puuid = e ? e.uuid : "";
      this.haveData = [];
      this.noData = [];
      this.$axios(
        "get",
        `${this.url.contentdetails}?uuid=${e.uuid}&puuid=${e.uuid}`
      ).then((res) => {
        console.log(
          "res.OaMeetingsBasesList--------------",
          res.OaMeetingsBasesList
        );
        console.log("res.oaMeetingSingus1=======", res.oaMeetingSingus1);
        console.log("res.oaMeetingsBase--------------", res.oaMeetingsBase);
        this.dataList = res;
        if (res.OaMeetingsBasesList) {
          res.OaMeetingsBasesList.forEach((val) => {
            if (val.state === "public.whether01") {
              this.haveData.push(val.userIdName);
            } else if (val.state === "public.whether02") {
              this.noData.push(val.userIdName);
            }
          });
        }
        if (res.oaMeetingSingus1) {
          this.signData = res.oaMeetingSingus1;
        }
      });
    },
  },
};
</script>
<style scoped="scoped" lang="less">
.data-box {
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
}

.test-box {
  width: 100%;
  min-height: 150px;
  border: none;
}

.test-box:focus {
  outline: none !important;
  border-color: transparent;
}

.table-ant {
  width: 80%;
  margin: 0 auto;
  border: 1px solid #e7e7e7;
  padding: 10px 20px;

  thead,
  & > tr {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #e7e7e7;
  }

  & > tr > td {
    border-right: 1px solid #e7e7e7;
  }

  & > tr > td:nth-child(2n) {
    text-align: left;
    padding-left: 20px;
  }
}

.account-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .account-list {
    width: 50%;
    display: flex;
    align-items: center;
    text-align: left;
    font-size: 16px;
    border: 1px solid #e7e7e7;

    div {
      height: 34px;
      line-height: 34px;
    }

    & > div:first-child {
      width: 30%;
      padding-left: 20px;
      border-left: 1px solid #e7e7e7;
    }
  }
}

.account-center-avatarHolder {
  text-align: center;
  margin-bottom: 24px;
  // border: 1px solid #e7e7e7;
  // padding: 20px 20px;
  // text-align: left;

  & > .avatar {
    margin: 0 auto;
    width: 104px;
    height: 104px;
    margin-bottom: 20px;
    border-radius: 50%;
    overflow: hidden;

    img {
      height: 100%;
      width: 100%;
    }
  }

  .username {
    color: rgba(0, 0, 0, 0.85);
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 4px;
  }

  /deep/ img {
    width: 100%;
    height: 100%;
  }
}

.account-center-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
