
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

RSA.ThirdParty = {

    //onLoad function for this form
    onLoad: function () {

        var formtype = Xrm.Page.ui.getFormType();

        if (formtype == formType.CREATE) {
           this.Clearname();
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




    //Clear TPC Name
    Clearname: function () {

        var name = Xrm.Page.data.entity.attributes.get("rsa_tpcnameid").getValue();
        if (name != null) {
            var tpcname = Xrm.Page.data.entity.attributes.get("rsa_tpcnameid").getValue()[0].id;
            var policyholder = Xrm.Page.data.entity.attributes.get("rsa_customerid").getValue()[0].id;
            if (tpcname != null && policyholder != null)
                if (tpcname = policyholder) {
                    Xrm.Page.data.entity.attributes.get("rsa_tpcnameid").setValue(null);

                }

        }
    }
}

   