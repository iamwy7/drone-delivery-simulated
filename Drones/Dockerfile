# Link útil sobre as flags https://stackoverflow.com/questions/52640304/standard-init-linux-go190-exec-user-process-caused-no-such-file-or-directory
FROM golang:1.16-alpine as builder

WORKDIR /go/src/
COPY . .
RUN CGO_ENABLED=0 GOARCH=amd64 GOOS=linux go build -a -tags netgo -ldflags="-s -w" drones.go

FROM scratch
WORKDIR /go/src/
COPY --from=builder /go/src .
EXPOSE 8081
CMD ["./drones"]