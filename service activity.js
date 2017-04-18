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
const NBSAPPOINTMENT = "rsa_nbsappointment";
const NBSAPPOINTMENTTYPE = "rsa_appointmenttype";

var XP = Xrm.Page;

RSA.ServiceActivity = {

    //onLoad function for this form
    onLoad: function () {
        var formtype = Xrm.Page.ui.getFormType();

        if (formtype == formType.CREATE) {
            this.hideAndShowNbsAppointmentId();
        }
        else if (formtype == formType.UPDATE) {

            this.hideAndShowNbsAppointmentId();
            this.disableAppointmentType();
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


    // hide appointment type if value is "Call back" else show and make it required
    hideAndShowNbsAppointmentId: function () {
        var hideAppointmentId = Xrm.Page.data.entity.attributes.get(NBSAPPOINTMENTTYPE).getValue();

        if (hideAppointmentId == 866760002) {
            Xrm.Page.getControl("rsa_nbsappointmentid").setVisible(false);            
            Xrm.Page.getAttribute("rsa_nbsappointmentid").setRequiredLevel("none");
        }

        else {            
            Xrm.Page.getControl("rsa_nbsappointmentid").setVisible(true);            
            Xrm.Page.getAttribute("rsa_nbsappointmentid").setRequiredLevel("required");
        }

    },

    disableAppointmentType: function (){
        Xrm.Page.getControl(NBSAPPOINTMENTTYPE).setDisabled(true);
    },



    //Function to get values from contact record to service activity (I

    retrieveValuesFromContact: function () {
        debugger;
        var regardingObject = Xrm.Page.getAttribute("customers");
        if (regardingObject != null && regardingObject.getValue() != null) {

            var contactlookup = regardingObject.getValue()[0];
            if (!IsNull(contactlookup)) {
                if (contactlookup.entityType == "contact") {
                    
                   
                    var contactId = contactlookup.id;
                    RSA.ServiceActivity.retrieveRecords(contactId, RSA.ServiceActivity.retrieveCompleted, null, "ContactSet(guid'"+ contactId +"')?$select=MobilePhone,Telephone2,Telephone1");
                }
            }

        }
    },


    retrieveCompleted: function (data, textStatus, XmlHttpRequest) {
        debugger;
        if (data != null) {
            var mobileNumber = data.MobilePhone;
            Xrm.Page.getAttribute("rsa_mobilenumber").setValue(mobileNumber);

            var workNumber = data.Telephone1;
            Xrm.Page.getAttribute("rsa_worknumber").setValue(workNumber);

            var homeNumber = data.Telephone2;
            Xrm.Page.getAttribute("rsa_homenumber").setValue(homeNumber);


        }

    },


    retrieveRecords: function (id, successCallback, errorCallback, url) {
        //var context = GetGlobalContext();
        debugger;
        var serverUrl = XP.context.getClientUrl();
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

    }

}