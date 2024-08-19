## 一、技术栈：
- pnpm 为工程提供包管理服务。
- Vue 作为组件库的框架基础。
- Vite 作为主力构建工具。
- TypeScript 提供类型支持。
- VitePress 搭建文档示例网站。
- Vitest 处理单元测试。
- Playwright 处理 E2E 测试。
- 规范系列工具：ESLint、Stylelint、commitlint 等。
- 保证脚本代码规范的 ESLint。
- 保证样式代码规范的 Stylelint。
- 保证代码提交规范的 commitlint。
- 设置编码风格的 Prettier。
- Changesets 处理版本发布。
- Github Actions 提供持续集成服务。


这里提示一个小技巧，在 Github 的代码仓页面，给域名中的 github 加上 1s 后缀，就可以前往在线版的 VSCode 编辑器浏览代码，获得更好的体验。这个功能是来自于开源项目 github1s。

- https://github.com/element-plus/element-plus
+ https://github1s.com/element-plus/element-plus


## 二、模块儿划分：

- components 包，作为组件库的主要代码，实现各个 UI 组件的核心逻辑。
- shared 包，主要存放各种杂七杂八的工具方法。
- plugins 包，可以实现组件库的周边插件(比如构建工具插件等)。
- theme 包，实现组件库的主题样式定制方案。
- cli 包，实现组件库模板脚手架的命令行工具。
- docs 包，组件库的示例 demo 与使用文档。
- playground 包，组件库的在线编辑、演示应用。

## 三、package.json 基础信息

    {
    		// name 是区分 npm 包的唯一标识。当一个 npm 仓库中的包被安装到本地，我们能通过名称引用，而不必写复杂的 node_modules/... 引入路径就是得益于此。
        "name": "vue",
        // 一句话简介，可以作为关键字搜索的依据
        "description": "The progressive JavaScript framework for building modern web UI.",
        // 关键字、标签，正确设置可以提高在 npm 的搜索权重与曝光度
        "keywords": ["vue"],
        // 包的作者，主要 Owner
        "author": "Evan You",
        // 开源许可证
        "license": "MIT",
        // 项目主页
        "homepage":
        "https://github.com/vuejs/core/tree/main/packages/vue#readme",
        // 源码仓库
        "repository": {
        "type": "git",
        "url": "git+https://github.com/vuejs/core.git"
        },
        // BUG 反馈方式，支持 `bugs.email` 邮箱字段
        "bugs": { 
        "url" : "https://github.com/vuejs/core/issue"
        },
        // version 字段表示包的版本号，大致符合 x.x.x 的格式，严格来说应该叫 major.minor.patch(主版本号.次版本号.修订号)，如果要进一步了解版本号相关的知识，我们可以阅读以下文章来详细了解什么是语义化版本。
        "version": "2.0.0",
        // files 指定了发布为 npm 包时，哪些文件或目录需要被提交到 npm 服务器中
        "files": [
        "LICENSE",
        "README.md",
        "dist"
      	],
      	// private 用于指定项目是否为私有包。当我们的项目不想被意外发布到公共 npm 仓库时，就设置 private: true。
        // 根目录在 monorepo 模式下只是一个管理中枢，它不会被发布为 npm 包。需要设置为true
      	"private": false,
      	// 当我们的项目需要发布到私有的 npm 仓库时(比如公司内网的仓库)，需要设置 publishConfig 对象。
      	"publishConfig": {
        "registry": "https://mynpm.com",
      	},
    }

## 四、版本约束


​			major.minor.patch(主版本号.次版本号.修订号)

- ^ 的含义是安装最新的 minor 版本。例如 ^1.2.0 的约束下，会为项目安装最新的 minor 版本 1.X.Y，但不会安装下一个 major 版本 2.0.0。
- ~ 的含义是安装最新的 patch 版本。例如 ~1.2.0 的约束下，会为项目安装最新的 patch 版本 1.2.X，但不会安装下一个 minor 版本 1.3.0。
- 如果版本号前面没有任何标识符，表示固定版本号，无论如何都只安装这个固定版本。

dependencies会被安装会被安装

|     依赖类型     |   项目中   |                            依赖中                            |                             用途                             |
| :--------------: | :--------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|   dependencies   |  会被安装  |                           会被安装                           |                        项目运行时依赖                        |
| devDependencies  |  会被安装  |                          不会被安装                          | 项目在开发过程需要的依赖。一般构建工具、测试框架、代码规范工具都会被作为开发依赖 |
| peerDependencies | 不会被安装 | 不会被安装。但是若其中声明的依赖没有被项目安装，或者版本不匹配时，会生成警告信息提示用户 | 定义项目需要的依赖环境。常用于表示插件和主框架的关系，如 `@vitejs/plugin-vue` 的 `peerDependencies` 中就声明了主框架 `vite` 和 `vue` |
devDependencies 根目录中的开发依赖代表所有模块都会有一些公共的开发依赖，例如构建工具、TypeScript、Vue、代码规范等，将公共开发依赖安装在根目录可以大幅减少子模块的依赖声明。

- 表格中的 `项目中` 理解为依赖信息被定义在我们正在开发的模块，对应根目录下的 `package.json` 中；

- `依赖中` 理解为依赖信息被定义在 `node_modules` 内的依赖包中(即依赖的依赖)，对应 `node_modules/${packageName}/package.json`。

生成代码片段

    "": {
      "prefix": "",
      "body": [
        ""
      ],
      "description": ""
    }

## 五、安装公共依赖


每个包都用的依赖即公共开发依赖统一安装在根目录下，是可以被各个子包正常使用的

  pnpm i -wD vite typescript

为单独一个包安装依赖

  pnpm --filter @ericui/shared i -S lodash @types/lodash

给其他包安装本地依赖

  pnpm --filter @ericui/button i -S @ericui/shared