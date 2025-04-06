# 这是Heading 1大标题

**加粗**
_倾斜_
~~删除线~~
这是**Bold加粗**在1个段落中，这端会correct掉，如果是inline code，例如`Rust语言`，也可以应该处理。

> 引用文本：Quote也是可以的。

```rust
// Codeblock里面也会处理
let a = "你好hello";
```

- ![img图片](https://google.com/a/b/url不处理)
- [link链接](https://google.com/a/b/url不处理)`,
  },
  rust: {
    title: 'Rust',
    raw: `fn main() {
  let number\_list = vec!\[34, 50, 25, 100, 65];
  let mut largest = number\_list\[0];
  let regexp = %r"包含#regexp测试";
  // 1第一行Single line注释
  // 2第二行注释
  for number in number\_list {
  if number > largest {
  largest = number;
  }
  }
  // autocorrect: false
  let disable\_1 = "这行将会disable掉";
  let disable\_2 = "这行将也会disable掉";
  // autocorrect: true
  let a = r#"
  这是第1行
  这是第2行
  "#;
  let b = r##"
  这是第 3 行
  这是第 4 行
  "##;
  /\*\*

* 多行Rust注释
* 第二行Rust注释
  \*/
  println!("最大的数字number是{}", largest);
  }
