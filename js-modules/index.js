import answer from "./answer";
import { repeat } from 'lodash'
// 定义一个无用变量
const unusedVar = 'May the 4th'

export const printAnswer = () => {
  // 打印
  console.log(`the answer is ${answer}`)
  // 测试 lodash 的能力，打印42个1
  console.log(repeat('1', answer))
}