System.register('Test', ['https://unpkg.com/lodash@4.17.21/lodash.js'], (function (exports) {
  'use strict';
  var repeat;
  return {
    setters: [function (module) {
      repeat = window._.repeat;
    }],
    execute: (function () {

      var answer = 42;

      const printAnswer = exports('printAnswer', () => {
        // 打印
        console.log(`the answer is ${answer}`);
        // 测试 lodash 的能力，打印42个1
        console.log(repeat('1', answer));
      });

    })
  };
}));
