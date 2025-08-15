package docdb
import (
  "encoding/json"
  "fmt"
  "io/ioutil"
  "os"
  "path/filepath"
  "time"
)

type Document struct {
  ID string `json:"id"`
  CreatedAt int64 `json:"createdAt"`
  Data map[string]interface{} `json:"data"`
}

func ensureDir(path string) error { return os.MkdirAll(path, 0755) }

func Save(collection string, doc *Document) error {
  base := os.Getenv("DATA_DIR")
  if base=="" { base="./data" }
  dir := filepath.Join(base, collection)
  if err := ensureDir(dir); err != nil { return err }
  if doc.ID=="" { doc.ID = fmt.Sprintf("%d-%d", time.Now().UnixNano(), time.Now().Unix()) }
  doc.CreatedAt = time.Now().Unix()
  b, _ := json.Marshal(doc)
  return ioutil.WriteFile(filepath.Join(dir, doc.ID+".json"), b, 0644)
}

func FindByField(collection, field string, value interface{}) (*Document, error) {
  base := os.Getenv("DATA_DIR"); if base=="" { base="./data" }
  dir := filepath.Join(base, collection)
  files, _ := ioutil.ReadDir(dir)
  for _, f := range files {
    data, _ := ioutil.ReadFile(filepath.Join(dir,f.Name()))
    var d Document
    json.Unmarshal(data, &d)
    if v, ok := d.Data[field]; ok && v == value {
      return &d, nil
    }
  }
  return nil, fmt.Errorf("not found")
}
