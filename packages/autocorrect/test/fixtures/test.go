// WithContext创建基于ctx的db
// 第2行注释
func (d *Dao) WithContext(ctx context.Context) (db *gorm.DB) {
  a := "第1个"
  b := \`
  多行string
  第2行
  \`
  re := regexp.MustCompile(\`regexp不处理\`)
  re1 := regexp.Compile("regexp不处理")
  t := time.Parse("2006年01月02日 15:04", t)
  fmt.Println(a + b + "go语言")
  fmt.Println("%s链接的内容不会空格%d也不处理，保守", "格式", 100)
  db = d.DB.WithContext(ctx)
  return
}
