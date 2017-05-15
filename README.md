# billund

## 介绍

(带图)

### billund是什么

billund是一个专注于界面渲染的同构化工具，同时支持了`React` 与 `Vue` 的渲染。billund希望能够为开发者与用户都带来优秀的体验：

- 屏蔽了繁琐的同构细节
- 一致化的组件开发体验
- 自由选型react|vue 技术栈
- 强大直观的页面配置
- 自动优化webpack打包代码
- 自由拓展的页面渲染插件

### 为什么要同构

同构，简单的解释来说就是代码能够同时运行在客户端和服务端。对于前端来说，同构的好处在于：

- 提升首屏渲染速度，提升用户体验
- 方便seo

### 真实的场景中

但是，在真实的开发过程中，我们逐步发现了许多令人不快的地方：

- 同构的流程比较复杂

- 在一个团队内，可能会根据真实场景对`React`和`Vue`的技术栈进行不同选型，对应设施都要重新搭建

- `Server-Side-Render`开发过程中，如果某个获取数据逻辑耗时较长，还需要考虑将那一块的html渲染滞后以免影响用户体验，却让开发体验不尽相同

针对以上痛点，`billund`逐渐从业务项目中脱胎而出，成为一个同构组件，致力于为用户和开发和都提供更好的体验：

- 屏蔽了复杂的同构流程

- 对`React`和`Vue`兼而并包

- 将组件的开发 和 在页面的展示进行分离，组件的开发体验一致，通过页面上的简单配置就可以决定组件是否延迟在浏览器端再渲染，同时带有组件错误重试机制，能够在服务端出现问题的时候有所补救。

再次感谢`React`、`Vue`、`Koa`、`webpack`等优秀的前端技术，正在这些新技术让当今的前端世界变得如此美好。

如果您在使用过程或阅读过程中有任何不快的地方，欢迎[吐槽](https://github.com/robinleej/billund/issues)。

* [安装](chapter1/README.md)
* [介绍](chapter2/README.md)
    * [项目结构](chapter2/project-config.md)
    * [组件](chapter2/widget.md)
    * [页面配置](chapter2/page.md)
    * [webpack-loader](chapter2/loader.md)
* [API文档](chapter3/README.md)
    * [服务端](chapter3/server-api.md)
    * [浏览器端](chapter3/browser-api.md)
* [高级配置](chapter4/README.md)
    * [renderPlugin](chapter4/renderplugin.md)

## 文档

`billund`提供了丰富的api，能够在很大程度上便利开发。
[文档戳我](https://robinleej.gitbooks.io/billund-books/content/)

## License

MIT



