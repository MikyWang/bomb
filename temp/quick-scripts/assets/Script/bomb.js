(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/bomb.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd054bq6lFBN+oa4F2xGxTh/', 'bomb', __filename);
// Script/bomb.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Bomb = /** @class */ (function (_super) {
    __extends(Bomb, _super);
    function Bomb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bomb.prototype.exploded = function () {
        this.node.destroy();
    };
    Bomb = __decorate([
        ccclass
    ], Bomb);
    return Bomb;
}(cc.Component));
exports.default = Bomb;

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
        //# sourceMappingURL=bomb.js.map
        