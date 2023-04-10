({
    showErrorToast: function(component, event, helper, title, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: title,
            message: message,
            duration: "5000",
            key: "info_alt",
            type: "error",
            mode: "pester",
        });
        toastEvent.fire();
    },
    showSuccessToast: function(component, event, helper, title, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: title,
            message: message,
            duration: "5000",
            key: "info_alt",
            type: "success",
            mode: "pester",
        });
        toastEvent.fire();
    },

    addProductToRfqLines: function(component, event, helper, productIds, RfqId) {
        var action = component.get("c.addProductToRfq");
        component.set("v.Spinner", true);
        component.set("v.showMessage", true);
        action.setParams({
            "productIds": productIds,
            "RfqId": component.get("v.mainObjectId")
        });
        action.setCallback(this, function(response) {

            if (response.getState() == "SUCCESS") {
                var recId = response.getReturnValue();
                // alert(recId);
                helper.showSuccessToast(component, event, helper, "Success!", 'Successfully added Rfq Line');
                $A.get("e.force:closeQuickAction").fire();
                // setTimeout(function() { location.reload(); }, 1000);
                component.set("v.Spinner", false);
                component.set("v.showMessage", false);


                var recordId = component.get("v.mainObjectId");
                $A.get("e.force:navigateToSObject").setParams({
                    "recordId": recordId

                }).fire();

                var workspaceAPI = component.find("workspace");
                workspaceAPI.getFocusedTabInfo().then(function(response) {
                    var focusedTabId = response.tabId;
                    workspaceAPI.refreshTab({
                            tabId: focusedTabId,
                            includeAllSubtabs: true
                    });
                })
                .catch(function(error) {
                    console.log(error);
                });

                /* var urlEvent = $A.get("e.force:navigateToURL");
                 urlEvent.setParams({
                     "url": '/lightning/r/buildertek__RFQ_Items__c/'+recordId+'/related/buildertek__RFQ_Items__r/view'
                 });
                 urlEvent.fire();*/

            } else {
                helper.showErrorToast(component, event, helper, "Error occurs", "Something went wrong!");
            }
        });
        $A.enqueueAction(action);
    },
    getRfqList: function(component, event, helper, pageNumber, pageSize, productFamilyValue, tradeValue, productTypeValue, productValue, productCategoryValue, priceBook, vendor) {
        var action = component.get("c.getProducts");
        var tradetype = component.get("v.rfqtradeType");
        // alert('tradeValue'+tradeValue);
        //alert('tradeValue.trim()'+tradeValue.trim());
        //  alert('productValue'+productValue);
        // alert(priceBook);
        var recId = component.get("v.recordId");
        action.setParams({
            "pageNumber": pageNumber,
            "pageSize": pageSize,
            "RFQRecId": recId,
            "productFamily": productFamilyValue,
            "tradeType": tradeValue,
            "productType": productTypeValue,
            "Product": productValue,
            "category": productCategoryValue,
            "priceBook": priceBook,
            "vendor": vendor,
            "rfqtradeType": tradetype,

        });
        action.setCallback(this, function(result) {
            var state = result.getState();
            if (component.isValid() && state === "SUCCESS") {
                var resultData = result.getReturnValue();
                if (resultData.categoryList && resultData.categoryList.length > 5) {
                    component.set("v.rfqCategoryList", resultData.categoryList.slice(0, 5));
                } else if (resultData.categoryList) {
                    component.set("v.rfqCategoryList", resultData.categoryList);
                }
                if (resultData.producttypeList && resultData.producttypeList.length > 5) {
                    component.set("v.rfqproducttypeList", resultData.producttypeList.slice(0, 5));
                } else if (resultData.producttypeList) {
                    component.set("v.rfqproducttypeList", resultData.producttypeList);
                }
                if (resultData.tradetypeList && resultData.tradetypeList.length > 5) {
                    component.set("v.rfqtradetypeList", resultData.tradetypeList.slice(0, 5));
                } else if (resultData.tradetypeList) {
                    component.set("v.rfqtradetypeList", resultData.tradetypeList);
                }
                if (resultData.vendorList && resultData.vendorList.length > 5) {
                    component.set("v.rfqvendorList", resultData.vendorList.slice(0, 5));
                } else if (resultData.vendorList) {
                    component.set("v.rfqvendorList", resultData.vendorList.slice(0, 5));
                }

                component.set("v.rfqRecordList", resultData.recordList);
                console.log("Records : ", resultData.recordList)
                component.set("v.PageNumber", resultData.pageNumber);
                component.set("v.TotalRecords", resultData.totalRecords);
                component.set("v.RecordStart", resultData.recordStart);
                component.set("v.RecordEnd", resultData.recordEnd);
                component.set(
                    "v.TotalPages",
                    Math.ceil(resultData.totalRecords / pageSize)
                );
                /* var rfqrecordlist = component.get("v.rfqRecordList");
                if(rfqrecordlist.length > 0){
					component.set("v.RecordEnd", true);                    
                }else{
                    component.set("v.RecordEnd", true);                 
                }*/
            }
        });
        $A.enqueueAction(action);
    }
})