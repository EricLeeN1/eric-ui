## 关于 `package.json`

### 一、根目录 `package.json`

- `private: true`：根目录在 `monorepo` 模式下只是一个管理中枢，它不会被发布为 `npm` 包。
- `devDependencies`：所有模块都会有一些公共的开发依赖，例如构建工具、TypeScript、Vue、代码规范等，将公共开发依赖安装在根目录可以大幅减少子模块的依赖声明。

### 二、组件包的 `package.json`

- `name`：组件统一发布到 @ericui 坐标下，有坐标限制了命名空间，组件的名称可以尽可能简单。
- `files`：我们规定每个包的产物目录为 `dist`，此外还要一并发布 `README.md` 文档。
- `publishConfig`：如果我们需要发布到私有 npm 仓，请取消 `publishConfig` 的注释并根据实际情况填写。
- `peerDependencies`: 既然是使用 `vue3` 的组件库，我们需要正确声明主框架的版本。这里不将 `vue` 放入 `dependencies` 是因为用户项目同样也直接依赖 vue 框架，这样可能造成依赖版本不同的风险。这就是为什么周边库、插件总是要把主框架声明为 `peerDependencies` 的原因，我们的组件库也不例外。
- `dependencies`：项目的运行依赖都安装在这里。一般不容易或是不介意出现版本冲突的依赖都放在这里。比如 `lodash` 这样的工具方法库，即使版本冲突出现多实例的现象，也不会出现问题。
- `devDependencies`：大部分开发依赖都会被定义在根目录下，这里只会声明特有的、本模块专属的开发依赖。比如某个特定的 `Vite` 插件。

### 三、项目文档的 `package.json`

- `private: true`：项目文档的 `packages.json` 与根目录类似，它同样不需要被发布到 `npm` 仓库。
- `dependencies` 和 `devDependencies`：由于不涉及发包，因此依赖声明无需仔细考量，安装到那个里面效果都是一样的。不过还是建议大家还是按照“实际的含义”来决定安装类型。

### 四、中枢管理操作

1、`pnpm init`

创建一个 `package.json` 文件。

2、`pnpm config set <key> <value>` 设置用户的全局 `.npmrc` 配置,也可以放在项目根目录下，只不过配置只在当前项目目录下生效，优先级高于用户设置的本地配置。

3、`pnpm install`

根据当前目录 ```package.json``` 中的依赖声明安装全部依赖，在 workspace 模式下会一并处理所有子模块的依赖安装。
更新package.json以后执行 ```pnpm -w i```更新依赖

4、```pnpm install -w D xxx```

- 安装项目公共开发依赖，声明在根目录的 package.json - devDependencies 中。```-w``` 选项代表在 ```monorepo``` 模式下的根目录进行操作。
- 每个子包都能访问根目录的依赖，适合把 ```TypeScript```、```Vite```、```eslint``` 等公共开发依赖装在这里。

5、```pnpm uninstall -w xxx```

 卸载公共依赖，在根目录的 ```package.json``` - ```devDependencies``` 中删去对应声明

6、```pnpm run xxx```

执行根目录的 ```package.json``` 中的脚本


### 五、子包管理操作

在 ```workspace``` 模式下，```pnpm``` 主要通过 ```--filter``` 选项过滤子模块，实现对各个工作空间进行精细化操作的目的。

1. 为指定模块安装外部依赖。

- 下面的例子指为 ```a``` 包安装 ```lodash``` 外部依赖。
- 同样的道理，```-S``` 和 ```-D``` 选项分别可以将依赖安装为正式依赖(```dependencies```)或者开发依赖(```devDependencies```)。

```bash

# 为 a 包安装 lodash
pnpm --filter a i -S lodash
pnpm --filter a i -D lodash

```

2. 指定内部模块之间的互相依赖。

- 指定模块之间的互相依赖。下面的例子演示了为 ```a``` 包安装内部依赖 ```b```。

```bash

# 指定 a 模块依赖于 b 模块
pnpm --filter a i -S b

```

```pnpm``` ```workspace``` 对内部依赖关系的表示不同于外部，它自己约定了一套 ```Workspace 协议 (workspace:)```。下面给出一个内部模块 ```a``` 依赖同是内部模块 ```b``` 的例子。

```json
{
  "name": "a",
  // ...
  "dependencies": {
    "b": "workspace:^"
  }
}
```

在实际发布 ```npm``` 包时，```workspace:^``` 会被替换成内部模块 ```b``` 的对应版本号(对应 ```package.json``` 中的 ```version``` 字段)。替换规律如下所示：

```json
{
  "dependencies": {
    "a": "workspace:*", // 固定版本依赖，被转换成 x.x.x
    "b": "workspace:~", // minor 版本依赖，将被转换成 ~x.x.x
    "c": "workspace:^"  // major 版本依赖，将被转换成 ^x.x.x
  }
}
```

3. 过滤的高级用法

- 用 ```--filter``` 过滤出目标工作空间集合后，不仅支持 ```install``` ```安装依赖，run```(执行脚本)```、publish```(发布包) 等绝大多数包管理操作都能够执行。

```bash

# 发布所有包名为 @a/ 开头的包
pnpm --filter @a/* publish

```

