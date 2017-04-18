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

//CONSTANTS
const EFFECTIVEDATE = "estimatedclosedate";
const STAGE_CALL_REASON = "Call Reason";
const STAGE_DUCKCREEK = "Duck Creek";
const DUCKCREEK_FLAG = "rsa_openduckcreek";

RSA.Opportunity = {

    //onLoad function for this form
    onLoad: function () {

        this.filterCallSubReason();

        var formtype = Xrm.Page.ui.getFormType();

        if (formtype == formType.CREATE) {
            this.setEffectiveDate();

            try {
                // Call a function in another library  
                RSA.Opportunity.getBrand();

                //   Xrm.Page.data.setFormDirty(false);  // This code check if there are changes on form
            }
            catch (e) {
                Xrm.Page.ui.setFormNotification("Error onLoad" + Date().toString() + " RSA.Opportunity.OnLoad(): " + e.message, "ERROR", "RSA.Opportunity.OnLoad()");
            }

        }
        else if (formtype == formType.UPDATE) {

        }
        else if (formtype == formType.READONLY) {

        }
        else if (formtype == formType.DISABLED) {

        }

        var activeProcess = Xrm.Page.data.process.getActiveProcess();
        if (activeProcess != null) {
            Xrm.Page.data.process.removeOnStageChange(this.setDuckCreekFlag);
            Xrm.Page.data.process.addOnStageChange(this.setDuckCreekFlag);
        }
    },

    //onSave function for this form
    onSave: function () {
        var formtype = Xrm.Page.ui.getFormType();

        if (formtype == formType.CREATE) {
            //  this.advanceBusinessProcess(); // move to next stage when record is created
            try {
                // Call a function in another library  
                RSA.Opportunity.getBrand();

                //   Xrm.Page.data.setFormDirty(false);  // This code check if there are changes on form
            }
            catch (e) {
                Xrm.Page.ui.setFormNotification("Error onLoad" + Date().toString() + " RSA.Opportunity.OnLoad(): " + e.message, "ERROR", "RSA.Opportunity.OnLoad()");
            }
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

    getBrand: function () {
        try {

            if (Xrm.Page.getAttribute("parentcontactid").getValue() != null) {
                var id = Xrm.Page.getAttribute("parentcontactid").getValue()[0].id;
                var contactId = id.slice(1, -1);

                var serverUrl;

                if (Xrm.Page.context.getClientUrl !== undefined) {
                    serverUrl = Xrm.Page.context.getClientUrl();
                }
                else {
                    serverUrl = Xrm.Page.context.getServerUrl();
                }

                var ODataPath = serverUrl + "/XRMServices/2011/OrganizationData.svc";
                var contactRequest = new XMLHttpRequest();
                var leadRequest = new XMLHttpRequest();

                contactRequest.open("GET", ODataPath + "/ContactSet(guid'" + contactId + "')", false);
                contactRequest.setRequestHeader("Accept", "application/json");
                contactRequest.setRequestHeader("Content-Type", "application/json; charset=utf-8");

                contactRequest.send();
                //If  contact request was successful
                if (contactRequest.status == 200) {

                    var retrievedContact = JSON.parse(contactRequest.responseText).d;


                    var cBrand = retrievedContact.rsa_brand;
                    var value = cBrand.Name
                    var fieldName = "rsa_brandid"


                    // value cBrand
                    RSA.Opportunity.SetLookUp(fieldName, cBrand.LogicalName, cBrand.Id, value);

                }
                else {
                    console.log('Contact request failed.');

                    leadRequest.open("GET", ODataPath + "/LeadSet(guid'" + contactId + "')", false);
                    leadRequest.setRequestHeader("Accept", "application/json");
                    leadRequest.setRequestHeader("Content-Type", "application/json; charset=utf-8");

                    leadRequest.send();
                    //if lead request was succesfull

                    if (leadRequest.status == 200) {

                        var retrievedLead = JSON.parse(leadRequest.responseText).d;


                        var lBrand = retrievedLead.rsa_brandid;
                        var valuel = lBrand.Name;
                        var fieldName = "rsa_brandid";

                        var fieldName2 = "originatingleadid";

                        var value2 = retrievedLead.FullName;



                        // value cBrand
                        RSA.Opportunity.SetLookUp(fieldName, lBrand.LogicalName, lBrand.Id, valuel);

                        RSA.Opportunity.SetLookUp(fieldName2, "lead", retrievedLead.LeadId, value2);


                    }
                    else {
                        console.log('Lead request failed.');

                    }

                }

                // Xrm.Page.getAttribute("rsa_brandid").setSubmitMode("always");
                //Xrm.Page.getAttribute("originatingleadid").setSubmitMode("always");

            }
        }
        catch (e) {
            Xrm.Page.ui.setFormNotification("Error" + Date().toString() + " RSA.Opportunity.GetBrand(): " + e.message, "ERROR", "RSA.Opportunity.GetBrand");
        }
    },

    SetLookUp: function (fieldName, fieldType, fieldId, value) {
        try {
            var object = new Array();
            object[0] = new Object();
            object[0].id = fieldId;
            object[0].name = value;
            object[0].entityType = fieldType;
            Xrm.Page.getAttribute(fieldName).setValue(object);
        }
        catch (e) {
            alert("Error in SetLookUp: fieldName = " + fieldName + " fieldType = " + fieldType + " fieldId = " + fieldId + " value = " + value + " error = " + e);
        }
    },

   //Set flag if stage is moving from CALL REASON TO DUCK CREEK
    setDuckCreekFlag: function () {
        var activeStage = Xrm.Page.data.process.getActiveStage();

        if (activeStage != null && activeStage.getName() == STAGE_DUCKCREEK) {
            Xrm.Page.getAttribute(DUCKCREEK_FLAG).setValue(true);
            Xrm.Page.data.entity.save();

            // Trigger Duck Creek Tab when in USD
            if (window.IsUSD == true) {
                window.open("http://event/?eventname=RSAOpenDuckCreekQuoteForBPF");
            }

        }
        else {
            Xrm.Page.getAttribute(DUCKCREEK_FLAG).setValue(false);
            Xrm.Page.data.entity.save();

            if (activeStage != null && activeStage.getName() != STAGE_CALL_REASON) {
                // Trigger Duck Creek Tab when in USD
                if (window.IsUSD == true) {
                    window.open("http://event/?eventname=RSALoadWrapUpCallGuidenceForBPF");
                }
            }

        }
    },

    //default the Effective Date to todays date
    setEffectiveDate: function () {
        Xrm.Page.getAttribute(EFFECTIVEDATE).setValue(new Date());
    },

    AdvanceBusinessProcessStage: function () {
        var activeStage = Xrm.Page.data.process.getActiveStage();
        var dirty = Xrm.Page.data.entity.getIsDirty();
        if (activeStage != null && activeStage.getName() == STAGE_DUCKCREEK)
            this.movefarward();
    },

    //this method moved the Business Process Flow to next stage
    advanceBusinessProcess: function (activeStageName) {
        //   Xrm.Page.data.process.moveNext();

        var activePathCollection = Xrm.Page.data.process.getActivePath();

        //Enumerate the stages

        activePathCollection.forEach(function (stage, n) {

            var name = stage.getName();

            //search for specific stage by name

            if ((STAGE_DUCKCREEK == name) && (STAGE_DUCKCREEK != activeStageName)) {

                //move to the new stage

                Xrm.Page.data.process.setActiveStage(stage.getId(), function (result) {
                    var value = result;
                }
                    );
            }
        });
    },

    movefarward: function () {
        Xrm.Page.data.process.moveNext(this.callback);
    },
    retrieveCampaignCode: function () {
        Xrm.Page.getAttribute("rsa_discountcode").setValue("");
        var campaign = Xrm.Page.getAttribute("campaignid");
        if (campaign != null && campaign.getValue() != null) {
            var campaignlookup = Xrm.Page.getAttribute("campaignid").getValue()[0];
            campaignid = campaignlookup.id.replace(/[{}]/g, "");
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.0/campaigns(" + campaignid + ")?$select=promotioncodename", true);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var result = JSON.parse(this.response);
                        var promotioncodename = result["promotioncodename"];
                        Xrm.Page.getAttribute("rsa_discountcode").setValue(promotioncodename);
                    } else {
                        Xrm.Utility.alertDialog(this.statusText);
                    }
                }
            };
            req.send();
    }
    },

    // add filter condition to call sub reason
    filterCallSubReason: function ()
    {
        //Check if the control exist on the form
        if (Xrm.Page.getControl('header_process_rsa_callsubreasonid') != null) {
            // add the event handler for PreSearch Event
            Xrm.Page.getControl('header_process_rsa_callsubreasonid').addPreSearch(this.addFilter);
        }
    },

    //set the filter condition for call sub reason
    addFilter: function ()
    {
        var callReasonId = null;
        var callReason = null;
        var callReasonLookup;
        var fetchQuery;

        try {
            //Check if control exist on form

            if (Xrm.Page.getControl('header_process_rsa_callreasonid') != null
                && Xrm.Page.getControl('header_process_rsa_callreasonid').getAttribute().getValue() != null) {
                //Get Account lookup value
                callReasonLookup = Xrm.Page.getControl('header_process_rsa_callreasonid').getAttribute().getValue();
                //Get the account id
                callReason = callReasonLookup[0].id;
                callReasonId = callReason.substring(1, 37);
            }
            //Build fetch

            if (callReasonId != null || callReasonId != undefined) {
                fetchQuery = "<filter type='and'>" +
                "<condition attribute='statecode' operator='eq' value='0' />" +
                "<condition attribute='rsa_callreasonid' operator='eq' value='" + callReasonId + "' />" +
                "</filter>";

                //add custom filter
                Xrm.Page.getControl('header_process_rsa_callsubreasonid').addCustomFilter(fetchQuery);
            }

        } catch (e) {
        Xrm.Utility.alertDialog('addFilter Error: ' + (e.description || e.message));
        }
    }

}