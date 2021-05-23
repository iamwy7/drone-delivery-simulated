import {HttpService, Injectable} from '@nestjs/common';
import {map} from "rxjs/operators";

@Injectable()
export class DroneService {

    baseUrl = process.env.MICRO_DRONES_URL;

    constructor(private readonly httpService: HttpService) {
    }

    list() {
        return this.httpService
            .get<{drones: any[]}>(`${this.baseUrl}/drones`)
            .pipe(
                map(response => response.data.drones)
            ) //Reactive X ( Promisse )
    }

    show(id){
        return this.httpService
            .get(`${this.baseUrl}/drones/${id}`)
            .pipe(
                map(response => response.data)
            )
    }
}
