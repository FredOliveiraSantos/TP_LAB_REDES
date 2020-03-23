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

export enum ColorPallet {
    RED = 'READ',
    BLUE = 'BLUE',
    GREEN = 'GREEN',
    YELLOW = 'YELLOW'
}

export interface ISnakeClientState {
    readonly color : string;
    readonly food : IFood;
    readonly player : IPlayer;
    readonly serverStatus : string | JSX.Element; 
    readonly serverRule : number;
    readonly people : null | ReadonlyArray<IPlayer>;
}