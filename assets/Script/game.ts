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
    private maxMonster = 5;

    onLoad() {
        this.bombList = [];
        this.monsterList = [];
    }

    start() {
        this.schedule(this.generateMonster, 3);
    }

    generateMonster() {
        if (this.monsterList.length < this.maxMonster) {
            let monsterNode = cc.instantiate(this.monsterPrefab);
            this.node.addChild(monsterNode);
        }
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
        this.bombList.splice(index, 3);
    }

    getBombList() {
        return this.bombList ? ObjectHelper.shallowCopy(Array, this.bombList) : [];
    }

    increaseMonster(monster: Monster) {
        this.monsterList.push(monster);
    }

    destroyMonster(monster: Monster) {
        let index = this.monsterList.indexOf(monster);
        this.monsterList[index].node.emit('killed');
        this.monsterList.splice(index, 1);
    }

    getMonsterList() {
        return this.bombList ? ObjectHelper.shallowCopy(Array, this.monsterList) : [];
    }

    isExistMonster(tile: cc.Vec2) {
        for (const monster of this.getMonsterList()) {
            let monsterTile = this.getTilePos((monster as Monster).node.position);
            if (tile.x == monsterTile.x && tile.y == monsterTile.y) return true;
        }
        return false;
    }

    canMove(tile: cc.Vec2): boolean {
        let mapSize = this.map.getMapSize();
        if (tile.x < 0 || tile.x >= mapSize.width) return false;
        if (tile.y < 0 || tile.y >= mapSize.height) return false;

        let newTile = this.mainLayer.getTileAt(tile);
        let success = newTile ? false : true;
        if (!success) return success;
        let bombList = this.getBombList();
        bombList.forEach(bomb => {
            let bombTile = this.getTilePos((bomb as Bomb).node.position);
            if (bombTile.equals(tile)) {
                success = false;
            }
        });
        return success;
    }

}
