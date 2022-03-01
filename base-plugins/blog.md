# 13组demo理解rollup 插件们

## 📖阅读本文，你将:
1. 对 `rollup` 有初步认识，理解它的主要使用场景。
2. 跟随作者一一了解那些**主流插件都能做什么**。（官方文档的一句话简介太难以理解了）
3. 收获一系列（13组） `demo` 源码，可以 `fork` 下来肆意摆弄。 

## 前言、有了 `webpack`, 为啥还需要 `rollup`

提到 `rollup` 它总是被提出来 `webpack` 进行比较，但真正使用过 `rollup` 的人却可以清晰地感受到，小巧轻便的它，真正的发力点和 `webpack` 并不相同：

`webpack` 的一个理念是“万物皆是模块”，在此理念下，`webpack` 具备强力的处理各类资源，构建 `web应用` 的能力，当前第 `version 5.x` 引入的“模块联邦”更是奠基了微应用时代的霸主地位。  

`rollup.js` 从一开始，就没有那样宏大的愿景，它描述自己是：“一个 `JavaScript` 模块打包器”。致力于“将小块的代码编译成大的复杂的代码”。

哪怕它后续也具备了各种各样的插件，但这些插件实际上也只是这个“`JavaScript` 模块打包器”能力的一些补充。

相比于 `webpack`，`rollup.js`的优势在于：  
1. `api` 简单，学习成本低。（这点难道不重要吗...`webpack` 学起来真的好难）  
2. 因为专注构建出的代码体积更小。（`rollup.js` 的构建结果就是纯纯的 `js`，并不会被 `__webpack_require__` 之类的代码增加代码量）  
3. 热门工具 `vite` 采用了它当生产构建工具。（最近各大厂都在纷纷试水 `vite` 落地，不能不说是个机会吧？）



