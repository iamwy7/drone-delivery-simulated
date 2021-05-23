import { Injectable } from '@nestjs/common';
import {ConsoleService} from "nestjs-console";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Order} from "../../order/order.model";
import {DroneService} from "../../order/drone-service/drone.service";

@Injectable()
export class FixturesService {
    constructor(
        private readonly consoleService: ConsoleService,
        @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
        private readonly droneHttp: DroneService
    ) {
        const cli = this.consoleService.getCli();

        this.consoleService.createCommand(
            {
                command: 'db:seed',
                description: 'Seed data in database'
            },
            this.seed,
            cli
        );
    }

    seed = async (): Promise<any> => {
        const drones = await this.droneHttp.list().toPromise();
        for(const drone of drones){
            const order = this.orderRepo.create({
                drone_id: drone.uuid,
                drone_name: drone.name,
                location_id: 1,
                location_geo: [-81.24653,28.3645],
            });
            await this.orderRepo.save(order);
        }

    };
}
