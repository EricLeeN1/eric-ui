## 关于 `package.json`

### 一、根目录 `package.json`

- `private: true`：根目录在 `monorepo` 模式下只是一个管理中枢，它不会被发布为 ```npm``` 包。
- `devDependencies`：所有模块都会有一些公共的开发依赖，例如构建工具、TypeScript、Vue、代码规范等，将公共开发依赖安装在根目录可以大幅减少子模块的依赖声明。

### 二、组件包的 `package.json`

- `name`：组件统一发布到 @gt-ui 坐标下，有坐标限制了命名空间，组件的名称可以尽可能简单。
- `files`：我们规定每个包的产物目录为 `dist`，此外还要一并发布 `README.md` 文档。
- `publishConfig`：如果我们需要发布到私有 npm 仓，请取消 `publishConfig` 的注释并根据实际情况填写。
- `peerDependencies`: 既然是使用 `vue3` 的组件库，我们需要正确声明主框架的版本。这里不将 `vue` 放入 `dependencies` 是因为用户项目同样也直接依赖 vue 框架，这样可能造成依赖版本不同的风险。这就是为什么周边库、插件总是要把主框架声明为 `peerDependencies` 的原因，我们的组件库也不例外。
- `dependencies`：项目的运行依赖都安装在这里。一般不容易或是不介意出现版本冲突的依赖都放在这里。比如 `lodash` 这样的工具方法库，即使版本冲突出现多实例的现象，也不会出现问题。
- `devDependencies`：大部分开发依赖都会被定义在根目录下，这里只会声明特有的、本模块专属的开发依赖。比如某个特定的 `Vite` 插件。

### 三、项目文档的 `package.json`
- ```private: true```：项目文档的 ```packages.json``` 与根目录类似，它同样不需要被发布到 ```npm``` 仓库。
- ```dependencies``` 和 ```devDependencies```：由于不涉及发包，因此依赖声明无需仔细考量，安装到那个里面效果都是一样的。不过还是建议大家还是按照“实际的含义”来决定安装类型。

### 四、```pnpm``` 的 ```resolve-peers-from-workspace-root``` 机制

    因为几乎所有子包的 peerDependencies 中都具有 vue(peerDependencies)我们结合 pnpm 的 resolve-peers-from-workspace-root 机制，可以统一所有子包中 vue 的版本。在执行这一步前，建议删除 node_modules 目录以及 pnpm-lock.yaml 文件，确保依赖重新被解析安装。
    默认为 true。 启用后，将会使用根工作区项目的 dependencies 解析工作区中任何项目的 peer dependencies。这是一个有用的功能，因为你可以只在工作区的根目录中安装 peer dependencies，并且确保工作区中的所有项目都使用相同版本的 peer dependencies。

### 依赖包

- ```Vite``` 和 ```TypeScript```  进行构建
- ```@vitejs/plugin-vue``` 由于我们要构建的是 Vue 组件库，Vue 推荐的组件开发范式 单文件组件 SFC 并不是原生的 Web 开发语法，而是 Vue 方面定义的“方言”，需要经过一个编译为原生 js 的过程。这个插件集成了 vue 编译器的能力，使得构建工具能够理解 Vue SFC 模板。

