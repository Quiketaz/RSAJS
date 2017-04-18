if (typeof (RSA) == "undefined") {
    RSA = { __namespace: true };
}

//ENUMS
formType = {
    CREATE: 1,
    UPDATE: 2,
    READONLY: 3,
    DISABLED: 4
}

var count = 0;

RSA.HelperLibrary = {

    //Calls the action from JS
    callAction: function (actionName, inputParams, successCallback, errorCallback, url) {
        if (url == null) {
            url = parent.Xrm.Page.context.getClientUrl();
        }

        var requestXml = "<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>" +
              "<s:Body>" +
                "<Execute xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>" +
                  "<request xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>" +
                    "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>";

        if (inputParams) {
            // Add each input param
            for (var i = 0; i < inputParams.length; i++) {
                var param = inputParams[i];

                if (param.value == null)
                    continue;

                var value = "";
                var displayXmlns = false;

                // Check the param type to determine how the value is formed
                switch (param.type) {
                    case "c:boolean":
                    case "c:int":
                    case "c:string":
                        value = param.value;
                        displayXmlns = true;
                        break;
                    case "c:dateTime":
                        value = param.value.toISOString();
                        displayXmlns = true;
                        break;
                    case "a:EntityReference":
                        value = "<a:Id>" + param.value.id + "</a:Id>" +
                          "<a:LogicalName>" + param.value.entityType + "</a:LogicalName>" +
                          "<a:Name i:nil='true' />";
                        break;
                    case "a:OptionSetValue":
                    case "a:Money":
                        value = "<a:Value>" + param.value + "</a:Value>";
                        break;
                    default:
                        if (errorCallback) {
                            errorCallback("Type of input parameter " + (i + 1) + " '" + param.type + "' is invalid or unsupported");
                        }
                        return;
                        break;
                }

                requestXml += "<a:KeyValuePairOfstringanyType>" +
                        "<b:key>" + param.key + "</b:key>" +
                        "<b:value i:type='" + param.type + "' " + (displayXmlns ? "xmlns:c='http://www.w3.org/2001/XMLSchema'" : "") + ">" + value + "</b:value>" +
                      "</a:KeyValuePairOfstringanyType>";
            }
        }

        requestXml += "</a:Parameters>" +
                    "<a:RequestId i:nil='true' />" +
                    "<a:RequestName>" + actionName + "</a:RequestName>" +
                  "</request>" +
                "</Execute>" +
              "</s:Body>" +
            "</s:Envelope>";

        var req = new XMLHttpRequest();
        req.open("POST", url + "/XRMServices/2011/Organization.svc/web", true);
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");

        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    // Action completed successfully - get output params
                    var responseParams = req.responseXML.getElementsByTagName("a:KeyValuePairOfstringanyType"); // IE
                    if (responseParams.length == 0) {
                        responseParams = req.responseXML.getElementsByTagName("KeyValuePairOfstringanyType"); // FireFox and Chrome
                    }

                    var outputParams = [];
                    for (i = 0; i < responseParams.length; i++) {

                        var attrNameNode = responseParams[i].childNodes[0].firstChild;
                        var attributeName = attrNameNode.textContent || attrNameNode.nodeValue || attrNameNode.data || attrNameNode.text;

                        var attributeValue = "";
                        if (responseParams[i].childNodes[1].firstChild != null) {
                            var attrValueNode = responseParams[i].childNodes[1].firstChild;
                            attributeValue = attrValueNode.textContent || attrValueNode.nodeValue || attrValueNode.data || attrValueNode.text;
                        }

                        // Values will be string, figure out the types yourself
                        outputParams.push({ key: attributeName, value: attributeValue });
                    }

                    if (successCallback) {
                        // Make sure the callback accepts exactly 1 argument - use dynamic function if you want more
                        successCallback(outputParams);
                    }
                }
                else {
                    // Error has occured, action failed
                    if (errorCallback) {
                        var error = null;
                        try { error = req.responseXML.getElementsByTagName("Message")[0].firstChild.nodeValue; } catch (e) { }
                        errorCallback(error);
                    }
                }
            }
        };

        req.send(requestXml);
    },

    //Retrieve record based on id passed
    retrieveRecords: function (id, successCallback, errorCallback, url) {

        var serverUrl = Xrm.Page.context.getClientUrl();
        var odataEndPoint = "/XRMServices/2011/OrganizationData.svc/";
        if (!id) {
            alert("record id is required.");
            return;
        }

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: serverUrl + odataEndPoint + "/" + url,

            beforeSend: function (XMLHttpRequest) {

                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {

                if (successCallback) {
                    successCallback(data.d, textStatus, XmlHttpRequest);
                }
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                if (errorCallback)
                    errorCallback(XmlHttpRequest, textStatus, errorThrown);
                else
                    errorHandler(XmlHttpRequest, textStatus, errorThrown);
            }
        });

    },

    //Refresh the sub-grid passed
    RefreshDocumentGrid: function (gridControl) {
        Xrm.Page.ui.controls.get(gridControl).refresh();
    },

    //Calls the action from JS using the WebAPI
    webApiCallAction: function (actionName, inputParams, successCallback, errorCallback, url) {
        if (url == null) {
            url = parent.Xrm.Page.context.getClientUrl();
        }

        //query to send the request to the global Action 
        //var query = 'rsa_documentpacks(' + inputParams +')/Microsoft.Dynamics.CRM.rsa_ResendDocuments';

        //set the guid in to _inputParameter of the 
        //_InputParameter = "<documentpack><rsa_isfinalstage>false</rsa_isfinalstage><rsa_contactid>5678</rsa_contactid><rsa_suppressionindicator>No</rsa_suppressionindicator><rsa_policyid>NBSH100002184P</rsa_policyid><rsa_outputchannel>866760003</rsa_outputchannel><rsa_documentsreceivedon>21-10-2016 12:48:44</rsa_documentsreceivedon><rsa_clientstream>866760002</rsa_clientstream><rsa_deliverydata>AnyTEXT</rsa_deliverydata><document><rsa_name>test</rsa_name></document><document><rsa_name>test2</rsa_name></document></documentpack>";

        //Pass the input parameters of action
        var data = inputParams;

        //Create the HttpRequestObject to send WEB API Request 
        var req = new XMLHttpRequest();
        //Post the WEB API Request 
        req.open("POST", url + "/api/data/v8.0/" + actionName, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    //You can get the output parameter of the action with name as given below
                    result = JSON.parse(this.response);
                    if (successCallback) {
                        // Make sure the callback accepts exactly 1 argument - use dynamic function if you want more
                        successCallback(results);
                    }
                } else {
                    // Error has occured, action failed
                    if (errorCallback) {
                        var error = null;
                        try { error = JSON.parse(this.response).error; } catch (e) { }
                        errorCallback(error);
                    }
                }
            }
        };
        //Execute request passing the input parameter of the action 
        req.send(window.JSON.stringify(data));
    },

    //Ad Hoc functionality - TimeOut approach
    ConfigureAdHocIframe: function () {

        if (count > 0)
            return;

        setTimeout(function () {

            var formtype = Xrm.Page.ui.getFormType();

            if (formtype != formType.UPDATE) return;

            var entityName = Xrm.Page.data.entity.getEntityName();
            var referenceNumber = null;

            switch (entityName) {
                case "contact":
                    referenceNumber = Xrm.Page.getAttribute("rsa_mdmid").getValue();
                    break;
                case "rsa_policy":
                case "rsa_quote":
                    referenceNumber = Xrm.Page.getAttribute("rsa_name").getValue();
                    break;
                default:
                    return;
            }

            var guid = RSA.HelperLibrary.GenerateGUID();

            switch (entityName) {
                case "contact":
                case "rsa_quote":
                    var url = "https://tt216bvi.messagepoint.com/mp/connected_portal_gateway.form?touchpoint_guid=EBE1D143B0F4486E5E96570BFF4016D8&order_guid=" + guid + "&EntityName=" + entityName + "&Reference=" + referenceNumber;
                    break;
                case "rsa_policy":
                    var url = "https://tt216bvi.messagepoint.com/mp/connected_portal_gateway.form?touchpoint_guid=EBE1D143B0F4486E5E96570BFF4016D8&order_guid=" + guid + "&EntityName=" + entityName + "&Reference=" + referenceNumber + "&PolicyNumber=" + referenceNumber;
                    break;
            }

            var IFrame = Xrm.Page.ui.controls.get("IFRAME_AdHocDocuments");
            IFrame.setSrc(url);
            count = 1;

        }, 300);
    },   

    //ConfigureAdHocIframe: function () {

    //        var formtype = Xrm.Page.ui.getFormType();

    //        if (formtype != formType.UPDATE) return;

    //        var entityName = Xrm.Page.data.entity.getEntityName();
    //        var referenceNumber = null;

    //        switch (entityName) {
    //            case "contact":
    //                referenceNumber = Xrm.Page.getAttribute("rsa_mdmid").getValue();
    //                break;
    //            case "rsa_policy":
    //            case "rsa_quote":
    //                referenceNumber = Xrm.Page.getAttribute("rsa_name").getValue();
    //                break;
    //            default:
    //                return;
    //        }

    //        var guid = RSA.HelperLibrary.GenerateGUID();

    //        switch (entityName) {
    //            case "contact":
    //            case "rsa_quote":
    //                var url = "https://tt216bvi.messagepoint.com/mp/connected_portal_gateway.form?touchpoint_guid=EBE1D143B0F4486E5E96570BFF4016D8&order_guid=" + guid + "&EntityName=" + entityName + "&Reference=" + referenceNumber;
    //                break;
    //            case "rsa_policy":
    //                var url = "https://tt216bvi.messagepoint.com/mp/connected_portal_gateway.form?touchpoint_guid=EBE1D143B0F4486E5E96570BFF4016D8&order_guid=" + guid + "&EntityName=" + entityName + "&Reference=" + referenceNumber + "&PolicyNumber=" + referenceNumber;
    //                break;
    //        }                        

    //        var IFrame = Xrm.Page.ui.controls.get("IFRAME_AdHocDocuments");
    //        IFrame.setSrc(url);                    
    //},

    //SetIFrameVisible: function(){
    //    Xrm.Page.getControl("IFRAME_AdHocDocuments").setVisible(true);
    //},

    GenerateGUID: function () {

        return RSA.HelperLibrary.s4() + RSA.HelperLibrary.s4() + '-' + RSA.HelperLibrary.s4() + '-' + RSA.HelperLibrary.s4() + '-' +
              RSA.HelperLibrary.s4() + '-' + RSA.HelperLibrary.s4() + RSA.HelperLibrary.s4() + RSA.HelperLibrary.s4();
    },

    s4: function () {

        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    },

    //This function stops save even if Save has triggerd through auto save event
    preventAutoSave: function (econtext) {
        var eventArgs = econtext.getEventArgs();
        if (eventArgs.getSaveMode() == 70 || eventArgs.getSaveMode() == 2) {
            eventArgs.preventDefault();
        }
    },

    DisplayNotification: function (message, type, id, time) {
        if (time == null)
        { time = 3000; }//Display time in milliseconds

        //Display the notification
        Xrm.Page.ui.setFormNotification(message, type, id);

        //Wait the designated time and then remove
        setTimeout(
            function () {
                Xrm.Page.ui.clearFormNotification(id);
            },
            time
        );
    }
};