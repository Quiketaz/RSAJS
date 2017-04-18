
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
const CAMPAIGNCODE = "promotioncodename";


RSA.Campaign = {

    //onLoad function for this form
    onLoad: function () {

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

    campaignCodeUppercase: function () {
        var code = Xrm.Page.getAttribute(CAMPAIGNCODE).getValue();
        if (code != null) {
            campcode = code.toUpperCase();

            Xrm.Page.getAttribute(CAMPAIGNCODE).setValue(campcode);
        }
        
    }
}