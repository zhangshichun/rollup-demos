define('Test', ['exports', 'lodash'], (function (exports, lodash) { 'use strict';

  var answer = 42;

  const printAnswer = () => {
    // 打印
    console.log(`the answer is ${answer}`);
    // 测试 lodash 的能力，打印42个1
    console.log(lodash.repeat('1', answer));
  };

  exports.printAnswer = printAnswer;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
