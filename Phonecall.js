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
channelType = {

    CHANNELOPTION: 866760002
}

//CONSTANTS
var recordId = Xrm.Page.data.entity.getId();
var entityLogicalName = Xrm.Page.data.entity.getEntityName();

RSA.Phonecall = {

    //onLoad function for this form
    onLoad: function () {
        var formtype = Xrm.Page.ui.getFormType();

        if (formtype == formType.CREATE) {
            this.VisibleRuleConvertoOpportunity();
        }
        else if (formtype == formType.UPDATE) {

        }
        else if (formtype == formType.READONLY) {

        }
        else if (formtype == formType.DISABLED) {

        }
    },

    //onSave function for this form
    onSave: function () {
        var formtype = Xrm.Page.ui.getFormType();

        if (formtype == formType.CREATE) {

        }
        else if (formtype == formType.UPDATE) {

        }
        else if (formtype == formType.READONLY) {

        }
        else if (formtype == formType.DISABLED) {

        }
    },

    //clear call sub-reason on change of call reason
    onChangeCallReason: function () {
        Xrm.Page.getAttribute("rsa_callsubreasonid").setValue(null);
    },

    //***once we are clicking the Covert to opportunity button open opportunity window.****//
    openOpportunityWindow: function () {

        Xrm.Page.data.entity.save(); // save phonecall before opening Opportunity

        if (Xrm.Page.getAttribute("rsa_callreasonid").getValue() == null)
            return; // do not open Opportunity form if Call Reason is not filled

        var callReason = Xrm.Page.getAttribute("rsa_callreasonid").getValue();
        var callSubreason = Xrm.Page.getAttribute("rsa_callsubreasonid").getValue();
        var contactLookup = Xrm.Page.getAttribute("regardingobjectid").getValue();
        var windowOptions = {
            openInNewWindow: true
        };

        var parameters = {};
        parameters["parentcontactid"] = contactLookup[0].id;
        parameters["parentcontactidname"] = contactLookup[0].name;
        parameters["rsa_channel"] = 866760002; // Phone
        parameters["rsa_originatingphonecallid"] = Xrm.Page.data.entity.getId(); // set phonecall lookup
        parameters["rsa_originatingphonecallidname"] = Xrm.Page.getAttribute("subject").getValue(); // set phonecall lookup

        if (callReason != null) {
            parameters["rsa_callreasonid"] = callReason[0].id;
            parameters["rsa_callreasonidname"] = callReason[0].name;
        }
        if (callSubreason != null) {
            parameters["rsa_callsubreasonid"] = callSubreason[0].id;
            parameters["rsa_callsubreasonidname"] = callSubreason[0].name;
        }

        //Open opportunity form in new window
        Xrm.Utility.openEntityForm("opportunity", null, parameters, windowOptions);
    },

    //*****Based on regading field hide/show ribbon convert to opportunity button.******//
    OnchangeRegardingField: function () {
        Xrm.Page.ui.refreshRibbon();
    },

    //****Based on contact field(regarding field ="contact") convert to opportunity button is visible.*** //
    VisibleRuleConvertoOpportunity: function () {

        var regardingObject = Xrm.Page.getAttribute("regardingobjectid");
        if (regardingObject != null && regardingObject.getValue() != null) {

            var contactlookup = regardingObject.getValue()[0];
            var contactId = contactlookup.id;
            if (contactlookup.entityType == "contact")
                return true;
            else
                return false;
        }
        else
            return false;
    },
    VisibleRuleConvertoOpp: function () {

        var regardingObject = Xrm.Page.getAttribute("regardingobjectid");
        var leadvalueflag = false;
        if (regardingObject != null && regardingObject.getValue() != null) {
            var leadlookup = regardingObject.getValue()[0];
            var leadId = leadlookup.id;
            if (leadlookup.entityType == "lead") {
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/LeadSet(guid' " + leadId + "')?$select=StateCode,StatusCode", false);
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        this.onreadystatechange = null;
                        if (this.status === 200) {
                            var result = JSON.parse(this.responseText).d;
                            var stateCode = result.StateCode;
                            var statusCode = result.StatusCode;

                            if (leadlookup.entityType == "lead" && stateCode.Value == 0)
                                leadvalueflag = true;
                        }
                        else {
                            alert(this.statusText);
                        }
                    }
                };
                req.send();
            }

        }
        return leadvalueflag;
    },


    Leadconversion: function () {

        var regardingObject = Xrm.Page.getAttribute("regardingobjectid");

        if (regardingObject != null && regardingObject.getValue() != null) {
            var leadlookup = regardingObject.getValue()[0];
            var leadId = leadlookup.id;
            leadId = leadId.replace(/[{}]/g, "");
            RSA.Phonecall.callAction("leads", "Microsoft.Dynamics.CRM.rsa_QualifyLead", leadId);

        }
    },
    callAction: function (entityName, actionName, targetid) {
        var result = null;

        var oDataEndPoint = Xrm.Page.context.getClientUrl() + "/api/data/v8.0/";

        var req = new XMLHttpRequest();
        req.open("POST", oDataEndPoint + entityName + "(" + targetid + ")/" + actionName, false);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                req.onreadystatechange = null;

                if (this.status == 200) {
                    result = JSON.parse(this.response);
                    Xrm.Utility.openEntityForm("opportunity", result.OpportunityID);
                }
                else {
                    var error = JSON.parse(this.response).error;
                    alert(error.message);
                }
            }
        };
        req.send();
        return result;
    },
}
