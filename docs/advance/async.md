---
title: 异步路由和菜单
lang: zn-CN
---
### 注册路由组件
基础路由组件包含路由基本配置和对应的视图组件，我们统一在 `/config/router.config.js` 文件中注册它们。它和正常的路由配置基本无异，相当于把完整的路由拆分成单个的路由配置进行注册，为后面的路由动态配置打好基础。  
一个单独的路由组件注册示例如下：
```jsx
registerName: {                               //路由组件注册名称，唯一标识
  path: 'path',                               //路由path，可缺省，默认取路由注册名称 registerName 的值
  name: '演示页',                             //路由名称
  redirect: '/login',                         //路由重定向
  component: () => import('@/pages/demo'),    //路由视图
  icon: 'permission',                         //路由的菜单icon，会注入到路由元数据meta中
  invisible: false,                           //是否隐藏菜单项，true 隐藏，false 不隐藏，会注入到路由元数据meta中。
  authority: {                                //路由权限配置，会注入到路由元数据meta中。可缺省，默认为 ‘*’, 即无权限限制
    permission: 'form',                       //路由需要的权限  
    role: 'admin'                             //路由需要的角色。当permission未设置，通过 role 检查权限
  },                     
  page: {                                     //路由的页面数据，会注入到路由元数据meta中
    title: '演示页',                          //页面标题
    breadcrumb: ['首页', '演示页']            //页面面包屑
  }             
}
```
