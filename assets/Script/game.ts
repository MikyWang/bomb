import Player from "./player";
import Bomb from "./bomb";
import ObjectHelper from "./objectHelper";
import Monster from "./monster";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.TiledMap)
    map: cc.TiledMap = null;
    @property(cc.TiledLayer)
    hideLayer: cc.TiledLayer = null;
    @property(cc.TiledLayer)
    mainLayer: cc.TiledLayer = null;
    @property(cc.TiledLayer)
    groundLayer: cc.TiledLayer = null;
    @property(cc.Node)
    player: cc.Node = null;
    @property(cc.Prefab)
    monsterPrefab: cc.Prefab = null;


    private bombList: Array<Bomb> = null;
    private monsterList: Array<Monster> = null;

    onLoad() {
        this.bombList = [];
        this.monsterList = [];
    }

    start() {
        this.scheduleOnce(() => {

        });
    }

    generateMonster() {
        let monsterNode = cc.instantiate(this.monsterPrefab);
        this.node.addChild(monsterNode);
    }

    getTilePos(position: cc.Vec2): cc.Vec2 {
        let mapSize = this.map.node.getContentSize();
        let tileSize = this.map.getTileSize();
        let x = Math.floor(position.x / tileSize.width);
        let y = Math.floor((mapSize.height - position.y) / tileSize.height) - 1;
        return cc.p(x, y);
    }

    getTileType(layer: cc.TiledLayer, tile: cc.Vec2): string {
        let tileGID = layer.getTileGIDAt(tile);
        let prop = this.map.getPropertiesForGID(tileGID);
        return prop ? prop.type : null;
    }

    increaseBomb(bomb: Bomb) {
        this.bombList.push(bomb);
    }

    destroyBomb(bomb: Bomb) {
        let index = this.bombList.indexOf(bomb);
        this.bombList.splice(index, 1);
    }

    getBombList() {
        return this.bombList ? ObjectHelper.shallowCopy(Array, this.bombList) : [];
    }

    increaseMonster(monster: Monster) {
        this.monsterList.push(monster);
    }

    destroyMonster(monster: Monster) {
        let index = this.monsterList.indexOf(monster);
        this.bombList.splice(index, 1);
    }

    getMonsterList() {
        return this.bombList ? ObjectHelper.shallowCopy(Array, this.monsterList) : [];
    }

    isExistMonster(tile: cc.Vec2) {
        let position = this.groundLayer.getPositionAt(tile);
        for (const monster of this.getMonsterList()) {
            if (position.equals((monster as Monster).node.position)) {
                return true;
            }
        }
        return false;
    }

}
