# 一、目标检测

### 1. 选择权重

<img src='public/assets/demo.png' />

![demo](public/assets/detection2.gif)

说明：

1. 
2. 

# 二、人脸识别

# 三、项目部署

## 环境和依赖

#### 安装 node.js

- [ ]下载地址：(http://nodejs.cn/download/)

- 查看版本

```
node -v
```

#### 安装 cnpm

- 安装

```
npm install -g cnpm -registry=https://registry.npm.taobao.org
```

- 查看版本

```
cnpm -v
```

#### 安装 yarn

- 安装

```
npm install -g yarn
```

- 查看版本

```
yarn --version
```

### 项目启动
#### npm 启动

- 安装依赖

```
npm install
```

- 编译并启动

```
npm run serve
```

- 编译

```
npm run build
```

- Lints and fixes files / 代码检查和文件规范格式化

```
npm run lint
```

- Customize configuration / 更多脚手架配置:
- See [Configuration Reference](https://cli.vuejs.org/config/).


#### yarn 启动(推荐使用)

- 安装依赖

```
yarn install
```

- 开发模式运行

```
yarn run serve
```

- 编译项目

```
yarn run build
```

- Lints and fixes files

```
yarn run lint
```



### 目录结构

```

├── docs                                        # 使用文档
├── mock                                        # mock数据
├── public
│   └── logo.png                                # 浏览器图标
│   └── index.html                              # 入口 HTML
│   └── build.html                              # 大屏报表新建页面
│   └── list.html                               # 大屏报表列表页面
│   └── view.html                               # 大屏报表预览页面
├── src
│   ├── assets                                  # 本地静态资源
│   ├── components                              # 内置通用组件
│   ├── config                                  # 系统配置
│   ├── core                                    # 项目目引导, 全局配置初始化，依赖包引入等
│   ├── layouts                                 # 通用布局
│   ├── mixins                                  # 混合js
│   ├── mock                                    # 本地 mock 数据
│   ├── pages                                   # 页面组件和通用模板
│   ├── plugins                                 # vue 插件
│   ├── router                                  # 路由配置
│   ├── services                                # 数据服务模块
│   ├── store                                   # vuex 状态管理配置
│   ├── theme                                   # 主题相关
│   ├── utils                                   # js 工具
│   ├── utils                                   # js 工具
│          ├── behavior                         # 百度统计代码
│          ├── browser                          # 判断浏览器内核
│          ├── device                           # 媒体查询domUtil
│          ├── domUtil                          # 修改浏览器标题
│          ├── drag                             # 弹窗拖拽
│          ├── filter                           # 日期时间处理
│          ├── formatter                        # 流程表单json数据处理
│          ├── mock                             # mock请求
│          ├── request                          # axios请求
│          ├── routerUtil                       # 路由处理
│          ├── screenLog                        # 控制台打印
│          ├── themeUtil                        # 主题色
│          └── TopVUI                           # 常用方法（文件下载，cookie处理）
│   ├── permission.js                           # 路由守卫(路由权限控制)
│   └── main.js                                 # 应用入口js
├── .env.development                            # 开发环境
├── .env.production                             # 生产环境
├── package.json                                # package.json
├── README.md                                   # README.md
└── vue.config.js                               # vue 配置文件

```

### ~~常见问题~~

- 1.解决Cannot read property 'getUserMedia' of undefined：
  **在浏览器输入**：*chrome://flags/#unsafely-treat-insecure-origin-as-secure*，输入框中输入网址，然后将右侧Disabled 改成 Enabled即可，
点击下方Relaunch会重启浏览器