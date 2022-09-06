'''
这是多行1注释
这是多行2注释
这是多行3注释
'''
def hello(a):
  multi_str = """
  第1行多行字符串
  第2行多行字符串
  """
  re = r'包含#regexp测试'
  re1 = r"""
    包含re0测试
    包含re1测试
  """
  re2 = re.compile( "hello你" + "world好")
  # 第4个注释
  print("你好hello世界")
  print('你好hello世界')
  