import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent, Repository,
} from 'typeorm';
import {Order} from "../order.model";
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";
import {InjectRepository} from "@nestjs/typeorm";

// Um serviço que captura todos os eventos no TypweORM quanto de diz respeito á Order.
@EventSubscriber()
export class OrderSubscriberService implements EntitySubscriberInterface<Order> {
    constructor(
        connection: Connection,
        private amqpConnection: AmqpConnection,
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>
    ) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return Order;
    }

    // Evento que é disparado depois de uma nova order, para enviar os dados ao RabbitMQ.
    async afterInsert(event: InsertEvent<Order>) {
        const order = event.entity;
        await this.amqpConnection.publish(
            'amq.direct',
            'orders.new',
            {
                id: order.id,
                drone_name: order.drone_name,
                location_id: order.location_id,
                location_geo: order.location_geo,

                // O Simulator lê esses dados...
                order: order.id,
                destination: order.location_id
            }
        )
    }
}
