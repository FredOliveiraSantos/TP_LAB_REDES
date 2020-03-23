import React, {useEffect, useState} from "react";
import {ISnakeClientState, ColorPallet, IFood, IPlayer} from "./snake-client.models";
import {Stage, Layer, Rect, Text} from "react-konva";
import openSocket from 'socket.io-client';
import "./styles.css";
import ScoreText from "./score-text.component";

// TP de Lab de Redes e SO
// Frederico Oliveira
// CLASSE DO CLIENTE

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
    serverRule: 0,
    people: null
}

const SnakeClient : React.FC<any> = () => {

    // VARIAVEIS DE ESTADO
    const [state, setState] = useState<ISnakeClientState>(initalState);
    const [socket, setSocket] = useState<SocketIOClient.Socket | undefined>();
    const [gameImage, setGameImage] = useState<HTMLImageElement>();

    // METODO QUE OCORRE SEMPRE QUE O JOGADOR APERTAR UMA DAS SETAS DO TECLADO
    const handleKeyPress = (event : any) => {

        if(!socket) return;

        let newPlayer : IPlayer = state.player;

        if(event.key === 'ArrowLeft') {
           newPlayer = {
               ...state.player,
               rx: -1,
               ry: 0
           }
        }
        else if(event.key === 'ArrowRight') {
            newPlayer = {
                ...state.player,
                rx: 1,
                ry: 0
            }
         }
         else if(event.key === 'ArrowDown') {
            newPlayer = {
                ...state.player,
                rx: 0,
                ry: 1
            }
         }
         else if(event.key === 'ArrowUp') {
            newPlayer = {
                ...state.player,
                rx: 0,
                ry: -1
            }
         };

         // DISPARAR EVENTO DE MOVIMENTACAO PARA O SERVIDOR E ATUALIZAR ESTADO
         socket.emit('move', newPlayer);
         setState({
             ...state,
             player: newPlayer
         });
    }

    // METODO QUE INICIALIZA OS EVENTOS DE SOCKET QUE O JOGADOR (CLIENTE) IRA RECEBER DO SERVIDOR
    const createSocketEvents = (socket : SocketIOClient.Socket) => {
        // ATUALIZAR ESTADOS QUANDO UM JOGADOR SE MOVE OU COME UMA FRUTA DO TABULEIRO
        socket.on('moved', (message : any) => {
            const newState : ISnakeClientState = {
                ...state,
                people: message,
                serverRule: 1
            };
            setState(newState);
        });

        socket.on('food', (message: IFood) => {
            setState({
                ...state,
                food: message
            })
        });

        return socket;
    }

    // METODO AUXILIAR (GERA UM INT ALEATORIO)
    const getRandomInt = (min : number, max: number) : number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ATUALIZA O ESTADO DOS OUTROS JOGADORES PROPRIO TABULEIRO
    const handleUpdateOtherGames = () => {
        if(!state.people || !state.people.length) return;

        let newPeople : Array<IPlayer> = [];
        
        const speed = 7;
        Object.keys(state.people).forEach((key : any) => {
            let newPerson = state.people![key];
            
            let newX = newPerson.x + newPerson.rx * speed;
            let newY = newPerson.y + newPerson.ry * speed;

            if(newX < 0) newX = 500;
            if(newY < 0) newY = 500;
            if(newX > 500) newX = 0;
            if(newY > 500) newY = 0;

            newPerson = {
                ...newPerson,
                x: newX,
                y: newY
            };
            newPeople.push(newPerson);
        });

        setState({
            ...state,
            people: newPeople
        });
    }

    // LOGICA GERAL DO JOGO
    const game = () => {
        if(!socket) return;

        // STATUS DO SERVIDOR
        let newServerStatus = state.serverStatus;
        if(socket.connected) {
            newServerStatus = <p className="text-success">ONLINE</p>;
        } else {
            newServerStatus = <p className="text-danger">OFFLINE</p>
        };

        // LOGICA DE MOVIMENTACAO PELO TABULEIRO
        let people = state.player;
        let speed = 7;
        let x = people.x + people.rx * speed;
        let y = people.y + people.ry * speed;
        let newScore = people.score;

        if(x < 0) x = 500;
        if(x > 501) x = 0;
        if(y < 0) y = 500;
        if(y > 500) y = 0;

        // EVENTO QUE OCORRE AO SE MARCAR UM PONTO
        if(x -5 < state.food.x && state.food.x < x + 5 && 
            state.food.y - 5 < y && y < state.food.y + 5) {

            // GERAR OUTRA FRUTA
            newScore++;
            const newFood : IFood = {
                x: getRandomInt(0, 500),
                y: getRandomInt(0, 500),
            };

            //EMITIR EVENTOS DE MOVIMENTO E DE QUE UMA PECA FOI COMIDA PARA O SERVIDOR
            socket.emit('move', {...people, score:newScore});
            socket.emit('eat', newFood);

            setState({
                ...state,
                food: newFood
            });
        };

        people = {
            ...people,
            x,
            y
        };
        setState({
            ...state,
            player: people,
            serverStatus: newServerStatus
        });
        // SEMPRE EMITIR EVENTO DE MOVIMENTO PARA O SERVIDOR (PARA QUE A PECA SEMPRE SE MOVA NO SEU EIXO POR PADRAO)
        socket.emit('move', people);

        handleUpdateOtherGames();

    }

    // COMPONENTE "CONSTRUTOR"
    useEffect(() => {
        let name : string | null = ''
        // Obter nome do jogador: 
        while(true) {
            name = prompt("Informe seu nome: ", "");
            try {
                if(name && name.length) break;
                else alert("Nome invalido!")
            } catch(e) {
                console.log(e);
            }
        };

        // Inicializando Jogador
        const person = {
            id: getRandomInt(0, 100),
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

        setState({
            color: ColorPallet.BLUE,
            food,
            player: person,
            serverStatus: 'offline',
            serverRule: 0,
            people: null
        });

        // Criar os listeners de eventos para o pressionamento de teclas para movimento
        document.addEventListener('keydown', (e) => handleKeyPress.bind(null, e));

        // Comecar nova conexao socket com o servidor, rodando na porta 8000
        const newSocket = createSocketEvents(openSocket('192.168.1.150:8000'));
        setSocket(newSocket);

        // Coloca a imagem de fundo do tabuleiro
        const image = new window.Image();
        image.src = "https://cdn.tutsplus.com/mobile/uploads/legacy/Corona-SDK_Build-A-Snake-Game/1/6.png";
        setGameImage(image);
    }, []);

    useEffect(() => {
        if(!socket) return;
        //Comecar um jogo quando a configuracao do socket se finalizar
        setInterval(game.bind(null), 1000/8);
    }, [socket]);


    // Componentes front-end (renderizacao das pecas e do tabuleiro)
    return (<div>
        <Stage className={'stage-component'}> 
            <Layer>
                <Rect x={0} y={0} width={500} height={500} fillPatternImage={gameImage}/>
                <Text text={state.player.name} x={state.player.x} y={state.player.y+10} />
                <Rect x={state.player.x} y={state.player.y} width={10} height={10} fill="blue" />

                {state.people && state.people.length && Object.keys(state.people).map((key : any) => (
                    state.people![key].name !== state.player.name && <React.Fragment>
                        <Text text={state.people![key].name} x={state.people![key].x} y={state.people![key].y} />
                        <Rect x={state.people![key].x} y={state.people![key].y} width={10} height={10} fill='blue'/>
                    </React.Fragment>
                ))}

                <Rect x={state.food.x} y={state.food.y} width={10} height={10} fill="red"/>
            </Layer>
        </Stage>

        <div>
            <h1>{'Tabela de Pontos'}</h1>
            <ul>
                {state.people && Object.keys(state.people).map((key : any) => (
                    <ScoreText name={state.people![key].name} score={state.people![key].score} />
                ))}
            </ul>
                <p>{'Status do Servidor: '}{state.serverStatus}</p>
        </div>
    </div>);
};

export default SnakeClient;