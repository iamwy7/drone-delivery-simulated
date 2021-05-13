FROM golang:1.16-alpine

WORKDIR /go/src/
COPY . .
RUN GOOS=linux go build drones.go
CMD ["./drones"]
