//地图注册方法
let EchartsMap = {
    /**
     * 注册地图
     * @param {*} provinceName 
     */
    registerMap:function(provinceName,callback){
        let provinceJson = './report/json/province/'+provinceName+".json"
        axios.get(provinceJson).then(res=>{
             echarts.registerMap(provinceName, res.data);
             if(callback!=null && typeof callback=="function"){
                callback(res.data);
             }
        }).catch(err=>{
            // console.log(err);
        })
    }
}