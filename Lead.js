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

RSA.Lead = {

    //onLoad function for this form
    onLoad: function () {

        var formtype = Xrm.Page.ui.getFormType();

        if (formtype == formType.CREATE) {

            try {
                // Call a function in another library  
                RSA.Lead.retrieveBrandValue();

                //   Xrm.Page.data.setFormDirty(false);  // This code check if there are changes on form
            }
            catch (e) {
                Xrm.Page.ui.setFormNotification("Error onLoad" + Date().toString() + " RSA.Lead.OnLoad(): " + e.message, "ERROR", "RSA.Lead.OnLoad()");
            }

        }
        else if (formtype == formType.UPDATE) {

        }
        else if (formtype == formType.READONLY) {

        }
        else if (formtype == formType.DISABLED) {

        }       
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

                        Xrm.Page.getAttribute("rsa_brandid").setValue(value); //set the lookup
                    }
                    else
                        alert("Your user profile is missing brand information; please add and try again!")
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                }
            }
        };
        req.send();
    }
}