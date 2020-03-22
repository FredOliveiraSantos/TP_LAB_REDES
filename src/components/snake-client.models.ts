export interface IPlayer {
    readonly name : string;
    readonly id: number;
    readonly x : number;
    readonly y : number;
    readonly rx : number;
    readonly ry: number;
    readonly score : number;
}

export interface IFood {
    readonly x : number;
    readonly y : number;
};

const colorPallet = ['red', 'blue', 'green', 'yellow', 'pink'];

export interface ISnakeClientState {
    readonly color : string;
    readonly food : IFood;
    readonly player : IPlayer;
    readonly serverStatus : string;
    readonly serverRule : 0;
}