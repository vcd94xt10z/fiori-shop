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
                var sRewrite = oArgs.rewrite;
                var oModel = this.getOwnerComponent().getModel();
                var oData = oModel.getData();

                var oProdFound = null;
                for(var i in oData.productList){
                    var oProd = oData.productList[i];
                    if(oProd.Rewrite == sRewrite){
                        oProdFound = oProd;
                        break;
                    }
                }

                if(oProdFound == null){
                    var oRouter = this.getRouter();
                    oRouter.navTo("RoutePageNotFound");
                    return;
                }

                var oViewModel = new sap.ui.model.json.JSONModel();
                oViewModel.setData(oProdFound);
                this.getView().setModel(oViewModel,"product");
            }
        });
    });
