import Game from "./game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ObjectHelper extends cc.Component {

    private static game: Game = null;
    private static gameNode = 'game/map';

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    }

    static shallowCopy<T>(type: { new(): T }, src: T): T {
        let dst = new type();
        if (dst instanceof Array && src instanceof Array) {
            for (const value of src) {
                dst.push(value);
            }
        } else {
            for (let prop in src) {
                if (src.hasOwnProperty(prop)) {
                    dst[prop] = src[prop];
                }
            }
        }
        return dst;
    }

    static currentGameInstance(): Game {
        if (ObjectHelper.game) return ObjectHelper.game;
        let rootNode = cc.find(ObjectHelper.gameNode);
        ObjectHelper.game = rootNode.getComponent(Game);
        return ObjectHelper.game ? ObjectHelper.game : null;
    }

    static getEnumName<T>(type: any, eWord: T): string {
        return type[eWord].toString().toLowerCase();
    }
}

export enum MoveType {
    Left,
    Right,
    Up,
    Down,
    None
}

export enum TileType {
    Soil,
    Steel,
    Door,
    Power,
    Water,
    Speed,
    Health
}

