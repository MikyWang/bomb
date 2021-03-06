import ObjectHelper, { TileType } from "./objectHelper";
import Game from "./game";
import Monster from "./monster";
import Player from "./player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bomb extends cc.Component {

    start() {
        let game = ObjectHelper.currentGameInstance();
        game.increaseBomb(this);
    }

    exploded() {
        let game = ObjectHelper.currentGameInstance();
        let tilePosition = game.getTilePos(this.node.position);

        let linkTiles: cc.Vec2[] = [];
        linkTiles.push(cc.p(tilePosition.x - 1, tilePosition.y));
        linkTiles.push(cc.p(tilePosition.x + 1, tilePosition.y));
        linkTiles.push(cc.p(tilePosition.x, tilePosition.y - 1));
        linkTiles.push(cc.p(tilePosition.x, tilePosition.y + 1));

        linkTiles.forEach(linkTile => {
            this.tryRemoveTile(linkTile);
            this.tryKillMonster(linkTile);
            this.tryKillPlayer(linkTile);
        });
        this.node.destroy();
    }

    onDestroy() {
        let game = ObjectHelper.currentGameInstance();
        game.destroyBomb(this);
    }

    tryKillMonster(tilePosition) {
        let game = ObjectHelper.currentGameInstance();
        let monsterList = game.getMonsterList() as Array<Monster>;
        monsterList.forEach(monster => {
            let monsterTile = game.getTilePos(monster.node.position);
            if (monsterTile.equals(tilePosition)) {
                game.destroyMonster(monster);
            }
        })
    }

    tryKillPlayer(tilePosition) {
        let player = ObjectHelper.currentGameInstance().player.getComponent(Player);
        if (player.getPlayerTile().equals(tilePosition)) {
            player.killed();
        }
    }

    tryRemoveTile(position: cc.Vec2) {
        let game = ObjectHelper.currentGameInstance();
        let tileType = game.getTileType(game.mainLayer, position);
        if (tileType == null) {
            tileType = game.getTileType(game.hideLayer, position);
        }
        if (tileType == null) return;
        for (let type in TileType) {
            let typeIndex = parseInt(type) as TileType;
            let typeName = ObjectHelper.getEnumName(TileType, typeIndex);
            if (typeIndex == TileType.Soil && tileType == typeName) {
                game.mainLayer.removeTileAt(position);
                break;
            }
            if (tileType == typeName) {
                game.hideLayer.removeTileAt(position);
                break;
            }
        }
    }
}

