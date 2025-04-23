### last-mile-delivery-microservices

Esse projeto é para uma plataforma de entregas de "Last Mile", onde um produto recebe o pedido para ser entregue do último centro de distribuição até a residencia nessa ordem: 
- O serviço de [Orders](./Orders) recebe um pedido por Api
- Assim que um pedido é criado, ele fica disponível no serviço de [Mapping](./Mapping) para visualização no Google Maps
- Além disso também é enviada uma mensagem pelo RabbitMQ para que o serviço de [Simulator](./Simulator) para que ele possa simular um drone(carro, moto, ou qualquer outro meio) fazendo o envio do produto por uma das rotas fakes no serviço de Mapping

>Esse projeto foi feito com base em um dos eventos de imersão de código da escola [FullCycle](https://fullcycle.com.br/).

