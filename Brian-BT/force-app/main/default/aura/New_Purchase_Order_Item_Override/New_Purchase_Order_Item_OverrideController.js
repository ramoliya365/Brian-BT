({
    doInit: function (component, event, helper) {
        component.set("v.isOpen", true);
        component.set("v.isLoading", true);
        var value = helper.getParameterByName(component, event, 'inContextOfRef');
        var context = '';
        var parentRecordId = '';
        component.set("v.parentRecordId", parentRecordId);
        if (value != null) {
            context = JSON.parse(window.atob(value));
            parentRecordId = context.attributes.recordId;
            component.set("v.parentRecordId", parentRecordId);
        } else {
            var relatedList = window.location.pathname;
            var stringList = relatedList.split("/");
            parentRecordId = stringList[4];
            if (parentRecordId == 'related') {
                var stringList = relatedList.split("/");
                parentRecordId = stringList[3];
            }

            component.set("v.parentRecordId", parentRecordId);
            console.log({parentRecordId});
        }
        helper.fetchpricebooks(component, event, helper);
        helper.getFields(component, event, helper);
    },

    handleComponentEvent: function (component, event, helper) {
        var selectedAccountGetFromEvent = event.getParam("recordByEvent");
        component.set("v.newPOItem.Name", selectedAccountGetFromEvent.Name);
        component.set("v.newPOItem.buildertek__Product__c", selectedAccountGetFromEvent.Id);
        component.set("v.productId", selectedAccountGetFromEvent.Id);
        component.set("v.productName", selectedAccountGetFromEvent.Name);
        helper.getProductDetails(component, event, helper);
    },

    handleComponentEvents: function (component, event, helper) {
        var selectedAccountGetFromEvent = event.getParam("recordByEvent");
        component.set("v.newPOItem.Name", selectedAccountGetFromEvent.Name);
        component.set("v.newPOItem.buildertek__Product__c", selectedAccountGetFromEvent.Id);
        component.set("v.productId", selectedAccountGetFromEvent.Id);
        component.set("v.productName", selectedAccountGetFromEvent.Name);
        helper.getProductDetails(component, event, helper);
    },

    closeModel: function (component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle" 
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function (response) {
                var focusedTabId = response.tabId;
                workspaceAPI.closeTab({
                    tabId: focusedTabId
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        $A.get("e.force:closeQuickAction").fire();
        component.set("v.isOpen", false);
        window.setTimeout(
            $A.getCallback(function () {
                $A.get('e.force:refreshView').fire();
            }), 1000
        );
    },

    // save: function (component, event, helper) {

    //     var selectedPO = component.get("v.selectedPORecord");
    //     var parentRecordId = component.get("v.parentRecordId");
    //     var selectedPORecordId;
    //     if (parentRecordId != undefined) {
    //         selectedPORecordId = parentRecordId;
    //     } else {
    //         if (selectedPO != undefined) {
    //             selectedPORecordId = selectedPO.Id;
    //         }
    //     }

    //     //component.set("v.newPOItem.buildertek__Purchase_Order__c", PO);
    //     var POLineToInsert = JSON.stringify(component.get("v.listOfFields"));
    //     console.log('PO Lines::', POLineToInsert);
    //     if (selectedPORecordId != undefined) {
    //         component.set("v.Spinner", true);
    //         var action = component.get("c.savePOItem");
    //         action.setParams({
    //             POLines: POLineToInsert,
    //             POId: selectedPORecordId
    //         });
    //         action.setCallback(this, function (response) {
    //             var state = response.getState();
    //             if (state === "SUCCESS") {
    //                 var url = location.href;
    //                 var baseURL = url.substring(0, url.indexOf('/', 14));
    //                 var result = response.getReturnValue();
    //                 $A.get("e.force:closeQuickAction").fire();
    //                 var workspaceAPI = component.find("workspace");
    //                 workspaceAPI.getFocusedTabInfo().then(function (response) {
    //                         var focusedTabId = response.tabId;
    //                         workspaceAPI.closeTab({
    //                             tabId: focusedTabId
    //                         });
    //                         //$A.get('e.force:refreshView').fire();
    //                     })
    //                     .catch(function (error) {
    //                         console.log(error);
    //                     });

    //                 var toastEvent = $A.get("e.force:showToast");
    //                 toastEvent.setParams({
    //                     mode: 'sticky',
    //                     message: 'Purchase Order Line was created ',
    //                     messageTemplate: "Purchase Order Line {0} was created",
    //                     messageTemplateData: [{
    //                         url: baseURL + '/lightning/r/buildertek__Purchase_Order_Item__c/' + escape(result.Id) + '/view',
    //                         label: result.Name,
    //                     }],
    //                     type: 'success',
    //                     duration: '10000',
    //                     mode: 'dismissible'
    //                 });
    //                 toastEvent.fire();

    //                 window.open("/" + result.Id, "_Self");
    //             }
    //         });
    //         $A.enqueueAction(action);
    //     } else {
    //         var pillTarget = component.find("errorId");
    //         $A.util.addClass(pillTarget, 'showErrorMessage');
    //     }

    // },
    // saveAndNew: function (component, event, helper) {
    //     component.set("v.Spinner", true);

    //     var selectedPO = component.get("v.selectedPORecord");
    //     var parentRecordId = component.get("v.parentRecordId");
    //     var selectedPORecordId;
    //     if (parentRecordId != undefined) {
    //         selectedPORecordId = parentRecordId;
    //     } else {
    //         if (selectedPO != undefined) {
    //             selectedPORecordId = selectedPO.Id;
    //         }
    //     }

    //     component.set("v.newPOItem.buildertek__Purchase_Order__c", selectedPORecordId);
    //     var POLineToInsert = JSON.stringify(component.get("v.newPOItem"));
    //     var action = component.get("c.savePOItem");
    //     action.setParams({
    //         POLines: POLineToInsert,
    //         POId: selectedPORecordId
    //     });
    //     action.setCallback(this, function (response) {
    //         var state = response.getState();
    //         if (state === "SUCCESS") {
    //             var url = location.href;
    //             var baseURL = url.substring(0, url.indexOf('/', 14));
    //             var result = response.getReturnValue();
    //             component.set("v.newPOItem", null);
    //             component.set("v.Spinner", false);
    //             var toastEvent = $A.get("e.force:showToast");
    //             toastEvent.setParams({
    //                 mode: 'sticky',
    //                 message: 'Purchase Order Line was created',
    //                 messageTemplate: "Purchase Order Line {0} was created",
    //                 messageTemplateData: [{
    //                     url: baseURL + '/lightning/r/buildertek__Purchase_Order_Item__c/' + escape(result.Id) + '/view',
    //                     label: result.Name,
    //                 }],
    //                 type: 'success',
    //                 duration: '10000',
    //                 mode: 'dismissible'
    //             });
    //             toastEvent.fire();
    //             window.location.reload(true);
    //         }
    //     });
    //     $A.enqueueAction(action);
    // },

    changefamily: function (component, event, helper) {

        var product = component.get('v.selectedLookUpRecord');
        var compEvent = $A.get('e.c:BT_CLearLightningLookupEvent');
        compEvent.setParams({
            "recordByEvent": product
        });
        compEvent.fire();
        component.set('v.newPOItem.Name', '');
        component.set('v.newPOItem.buildertek__Unit_Price__c', '');

    },
    changeEvent: function (component, event, helper) {

        // var product = component.get('v.selectedLookUpRecord');
        // console.log({product});
        // var compEvent = $A.get('e.c:BT_CLearLightningLookupEvent');
        // compEvent.setParams({
        //     "recordByEvent": product
        // });
        // compEvent.fire();

        // console.log({product});

        var pribooknames = component.get("v.pricebookName");
        var action = component.get("c.getProductfamilyRecords");
        // set param to method  
        action.setParams({
            'ObjectName': "Product2",
            'parentId': component.get("v.pricebookName")
        });
        // set a callBack    
        action.setCallback(this, function (response) {
            $A.util.removeClass(component.find("mySpinner"), "slds-show");
            var state = response.getState();
            if (state === "SUCCESS") {
                // helper.fetchPickListVal(component, event, helper);
                var storeResponse = response.getReturnValue();
                // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                if (storeResponse.length == 0) {
                    component.set("v.Message", 'No Result Found...');
                } else {
                    component.set("v.Message", '');
                }
                // set searchResult list with return value from server.
                component.set("v.listofproductfamily", storeResponse);

                if (component.get("v.listofproductfamily").length > 0) {
                    component.set("v.productfamily", component.get("v.listofproductfamily")[0].productfamilyvalues);
                }

            }

        });
        // enqueue the Action  
        $A.enqueueAction(action);
    },

    // handleSubmit: function (component, event, helper) {
    //     component.set('v.Spinner', true);
    //     var fields = event.getParam("fields");
    //     var selectedProductId = component.get('v.selectedLookUpRecord');
    //     if (selectedProductId != undefined && selectedProductId.Id != undefined) {
    //         if(fields.buildertek__Product__c == undefined){
    //             fields.buildertek__Product__c='';
    //         }
    //         fields.buildertek__Product__c = selectedProductId.Id;
    //         if(fields.Name.length > 80){
    //             fields.Name = fields.Name.substring(0,80);
    //         }
    //     }
    //     event.preventDefault(); // Prevent default submit
    //     component.find('recordViewForm').submit(fields); // Submit form
    // },

    // onRecordSuccess: function (component, event, helper) {
    //     var workspaceAPI = component.find("workspace");
    //     workspaceAPI.getFocusedTabInfo().then(function (response) {
    //         var focusedTabId = response.tabId;
    //         workspaceAPI.closeTab({
    //             tabId: focusedTabId
    //         });
    //     }).catch(function (error) {
    //         console.log('Error', JSON.stringify(error));
    //     });
    //     setTimeout(function () {
    //         component.set("v.isOpen", false);
    //         component.set('v.Spinner', false);
    //         var payload = event.getParams().response;
    //         var url = location.href;
    //         var baseURL = url.substring(0, url.indexOf('/', 14));
    //         var toastEvent = $A.get("e.force:showToast");
    //         toastEvent.setParams({
    //             mode: 'sticky',
    //             message: 'Purchase Order Line created successfully',
    //             messageTemplate: "Purchase Order Line created successfully.",
    //             messageTemplateData: [{
    //                 url: baseURL + '/lightning/r/buildertek__Purchase_Order__c/' + escape(payload.id) + '/view',
    //                 label: payload.name,
    //             }],
    //             type: 'success',
    //             duration: '10000',
    //             mode: 'dismissible'
    //         });
    //         toastEvent.fire();

    //         var navEvt = $A.get("e.force:navigateToSObject");
    //         navEvt.setParams({
    //             "recordId": payload.id,
    //             "slideDevName": "related"
    //         });
    //         navEvt.fire();
    //     }, 200);
    // },
    handleSubmit : function (component, event, helper) {
        component.set("v.isDisabled", true);
		component.set("v.isLoading", true);
        event.preventDefault(); // Prevent default submit
        var fields = event.getParam("fields");

        let getProductId= component.get("v.productId");
        if(getProductId != null){
            fields['buildertek__Product__c' ]=getProductId;

        }
        let poName=fields['Name'];
        console.log(poName);
        if(poName !=null || poName!= undefined){
            if(poName.length > 80){
                poName=poName.substring(0 , 80)
                fields['Name']=poName;
            }

        }


        var allData = JSON.stringify(fields);


        var action = component.get("c.saveData");
        action.setParams({
            allData : allData
        });
        action.setCallback(this, function(response){
            console.log(response.getState());

            if(response.getState() == 'SUCCESS') {            
                var result = response.getReturnValue();
                console.log({result});
                var saveNnew = component.get("v.isSaveNew");
                if(saveNnew){
                    $A.get('e.force:refreshView').fire();
                    component.set("v.isSaveNew", false);
                }else{
                    var workspaceAPI = component.find("workspace");
                    var focusedTabId = response.tabId;
                    //timeout
                    window.setTimeout(
                        $A.getCallback(function() {
                            workspaceAPI.getFocusedTabInfo().then(function(response) {
                                workspaceAPI.closeTab({tabId: focusedTabId});
                                component.set("v.isLoading", false);
                            })
                        }), 1000
                        );
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": result,
                        "slideDevName": "Detail"
                    });
                    navEvt.fire();
                }
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "Purchase Order Line created successfully",
                    "type": "success"
                });
                toastEvent.fire();
                component.set("v.isDisabled", false);
            }else{
                var errors = response.getError();
                if (errors[0].pageErrors != undefined && (errors[0].pageErrors[0].statusCode.includes('REQUIRED_FIELD_MISSING') && errors[0].pageErrors[0].message.includes('Vendor'))) {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": "Vendor is Missing on Purchase Order",
                        "type": "error"
                    });
                    toastEvent.fire();
                } else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": "Something went wrong. Please try again.",
                        "type": "error"
                    });
                    toastEvent.fire();
                }
                
                component.set("v.isDisabled", false);
                component.set("v.isLoading", false);
            }
        });
        $A.enqueueAction(action);
    },

    saveAndNew: function (component, event, helper) {
        // component.set('v.Spinner', true);
        // event.preventDefault(); // Prevent default submit
        // var fields = event.getParam("listOfFields");
        // component.find('recordViewForm').submit(fields); // Submit form
        // $A.get('e.force:refreshView').fire();
        component.set("v.isSaveNew", true);

    },
    handleProductChange:function (component, event, helper) {
        console.log('handleProductChange');
        

        var action = component.get("c.getProductDetails");
        // set param to method  
        action.setParams({
            PriceBookId: component.get('v.pricebookName'),
            prodFamily: component.get("v.productfamily")
        });
        // set a callBack    
        action.setCallback(this, function (response) {
            var state = response.getState();
            console.log(response.getReturnValue());
            if (state === "SUCCESS") {
                

            }

        });
        // enqueue the Action  
        $A.enqueueAction(action);
    }
})