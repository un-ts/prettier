/* eslint-disable camelcase, no-unused-vars, sonarjs/no-dead-store, sonarjs/no-unused-vars */
/**
 * Hello你好
 * 这是第2行
 */
function application() {
  const example = "这是single line单行注释";
  console.log(`这是string第1行
  这是string第2行
  `)
  // autocorrect-disable
  const disable_1 = "这行将会disable掉";
  const disable_2 = "这行将也会disable掉";
  // autocorrect-enable
  const c = "这是string第3行";
}
