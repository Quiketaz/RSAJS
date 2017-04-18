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

nbAction = {
    AGREES: 866760000,
    NOTIME: 866760001,
    DECLINED: 866760002,
    INAPROPRIATE: 866760003,
    NOTASKED: 866760004

}

documentPreferences = {
    ONLINE: 866760000,
    POST: 866760001,
    REGISTEREDPOST: 866760002,
    RETURNTOBRANCH: 866760003
}

//CONSTANTS
//const HideSections = "customertypecode";
const RoRMessage = "Warning: The customer is under Reservation of Rights. Please do not amend, cancel or confirm cover as you may waive our right to take action.";
const ActiveComplaint = "Warning: Please be aware that this customer has active complaint(s)";
const VoidanceMessage = "Do Not Quote";
const ReviewMessage = "Warning: Please be aware that this customer is under review";


RSA.Contact = {

    //gets all nbas that are available for the customer and displays NBA tabs\sections
    getNba: function () {
        var flagNba = false;
        if (Xrm.Page.getAttribute('emailaddress1').getValue() == null
        && Xrm.Page.getAttribute('rsa_emailnba').getValue() != nbAction.DECLINED) {
            Xrm.Page.getAttribute('rsa_emailnba').setValue(null);
            Xrm.Page.ui.tabs.get("nba_tab").sections.get('nba_emailsection').setVisible(true);
            Xrm.Page.getAttribute('rsa_emailnba').setRequiredLevel('required');
            flagNba = true;
        }
        if (Xrm.Page.getAttribute('telephone2').getValue() == null
            && Xrm.Page.getAttribute('rsa_telephonenba').getValue() != nbAction.DECLINED) {
            Xrm.Page.getAttribute('rsa_telephonenba').setValue(null);
            Xrm.Page.ui.tabs.get("nba_tab").sections.get('nba_telephonesection').setVisible(true);
            Xrm.Page.getAttribute('rsa_telephonenba').setRequiredLevel('required');
            flagNba = true;
        }
        if (Xrm.Page.getAttribute('rsa_communicationpreferences').getValue() != null
             && Xrm.Page.getAttribute('rsa_documentnba').getValue() != nbAction.DECLINED
             && Xrm.Page.getAttribute('rsa_communicationpreferences').getValue() != documentPreferences.ONLINE
             ) {
            Xrm.Page.getAttribute('rsa_documentnba').setValue(null);
            Xrm.Page.ui.tabs.get("nba_tab").sections.get('nba_documentsection').setVisible(true);
            Xrm.Page.getAttribute('rsa_documentnba').setRequiredLevel('required');
            flagNba = true;
        }

        flagNba ? Xrm.Page.ui.tabs.get('nba_tab').setVisible(true) : Xrm.Page.ui.tabs.get('nba_tab').setVisible(false);
    },

    //onLoad function for Galaxy form
    onLoadGalaxy: function () {
        var formtype = Xrm.Page.ui.getFormType();
        this.showHide();
        if (formtype == formType.CREATE) {
            this.retrieveBrandValue();
            Xrm.Page.ui.tabs.get('nba_tab').setVisible(false);
        }
        else if (formtype == formType.UPDATE) {
            this.setFromNotification();
            this.activeComplaintNotification();
            this.getNba();
        }
        else if (formtype == formType.READONLY) {

        }
        else if (formtype == formType.DISABLED) {

        }
    },

    //onLoad function for Galaxy form
    onLoadMotor: function () {
        var formtype = Xrm.Page.ui.getFormType();

        if (formtype == formType.CREATE) {
            this.retrieveBrandValue();
            Xrm.Page.ui.tabs.get('nba_tab').setVisible(false);
        }
        else if (formtype == formType.UPDATE) {
            this.setFromNotification();
            this.activeComplaintNotification();
            this.getNba();
            this.voidanceNotification();
            this.reviewNotification();

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

    //function to hide all sections on contact form when relationship type is selected as Branch agent
    showHide: function () {

        var HideSections = Xrm.Page.data.entity.attributes.get("customertypecode").getValue();
        if (HideSections == 2) {
            Xrm.Page.ui.tabs.get("Summary").sections.get("CorrespondenceAddress").setVisible(false);
            Xrm.Page.ui.tabs.get("Summary").sections.get("OtehrDetails").setVisible(false);
            Xrm.Page.ui.tabs.get("DocumentPacks").setVisible(false);
            Xrm.Page.ui.tabs.get("QuoteInformation").setVisible(false);
            Xrm.Page.ui.tabs.get("PolicyInformation").setVisible(false);
            Xrm.Page.ui.tabs.get("Opportunities").setVisible(false);
            Xrm.Page.ui.tabs.get("DocumentPacks").setVisible(false);
            Xrm.Page.ui.tabs.get("MarketingCommunicationPreferences").setVisible(false);
            Xrm.Page.ui.tabs.get("Cases").setVisible(false);
            Xrm.Page.ui.tabs.get("thirdparties").setVisible(false);
            Xrm.Page.ui.tabs.get("Complaints").setVisible(false);
            Xrm.Page.ui.tabs.get("Claims").setVisible(false);


        }
        else {
            Xrm.Page.ui.tabs.get("Summary").sections.get("CorrespondenceAddress").setVisible(true);
            Xrm.Page.ui.tabs.get("Summary").sections.get("OtehrDetails").setVisible(true);
            Xrm.Page.ui.tabs.get("DocumentPacks").setVisible(true);
            Xrm.Page.ui.tabs.get("QuoteInformation").setVisible(true);
            Xrm.Page.ui.tabs.get("PolicyInformation").setVisible(true);
            Xrm.Page.ui.tabs.get("Opportunities").setVisible(true);
            Xrm.Page.ui.tabs.get("DocumentPacks").setVisible(true);
            Xrm.Page.ui.tabs.get("MarketingCommunicationPreferences").setVisible(true);
            Xrm.Page.ui.tabs.get("Cases").setVisible(true);
            Xrm.Page.ui.tabs.get("thirdparties").setVisible(true);
            Xrm.Page.ui.tabs.get("Complaints").setVisible(true);
            Xrm.Page.ui.tabs.get("Claims").setVisible(true);


        }
    },

    //on Tab State Change of Document Packs
    tabStateChange_DocumentPacks: function () {
        var formtype = Xrm.Page.ui.getFormType();

        if (formtype == formType.UPDATE) {
            var tabControl = Xrm.Page.ui.tabs.get("DocumentPacks");
            if (tabControl != null) {
                var tabState = tabControl.getDisplayState();
                //collapsed ,expanded
                if (tabState == "collapsed") {
                    RSA.DocumentPackHelper.GetDocumentPack();
                }
            }
        }
    },
    //Set the notification on the contact form
    setFromNotification: function () {
        var flag = Xrm.Page.getAttribute("rsa_ror").getValue();

        if (flag == 1 && flag != null) {
            Xrm.Page.ui.setFormNotification(RoRMessage, 'WARNING', '2');
        }
        else {
            Xrm.Page.ui.clearFormNotification('2');
        }
    },


    activeComplaintNotification: function () {
        var complaintsFlag = Xrm.Page.getAttribute("rsa_activecomplaints").getValue();

        if (complaintsFlag == 1 && complaintsFlag != null) {

            Xrm.Page.ui.setFormNotification(ActiveComplaint, 'WARNING', '1');
        }
        else {
            Xrm.Page.ui.clearFormNotification('1');

        }
    },


    voidanceNotification: function () {

        var voidanceFlag = Xrm.Page.getAttribute("rsa_voidance").getValue();
        if (voidanceFlag == 1 && voidanceFlag != null) {
            Xrm.Page.ui.clearFormNotification('2');
            Xrm.Page.ui.setFormNotification(VoidanceMessage, 'WARNING', '3');
        }
        else
            Xrm.Page.ui.clearFormNotification('3');
    },


    reviewNotification: function () {

        var reviewFlag = Xrm.Page.getAttribute("rsa_review").getValue();
        if (reviewFlag == 1 && reviewFlag != null) {
            Xrm.Page.ui.setFormNotification(ReviewMessage, 'WARNING', '4');
        }
        else
            Xrm.Page.ui.clearFormNotification('4');
    },

    //this method is called when a SaveCongruency button is called
    ButtonClick_SaveCongruency: function()
    {        
        if (Xrm.Page.data.entity.getIsDirty())
            {
                Xrm.Page.getAttribute("rsa_iscongruencysave").setValue(true);
                Xrm.Page.data.entity.save();
            }
    },

    canUpdateContact: function() {
        RSA.Contact.retrieveUserPrivileges(
            function (privileges) {
                if (privileges != null)
                    for (var i = 0; i < privileges.length; i++) {
                        var RoleId = Roles[i];

                        //var selectQuery = "/RoleSet?$top=1&$filter=RoleId eq guid'" + RoleId + "'&$select=Name";
                        //var role = null;
                        //role = makeRequest(selectQuery);
                        //var RoleName = role[0].Name;
                        alert("Role ID=" + RoleId);
                        //alert("Role ID=" + RoleId + " Role Name=" + RoleName);
                    }
            }
        );
    },

    //webapi call to retrive brand from the owner of the contact record.
    retrieveBrandValue: function () {
        debugger;
        var userid = Xrm.Page.getAttribute("ownerid").getValue();
        var newid = userid[0].id.slice(1, -1);

        var req = new XMLHttpRequest();

        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.1/systemusers(" + newid + ")?$select=_new_brand_value", true); //get brand from user
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

                    var userbrand = result._new_brand_value; //get the id of the brand
                    var userbandformatted = result["_new_brand_value@OData.Community.Display.V1.FormattedValue"]; //get the formatted name of the brand
                    if (userbrand != null) {
                        var value = new Array();
                        value[0] = new Object();
                        value[0].id = userbrand;
                        value[0].name = userbandformatted;
                        value[0].entityType = "rsa_brand";

                        Xrm.Page.getAttribute("rsa_brand").setValue(value); //set the lookup
                    }
                    else
                        alert("Your user profile is missing brand information; please add and try again!")
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                }
            }
        };
        req.send();
    },

    retrieveUserPrivileges: function (successCallback) {
        var userid = parent.Xrm.Page.context.getUserId()
        var newid = userid[0].id.slice(1, -1);
        var parameters = {};

        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.1/systemusers("+ newid+ ")/Microsoft.Dynamics.CRM.RetrieveUserPrivileges", true);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");        
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                    if (successCallback) {
                        // Make sure the callback accepts exactly 1 argument - use dynamic function if you want more
                        successCallback(results);
                    }
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                }
            }
        };
        req.send(JSON.stringify(parameters));
    }
}