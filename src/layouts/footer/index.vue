<template>
  <div class="footer">
    <div class="copyright" v-if="show">
      Copyright<a-icon type="copyright" />{{systemVersionPublishDate}}  
	 <a class="companyName" :href="companyWebsite" target="_blank">{{companyName}}</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PageFooter',
  computed: {
    ...mapGetters(['configData'])
  },
  data(){
	  return {
		 show:false 
	  }
  },
  mounted() {
  	console.log(this.configData)
  },
  computed:{
	  systemVersionPublishDate(){
	  	let index = this.configData.findIndex(item => item.code === 'systemVersionPublishDate')
	  	if(index>=0){
	  		return this.configData[index].value
	  	} else {
	  		return '2021'
	  	}
	  },
	  companyWebsite(){
	  	let index = this.configData.findIndex(item => item.code === 'companyWebsite')
	  	if(index>=0){
	  		return this.configData[index].value
	  	} else {
	  		return 'https://www.zuoyo.com'
	  	}
	  },
	  companyName(){
		  let index = this.configData.findIndex(item => item.code === 'companyWebsite')
		  if(index>=0){
		  	return this.configData[index].value
		  } else {
		  	return '湖南佐佑时代科技有限公司'
		  }
	  }
  },
  watch:{
	  configData(val){
		  if(val.length>0){
			  this.show = true
		  }
	  }
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 20px 0 14px;
  text-align: center;
  position: relative;
  .copyright {
    text-align: center;
    color: rgba(0, 0, 0, 0.45);
    font-size: 13px;
	.companyName{
		color: rgba(0, 0, 0, 0.45);
	}
	.companyName:hover{
		color: @primary-color;
	}
  }
}
</style>
