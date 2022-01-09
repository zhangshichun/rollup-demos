'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lodash = require('lodash');

var answer = 42;

const printAnswer = () => {
  // 打印
  console.log(`the answer is ${answer}`);
  // 测试 lodash 的能力，打印42个1
  console.log(lodash.repeat('1', answer));
};

exports.printAnswer = printAnswer;
