FROM golang:1.15-alpine

WORKDIR /go/src/
COPY . .
RUN GOOS=linux go build driver.go
CMD ["./driver"]
