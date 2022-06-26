sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,MessageToast) {
        "use strict";

        return BaseController.extend("zapp.fiorishop.controller.LoginForm", {
            onInit: function () {
            },

            onLogin: function(){
                var that = this;
                var oEmail    = this.byId("email");
                var oPassword = this.byId("password");
                var aFilter   = [];
                
                // inicialização
                oEmail.setValueState("None");
                oPassword.setValueState("None");

                if(oEmail.getValue() == ""){
                    oEmail.setValueState("Error");
                }

                if(oPassword.getValue() == ""){
                    oPassword.setValueState("Error");
                }

                var oFilter1 = new sap.ui.model.Filter({
                    path: 'Email',
                    operator: 'EQ',
                    value1: oEmail.getValue()
                });
                aFilter.push(oFilter1);

                var oFilter2 = new sap.ui.model.Filter({
                    path: 'Password',
                    operator: 'EQ',
                    value1: oPassword.getValue()
                });
                aFilter.push(oFilter2);

                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/customerSet",{
                    filters: aFilter,
                    success: function(oData,oResponse){
                        if(oResponse.statusCode == 200 && oData.results.length == 1){
                            that.createSession(oData.results[0]);
                        }else{
                            MessageToast.show("Erro ao efetuar login");
                        }
                    },
                    error: function(oError){
                        MessageToast.show("Erro ao efetuar login");
                        console.log(oError);
                    }
                })
            },

            createSession: function(oCustomer){
                oCustomer.Password = null;
                window.sessionStorage.setItem("customer",JSON.stringify(oCustomer));

                var oRouter = this.getRouter();

                var sRoute = window.sessionStorage.getItem("route_after_login");
                if(sRoute != null){
                    window.sessionStorage.setItem("route_after_login",null)
                    oRouter.navTo(sRoute);
                }else{
                    oRouter.navTo("RouteHome");
                }
            }
        });
    });
