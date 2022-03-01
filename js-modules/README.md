# rollup输出的6种格式
  
## 学习本文 📖
你将：
1. 弄明白rollup输出的6种格式，了解它们之间的关系和使用场景。
2. 获得一份最简单的 `rollup.js` 打包 `demo` 一份。
3. 这份 `demo` 还为每个打包结果准备了一个可执行 `demo of demo`

## 为什么要学这个？
伴随着 `vite.js` 越来越火，它也变成了工作生产和**面试问答**时被经常提及的问题。  

众所周知，`vite.js` 构建的核心是 `rollup.js`。  

那为什么在学习它们之前，有必要先学习 `js` 模块化规范？  

因为我们需要理解它们最终的产物是什么，是如何运作的。  

“崇拜魔法”是编程学习者的大忌，“好奇心”才是我们成长与进步的阶梯。  

让我们解开神秘的面纱，看看那些打包后的代码，都是些“什么玩意儿”！

## DEMO与示例构建
> 请配合 `demo` 食用，你会收获更多！  

我为本文构建了一个简单的 `demo` 实例，源码就放在 `github` 上。

`demo` 地址： [https://github.com/zhangshichun/rollup-demos/tree/master/js-modules](https://github.com/zhangshichun/rollup-demos/tree/master/js-modules)

`demo` 的代码结构如下：

```bash
├── answer.js
├── index.js
├── out
├── package.json
├── rollup.config.js
└── yarn.lock
```
其中 `index.js` 和 `answer.js` 属于业务代码，是需要被打包的对象。在 `index.js` 中依赖了 `answer.js`。  
如下：
```js
// answer.js
export default 42

// index.js
import answer from "./answer";
import { repeat } from 'lodash'
// 定义一个无用变量, 测试 tree-shaking
const unusedVar = 'May the 4th'

export const printAnswer = () => {
  // 打印
  console.log(`the answer is ${answer}`)
  // 测试 lodash 的能力，打印42个1
  console.log(repeat('1', answer))
}
```
`rollup.config.js` 是 `rollup` 的配置文件，在此文件中我们分别指定其输出 `amd` , `cjs` , `esm` , `iife` , `umd` , `system` 六种格式的文件。  

输出的文件会被打包到 `out` 文件夹下。  

当我们执行 `yarn build` 或者 `npm build` 之后，会在 `out` 下产生如下格式的代码：

```bash
├── out
│   ├── amd
│   │   └── bundle.js
│   ├── cjs
│   │   └── bundle.js
│   ├── ems
│   │   └── bundle.js
│   ├── iife
│   │   └── bundle.js
│   ├── system
│   │   └── bundle.js
│   └── umd
│       └── bundle.js
```
为了弄清楚每种格式的 `bundle.js` 文件是如何运作的，我专门为它们订制添加了一些附属的小 `demo`。

接下来，就让我们一种格式一种格式地学习和分析吧。
![勇敢牛牛](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-01-09-11.png)
## 一、IIFE 自执行函数
> IIFE 的全称是 “immediately invoked function expression”。  

### 1.1 打包结果分析
让我们先看看本 `demo` 的 `iife` 格式打出来的包长什么样。

![IIFE](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-01-08-06.png)

对上述代码做一些简化：
```javascript
var Test = (function (exports, lodash) {
  'use strict'; // 自带严格模式，避免一些奇怪的兼容性问题

  /**
   * 下面折行无用代码被 tree-shaking 掉了
   * const unusedVar = 'May the 4th'
   * */

  var answer = 42; // 业务中被单一引用的模块，被直接抹平了

  const printAnswer = () => {
    console.log(`the answer is ${answer}`);

    console.log(lodash.repeat('1', answer));
  };

  exports.printAnswer = printAnswer; // 把要export的属性挂在到exports上

  return exports;

})({}, $); // exports是第一个入参，依赖的jquery是第二个入参

```

`IIFE` 是前端模块化早期的产物，它的核心思路是:  
1. 构建一个匿名函数
2. 立刻执行这个匿名函数，对外部的依赖通过入参的形式传入
3. 返回该模块的输出

### 1.2 如何运行
`IIFE` 的运行其实很容易，如果它没有其他依赖，只需要去引入文件，然后在 `window` 上取相应的变量即可。  
如：

```html
  <script src="http://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
  <script> 
    // jquery 就是典型的自执行函数模式，当你引入后，他就会挂在到 window.$ 上
    window.$ // 这样就能取到 jquery 了
  </script>

```
但是如果你像本 `demo` 中那样依赖了其他的模块，那你就必须保证以下两点才能正常运行：  
  1. 此包所依赖的包，已在此包之前完成加载。
  2. 前置依赖的包，和 `IIFE` 只执行入参的变量命名是一致的。

以本 `demo` 的 `IIFE` 构建结果为例：
  1. 它前置依赖了 `lodash`，因此需要在它加载之前完成 `lodash` 的加载。
  2. 此 `IIFE` 的第二个入参是 `lodash`，作为前置条件，我们需要让 `window.lodash` 也指向 `lodash`。
因此，运行时，代码如下：
```html
<head>
  <script src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
  <script>window.lodash = window._</script>  
  <script src="./bundle.js"></script>
</head>
<body>
  <script>
    window.Test.printAnswer();
  </script>
</body>
```
### 1.3 优缺点

  - 优点:
    1. 通过闭包营造了一个“私有”命名空间，防止影响全局，并防止被从外部修改私有变量。
    2. 简单易懂
    3. 对代码体积的影响不大
  - 缺点：
    1. 输出的变量可能影响全局变量；引入依赖包时依赖全局变量。
    2. 需要使用者自行维护 `script` 标签的加载顺序。

优点就不细说了，缺点详细解释一下。

**缺点一：输出的变量可能影响全局变量；引入依赖包时依赖全局变量**。

前半句：**输出的变量可能影响全局变量;** 其实很好理解，以上面 `demo` 的输出为例： `window.Test` 就已经被影响了。  
这种明显的副作用在程序中其实是有隐患的。  

后半句：**引入依赖包时依赖全局变量；** 我们为了让 `demo` 正常运行，因此加了一行代码让 `window.lodash` 也指向 `lodash`，但它确实是太脆弱了。

```html
<!-- 没有这一行，demo就无法正常运行 -->
<script>window.lodash = window._</script>
```
你瞧，`IIFE` 的执行对环境的依赖是苛刻的，除非它完全不依赖外部包。（Jquery: 正是在下！）  

虽然 `IIFE` 的缺点很多，但并不妨碍它在 `Jquery` 时代极大地推动了 `web` 开发的进程，因为它确实解决了 `js` 本身存在的很多问题。  

那么？后续是否还有 **更为优秀** 的前端模块化方案问世呢？

当然有，往下看吧。

## 二、CommonJS
### 2.1 分析打包结果
先看看 `CommonJs` 打包的结果:  
![cjs](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-01-08-5.png)
简化一下，就长这样了：  
```js
'use strict';

var lodash = require('lodash');

var answer = 42;

const printAnswer = () => {
  // 打印
  console.log(`the answer is ${answer}`);
  // 测试 lodash 的能力，打印42个1
  console.log(lodash.repeat('1', answer));
};

exports.printAnswer = printAnswer;

```
以上格式，就是 `CommonJS` 规范的写法。  

```js
// CommonJS 通过一个全局 require 方法进行模块的引入 
var lodash = require('lodash');
// CommonJS 进行模块内方法输出的方式
module.exports.printAnswer = printAnswer;
// 上面写法也等价于：
exports.printAnswer = printAnswer;
// 因为 exports 变量等价于 module.exports
```

为了解决 `node.js` 在模块化上的缺失， **2009年10月** `CommonJS` 规范首次被提出。  

注意这个关键词： **node.js**。

是的，`CommonJS` 并不是在浏览器环境运行的规范，而是在 `node.js` 环境下运行的。
### 2.2 如何运行
因此，我写了一个 `run.js` 脚本。
如下：
```js
// run.js
const Test = require('./bundle-by-lodash')
Test.printAnswer()
```
然后，执行以下命令：
```bash
# 执行脚本
node ./out/cjs/run.js 
# 输出1： 
> the answer is 42
# 输出2： 
> 111111111111111111111111111111111111111111
```
可以看出，`node.js` 环境是天然支持 `CommonJS` 的。

### 2.3 优缺点
 - 优点
 1. 完善的模块化方案，完美解决了 `IIFE` 的各种缺点。

 - 缺点
 1. 不支持浏览器环境，因为这种同步的引入方式可能导致浏览器假死。

因此，前端界迫切地需要一种能在浏览器环境完美运行，完善的模块化方案。

## 三、AMD 和 requirejs !
> AMD，YES!

2011年， `amdjs-api` 在业内被正式提出。

### 3.1 打包结果分析
amd 格式的打包结果如下：
![amd,yes!](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-01-08-03.png)
可以看到，核心内容是一个全局方法 `define` 。

`define` 方法有三个入参，分别是：
 - `"Test"`, 模块名称
 - `[`exports`, `lodash`]` 分别表示模块的输出和外部依赖
 - 一个以 `exports` 和 `lodash` 作为入参的方法，代表模块的实际内容。

相比于 `IIFE` 和 `CommonJs` 而言，`AMD` 的写法无疑是复杂且别扭的。  

但它却实实在在是解决了 `IIFE` 和 `CommonJS` 所面临的问题，对“浏览器里完善的JS模块方法” 提供了一套完善的方案。  

尤其是 `amd` 标准的实现方案：`requirejs`。

`requirejs` 所实现的 `AMD` 不仅解决了 `CommonJS` 在浏览器端的不适，通过异步的方式进行模块加载实现了不会导致假死的能力；更是完全弥补了 `IIFE` 存在的各类缺陷。  

`requirejs` 在使用时，一般情况下是以下四步法：
1. 在浏览器内引入 `require.js`
2. 通过 `requirejs.config` 方法定义全局的依赖
3. 通过 `requirejs.define` 注册模块
4. 通过 `requirejs()` 完成模块引入。

### 3.2 如何运行
在 `out/amd` 打包目录下的 `index.html` 里，按如下方式编排代码：  
```html
<head>
  <!-- 1. 引入 require.js -->
  <script src="./require.js"></script>
  <!-- 2. 定义全局依赖 -->
  <script>
    window.requirejs.config({
      paths: {
        "lodash": "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min"
      }
    });
  </script>
  <!-- 3. 定义模块 -->
  <script src="./bundle.js"></script>
</head>
<body>
  <script>
    // 4. 开销模块
    window.requirejs(
      ['Test'],
      function   (test) {
        test.printAnswer()
      }
    );
  </script>
</body>
```
打开浏览器，我们可以正常地看到]控制台里被打印出来的 `42` 和 `42个1` 了。

