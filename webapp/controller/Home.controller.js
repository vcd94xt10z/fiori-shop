sap.ui.define([
    "./BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController) {
        "use strict";

        return BaseController.extend("zapp.fiorishop.controller.Home", {
            onInit: function () {
                var oRouter = this.getRouter();
                var oTarget = oRouter.getTarget("TargetHome");
                oTarget.attachDisplay(this.onDisplay,this);
            },

            onDisplay: function(){
            }
        });
    });
