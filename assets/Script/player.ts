import Game from "./game";
import ObjectHelper from "./objectHelper";

const { ccclass, property } = cc._decorator;

enum MoveType {
    Left,
    Right,
    Up,
    Down,
    None
}

@ccclass
export default class Player extends cc.Component {

    @property(cc.Prefab)
    bombPrefab: cc.Prefab = null;
    @property(cc.Float)
    duration: number = 0;

    game: Game = null;
    playerTile: cc.Vec2 = null;
    moveState: MoveType = MoveType.None;

    onLoad() {
        this.node.setLocalZOrder(99);

    }

    start() {
        this.playerTile = this.game.getTilePos(this.node.getPosition());
        this.playerTile.y -= 1;
        this.addEventListener();
    }

    canMove(tile: cc.Vec2): boolean {
        let mapSize = this.game.map.getMapSize();
        if (tile.x < 0 || tile.x >= mapSize.width) return false;
        if (tile.y < 0 || tile.y >= mapSize.height) return false;

        let newTileId = this.game.mainLayer.getTileAt(tile);
        return newTileId ? false : true;
    }

    move(moveType: MoveType) {
        if (this.moveState != MoveType.None) return;
        let newTile = ObjectHelper.shallowCopy(this.playerTile) as cc.Vec2;
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
        let aniName = MoveType[moveType].toLowerCase();
        let animation = this.getComponent(cc.Animation);
        if (!animation.getAnimationState(aniName).isPlaying) {
            animation.play(aniName);
        }
        if (!this.canMove(newTile)) return;
        this.moveState = moveType;
        this.playerTile = ObjectHelper.shallowCopy(newTile) as cc.Vec2;
        let position = this.game.mainLayer.getPositionAt(newTile);
        this.node.runAction(this.moveAction(position));
    }

    moveAction(position: cc.Vec2): cc.Action {
        let move = cc.moveTo(this.duration, cc.p(position.x, position.y));
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
