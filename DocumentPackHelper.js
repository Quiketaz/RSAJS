if (typeof (RSA) == "undefined") {
    RSA = { __namespace: true };
}

Type = {
    Bool: "c:boolean",
    Int: "c:int",
    String: "c:string",
    DateTime: "c:dateTime",
    EntityReference: "a:EntityReference",
    OptionSet: "a:OptionSetValue",
    Money: "a:Money"
}

RSA.DocumentPackHelper = {
    //Retrieve all the document packs records
    GetDocumentPack: function () {

        var docPackGuids = "";
        var rows = Xrm.Page.getControl("DocumentPacks").getGrid().getRows();
        rows.forEach(function (row, i) {
            var docPackGuid = row.getData().getEntity().getAttributes().get("rsa_documentpackguid").getValue();
            var isFinalStage = row.getData().getEntity().getAttributes().get("rsa_isfinalstage").getValue();
            if (isFinalStage != null && isFinalStage == "No" && docPackGuid != null && docPackGuid != "") {
                docPackGuids += ":" + docPackGuid;
            }
        });

        if (docPackGuids != "") {
            docPackGuids = docPackGuids.replace(/^:/, '');
            RSA.DocumentPackHelper.SendDocumentIdsToAction(docPackGuids);
        }
    },
    //Get all the retrieved document packs Guids and send it in the input parameter to the calling Action
    SendDocumentIdsToAction: function (docPackGuids) {
        RSA.HelperLibrary.callAction("rsa_GetDocumentStatus",
                [{
                    key: "DocumentPackGuids",
                    type: Type.String,
                    value: docPackGuids
                }],

                function (params) {
                    if (params.length > 0) {
                        if (params[0].key == "Success" && params[0].value == "true") {
                            // Success
                            RSA.HelperLibrary.RefreshDocumentGrid("DocumentPacks");
                        }
                    }
                },
                function (e) {
                    // Error
                    alert(e);
                }
            );
    }
}