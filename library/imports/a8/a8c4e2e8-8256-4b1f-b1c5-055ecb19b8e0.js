"use strict";
cc._RF.push(module, 'a8c4eLoglZLH7HFBV7LGbjg', 'game');
// Script/game.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        property(cc.TiledMap)
    ], Game.prototype, "map", void 0);
    __decorate([
        property(cc.TiledLayer)
    ], Game.prototype, "hideLayer", void 0);
    __decorate([
        property(cc.TiledLayer)
    ], Game.prototype, "mainLayer", void 0);
    Game = __decorate([
        ccclass
    ], Game);
    return Game;
}(cc.Component));
exports.default = Game;

cc._RF.pop();