如果你还不太清楚 `rollup.js` 构建出来的是什么，那倒也不妨先看看我之前的另一篇文章：[《说不清rollup能输出哪6种格式😥差点被鄙视》](https://juejin.cn/post/7051236803344334862)  

ok，闲言废语不多聊，让我们通过 `13组demo` 一一认识 `rollup.js` 生态里那些必不可少的核心插件，都有什么能力！

Demo地址：[https://github.com/zhangshichun/rollup-demos/tree/master/base-plugins](https://github.com/zhangshichun/rollup-demos/tree/master/base-plugins)

## 一、commonjs 插件

> 官方文档简介：将 CommonJS 模块转换为 ES6，这样它们就可以包含在 Rollup 包中。

![](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-02-25-01.png)

我给翻译一下：

> 虽然 `rollup.js` 默认支持的是 `esm` 格式的模块化，但有了它，你就能在项目里导入 `commonjs` 格式的文件/模块啦。

如果上面这句话还是让你似懂非懂，不太理解它到底解决了什么问题，没关系，春哥为你准备了一个 `demo`。  

Demo详解：

有两个文件，分别是 `index.js` 和 `answer.js`。  

首先是 `index.js`：

```js
import answer from "./answer";

export const printAnswer = () => {
  // 打印
  console.log(`the answer is ${answer}`)
}
```

然后是 `answer.js`：

```js
module.exports = 42
```

以上代码逻辑很简单，但仔细看的话，也存在一些问题：`answer.js` 的导出模式 `module.exports` 是 `commonjs` 格式的。  
当我们使用没有插件的 `rollup` 进行打包时(执行命令 `yarn build-commonjs-no-plugin`)，控制台会直接报错：

> Error: 'default' is not exported by commonjs/answer.js

意思很简单：`answer.js` 所使用的 `commonjs`的导出方式，决定了它无法被普通js正常 `import`。

因此就引出了一个问题：

> 应该如何导入 `commonjs` 格式的文件/模块？

答案便是：`@rollup/plugin-commonjs` 。

引入该插件后，进行打包（执行命令 `yarn build-commonjs`）。

![](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-02-25-02.png)

构建结果终于正常了！`commonjs` 格式的文件，也被构建到了产物之中。

## 二、node-resolve 插件

> 官方文档简介：使用 "node 解析算法" 来定位模块，用于使用 `node_modules` 中的第三方模块。

![](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-02-25-03.png)

看到这句总结，肯定有人很懵逼，什么是“node 解析算法”?

官方地址：[http://nodejs.cn/api/modules.html#all-together](http://nodejs.cn/api/modules.html#all-together)

它详细阐述了 `commonjs` 中关于 `require()` 方法的生效细节，及其伪代码。

中文伪代码翻译下核心内容：

```js
假设我们在 Y 路径下，使用了 require(X)

1. 假如 X 是 node 核心模块，直接返回该模块。
   // ↑ 比如 require('path')

2. 假如 X 以 '/' 作为开头，将 Y 设为文件根系统。
   // ↑ 存疑，待验证

3. 假如 X 以 './' 或 '../' 或 '/' 开头
  则：
    a. 执行方法：找文件(Y + X)  
    b. 执行方法：找文件夹(Y + X)
    c. 如果 a 和 b 都没找到，抛出错误
   // ↑ 关于相对路径的解释

4. 如果 X 以 '#' 开头，执行方法： 获取包导入(X, dirname(Y))

5. 执行方法：获取当前包(X, dirname(Y))

6. 执行方法：获取node模块(X, dirname(Y))

7. 抛出错误：not found

// 后面还有关于各种方法各种细节的描述，就不在本文细说了
```

说了这么多，这和 `@rollup/plugin-node-resolve` 有啥关系呢？很简单，因为上面描述的方式属于 `commonjs`，而 `rollup.js` 默认的文件定位方式属于 `esm`，中间存在一些差异。

比如：

> import a from './answer'

在 `@rollup/plugin-node-resolve` 插件的帮助下，才能成功命中：`'./answer/index.js'` 文件。

对照组：  
1. 没有`@rollup/plugin-node-resolve` 插件的构建（执行命令 `yarn build-node-resolve-no-plugin`）。  
> 报错：[!] Error: Could not resolve './answer' from node-resolve/index.js

2. 有`@rollup/plugin-node-resolve` 插件的构建（执行命令 `yarn build-node-resolve`）。构建成功！

## 三、babel 插件
> 官方简介：一个 `Rollup` 插件，用于 `Rollup` 和 `Babel` 之间的无缝集成。  

![](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-02-25-04.png)

这个倒是不难理解，熟悉 `Babel` 的同学应该很容易明白它的用途。  

翻译下：
> 使用本插件，可以通过 `Babel` 的能力将你所写的 `es6/es7` 代码编译转换为 `es5` 的，以适用那些更古老的浏览器。

demo讲解：  
在`index.js` 编写如下代码：
```js
const sleep = (timestamp) => {
  return new Promise((resolve) => {
    setTimeout(() => { resolve() }, timestamp)
  })
}

export const printAnswer = async () => {
  await sleep(3000)
  console.log('I am awake')
}
```
对照组：
1. 不使用 `@rollup/plugin-babel` 打包（执行 `yarn build-babel-no-plugin`）出来的代码：**基本没有变化，还是有 `async` 和 `await`** 。
2. 使用 `@rollup/plugin-babel` 打包（执行 `yarn build-babel`）出来的代码：**没有 `await` 和 `async` 了，编译成了兼容性更强的代码** 。

> `babel` 后的代码块太长了，有70行，就不截图了，感兴趣的朋友可下载 `demo` 自行编译。

## 四、alias 插件
> 官方简介：一个在构件包时定义“别名”的 `Rollup` 插件。

![](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-02-25-05.png)

一个很简单的功能，为啥官方总能做到说的不清不楚呢...(尤其是对那些不熟悉 `alias` 特性的新人)

好吧，我翻译一下：
> 使用这个插件，你可以在引入文件时，使用一个 `别名` 来代替那些固定的路径。

比如说，业界最常见的做法就是把 `项目根目录/src` 这个路径定义为别名 `@`。因此：  
`import "@/index.js"`便等价于 `import "项目根目录/src/index.js"` 。

demo详解：   
路径：`/a/b/answer.js`
```js
export default 42;
```
路径 `index.js`
```js
import answer from "@/answer"

export const printAnswer = async () => {
  console.log(`answer is ${answer}`)
}
```
很显然，不借助插件直接构建，是无法 `import` 到正确的 `answer.js`的。

对照组：  

1. 不使用 `@rollup/plugin-alias`，构建（执行命令 `yarn build-alias-no-plugin`）的产物： 

```js
import answer from '@/answer';

const printAnswer = async () => {
  console.log(`answer is ${answer}`);
};

export { printAnswer };
```
(很显然并没有将 `answer.js` 构建进来)

2. 使用 `@rollup/plugin-alias`，构建（执行命令 `yarn build-alias`）的产物：

```js
var answer = 42;

const printAnswer = async () => {
  console.log(`answer is ${answer}`);
};

export { printAnswer };
```
太棒了，正是我们所期望的！

## 五、beep 插件

> 官方简介：当构建结束错误时会发出嘟嘟声。

喜极而泣！终于遇到一个能清晰自身功能的“官方简介”！

![](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-02-25-06.png)

既然意思明了，那直接上 `demo`：  
`index.js`
```js
export const printAnswer = () => {
  await console.log(`answer is ${answer}`)
}
```
在普通函数里写 `await` 显然会触发构建错误。  

对照组：  
1. 不使用 `@rollup/plugin-beep` 插件，构建（执行命令 `yarn build-beep-no-plugin`）报错时会报错，但没有“嘟嘟”声。  
2. 使用 `@rollup/plugin-beep` 插件，构建（执行命令 `yarn build-beep`）报错时发出“嘟嘟”声。  
（想亲自验证的朋友注意了，直接在 `vscode` 终端内执行是没声音的，用系统命令行工具吧）

## 六、html 插件
> 官方简介：一个 `Rollup` 插件，它创建 `HTML` 文件来为 `Rollup` 构建的包提供服务。  

![](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-02-25-07.png)

我简单翻译下：
> 此插件可以创建一个 `HTML` 文件，并且在其中引用 `Rollup` 构建的包。

是不是清晰多了？  

这个功能性质的 `demo` 就不提供对照组了，执行：`yarn build-html`，产物中包含了一个 `index.html`：
```html

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Rollup Bundle</title>
    
  </head>
  <body>
    <script src="bundle.js" type="module"></script>
  </body>
</html>
```

## 七、inject 插件
> 官方简介：一个 Rollup 插件，用于扫描模块的全局变量，并在必要时注入`import`语句。

这个简介其实还算中规中矩。

我稍微翻译下：

> 你可以将一些模块定义为“全局变量”，在项目中使用时无需再写 `import` 语句。实际在构建时，此组件会发现它们并自动在文件中补全 `import` 语句。

比如，可以将 `lodash` 定义为全局变量 `_`，这样就可以随时随地地使用 `_.xxx`，并且在构建时，此插件会自动帮你补全：  
`import _ from 'lodash'`。

`demo`详解：  
`index.js`:
```js
export const printAnswer = () => {
  console.log(_.includes([1,2,3], 1))
}
```
以上直接使用了一个未曾定义的全局变量 `_`，正常构建肯定会报错。

对照组：  
1. 不使用`@rollup/plugin-inject` 插件，构建（执行 `yarn build-inject-no-plugin`）的构建产物：**代码毫无变化**。

2. 使用`@rollup/plugin-inject` 插件，构建（执行 `yarn build-inject`）的构建产物：
```js
import _ from 'lodash';

const printAnswer = () => {
  console.log(_.includes([1,2,3], 1));
};

export { printAnswer };
```
构建产物里，按需引入了`lodash`，非常智能。

## 八、multi-entry 插件

> 官方简介：一个 `Rollup` 插件，允许对一个 `bundle` 使用多个入口点。

官方简介其实表示的还挺明白的，多个入口的文件，可以打包到一个 `bundle` 之中。

demo详解：  
`a.js`
```js
export const printHello = () => {
  console.log('hello')
}
```
`b.js`
```js
export const printHello = () => {
  console.log('hello')
}
```
把 `rollup` 的配置文件也做一定改动：
```js
export default {
  input: [path.resolve(__dirname, './a.js'), path.resolve(__dirname, './b.js')],
  output: {
    dir: path.resolve(__dirname, 'out'),
    format: 'esm'
  },
};
```

对照组：
1. 不使用 `@rollup/plugin-multi-entry` 插件，在构建（执行命令 `yarn build-multi-entry-no-plugin`）之后，其产出为：
```js
out/a.js
// 和
out/b.js
```
是的，并没有被合并到一个 `bundle` 中。  

2. 使用 `@rollup/plugin-multi-entry` 插件，在构建（执行命令 `yarn build-multi-entry`）之后，其产出为：  
`out/multi-entry.js`
```js
const printHello = () => {
  console.log('hello');
};

const printWorld = () => {
  console.log('world');
};

export { printHello, printWorld };
```
构建结果完成了合并，两个入口的内容出现在了一个 `bundle` 之中。

## 九、replace 插件

> 官方简介：一个 Rollup 插件，在打包时替换文件中的目标字符串。

![](https://files.mdnice.com/user/23675/17eae556-59fc-4b6a-87c5-3841f287744b.png)

可以，官方简介很准确。

`demo`详解：  

假设一个场景：你希望每次访问页面时，都能快速知道本包是何时构建的，应该怎么做？

很简单，使用本插件： `@rollup/plugin-replace`。

只需要在代码中如下定义：

```js
window.buildTime = "__build_time__";
```
然后在 `rollup` 配置中通过 `@rollup/plugin-replace` 插件，将当前构建的时间戳格式化后赋值给 `__build_time__`，即可实现功能。

对照组：  
1. 不使用 `@rollup/plugin-replace` 插件，构建（执行命令 `yarn build-replace-no-plugin`）产物：

```js
window.buildTime = "__build_time__";
```
2. 使用 `@rollup/plugin-replace` 插件，构建（执行命令 `yarn build-replace`）产物：
```js
window.buildTime = "2022-02-23 22:11:04";
```
哈哈，同理，打组件包时，想知道构建 `version` 也可以用这个思路。

## 十、run 插件

> 官方简介：一个 `Rollup` 插件，一旦你的 `bundle` 被构建，它就会在 `nodejs` 中运行。

不错的官方简介！

这显然是为一些 `node` 脚本或者 `node` 服务订制的能力，构建后会立刻运行或启动一个服务。

demo详解：（这就不配对照组了）  
`index.js`:
```js
const printAnswer = () => {
  console.log('hello world')
}

printAnswer()
```
使用`@rollup/plugin-run` 插件构建（执行命令 `yarn build-run`）之后，控制台输出:
```bash
created run/out/bundle.js in 11ms
hello world
Done in 0.15s.
```
直接执行了构建内容，输出了 `hello world`。

## 十一、strip 插件

> 官方简介：一个 Rollup 插件，用于从代码中删除 `debugger` 语句和诸如 `assert.equal` 和 `console.log` 类似的函数。

emmm...很清晰的简介，点赞。

`demo` 详解：  
`index.js`
```js
export const printAnswer = () => {
  console.log('hello, boy')
  return 42;
}
```
对照组：
1. 不使用 `@rollup/plugin-strip` 插件，构建（`yarn build-trip-no-plugin`）产物：
```js
const printAnswer = () => {
  console.log('hello, boy');
  return 42;
};

export { printAnswer };
```

2. 使用 `@rollup/plugin-strip` 插件，构建（`yarn build-trip`）产物：
```
const printAnswer = () => {
  return 42;
};
export { printAnswer };
```
在生产构建时，这个插件还是很重要的，避免将一些 `debugger` 语句带入生产环境，毕竟 `console.log` 还是有性能开销的。

## 十二、url 插件
> 官方简介：一个 `Rollup` 插件，将文件导入为 `data-URIs` 或 `esm` 格式。

![](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-02-25-01.png)

这样说或者有些让人摸不着头脑，通过 `demo` 或许能更容易理解。

`demo` 详解：  
`index.js` 分别引入了两个 `.png` 格式文件，分别为：
```js
// test.png 7KB 大小
import test01 from './test.png'
// test02.png 16KB 大小
import test02 from './test02.png'
```
当没有 `@rollup/plugin-url` 支持时，构建（`yarn build-url-no-plugin`）行为一定会报错，因为 `js` 解析引擎无法解析 `.png` 格式的文件。  

但配上 `@rollup/plugin-url` 插件后，结果会怎样呢？  

```
var test01 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOcAAAD2CAYAAAAtfpAeAAAAAXNS...(略)";

var test02 = "7822ffd3c90c0d9c.png";
```
对于两张图片的处理居然并不相同！  
为什么呢？  
官方文档解释：
> 内联文件的文件大小限制。如果一个文件超过这个限制(默认14KB)，它将被复制到目标文件夹，并提供散列文件名。

因此， `test02.png` 被复制到了目标文件夹，并提供了一个新的基于散列的名称，而且导入的 `test02` 并不是文件，而是该文件的路径。

那么 `test` 呢？

`test` 是作为 `data URIs` 被导入的，关于这种格式,想详细了解的可以访问此文档查看:
[http://nodejs.cn/api/esm.html#data-imports](http://nodejs.cn/api/esm.html#data-imports) 

简单来说，通过这种形式将 `文件` 作为内联形式引入，可以减少网络请求的次数，提升页面加载速度。

（这也是为什么此插件针对小文件和大文件要采取不一样的策略的原因。）

## 十三、post-css 插件
(非rollup官方仓库直接推荐的插件)地址：[https://github.com/egoist/rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss)
> 官方简介：`Rollup` 和 `PostCSS` 之间的无缝集成。

为什么要推荐这个插件？因为它太强了！

它不仅仅是一个插件这么简单，因为使用它，你可以获得 `PostCSS` 整个社区的生态力量。

众所周知，`PostCSS` 本身就拥有自己的`插件系统`，在集成本插件之后，你将可以导入各种 `postcss 插件`，完成关于 `css` 的各种复杂操作。
![](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-02-26-01.png)
**ALL IN ONE! AMAZING!**  

`demo` 详解：
`index.js`
```js
import './style.scss'
export const printAnswer = () => {
  console.log('answer is 42')
}
```
`style.scss`
```scss
.bg {
  color: red;
  
  .title {
    color: black;
  }
}
```
因为 `rollup.js` 本身是不支持 `css` 格式的，更是不支持 `scss` 格式的。

因此我们的思路是：

构建时引入 `rollup-plugin-css` 插件，并通过配置让它支持 `scss` 的编译和链接支持。

```js
export default {
  ...
  plugins: [
    postcss({
      extract: true,  // css通过链接引入
      use: ["sass"],  // 编译 sass
    })
  ],
  ...
};
```

执行命令: `yarn build-post-css`

输出：
`bundle.css`
```css
.bg {
  color: red;
}
.bg .title {
  color: black;
}
```
完美。

## 十四、那些未提供 `demo` 的插件

因为本文篇幅有限，很多“官方推荐”的插件也并未能全部提供插件，其中以“格式解析”类为主，比如：
1. `@rollup/plugin-dsv`
2. `@rollup/plugin-graphql`
3. `@rollup/plugin-image`
4. `@rollup/plugin-json`
5. `@rollup/plugin-wasm`
6. `@rollup/plugin-yaml`

以上这些都专注于解决一件事：“之前 `rollup` 不支持 `xx` 格式的文件，现在我想办法让它支持”。  
 
当我们需要使用时，看看文档，通常就能很快上手，没啥理解难度。

> 除此之外，还有一些比较冷门的插件，也没列出来细说。

## 十五、地址汇总：

1. 我的另一篇 `rollup` 相关文章：《说不清rollup能输出哪6种格式😥差点被鄙视》[https://juejin.cn/post/7051236803344334862](https://juejin.cn/post/7051236803344334862)

2. `@rollup/plugins` 官方 `github`：[https://github.com/rollup/plugins](https://github.com/rollup/plugins)

3. 本文 `demo` 地址：[https://github.com/zhangshichun/rollup-demos/tree/master/base-plugins](https://github.com/zhangshichun/rollup-demos/tree/master/base-plugins)

4. `rollup-plugin-postcss`地址：[https://github.com/egoist/rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss)

## 十六、结束语

我是`春哥`。  
大龄前端打工仔，依然在努力学习。  
我的目标是给大家分享最实用、最有用的知识点，希望大家都可以早早下班，并可以飞速完成工作，淡定摸鱼🐟。

你可以在**公众号**里找到我：`前端要摸鱼`。
