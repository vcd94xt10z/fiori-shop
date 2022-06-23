sap.ui.define([
    "./BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController) {
        "use strict";

        return BaseController.extend("zapp.fiorishop.controller.ProductDetail", {
            onInit: function () {
                var oRouter = this.getRouter();
                oRouter.getRoute("RouteProductDetail").attachMatched(this._onRouteMatched,this);
            },

            _onRouteMatched: function(oEvent){
                var oArgs = oEvent.getParameter("arguments");
                alert(oArgs.rewrite);
            }
        });
    });
