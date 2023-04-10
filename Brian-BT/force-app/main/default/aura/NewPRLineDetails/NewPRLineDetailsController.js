({
    doInit: function(component, event, helper) {
        var pageRef = component.get("v.pageReference");
        var state = pageRef.state;
        var base64Context = state.inContextOfRef;
        if (base64Context.startsWith("1\.")) {
            base64Context = base64Context.substring(2);
        }
        var addressableContext = JSON.parse(window.atob(base64Context));
        component.set("v.recordId", addressableContext.attributes.recordId);
        component.set("v.PRLineDetails.buildertek__Pricing_Request_Line__c", component.get("v.recordId"));

    },

    closePopup: function(component, event, helper) {
        helper.closePopupHelper(component, event, helper);
    },

    createRecord: function(component, event, helper) {
        helper.createRecordHelper(component, event, helper);
    },

    clickHandler: function(component, event, helper) {
        var record = event.currentTarget.dataset.value;
        component.set("v.PRLineDetails.buildertek__Product__c", record);

        var productList = component.get("v.productList");
        productList.forEach(element => {
            if (element.Id == record) {
                component.set("v.searchProductValue", element.Name);
            }
        });
        component.set("v.displayProduct", false);
    }, 

    searchProduct: function(component, event, helper) {
        helper.searchProductHelper(component, event, helper);
    }, 

    closeSearchOption: function (component, event, helper){
        component.set("v.displayProduct", false);
    },
    
})