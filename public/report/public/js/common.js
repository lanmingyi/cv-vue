//大屏后台服务域名
var base = "https://vue.misboot.com";
var previewUrl = "https://vue.misboot.com"
var getBaseUrl = "https://vue.misboot.com"

var baseUrl = base+"/jmreport/bigscreen";
var reportUrl={
    "index":baseUrl+"/index",
    "list":baseUrl+"/list",
    "add":baseUrl+"/add",
    "edit":baseUrl+"/edit",
    "view":baseUrl+"/view",
    "queryById":baseUrl+"/queryById"
}

var config = {
  width: 1920,
  height: 1080,
  scale: 1,
  mark: {
    show: false,
    text: '大屏报表',
    fontSize: 20,
    textStyle: 'rgba(100,100,100,0.2)',
    degree: -20
  },
  backgroundImage:'./report/public/img/bg/bg38.jpg',
  query: {},
  thumbnail:""
};
var list = [];
