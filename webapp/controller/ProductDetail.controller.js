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
                var that = this;
                var oArgs = oEvent.getParameter("arguments");
                var sRewrite = oArgs.rewrite;
                var oModel = this.getOwnerComponent().getModel();
                var aFilter = [];
                var oFilter = new sap.ui.model.Filter({
                    path: 'Rewrite',
                    operator: "EQ",
                    value1: sRewrite
                });
                aFilter.push(oFilter);
                
                oModel.read("/productSet",{
                    filters: aFilter,
                    success: function(oData,oResponse){
                        if(oResponse.statusCode == 200 && oData.results.length == 1){
                            that.updateProductData(oData.results[0]);
                        }else{
                            var oRouter = this.getRouter();
                            oRouter.navTo("RoutePageNotFound");
                            return;
                        }
                    },
                    error: function(oError){
                        console.log(oError);
                    }
                });
            },

            updateProductData: function(oData){
                var oViewModel = new sap.ui.model.json.JSONModel();
                oViewModel.setData(oData);
                this.getView().setModel(oViewModel,"product");
            }
        });
    });
