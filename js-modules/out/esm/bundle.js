import repeat from '../../node_modules/lodash-es/repeat.js';

var answer = 42;

const printAnswer = () => {
  // 打印
  console.log(`the answer is ${answer}`);
  // 测试 lodash 的能力，打印42个1
  console.log(repeat('1', answer));
};

export { printAnswer };
