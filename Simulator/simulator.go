package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"simulator/entity"
	"simulator/queue"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/streadway/amqp"
)

// Para guardar as entregas em andamento.
var active []string

func init() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}
}

func main() {

	in := make(chan []byte)
	ch := queue.Connect()
	queue.StartConsuming(in, ch)

	// Tudo que for consumido, cai nesse loop.
	for msg := range in {
		var order entity.Order
		err := json.Unmarshal(msg, &order)

		if err != nil {
			fmt.Println(err.Error())
		}

		fmt.Println("New order Received: ", order.Uuid)

		start(order, ch)
	}
}

// start gera uma nova routine para processar cada Order.
func start(order entity.Order, ch *amqp.Channel) {

	if !stringInSlice(order.Uuid, active) {
		active = append(active, order.Uuid)
		go SimulatorWorker(order, ch)
	} else {
		fmt.Println("Order", order.Uuid, "was already completed or is on going...")
	}
}

// SimulatorWorker lê os arquivos com as geolocalizações, serealiza-os, e envia para o RabbitMQ.
func SimulatorWorker(order entity.Order, ch *amqp.Channel) {

	f, err := os.Open("destinations/" + order.Destination + ".txt")

	if err != nil {
		panic(err.Error())
	}

	defer f.Close()

	// Para processarmos e serealizarmos a localização.
	scanner := bufio.NewScanner(f)

	for scanner.Scan() {
		data := strings.Split(scanner.Text(), ",")
		json := destinationToJson(order, data[0], data[1])

		// Vamos mandar para a fila a cada segundo.
		time.Sleep(1 * time.Second)
		queue.Notify(string(json), ch)
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	// É a mensagem que indica que a rota terminou.
	json := destinationToJson(order, "0", "0")
	queue.Notify(string(json), ch)
}

func destinationToJson(order entity.Order, lat string, lng string) []byte {
	dest := entity.Destination{
		Order: order.Uuid,
		Lat:   lat,
		Lng:   lng,
	}
	json, _ := json.Marshal(dest)
	return json
}

// stringInSlice procura um Order.Uuid dentro do Slice, para verificar se a Order já está em andamento.
func stringInSlice(a string, list []string) bool {
	for _, b := range list {
		if b == a {
			return true
		}
	}
	return false
}
