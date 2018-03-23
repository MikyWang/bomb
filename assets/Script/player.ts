import Game from "./game";

const { ccclass, property } = cc._decorator;

enum MoveType {
    Left,
    Right,
    Up,
    Down
}

@ccclass
export default class Player extends cc.Component {

    @property(cc.Prefab)
    bombPrefab: cc.Prefab = null;
    @property(cc.Integer)
    speed: number = 0;
    @property(cc.Float)
    duration: number = 0;

    game: Game;

    onLoad() {
        this.node.setLocalZOrder(99);
    }

    start() {
        this.addEventListener();
    }

    canMove(position: cc.Vec2): boolean {

        let tilePos = this.game.getTilePos(position);
        let tile = this.game.mainLayer.getTileAt(cc.p(tilePos.x, tilePos.y - 1));
        return tile ? false : true;
    }

    move(moveType: MoveType) {
        let xPos = 0, yPos = 0;
        switch (moveType) {
            case MoveType.Left:
                xPos -= this.speed;
                break;
            case MoveType.Right:
                xPos += this.speed;
                break;
            case MoveType.Up:
                yPos += this.speed;
                break;
            case MoveType.Down:
                yPos -= this.speed;
                break;
        }
        let aniName = MoveType[moveType].toLowerCase();
        let animation = this.getComponent(cc.Animation);
        if (!animation.getAnimationState(aniName).isPlaying) {
            animation.play(aniName);
        }
        if (!this.canMove(cc.p(this.node.x + xPos, this.node.y + yPos))) return;
        this.node.runAction(this.moveAction(xPos, yPos));
    }

    moveAction(xPos, yPos): cc.Action {
        let move = cc.moveTo(this.duration, cc.p(this.node.x + xPos, this.node.y + yPos));
        let callback = cc.callFunc(() => {
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