### 3.3 优缺点
 - 优点
  1. 解决了 `CommonJS` 的缺点
  2. 解决了 `IIFE` 的缺点
  3. 一套完备的浏览器里 `js` 文件模块化方案
 - 缺点
  1. 代码组织形式别扭，可读性差

但好在我们拥有了各类打包工具，浏览器内的代码可读性再差也并不影响我们写出可读性ok的代码。  

现在，我们拥有了**面向 `node.js` 的 `CommonJs`** 和 **面向浏览器的 `AMD`** 两套标准。  

如果我希望我写出的代码能同时被**浏览器**和**nodejs**识别，我应该怎么做呢？

## 四、UMD 伟大的整合
> 它没有做什么突破性的创造，但它是集大成者。  

### 4.1 打包分析
`umd` 格式构建出来的代码的可读性进一步降低了。

我相信任何正常人看到下面这段代码都会感到一阵头大：

![umd bundle](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-01-07-04.png)

是的，整整一大段代码，只是在处理兼容性问题，判断当前应该使用 `amd` 亦或是 `CommonJS`。

因此 `umd` 的代码和实现不在此进行过多分析，它所做的无非便是让同一段代码兼容了 `amd` 和 `CommonJS`。

### 4.2 如何运行？
- 在浏览器端，它的运行方式和 `amd` 完全一致，可以完全参考 `3.2` 节的 `demo`。 
- 在node.js端，它则和 `CommonJS` 的运行方式完全一致，在此就不赘述了。

