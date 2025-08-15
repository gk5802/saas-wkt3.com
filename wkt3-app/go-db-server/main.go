package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

var dataDir string

type Doc map[string]interface{}

func ensureDir(p string) {
	os.MkdirAll(p, 0755)
}

func saveDoc(collection string, id string, doc Doc) error {
	dir := filepath.Join(dataDir, collection)
	ensureDir(dir)
	b, _ := json.Marshal(doc)
	return os.WriteFile(filepath.Join(dir, id+".json"), b, 0644)
}

func readDocs(collection string) ([]Doc, error) {
	dir := filepath.Join(dataDir, collection)
	ensureDir(dir)
	files, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}
	out := make([]Doc, 0, len(files))
	for _, f := range files {
		b, _ := os.ReadFile(filepath.Join(dir, f.Name()))
		var d Doc
		json.Unmarshal(b, &d)
		out = append(out, d)
	}
	return out, nil
}

func handleCreateUser(w http.ResponseWriter, r *http.Request) {
	var payload map[string]interface{}
	json.NewDecoder(r.Body).Decode(&payload)
	id := fmt.Sprintf("u-%d", time.Now().UnixNano())
	payload["id"] = id
	payload["createdAt"] = time.Now().Unix()
	_ = saveDoc("users", id, payload)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "id": id})
}

func handleFindUser(w http.ResponseWriter, r *http.Request) {
	var payload map[string]interface{}
	json.NewDecoder(r.Body).Decode(&payload)
	identifier := fmt.Sprintf("%v", payload["identifier"])
	users, _ := readDocs("users")
	for _, u := range users {
		if u["email"] == identifier || u["username"] == identifier {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]interface{}{"user": u})
			return
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"error": "not found"})
}

func handleCreateToken(w http.ResponseWriter, r *http.Request) {
	var payload map[string]interface{}
	json.NewDecoder(r.Body).Decode(&payload)
	id := fmt.Sprintf("t-%d", time.Now().UnixNano())
	payload["id"] = id
	payload["createdAt"] = time.Now().Unix()
	_ = saveDoc("tokens", id, payload)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "id": id})
}

func handleCreateSession(w http.ResponseWriter, r *http.Request) {
	var payload map[string]interface{}
	json.NewDecoder(r.Body).Decode(&payload)
	id := fmt.Sprintf("s-%d", time.Now().UnixNano())
	payload["id"] = id
	payload["createdAt"] = time.Now().Unix()
	_ = saveDoc("sessions", id, payload)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "id": id, "userId": payload["userId"]})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	dataDir = os.Getenv("DATA_DIR")
	if dataDir == "" {
		dataDir = "./data"
	}
	ensureDir(dataDir)

	http.HandleFunc("/users", handleCreateUser)     // POST
	http.HandleFunc("/users/find", handleFindUser)  // POST
	http.HandleFunc("/tokens", handleCreateToken)   // POST
	http.HandleFunc("/sessions", handleCreateSession) // POST

	log.Printf("Go DB server listening on :%s, dataDir=%s\n", port, dataDir)
	http.ListenAndServe(":"+port, nil)
}
