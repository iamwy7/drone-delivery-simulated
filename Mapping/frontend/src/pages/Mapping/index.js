import * as React from 'react';
import {useState} from "react";
import {useEffect} from "react";
import {Loader} from 'google-maps';
import {useParams} from 'react-router-dom';
import axios from 'axios';

import io from 'socket.io-client';
import {Box} from "@material-ui/core";
import MapControl from "./MapControl";
import OrderInformation from "./OrderInformation";
import {useSnackbar} from "notistack";

// Pré configuramos a JS API Key.
const loader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY);
const socket = io(process.env.REACT_APP_MICRO_MAPPING_URL);

const Mapping = () => {
    const {id} = useParams();

    const [order, setOrder] = useState();
    const [map, setMap] = useState();
    const [startMarker, setStartMarker] = useState();
    const [endMarker, setEndMarker] = useState();
    const [position, setPosition] = useState();

    const snackbar = useSnackbar();

    // Hook qu permite um "watch" em algumas propriedades que você determinar como dependencias.
    // Só executa uma vez, porque o id não muda.
    useEffect(() => {
        async function load() {
            const {data} = await axios
                .get(`${process.env.REACT_APP_MICRO_MAPPING_URL}/orders/${id}`);

            setOrder(data);

            console.log(data);
            const [lat, lng] = data.location_geo;
            const position = {lat: parseFloat(lat), lng: parseFloat(lng)};

            // Ativa o mapa do google, demora um tempinho.
            window.google = await loader.load();

            // Local para montar o mapa.
            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: position,
                zoom: 15,
            });

            // Colocamos o marcador de inicio.
            const start = new window.google.maps.Marker({
                title: 'Início',
                icon: process.env.PUBLIC_URL + '/droneMarker.png'
            });

            // Colocamos o marcador de ponto final.
            const end = new window.google.maps.Marker({
                position: position,
                map: map,
                title: 'Destino'
            });

            setMap(map);
            setStartMarker(start);
            setEndMarker(end);
        }

        // Para forçar o carregamento.
        load();
    }, [id]);


    // Para atualizar as posições.
    useEffect(() => {
        socket.on(`order.${id}.new-position`, (payload) => {
            console.log(payload);
            setPosition(payload)
        });
    }, [id]);

    // Para centralizarmos a posição no mapa.
    useEffect(() => {

        // Como no começo não vamos ter a instancia do mapa nem as posições, paramos o processamento.
        if (!map || !position) {
            return;
        }

        if(position.lat === 0 && position.lng === 0){
            snackbar.enqueueSnackbar('O Drone concluiu a entrega !', {
                variant: 'success',
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'bottom'
                },
            });

            // ToDO: Limpar os marcadores do mapa e voltar para resolução normal.
            return;
        }

        startMarker.setPosition({lat: position.lat, lng: position.lng});
        startMarker.setMap(map);
        const bounds = new window.google.maps.LatLngBounds();

        bounds.extend(startMarker.getPosition());
        bounds.extend(endMarker.getPosition());

        map.fitBounds(bounds);
    }, [map, position]);

    return (
        <div id={'map'} style={{width: '100%', height: '100%'}}>
            {
                map &&
                <MapControl map={map} position={window.google.maps.ControlPosition.TOP_RIGHT}>
                    <Box m={'10px'}>
                        <OrderInformation order={order}/>
                    </Box>
                </MapControl>
            }
        </div>
    );
};

export default Mapping;