### 4.3 优缺点
- 优点
  1. 抹平了一个包在 `AMD` 和 `CommonJS` 里的差异
- 缺点
  1. 会为了兼容产生大量不好理解的代码。（理解难度与包体积）


虽然在社区的不断努力下，`CommonJS` 、 `AMD` 、 `UMD` 都给业界交出了自己的答卷。  

但很显然，它们都是不得已的选择。

浏览器应该有自己的加载标准。

`ES6` 草案最终版里，虽然描述了模块应该如何被加载，但它没有 “加载程序的规范”。

## 五、SystemJs
因此 `WHATWG（Web Hypertext Application Technology Working Group）` 即网页超文本应用技术工作小组，提出了一套更有远见的规范：[whatwg/loader](https://github.com/whatwg/loader)。  

也就是 `JavaScript Loader Standard` （JS 加载标准）。  

> 本规范描述了从 JavaScript 宿主环境中加载 JavaScript 模块的行为。它还提供了用于拦截模块加载过程和自定义加载行为的 api。

基于此规范，`SystemJS` 诞生了。 

`SystemJS` 是目前 `whatwg/loader` 规范的最佳实践者。  

![systemjs bundle](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-01-08-01.png)

可以看出来，`system` 的打包结果其实和 `amd` 类似，提供了全局的对象 `System`，并提供了注册的方式和统一的写法。  

就单纯的从打包结果上，其实看不出它相比对 `AMD + require.js` 有什么优势，**难道只是写法上存在差异**?  

并不止于此！

相比于 `require.js`，`SystemJS` 的 `System.import('module/name')` 方式允许你更为“懒”地加载模块，这意味着你无需每次都加载一大堆的 `bundle`，用户只需要为他能看见的页面开销带宽。  

另外，正因为 `SystemJS` 是面向 `whatwg/loader` 规范实践的，因此它是面向未来的模块依赖方式。

> 抱歉，这个的 demo 我也没玩明白，就不误导大家了。希望有明白的大佬可以帮忙完善下demo。  

## 六、ESM 
> ECMAScript modules, 也叫 ESM, Javascript 模块化官方标准格式。

### 6.1 打包分析

在 `ESM` 被提出来之前，JavaScript 一直没有真正意义上的模块（module）体系。

它的规范是通过 `export` 命令显式指定输出的代码，再通过  `import` 命令输入。
```javascript
// 导入模块
import { foo } from 'bar';
// 导出命令
export { zap };
```
这也是我们日常开发中最为熟悉的写法。  

因此，`esm` 格式打出来的包，可读性确实非常棒:
![esm](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/2022-01-08-09.png)

和阅读我们平时所写的业务代码完全没有区别。（`rollup` 依然没忘记做 `tree-shaking`）

### 6.2 如何运行
> 祝贺你，是这个时代的前端开发。  

部分现代浏览器已经开始实装 `<script type="module>` 了，因此在浏览器上直接使用 `esm` 已成为现实。

但运行起来扔需要做一些前置步骤。
1. 在js-modules目录下起一个本地静态服务
```bash
# 在js-modules目录下起一个本地静态服务
cd js-modules && http-server
```
2. 把 `esm/bundle.js` 文件的第一行修改为：
```js
import repeat from '../../node_modules/lodash-es/repeat.js';
// 因为默认的lodash并不是输出的 esm 格式，因此为了demo我们需要做一些特殊处理
```
3. 在浏览器打开页面(假设端口是8080)，则打开：http://127.0.0.1:8080/out/esm/index.html

这样一来，代码就能成功运行，控制台就可以成功打印 `42` 和 `42个1` 了。  

![](https://cdn.jsdelivr.net/gh/zhangshichun/blog-images/imgs/zxx-02.gif)
## 总结：分别适合在什么场景使用？
- **IIFE:** 适合部分场景作为SDK进行使用，尤其是需要把自己挂到 `window` 上的场景。
- **CommonJS:** 仅node.js使用的库。
- **AMD:** 只需要在浏览器端使用的场景。
- **UMD:** 既可能在浏览器端也可能在node.js里使用的场景。
- **SystemJs:** 和UMD类似。目前较出名的 `Angular` 用的就是它。
- **ESM:** 1. 还会被引用、二次编译的场景（如组件库等）；2.浏览器调试场景如 `vite.js`的开发时。3.对浏览器兼容性非常宽松的场景。

## 结束语

我是`春哥`。  
我热爱 `vue.js` , `ElementUI` , `Element Plus` 相关技术栈，我的目标是给大家分享最实用、最有用的知识点，希望大家都可以早早下班，并可以飞速完成工作，淡定摸鱼🐟。

你可以在**掘金**关注我，也可以在**公众号**里找到我：`前端要摸鱼`。  
希望大家玩得开心。