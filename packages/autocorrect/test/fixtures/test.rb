# 第1行注释
# 第2行注释
def hello(a, b: "第1个参数")
  re = /hello你好/
  re1 = %r{hello你好}
  re2 = Regexp.new('hello你好' )
  re3 = Regexp.new( "hello你好")
  a = "hello世界#{a}"
  b = '你好hello世界'
end
