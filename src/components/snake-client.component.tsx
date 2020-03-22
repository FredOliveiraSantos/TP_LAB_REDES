import React, {useEffect, useState} from "react";
import {ISnakeClientState} from "./snake-client.models";

const initalState :ISnakeClientState = {
    color: '',
    food: {
        x: 0,
        y: 0
    },
    player: {
        id: 0,
        name: '',
        x: 0,
        y: 0,
        rx: 0,
        ry: 0,
        score: 0
    },
    serverStatus: '',
    serverRule: 0
}

const SnakeClient : React.FC<any> = () => {

    const [state, setState] = useState<ISnakeClientState>()

    useEffect(() => {
        let name : string | null = ''
        // Get player name
        while(true) {
            name = prompt("Informe seu nome: ", "");
            try {
                if(name && name.match(/^[0-9a-z]+$/)) break;
                else alert("Nome invalido!")
            } catch(e) {
                console.log(e);
            }
        };

        const person = {
            id: 1,
            name,
            x: 0,
            y: 0,
            rx: 0,
            ry: 0,
            score: 0
        };

        const food = {
            x: 50,
            y: 50
        };

        // setState()





    }, []);

    return <div>

    </div>
};

export default SnakeClient;