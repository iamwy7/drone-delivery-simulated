package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

type Drone struct {
	Uuid string `json:"uuid"`
	Name string `json:"name"`
}

type Drones struct {
	Drones []Drone
}

func loadDrones() []byte {

	jsonFile, err := os.Open("drone.json")
	if err != nil {
		panic(err.Error())
	}

	defer jsonFile.Close()

	data, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		panic(err.Error())
	}
	return data
}

func ListDrones(w http.ResponseWriter, r *http.Request) {
	drones := loadDrones()
	w.Write([]byte(drones))
}

func GetDroneByUuid(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	data := loadDrones()

	var drones Drones
	json.Unmarshal(data, &drones)

	for _, v := range drones.Drones {
		if v.Uuid == vars["id"] {
			drone, _ := json.Marshal(v)
			w.Write([]byte(drone))
		}
	}
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/drones", ListDrones)
	r.HandleFunc("/drones/{id}", GetDroneByUuid)
	http.ListenAndServe(":8081", r)
}
