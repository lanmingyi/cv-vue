Vue.component('xvue-echart-province',{
    template:`
            <el-form-item label="省份">
                    <el-select v-model="selectProvince" filterable @change="handleProvinceSelect" placeholder="省份">
                        <el-option v-for="item in provincelist" :key="item.value" :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
             </el-form-item>
    `,
    data(){
        return {
           "selectProvince":0, //默认选中第一个
        }
    },
    mounted(){
        this.selectProvince = this.getProvinceByName(this.value.name).value;
    },
    props:{
        "provincelist":{
            type:Array
        },
        "value":{
            type:Object
        }
    },
    methods:{
        //获取下拉列表
        getProvinceByName(provinceName){
            let provinceSelect = null;
            let result = dicOption.provinceList.find(item=>item.name==provinceName)
            if(result){
                provinceSelect = result;
            }
            return provinceSelect;
          },
        handleProvinceSelect(value){
                //选中
                let selectProvince = dicOption.provinceList[value];
                this.selectProvince = selectProvince.value;
                EchartsMap.registerMap(selectProvince.name,()=>{
                     this.$emit('input',selectProvince)
                });
        }
    }      
})