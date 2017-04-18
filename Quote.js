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

RSA.Quote = {

    //onLoad function for this form
    onLoad: function () {

        var formtype = Xrm.Page.ui.getFormType();

        if (formtype == formType.CREATE) { }
        else if (formtype == formType.UPDATE) { }
        else if (formtype == formType.READONLY) { }
        else if (formtype == formType.DISABLED) { }
    },

    //onSave function for this form
    onSave: function () {
        var formtype = Xrm.Page.ui.getFormType();

        if (formtype == formType.CREATE) { }
        else if (formtype == formType.UPDATE) { }
        else if (formtype == formType.READONLY) { }
        else if (formtype == formType.DISABLED) { }
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
    }
}