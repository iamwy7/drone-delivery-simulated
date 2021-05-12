import * as React from 'react';
import {useMemo} from "react";
import {createPortal} from "react-dom";
import {useEffect} from "react";

const MapControl = (props) => {
    const {map, position, children} = props;
    const controlDiv = useMemo(() => document.createElement('div'), []);

    // Esse Hook, executará a geração de um Portal.
    // Portal: é quando criamos um elemento que não seja filho 
    // de sua referencia, mas sim, construido diretamente no DOM, 
    // no caso acima da instancia do maps.

    useEffect(() => {
        if (map && position) {
            // Aqui criamos o portal por cima do maps.
            map.controls[position].push(controlDiv);
        }
    }, [map, position]);

    return createPortal(children, controlDiv);
};


export default MapControl;
