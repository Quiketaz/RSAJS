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
//ENUMS
formType = {
    CREATE: 1,
    UPDATE: 2,
    READONLY: 3,
    DISABLED: 4
}

//CONSTANTS
var documentid = "";

RSA.DocumentPack = {

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

    //View Documents
    ViewDocuments: function () {
        var formtype = Xrm.Page.ui.getFormType();
        if (formtype == formType.UPDATE) {
            documentid = "";

            if (Xrm.Page.data.entity.getEntityName() == "rsa_documentpack") {
                if (Xrm.Page.getAttribute("rsa_documentpackguid").getValue() != null) {
                    documentid = Xrm.Page.getAttribute("rsa_documentpackguid").getValue();

                    if (documentid != "") {
                        RSA.DocumentPack.Actioncall(documentid);
                    }
                    else {
                        alert("Please add - Document Pack Guid - in order to view the document");
                    }
                }
            }
            else if (Xrm.Page.data.entity.getEntityName() == "rsa_document") {
                if (Xrm.Page.getAttribute("rsa_documentpackid").getValue() != null) {
                    var parentEntityId = Xrm.Page.getAttribute("rsa_documentpackid").getValue()[0].id;
                    RSA.HelperLibrary.retrieveRecords(parentEntityId, RSA.DocumentPack.retrieveCompleted, null,
                    "rsa_documentpackSet(guid'" + parentEntityId + "')?$select=rsa_documentpackguid");
                }
            }
        }
    },

    //Resend Documents
    ResendDocuments: function () {
        var formtype = Xrm.Page.ui.getFormType();
        if (formtype == formType.UPDATE) {
            var documentid = "";
            if (Xrm.Page.data.entity.getEntityName() == "rsa_documentpack") {
                documentid = Xrm.Page.data.entity.getId();
                if (documentid != "") {                    
                    documentid = documentid.replace(/[{()}]/g, '');                    
                    RSA.DocumentPack.ResendActioncall(documentid);
                }
                else {
                    Xrm.Page.ui.setFormNotification("Missing Document Id", "WARNING", "Resend");
                }
            }
        }
    },

    retrieveCompleted: function (data, textStatus, XmlHttpRequest) {

        if (data && data.rsa_documentpackguid != null) {
            documentid = data.rsa_documentpackguid;
        }

        if (documentid != "") {
            RSA.DocumentPack.Actioncall(documentid);
        }
        else {
            alert("Please add - Document Pack Guid - on the Document Pack form in order to view the document");
        }
    },

    Actioncall: function (documentId) {

        RSA.HelperLibrary.callAction("rsa_ViewDocuments",
                  [{
                      key: "Id",
                      type: Type.String,
                      value: documentId
                  }],

                  function (params) {
                      for (var i = 0; i < params.length; i++) {
                          if (params[i].key == "ContentStream") {
                              var pdfdata = params[i].value;
                              if (window.navigator.msSaveOrOpenBlob) {
                                  var contentType = "";
                                  var sliceSize = 512;

                                  var byteCharacters = atob(pdfdata);
                                  var byteArrays = [];

                                  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                                      var slice = byteCharacters.slice(offset, offset + sliceSize);

                                      var byteNumbers = new Array(slice.length);
                                      for (var i = 0; i < slice.length; i++) {
                                          byteNumbers[i] = slice.charCodeAt(i);
                                      }
                                      var byteArray = new Uint8Array(byteNumbers);

                                      byteArrays.push(byteArray);
                                  }

                                  var fileobj = new Blob(byteArrays);
                                  window.navigator.msSaveOrOpenBlob(fileobj, "File2.pdf");

                              }
                          }
                      }

                  },
                  function (e) {
                      // Error
                      alert(e);
                  }
              );
    },
  
    ResendActioncall: function (documentId) {
        debugger;
        RSA.HelperLibrary.callAction(
            "rsa_ResendDocuments",
            [{
                key: "Id",
                type: Type.String,
                value: documentId
            }],
			function (params) {
			    RSA.HelperLibrary.DisplayNotification("Successful - The document pack has been submittted to Williams Lea for resending", "INFORMATION", "Resend", 5000);
		    },
			function (e) {
			    // Error
			    RSA.HelperLibrary.DisplayNotification("Resend Status: " + e, "ERROR", "Resend", 5000);
			    console.log(e);
		    }
        );
    }   
}