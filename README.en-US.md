### 环境和依赖

#### 安装 node.js

- [ ]下载地址：(http://nodejs.cn/download/)

- 查看版本

```
node -v
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

### 目录结构

```
├── public
│   └── logo.png             # LOGO
|   └── index.html           # Vue 入口模板
├── src
│   ├── api                  # Api ajax 等
│   ├── assets               # 本地静态资源
│   ├── config               # 项目基础配置，包含路由，全局设置
│   ├── components           # 业务通用组件
│   ├── core                 # 项目引导, 全局配置初始化，依赖包引入等
│   ├── router               # Vue-Router
│   ├── store                # Vuex
│   ├── utils                # 工具库
│   ├── locales              # 国际化资源
│   ├── views                # 业务页面入口和常用模板
│   ├── App.vue              # Vue 模板入口
│   └── main.js              # Vue 入口 JS
│   └── permission.js        # 路由守卫(路由权限控制)
├── tests                    # 测试工具
├── README.md
└── package.json
```
