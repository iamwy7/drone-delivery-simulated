import {HttpModule, Module} from '@nestjs/common';
import {ConsoleModule} from "nestjs-console";
import { FixturesService } from './fixtures/fixtures.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "../order/order.model";
import {DroneService} from "../order/drone-service/drone.service";

@Module({
    imports: [
        ConsoleModule,
        TypeOrmModule.forFeature([ Order]),
        HttpModule
    ],
    providers: [FixturesService, DroneService]
})

// Esse módulo, é o de fixtures.
export class CommandsModule {}

