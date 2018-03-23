import Player from "./player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.TiledMap)
    map: cc.TiledMap = null;
    @property(cc.TiledLayer)
    hideLayer: cc.TiledLayer = null;
    @property(cc.TiledLayer)
    mainLayer: cc.TiledLayer = null;
    @property(cc.Node)
    player: cc.Node = null;

    onLoad() {
        this.player.getComponent(Player).game = this;
    }

    getTilePos(position: cc.Vec2): cc.Vec2 {
        let mapSize = this.map.node.getContentSize();
        let tileSize = this.map.getTileSize();
        let x = Math.floor(position.x / tileSize.width);
        let y = Math.floor((mapSize.height - position.y) / tileSize.height);
        return cc.p(x, y);
    }

}
