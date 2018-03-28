import ObjectHelper, { MoveType } from "./objectHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Monster extends cc.Component {

    @property(cc.Float)
    duration: number = 0;

    private moveAniName = 'monsterMove';
    private deadAniName = 'monsterDead';
    private animation: cc.Animation = null;
    private tilePosition: cc.Vec2 = null;
    private moveState: MoveType = MoveType.None;
    private movePosition: cc.Vec2 = null;
    private currentAction: cc.Action = null;

    onLoad() {
        this.initPosition();
        ObjectHelper.currentGameInstance().increaseMonster(this);
    }

    start() {
        this.animation = this.node.getComponent(cc.Animation);
        this.node.on('killed', () => {
            let state = this.animation.play(this.deadAniName);
        });
    }

    onMoved() {
        this.animation.play(this.moveAniName);
        let moveType = Math.floor(cc.random0To1() * 4) as MoveType;
        let newTile = ObjectHelper.shallowCopy(cc.Vec2, this.tilePosition) as cc.Vec2;
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
        if (!ObjectHelper.currentGameInstance().canMove(newTile)) return;
        this.moveState = moveType;
        this.tilePosition = ObjectHelper.shallowCopy(cc.Vec2, newTile) as cc.Vec2;
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

    onDeaded() {
        this.node.destroy();
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
        this.tilePosition = cc.p(x, y);
        let position = game.groundLayer.getPositionAt(this.tilePosition);
        this.node.setPosition(position);
    }
}
