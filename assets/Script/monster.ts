import ObjectHelper from "./objectHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Monster extends cc.Component {

    onLoad() {
        this.initPosition();
        ObjectHelper.currentGameInstance().increaseMonster(this);
    }

    initPosition() {
        let game = ObjectHelper.currentGameInstance();
        let mapSize = game.map.getMapSize();
        let x = Math.floor(cc.random0To1() * (mapSize.width - 1));
        let y = Math.floor(cc.random0To1() * (mapSize.height - 1));
        while (game.getTileType(game.mainLayer, cc.p(x, y)) || game.isExistMonster(cc.p(x, y))) {
            x = Math.floor(cc.random0To1() * (mapSize.width - 1));
            y = Math.floor(cc.random0To1() * (mapSize.height - 1));
        }
        let position = game.groundLayer.getPositionAt(cc.p(x, y));
        this.node.setPosition(position);
    }
}
