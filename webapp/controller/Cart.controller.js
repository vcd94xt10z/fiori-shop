sap.ui.define([
    "./BaseController",
    "./OrderManager",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,OrderManager,MessageToast) {
        "use strict";

        return BaseController.extend("zapp.fiorishop.controller.Cart", {
            onInit: function () {
            },

            onGoToCheckout: function(){
                var oRouter = this.getRouter();
                oRouter.navTo("RouteCheckout");
            },

            onCalcFreight: function(){
                var that = this;
                var oZipcode = this.byId("zipcode");
                var sZipcode = oZipcode.getValue();
                
                jQuery.ajax({
                    type: "GET",
                    contentType: "application/xml",
                    url: "https://viacep.com.br/ws/"+sZipcode+"/json/",
                    dataType: "json",
                    async: false,
                    success: function(data, textStatus, jqXHR) {
                        if(jqXHR.status == 200){
                            window.cepResult = data;

                            var oData = {
                                FreightTotal: that.formatter.randFloat(10,30,2),
                                Zipcode: data.cep,
                                Address: data.logradouro,
                                Number: '',
                                City: data.localidade,
                                Region: data.uf,
                                CarrierID:  '1',
                                CarrierName: 'Correios - SEDEX'
                            };

                            var om = new OrderManager(that);
                            om.updateFreight(oData,function(oResponse){
                                MessageToast.show("Frete atualizado");

                                om.loadOrder(function(oOrder){
                                    om.updateModels(oOrder);
                                });
                            });
                        }
                    },
                    error: function(a,b,c){
                        console.log(a);
                        console.log(b);
                        console.log(c);
                    }
                });
            }
        });
    });
