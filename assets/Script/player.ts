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

    private playerTile: cc.Vec2 = null;
    private moveState: MoveType = MoveType.None;
    private movePosition: cc.Vec2 = null;
    private currentAction: cc.Action = null;
    private animation: cc.Animation = null;
    private playerDeadedAniName = 'playerDead';
    private isAlive: boolean = true;

    onLoad() {
        this.node.setLocalZOrder(99);
    }

    start() {
        this.animation = this.node.getComponent(cc.Animation);
        this.playerTile = ObjectHelper.currentGameInstance().getTilePos(this.node.getPosition());
        this.addEventListener();
    }

    update(dt: number) {
        if (ObjectHelper.currentGameInstance().isExistMonster(this.playerTile)) {
            if (!this.animation.getAnimationState(this.playerDeadedAniName).isPlaying) {
                this.isAlive = false;
                this.animation.play(this.playerDeadedAniName);
            }
        }
    }

    onDeaded() {
        this.node.destroy();
    }

    move(moveType: MoveType) {
        if (this.moveState != MoveType.None || this.currentAction) {
            this.node.stopAction(this.currentAction);
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
        this.animation = this.getComponent(cc.Animation);
        if (!this.animation.getAnimationState(aniName).isPlaying) {
            this.animation.play(aniName);
        }
        if (!ObjectHelper.currentGameInstance().canMove(newTile) || !this.isAlive) return;
        this.moveState = moveType;
        this.playerTile = ObjectHelper.shallowCopy(cc.Vec2, newTile) as cc.Vec2;
        this.movePosition = ObjectHelper.currentGameInstance().mainLayer.getPositionAt(newTile);
        this.currentAction = this.node.runAction(this.moveAction());
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
