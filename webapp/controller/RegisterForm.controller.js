sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,MessageToast) {
        "use strict";

        return BaseController.extend("zapp.fiorishop.controller.RegisterForm", {
            onInit: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oModel);
            },

            onChangePassword: function(){
                var oPass1  = this.byId("customer.password1");
                var oPass2  = this.byId("customer.password2");
                var oStatus = this.byId("customer.password.status");

                var sPass1 = oPass1.getValue();
                var sPass2 = oPass2.getValue();

                if(sPass2 == ""){
                    return;
                }

                if(sPass1 != sPass2){
                    oStatus.setText("As senhas não coincidem");
                    oStatus.setState("Error");
                }else{
                    oStatus.setText("OK");
                    oStatus.setState("Success");
                }
            },

            onSave: function(){
                var oView = this.getView();
                var oViewModel = oView.getModel();
                var oData = oViewModel.getData();

                // validações
                if(oData.Name == ""){
                    MessageToast.show("Nome vazio");
                    return;
                }

                if(oData.Email == ""){
                    MessageToast.show("E-mail vazio");
                    return;
                }

                if(oData.Password == ""){
                    MessageToast.show("Senha vazia");
                    return;
                }

                if(oData.Password != oData.Password2){
                    MessageToast.show("Senhas divergentes");
                    return;
                }

                // persistência
                delete oData.Password2;

                var oModel = this.getOwnerComponent().getModel();
                oModel.create("/customerSet",oData,{
                    success: function(oData,oResponse){
                        if(oResponse.statusCode == 201){
                            MessageToast.show("Cadastro realizado com sucesso");
                        }else{
                            MessageToast.show("Erro ao realizar cadastro");
                        }
                    },
                    error: function(oError){
                        MessageToast.show("Erro ao realizar cadastro");
                    }
                });
            }
        });
    });
