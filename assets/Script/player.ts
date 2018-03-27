import Game from "./game";
import ObjectHelper, { MoveType } from "./objectHelper";
import Bomb from "./bomb";

const { ccclass, property } = cc._decorator;



@ccclass
export default class Player extends cc.Component {

    @property(cc.Prefab)
    bombPrefab: cc.Prefab = null;
    @property(cc.Float)
    duration: number = 0;

    playerTile: cc.Vec2 = null;
    moveState: MoveType = MoveType.None;
    movePosition: cc.Vec2 = null;

    onLoad() {
        this.node.setLocalZOrder(99);
    }

    start() {
        this.playerTile = ObjectHelper.currentGameInstance().getTilePos(this.node.getPosition());
        this.addEventListener();
    }

    canMove(tile: cc.Vec2): boolean {
        let game = ObjectHelper.currentGameInstance();
        let mapSize = game.map.getMapSize();
        if (tile.x < 0 || tile.x >= mapSize.width) return false;
        if (tile.y < 0 || tile.y >= mapSize.height) return false;

        let newTile = ObjectHelper.currentGameInstance().mainLayer.getTileAt(tile);
        let success = newTile ? false : true;
        if (!success) return success;
        let bombList = game.getBombList();
        bombList.forEach(bomb => {
            let bombTile = game.getTilePos((bomb as Bomb).node.position);
            if (bombTile.equals(tile)) {
                success = false;
            }
        });
        return success;
    }

    move(moveType: MoveType) {
        if (this.moveState != MoveType.None) {
            this.node.stopAllActions();
        }
        let newTile = ObjectHelper.shallowCopy(cc.Vec2, this.playerTile) as cc.Vec2;
        switch (moveType) {
            case MoveType.Left:
                newTile.x -= 1;
                break;
            case MoveType.Right:
                newTile.x += 1;
                break;
            case MoveType.Up:
                newTile.y -= 1;
                break;
            case MoveType.Down:
                newTile.y += 1;
                break;
        }
        let aniName = ObjectHelper.getEnumName(MoveType, moveType);
        let animation = this.getComponent(cc.Animation);
        if (!animation.getAnimationState(aniName).isPlaying) {
            animation.play(aniName);
        }
        if (!this.canMove(newTile)) return;
        this.moveState = moveType;
        this.playerTile = ObjectHelper.shallowCopy(cc.Vec2, newTile) as cc.Vec2;
        this.movePosition = ObjectHelper.currentGameInstance().mainLayer.getPositionAt(newTile);
        this.node.runAction(this.moveAction());
    }

    moveAction(): cc.Action {
        let move = cc.moveTo(this.duration, cc.p(this.movePosition.x, this.movePosition.y));
        let callback = cc.callFunc(() => {
            this.moveState = MoveType.None;
        })
        return cc.sequence(move, callback);
    }

    dropBomb() {
        let bomb = cc.instantiate(this.bombPrefab);
        bomb.setPosition(this.node.getPosition());
        this.node.parent.addChild(bomb, this.node.getLocalZOrder() - 1);
    }

    addEventListener() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, event => {
            switch (event.keyCode) {
                case cc.KEY.a:
                case cc.KEY.left:
                    this.move(MoveType.Left);
                    break;
                case cc.KEY.d:
                case cc.KEY.right:
                    this.move(MoveType.Right);
                    break;
                case cc.KEY.up:
                case cc.KEY.w:
                    this.move(MoveType.Up);
                    break;
                case cc.KEY.s:
                case cc.KEY.down:
                    this.move(MoveType.Down);
                    break;
                case cc.KEY.space:
                    this.dropBomb();
                    break;
            }
        });
    }

}
