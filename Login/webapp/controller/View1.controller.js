sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("logaligroup.Login.controller.View1", {
			onInit: function () {
                var oViewModel = new sap.ui.model.json.JSONModel({});
                this.getView().setModel(oViewModel,"oViewModel");
                //Se comprueba si esta loggueado
                var user = sessionStorage.getItem("user");
                var token = sessionStorage.getItem("token");
                if(user && token){
                    jQuery.ajax({

                    url: "sapapirest_logali/", 
                    dataType: 'json',
                    data:{
                        destination: "get_resource",
                        user_id: user,
                        token: token
                    },

                    success: function(data) {
                        //Login correcto
                        if(data.rc == "0"){
                            this.getView().getModel("oViewModel").setProperty("/userData",data.data); 
                            this.getView().getModel("oViewModel").setProperty("/logged",true);           
                        }else{
                            sap.m.MessageToast.show(data.msg);
                        }
                    }.bind(this),
                    error: function(e){}
                    })
                }

            },
            onPressLogin: function(){
                //Se comprueba si ya está logueado
                if(this.getView().getModel("oViewModel").getProperty("/logged")){
                    var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                if (!this.oDialogUser) {  

                        this.oDialogUser = new sap.m.Dialog({
                            title: "{i18n>datosUsuario}",
                            content: [
                                new sap.m.Label({
                                    text: "{i18n>usuario}",
                                    design:"Bold",
                                    width : "100%"
                                }),
                                new sap.m.Text( {
                                    text : "{oViewModel>/userData/user_name}",
                                    width : "100%"
                                }),
                                new sap.m.Label({
                                    text: "{i18n>correo}",
                                    design:"Bold",
                                    width : "100%"
                                }),
                                new sap.m.Text( {
                                    text : "{oViewModel>/userData/email}",
                                    width : "100%"
                                }),
                                new sap.m.Label({
                                    text: "{i18n>tipo}",
                                    design:"Bold",
                                    width : "100%"
                                }),
                                new sap.m.Text( {
                                    text : { path:"oViewModel>/userData/role_id",formatter:function(value1){
                                        if(value1 === "1"){
                                            return oResourceBundle.getText("administrador")
                                        }
                                    }}
                                })
                            ],
                            beginButton: new sap.m.Button({
                                text: "{i18n>cerrarSesion}",
                                press:  this._callLogout.bind(this)
                            }),
                            endButton: new sap.m.Button({
                                text: "{i18n>cerrar}",
                                press: function () {
                                    this.oDialogUser.close();
                                }.bind(this)
                            })
                        }).addStyleClass("sapUiContentPadding");
                        this.getView().addDependent(this.oDialogUser);
                    }
                    this.oDialogUser.open();
                }else{
                    if (!this.oDialogLogin) {  
                    this.oDialogLogin = new sap.m.Dialog({
                        title: "{i18n>iniciarSesion}",
                        content: [
                            new sap.m.Label({
                                text: "{i18n>usuario}"
                            }),
                            new sap.m.Input( {
                                width: "100%",
                                value : "{oLoginModel>/user_name}"
                            }),
                            new sap.m.Label({
                                text: "{i18n>contrasenia}"
                            }),
                            new sap.m.Input( {
                                width: "100%",
                                value : "{oLoginModel>/password}",
                                type:"Password"
                            }),
                            new sap.m.FlexBox({
                                justifyContent:"Center",
                                alignItems:"Center",
                                items:[
                                    new sap.m.Link({text:"{i18n>registrarse}",
                                    press : this.onPressRegister.bind(this)})
                                ]
                            })
                        ],
                        beginButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: "{i18n>entrar}",
                            press: this._callLogin.bind(this)
                        }),
                        endButton: new sap.m.Button({
                            text: "{i18n>cancelar}",
                            press: function () {
                                this.oDialogLogin.close();
                            }.bind(this)
                        })
                    }).addStyleClass("sapUiContentPadding");
                    this.getView().addDependent(this.oDialogLogin);
                }
                this.oDialogLogin.setModel(new sap.ui.model.json.JSONModel({}),"oLoginModel")
                this.oDialogLogin.open();
            }
        },
            _callLogin: function(oEvent) {
                //Se comprueba que este relleno user and pass
                var oLoginModel = this.oDialogLogin.getModel("oLoginModel");
                var user_name = oLoginModel.getProperty("/user_name");
                var password = oLoginModel.getProperty("/password");
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                if(!user_name){
                    sap.m.MessageToast.show(oResourceBundle.getText("campoUserObligatorio"))
                }else if(!password){
                    sap.m.MessageToast.show(oResourceBundle.getText("campoPasswordObligatorio"))
                }else{
                    //Llamamos al servicio
                    jQuery.ajax({

                    url: "sapapirest_logali/", 
                    dataType: 'json',
                    data:{
                        destination: "login",
                        user_name: user_name,//"admin",
                        password: password,//"fullstack"
                    },

                    success: function(data) {
                        //Login correcto
                        if(data.rc == "0"){
                            sessionStorage.setItem("user",data.data.user_id);
                            sessionStorage.setItem("token",data.token.token);
                            this.getView().getModel("oViewModel").setProperty("/userData",data.token); 
                            this.getView().getModel("oViewModel").setProperty("/logged",true);           
                        }else{
                            sap.m.MessageToast.show(data.msg);
                        }
                        this.oDialogLogin.close();
                    }.bind(this),
                    error: function(e){

                    }

                    })
                }
            },
            onPressRegister : function(oEvent){
                if (!this.oDialogRegister) {  
                    this.oDialogRegister = new sap.m.Dialog({
                        title: "{i18n>registrarse}",
                        content: [
                            new sap.ui.layout.form.SimpleForm({
                                editable:true,
                                layout:"ResponsiveGridLayout",
                               content:[

                                
                            new sap.m.Label({
                                text: "{i18n>usuario}"
                            }),
                            new sap.m.Input( {
                                width: "100%",
                                value : "{oRegisterModel>/user_name}"
                            }),
                            new sap.m.Label({
                                text: "{i18n>contrasenia}"
                            }),
                            new sap.m.Input( {
                                width: "100%",
                                value : "{oRegisterModel>/password}",
                                type:"Password"
                            }),
                           new sap.m.Label({
                                width:"100%",
                                text: "{i18n>repetirContrasenia}"
                            }),
                            new sap.m.Input( {
                                width: "auto",
                                value : "{oRegisterModel>/passwordCopy}",
                                type:"Password"
                            }),
                            new sap.m.Label({
                                width:"100%",
                                text: "{i18n>nombre}"
                            }),
                            new sap.m.Input( {
                                width: "auto",
                                value : "{oRegisterModel>/first_name}"
                            }),
                            new sap.m.Label({
                                width:"100%",
                                text: "{i18n>apellidos}"
                            }),
                            new sap.m.Input( {
                                width: "auto",
                                value : "{oRegisterModel>/last_name}"
                            }),
                            new sap.m.Label({
                                width:"100%",
                                text: "{i18n>telefono}"
                            }),
                            new sap.m.Input( {
                                width: "auto",
                                value : "{oRegisterModel>/telephone}"
                            }),
                            new sap.m.Label({
                                width:"100%",
                                text: "{i18n>correo}"
                            }),
                            new sap.m.Input( {
                                width: "auto",
                                value : "{oRegisterModel>/email}"
                            })
                            ]
                            })
                        ],
                        beginButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: "{i18n>crear}",
                            press: this._callRegister.bind(this)
                        }),
                        endButton: new sap.m.Button({
                            text: "{i18n>cancelar}",
                            press: function () {
                                this.oDialogRegister.close();
                            }.bind(this)
                        })
                    }).addStyleClass("sapUiContentPadding");
                    this.getView().addDependent(this.oDialogRegister);
                }
                this.oDialogRegister.setModel(new sap.ui.model.json.JSONModel({}),"oRegisterModel")
                this.oDialogRegister.open();
            },
            _callRegister : function(oEvent){
                //Se comprueba si estan todos los cmapos rellenos
                var oRegisterModel = this.oDialogRegister.getModel("oRegisterModel");
                var dataRegister = oRegisterModel.getData();
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var ok = false;
                if(dataRegister.user_name  && dataRegister.password && dataRegister.passwordCopy && dataRegister.first_name && dataRegister.last_name && dataRegister.telephone && dataRegister.email){
                    ok = true;
                }else{
                    sap.m.MessageToast.show(oResourceBundle.getText("todosCamposObligatorios"))
                }
                //Se comprueba si la password coincide
                if(dataRegister.password !== dataRegister.passwordCopy){
                    ok = false;
                    sap.m.MessageToast.show(oResourceBundle.getText("contraseniasNoIguales"))
                }
                if(ok){
                    jQuery.ajax({

                        url: "sapapirest_logali/", 
                        dataType: 'json',
                        data:{
                            destination: "register",
                            user_name: dataRegister.user_name,
                            password: dataRegister.password,
                            first_name : dataRegister.first_name,
                            last_name : dataRegister.last_name,
                            telephone : dataRegister.telephone,
                            email : dataRegister.email
                        },

                        success: function(data) {
                            //Login correcto
                            if(data.rc == "0"){
                                sessionStorage.setItem("user",data.data.user_id);
                                sessionStorage.setItem("token",data.token.token);
                                this.getView().getModel("oViewModel").setProperty("/userData",data.token); 
                                this.getView().getModel("oViewModel").setProperty("/logged",true);           
                            }else{
                                sap.m.MessageToast.show(data.msg);
                            }
                            this.oDialogRegister.close();
                            this.oDialogLogin.close();
                        }.bind(this),
                        error: function(e){

                        }

                        })
                }
            },
            _callLogout: function () {
                //Borramos los datos de session, llamamos a logout y refrescamos la página.
                var user = sessionStorage.getItem("user");
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("token");
                jQuery.ajax({

                        url: "sapapirest_logali/", 
                        dataType: 'json',
                        data:{
                            destination: "logout",
                            user_id : user
                        },

                        success: function(data) {
                            window.location.reload();
                        }.bind(this),
                        error: function(e){

                        }

                        })
            }
		});
	});
