import {Controller, Get, Post, Redirect, Render, Req, Request} from '@nestjs/common';
import {Order} from "./order.model";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {DriverHttpService} from "./driver-http/driver-http.service";

@Controller('orders') // '/orders'
export class OrderController {

    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>, // do TypeORM.
        private readonly driverHttp: DriverHttpService
    ) {

    }

    @Get() // Ação
    @Render('order/index') // O template
    async index() {
        const orders = await this.orderRepo.find({
            order: {
                created_at: 'DESC'
            }
        });
        return {data: orders}
    }

    @Get('/create')
    @Render('order/create')
    async create() {
        const drivers = await this.driverHttp.list().toPromise();
        return {drivers}
    }

    @Post()
    @Redirect('orders')
    async store(@Req() request: Request) {
        const [location_id, location_geo] = request.body['location'].split('/');
        const [driver_id, driver_name] = request.body['driver'].split(',');
        // Só cria a instância.
        const order = this.orderRepo.create({
            driver_id,
            driver_name,
            location_id,
            location_geo: location_geo.split(',') // Gera o nosso [latitude,longitude]
        });
        /* 
            Assim que salva a instância: 
            * Gera o Evento "afterInsert" do order-subscriber.
            * Envia uma mensagem para o Rabbit na exchange 'amq.direct' com a 
            routing-key 'orders.new' para os outros microservices inscritos 
            processarem a mensagem.
        */
        await this.orderRepo.save(order);
    }
}
