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
const KnowledgeArticleMessage = "Warning: This knowledge Article is not applicable for sharing to customers";

RSA.KnowledgeArticle = {

    //onLoad function for this form
    onLoad: function () {
        var formtype = Xrm.Page.ui.getFormType();

        if (formtype == formType.CREATE) {
            this.knowledgenotification();


        }
        else if (formtype == formType.UPDATE) {
            this.knowledgenotification();

        }
        else if (formtype == formType.READONLY) {
            this.knowledgenotification();


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

    knowledgenotification: function () {
        var formLabel = Xrm.Page.ui.formSelector.getCurrentItem().getLabel();

        if (formLabel == "KnowledgeArticle - MTM") {

            var knowledgeFlag = Xrm.Page.getAttribute("rsa_notapplicableforcustomersharing").getValue();
            if (knowledgeFlag == 1) {

                Xrm.Page.ui.setFormNotification(KnowledgeArticleMessage, 'WARNING', '1');
            }
            else
                Xrm.Page.ui.clearFormNotification('1');


        }
    }
}
