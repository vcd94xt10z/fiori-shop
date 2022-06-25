sap.ui.define([
	"sap/ui/core/mvc/Controller",
], function (Controller) {
	"use strict";

	return Controller.extend("zapp.fiorishop.controller.OrderManager", {
		oModel: null,
		bDebug: false,

		constructor: function(oRef){
			this.oModel = oRef.getOwnerComponent().getModel();
		},

		getItemByProductID: function(oOrder,sProductID){
			var oItemFound = null;

			for(var i in oOrder.itemList){
				var oItemLoop = oOrder.itemList[i];
				if(oItemLoop.ProductID == sProductID){
					oItemFound = oItemLoop;
					break;
				}
			}

			return oItemFound;
		},

		debugMessage: function(sMessage){
			if(this.bDebug){
				console.log(sMessage);
			}
		},

		addItemToOrder: function(oItem,callback){
			var that = this;

			// validações
			if(oItem.ProductID == ""){
				callback({
					statusCode: 400,
					message: 'Id do produto vazio',
					source: "addItemToOrder"
				});
				return;
			}

			if(oItem.Price <= 0){
				callback({
					statusCode: 400,
					message: 'Preço do produto vazio',
					source: "addItemToOrder"
				});
				return;
			}

			// carregando a ordem
			this.loadOrder(function(oOrder){
				if(oOrder == null){
					callback({
						statusCode: 400,
						message: 'Erro ao carregar ordem',
						source: "addItemToOrder"
					});
					return;
				}

				// verificar se não esta duplicado
				var bFound = false;
				for(var i in oOrder.itemList){
					var oItemLoop = oOrder.itemList[i];
					if(oItemLoop.ProductID == oItem.ProductID){
						oItemLoop.Quantity += oItem.Quantity;
						bFound = true;
						break;
					}
				}

				// item encontrado? atualiza o item e a ordem
				if(bFound){
					that.debugMessage("Item encontrado");
					that.recalc(oOrder,function(oResponse){
						that.debugMessage("Item recalculado");
						var oItemFound = that.getItemByProductID(oOrder,oItem.ProductID);
						that.debugMessage("Atualizando item");
						that._updateItem(oItemFound,function(oResponse){
							callback(oResponse);
						});
					});
				}else{
					that.debugMessage("Item não encontrado");
					// item não encontrado? insere o item e depois atualiza a ordem
					oItem.OrderID = oOrder.OrderID;
					oOrder.itemList.push(oItem);
					that.recalc(oOrder,function(oResponse){
						that.debugMessage("Item recalculado");
						that.debugMessage("Tentando inserir item");
						that._insertItem(oItem,function(oResponse){
							callback(oResponse);
						});
					});			
				}
			});
		},

		recalc: function(oOrder,callback){
			// recalculando
			oOrder.ItemTotal  = 0;
			oOrder.OrderTotal = 0;
			
			for(var i in oOrder.itemList){
				var oItem = oOrder.itemList[i];
				oItem.ItemTotal = oItem.ItemUnitary * oItem.Quantity;

				oOrder.ItemTotal += oItem.ItemTotal;
			}

			oOrder.OrderTotal = oOrder.ItemTotal + oOrder.FreightTotal;

			// persistindo
			this._updateOrderHeader(oOrder,function(oResponse){
				callback(oResponse);
			});
		},

		/**
		 * Carrega uma ordem (cabeçalho, itens etc)
		 */
		loadOrder: function(callback){
			var that = this;

			this.loadOrderHeader(function(oOrder){
				that.loadOrderItems(oOrder.OrderID,function(oData){
					oOrder.itemList = oData;
					callback(oOrder);
				});
			});
		},

		loadProduct: function(sProductID,callback){
			var sPath = "";

			sPath = "/productSet('"+sProductID+"')";
			this.oModel.read(sPath,{
				success: function(oData,oResponse){
					if(oResponse.statusCode == 404){
						callback(null);
					}else{
						callback(oData);
					}
				},
				error: function(oError){
					callback(null);
				}
			});
		},

		loadOrderHeader: function(callback){
			var oModel = this.oModel;
			var sOrderID = window.sessionStorage.getItem("OrderID");
			var sPath = "";
			var oOrder = null;
			var that = this;

			// template de ordem
			oOrder = {
				"CustomerID": 0,
				"CreateDate": new Date(),
				"DeliveryZipcode": "86031000",
				"ItemTotal": 0,
				"FreightTotal": 0,
				"OrderTotal": 0,
				"Status": "New"
			};
			if(sOrderID == null){
				this._insertOrderHeader(oOrder,callback);
			}else{
				sPath = "/orderSet("+sOrderID+")";
				oModel.read(sPath,{
					success: function(oData,oResponse){
						if(oResponse.statusCode == 404){
							that._insertOrderHeader(oOrder,callback);
						}else{
							callback(oData);
						}
					},
					error: function(oError){
						if(oError.statusCode == 404){
							that._insertOrderHeader(oOrder,callback);
						}else{
							callback(null);
						}
					}
				});
			}
		},

		loadOrderItems: function(sOrderID, callback){
			var oModel = this.oModel;
			var aFilter = [];
			var sPath = "/itemSet";

			var oFilter = new sap.ui.model.Filter({
				path: 'OrderID',
				operator: 'EQ',
				value1: sOrderID
			});
			aFilter.push(oFilter);

			oModel.read(sPath,{
				filters: aFilter,
				success: function(oData,oResponse){
					if(oResponse.statusCode == 200){
						callback(oData.results);
					}else{
						callback([]);
					}
				},
				error: function(oError){
					if(oError.statusCode == 404){
						callback([]);
					}else{
						callback([]);
					}
				}
			});
		},

		_insertOrderHeader: function(oOrder,callback){
			var oModel = this.oModel;
			oModel.create("/orderSet",oOrder,{
				success: function(oData,oResponse){
					window.sessionStorage.setItem("OrderID",oData.OrderID);
					callback(oData);
				},
				error: function(oError){
					callback(null);
				}
			});
		},

		_updateOrderHeader: function(oOrder,callback){
			var that = this;
			var oModel = this.oModel;
			
			// como o MERGE esta dando erro 500, será feito um DELETE e INSERT
			/*
			oModel.update("/orderSet",oOrder,{
				success: function(oData,oResponse){
					callback(oResponse.statusCode);
				},
				error: function(oError){
					callback(oError.statusCode);
				}
			});
			*/
			
			oModel.remove("/orderSet("+oOrder.OrderID+")",{
				success: function(oData,oResponse){
					that._insertOrderHeader(oOrder,callback);
					/*
					oModel.create("/orderSet",oOrder,{
						success: function(oData,oResponse){
							callback(oData);
						},
						error: function(oError){
							callback(null);
						}
					});
					*/
				},
				error: function(oError){
					callback(oError.statusCode);
				}
			});
		},

		_insertItem: function(oItem,callback){
			var oModel = this.oModel;
			oModel.create("/itemSet",oItem,{
				success: function(oData,oResponse){
					callback({
						statusCode: oResponse.statusCode,
						message: '',
						source: '_insertItem'
					});
				},
				error: function(oError){
					callback({
						statusCode: oError.statusCode,
						message: 'Erro',
						source: '_insertItem'
					});
				}
			});
		},

		_updateItem: function(oItem,callback){
			var that = this;
			var oModel = this.oModel;
			var sPath = "/itemSet(OrderID="+oItem.OrderID+",ItemID="+oItem.ItemID+")";
			oModel.remove(sPath,{
				success: function(oData,oResponse){
					that._insertItem(oItem,callback);
				},
				error: function(oError){
					that._insertItem(oItem,callback);
				}
			});
		}
	});
});