- 当 ```--filter``` 筛选出多个包时，默认情况下，它会首先分析多个包之间的内部依赖关系，按照依赖关系拓扑排序的顺序对这些包执行指令，即按依赖树从叶到根的顺序。

- ```--filter``` 的还有更多超乎我们想象的能力，它支持依赖关系筛选，甚至支持根据 ```git``` 提交记录进行筛选。
```bash

# 为 a 以及 a 的所有依赖项执行测试脚本
pnpm --filter a... run test
# 为 b 以及依赖 b 的所有包执行测试脚本
pnpm --filter ...b run test

# 找出自 origin/master 提交以来所有变更涉及的包
# 为这些包以及依赖它们的所有包执行构建脚本
# README.md 的变更不会触发此机制
pnpm --filter="...{packages/**}[origin/master]"
  --changed-files-ignore-pattern="**/README.md" run build

# 找出自上次 commit 以来所有变更涉及的包
pnpm --filter "...[HEAD~1]" run build

```

### 公共方法代码预备

- `pnpm --filter @ericui/shared i -S lodash @types/lodash`

### 声明内部模块关联

- 方法 1：`pnpm --filter @ericui/button i -S @ericui/shared`
- 方法 2：我们也可以先在子模块下的 `package.json` 中按照 `workspace` 协议 手动声明内部依赖，然后通过 `pnpm -w i` 执行全局安装，也能达到和上面那条命令一样的效果，两种方式二选一即可。

### 六、依赖包

#### 1、基础安装包

- ```pnpm i -wD vite typescript```
 `Vite` 和 `TypeScript` 进行构建
- ```pnpm i -wD @vitejs/plugin-vue```
 `@vitejs/plugin-vue` 由于我们要构建的是 Vue 组件库，Vue 推荐的组件开发范式 单文件组件 SFC 并不是原生的 Web 开发语法，而是 Vue 方面定义的“方言”，需要经过一个编译为原生 js 的过程。这个插件集成了 vue 编译器的能力，使得构建工具能够理解 Vue SFC 模板。
- ```pnpm i -wS vue```
 另外需要注意，vue 应该被安装到根目录下的 dependencies。
- ```pnpm i -wD sass``` 
 如果我们喜欢用 CSS 预处理器 的话，也要在根目录下进行安装，这里我选择安装 Sass。大家也可以根据自己的偏好选择 Less 或者 Stylus。

#### 2、`pnpm` 的 `resolve-peers-from-workspace-root` 机制

- 因为几乎所有子包的 peerDependencies 中都具有 vue(peerDependencies)我们结合 pnpm 的 resolve-peers-from-workspace-root 机制，可以统一所有子包中 vue 的版本。在执行这一步前，建议删除 node_modules 目录以及 pnpm-lock.yaml 文件，确保依赖重新被解析安装。
- 默认为 true。 启用后，将会使用根工作区项目的 dependencies 解析工作区中任何项目的 peer dependencies。这是一个有用的功能，因为你可以只在工作区的根目录中安装 peer dependencies，并且确保工作区中的所有项目都使用相同版本的 peer dependencies。

### 七、Vite 集成

#### 1、三个步骤

- 编写构建目标源码。因为文章的重点是工程化而非组件库的开发，代码预备部分我们不会实现组件的实际功能，只给出能够体现构建要点的 ```demo``` 代码。
- 准备 ```vite.config``` 配置文件。
- 在 ```package.json``` 中设置构建脚本。

#### 2、公共方法代码预备

我们安排 ```@ericui/shared``` 作为公具方法包，将成为所有其他模块的依赖项。

以自有方法和外部方法lodash为例。我们创建一个打印 ```HelloWorld``` 方法并且要导出一个方法 ```useLodash``` ，这个方法原封不动地返回 ```lodash``` 实例对象。```index.ts``` 会作为出口统一导出这些方法。

```bash

# 为 shared 包安装 lodash 相关依赖
pnpm --filter @ericui/shared i -S lodash @types/lodash

```

#### 3、构建 Vue 组件模块

  将 ```package.json``` 中的 ```build``` 命令更换为 ```vite build```。


```javascript

// packages/button/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // 增加插件的使用
  plugins: [vue()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'EricuiButton',
      fileName: 'ericui-button',
    },
    minify: false,
    rollupOptions: {
      external: [
        // 除了 @ericui/shared，未来可能还会依赖其他内部模块，不如用正则表达式将 @ericui 开头的依赖项一起处理掉
        /@ericui.*/, 
        'vue'
      ],
    },
  }
})

``` 

之后执行 ```button``` 包的构建命令，输出产物。

构建成功后，根据产物路径修改 ```package.json``` 的入口字段。

```javascript
// packages/button/package.json
{
  // 省略其他无关配置 ...
  "main": "./dist/ericui-button.umd.js",
  "module": "./dist/ericui-button.mjs",
  "exports": {
    ".": {
      "require": "./dist/ericui-button.umd.js",
      "module": "./dist/ericui-button.mjs",
      // ...
    }
  },
}
```







### 执行 shared 包的构建指令

- `pnpm --filter @ericui/shared run build`