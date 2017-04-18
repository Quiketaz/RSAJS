// JavaScript source code
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
var recordId = Xrm.Page.data.entity.getId();
var entityLogicalName = Xrm.Page.data.entity.getEntityName();

RSA.Task = {

    //onLoad function for this form
    onLoad: function () {
        var formtype = Xrm.Page.ui.getFormType();
        this.showHide();

        if (formtype == formType.CREATE) {
        }
        else if (formtype == formType.UPDATE) {
            this.setFromNotification();

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

    //open new case form on button click
    openNewCaseForm: function () {
        var parameters = {};
        var windowOptions = {
            openInNewWindow: true
        };

        var brand = Xrm.Page.getAttribute("rsa_brandid").getValue();
        var product = Xrm.Page.getAttribute("rsa_customproductid").getValue();
        var taskType = Xrm.Page.getAttribute("rsa_tasktypeid").getValue();
        var trnxType = Xrm.Page.getAttribute("rsa_transactionid").getValue();
        var trnxSubType = Xrm.Page.getAttribute("rsa_transactionsubtypeid").getValue();
        var customer = Xrm.Page.getAttribute("rsa_customerdetails").getValue();
        var policyReference = Xrm.Page.getAttribute("rsa_policyreference").getValue();
        var renewalDate = Xrm.Page.getAttribute("rsa_renewaldate").getValue();

        if (Xrm.Page.getAttribute("rsa_renewaldate").getValue() !== null) {
            var date1 = new Date(Xrm.Page.getAttribute("rsa_renewaldate").getValue());
            var dd = date1.getDate();
            var mm = date1.getMonth() + 1;
            var yyyy = date1.getFullYear();
            var reqDate = mm + '-' + dd + '-' + yyyy;
            parameters["rsa_renewaldate"] = reqDate;
        }
        if (brand != null) {
            parameters["rsa_brandid"] = brand[0].id;
            parameters["rsa_brandidname"] = brand[0].name;
        }
        if (product != null) {
            parameters["rsa_product"] = product[0].id;
            parameters["rsa_productname"] = product[0].name;
        }
        if (taskType != null) {
            parameters["rsa_casetype"] = taskType[0].id;
            parameters["rsa_casetypename"] = taskType[0].name;
        }

        if (trnxType != null) {
            parameters["rsa_transactiontypeid"] = trnxType[0].id;
            parameters["rsa_transactiontypeidname"] = trnxType[0].name;
        }
        if (trnxSubType != null) {
            parameters["rsa_transactionsubtypeid"] = trnxSubType[0].id;
            parameters["rsa_transactionsubtypeidname"] = trnxSubType[0].name;
        }
        if (customer != null) {
            parameters["customerid"] = customer[0].id;
            parameters["customeridname"] = customer[0].name;
            parameters["customeridtype"] = "contact";
        }
        if (policyReference != null) {
            parameters["rsa_policyreference"] = policyReference[0].id;
            parameters["rsa_policyreferencename"] = policyReference[0].name;
        }

        if (Xrm.Page.getAttribute("rsa_documentcategory").getValue() != null)
            parameters["rsa_documentcategory"] = Xrm.Page.getAttribute("rsa_documentcategory").getValue();

        if (Xrm.Page.getAttribute("rsa_documentscannedtype").getValue() != null)
            parameters["rsa_forwardbackscanned"] = Xrm.Page.getAttribute("rsa_documentscannedtype").getValue();

        parameters["description"] = Xrm.Page.getAttribute("description").getValue();
        parameters["rsa_originatingtaskid"] = recordId;
        parameters["rsa_originatingtaskidname"] = Xrm.Page.getAttribute("subject").getValue();
        parameters["rsa_migratedpolicy"] = Xrm.Page.getAttribute("rsa_migratedpolicy").getValue();
        parameters["rsa_errorid"] = Xrm.Page.getAttribute("rsa_errorid").getValue();
        parameters["rsa_externalurl"] = Xrm.Page.getAttribute("rsa_url").getValue();

        Xrm.Utility.openEntityForm("incident", null, parameters, windowOptions);
    }
}
