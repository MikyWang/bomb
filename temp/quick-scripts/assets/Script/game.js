(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a8c4eLoglZLH7HFBV7LGbjg', 'game', __filename);
// Script/game.ts

Object.defineProperty(exports, "__esModule", { value: true });
var player_1 = require("./player");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.map = null;
        _this.hideLayer = null;
        _this.mainLayer = null;
        _this.player = null;
        return _this;
    }
    Game.prototype.onLoad = function () {
        this.player.getComponent(player_1.default).game = this;
    };
    Game.prototype.getTilePos = function (position) {
        var mapSize = this.map.node.getContentSize();
        var tileSize = this.map.getTileSize();
        var x = Math.floor(position.x / tileSize.width);
        var y = Math.floor((mapSize.height - position.y) / tileSize.height);
        return cc.p(x, y);
    };
    __decorate([
        property(cc.TiledMap)
    ], Game.prototype, "map", void 0);
    __decorate([
        property(cc.TiledLayer)
    ], Game.prototype, "hideLayer", void 0);
    __decorate([
        property(cc.TiledLayer)
    ], Game.prototype, "mainLayer", void 0);
    __decorate([
        property(cc.Node)
    ], Game.prototype, "player", void 0);
    Game = __decorate([
        ccclass
    ], Game);
    return Game;
}(cc.Component));
exports.default = Game;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=game.js.map
        