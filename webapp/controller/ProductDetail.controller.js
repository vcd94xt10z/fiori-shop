sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,MessageToast) {
        "use strict";

        return BaseController.extend("zapp.fiorishop.controller.ProductDetail", {
            onInit: function () {
                var oRouter = this.getRouter();
                oRouter.getRoute("RouteProductDetail").attachMatched(this._onRouteMatched,this);
            },

            _onRouteMatched: function(oEvent){
                var oArgs = oEvent.getParameter("arguments");
                MessageToast.show(oArgs.rewrite);
            }
        });
    });
