({
    doInit: function (component, event, helper) {
        component.set("v.isOpen", true);
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
            // alert('stringList---'+stringList);
            parentRecordId = stringList[4];
            if (parentRecordId == 'related') {
                var stringList = relatedList.split("/");
                parentRecordId = stringList[3];
            }
            component.set("v.parentRecordId", parentRecordId);
        }

        component.find('quantityId').set("v.value", 1);
        //alert('parent-------'+ parentRecordId);
        component.find('projtakeoffid').set("v.value", parentRecordId);
        helper.fetchpricebooks(component, event, helper);

    },
    handleComponentEvent: function (component, event, helper) {
        var selectedAccountGetFromEvent = event.getParam("recordByEvent");
        // component.set("v.newprojecttakeoffline.buildertek__Item_Name__c",selectedAccountGetFromEvent.Name);
        component.set("v.newprojecttakeoffline.buildertek__Product__c", selectedAccountGetFromEvent.Id);
        component.set("v.productId", selectedAccountGetFromEvent.Id);
        component.set("v.productName", selectedAccountGetFromEvent.Name);
        helper.getProductDetails(component, event, helper);
    },

    handleComponentEvents: function (component, event, helper) {
        var selectedAccountGetFromEvent = event.getParam("recordByEvent");
        // component.set("v.newprojecttakeoffline.buildertek__Item_Name__c",selectedAccountGetFromEvent.Name);
        component.set("v.newprojecttakeoffline.buildertek__Product__c", selectedAccountGetFromEvent.Id);
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
        var parentRecordId = component.get("v.parentRecordId");
        if (parentRecordId != undefined) {

        } else {
            var url = location.href;
            var baseURL = url.substring(0, url.indexOf('/', 14));
            //alert('baseURL -------> '+baseURL);
            window.open(baseURL + '/lightning/o/buildertek__Project_Takeoff_Lines__c/list?filterName=Recent', '_self');
        }

    },

    save: function (component, event, helper) {
        // alert('test');


        var selectedTradeType = component.get("v.selectedTradeType");
        var selTradeType;
        if (selectedTradeType != undefined) {
            selTradeType = selectedTradeType.Id;
        } else {
            selTradeType = null;
        }

        var selectedprojecttakeoff = component.get("v.selectedprojecttakeoff");
        var parentRecordId = component.get("v.parentRecordId");
        var selectedPToff;
        if (parentRecordId != undefined) {
            selectedPToff = component.get("v.parentRecordId");
        } else {
            if (selectedprojecttakeoff != undefined) {
                selectedPToff = selectedprojecttakeoff.Id;
            } else {
                selectedPToff = null;
            }
        }



        component.set("v.newprojecttakeoffline.buildertek__Trade_Type__c", selTradeType);

        //component.set("v.newprojecttakeoffline.buildertek__Project_Takeoff__c", selectedPToff);
        var ProjtakeoffLineToInsert = JSON.stringify(component.get("v.newprojecttakeoffline"));
        if (selectedPToff != undefined) {
            // alert('test2--'); 
            component.set("v.Spinner", true);
            var action = component.get("c.savePToffline");
            action.setParams({
                takeoffLines: ProjtakeoffLineToInsert,
                PtoffId: selectedPToff
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.Spinner", false);
                    var url = location.href;
                    var baseURL = url.substring(0, url.indexOf('/', 14));
                    var result = response.getReturnValue();
                    $A.get("e.force:closeQuickAction").fire();
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
                    $A.get('e.force:refreshView').fire();
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        mode: 'sticky',
                        message: ' Project Takeoff Line was created ',
                        messageTemplate: " Project Takeoff Line {0} was created",
                        /*   messageTemplateData: [{
                           url: baseURL+'/lightning/r/buildertek__Project_Takeoff_Lines__c/'+escape(result.Id)+'/view',
                           label: result.Name,
                           }],*/
                        type: 'success',
                        duration: '10000',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();

                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": result.Id,
                        "slideDevName": "related"
                    });
                    navEvt.fire();
                    // window.open ("/"+result.Id,"_Self");     
                }
            });
            $A.enqueueAction(action);
        } else {
            var pillTarget = component.find("errorId");
            $A.util.addClass(pillTarget, 'showErrorMessage');
        }

    },
    saveAndNew: function (component, event, helper) {
        component.set("v.Spinner", true);

        var selectedTradeType = component.get("v.selectedTradeType");
        var selTradeType;
        if (selectedTradeType != undefined) {
            selTradeType = selectedTradeType.Id;
        } else {
            selTradeType = null;
        }
        var selectedprojecttakeoff = component.get("v.selectedprojecttakeoff");
        var parentRecordId = component.get("v.parentRecordId");
        var selectedPToff;
        if (parentRecordId != undefined) {
            selectedPToff = component.get("v.parentRecordId");
        } else {
            if (selectedprojecttakeoff != undefined) {
                selectedPToff = selectedprojecttakeoff.Id;
            } else {
                selectedPToff = null;
            }
        }
        component.set("v.newprojecttakeoffline.buildertek__Trade_Type__c", selTradeType);
        //component.set("v.newprojecttakeoffline.buildertek__Project_Takeoff__c", selectedPToff);
        var ProjtakeoffLineToInsert = JSON.stringify(component.get("v.newprojecttakeoffline"));
        if (selectedPToff != undefined) {
            var action = component.get("c.savePToffline");
            action.setParams({
                takeoffLines: ProjtakeoffLineToInsert,
                PtoffId: selectedPToff
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var url = location.href;
                    var baseURL = url.substring(0, url.indexOf('/', 14));
                    var result = response.getReturnValue();
                    component.set("v.newprojecttakeoffline", null);
                    component.set("v.Spinner", false);
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        mode: 'sticky',
                        message: ' Project Takeoff Line was created',
                        messageTemplate: " Project Takeoff Line {0} was created",
                        messageTemplateData: [{
                            url: baseURL + '/lightning/r/buildertek__Project_Takeoff_Lines__c/' + escape(result.Id) + '/view',
                            label: result.Name,
                        }],
                        type: 'success',
                        duration: '10000',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": result.Id,
                        "slideDevName": "related"
                    });
                    navEvt.fire();
                    window.location.reload(true);
                }
            });
            $A.enqueueAction(action);
        }

    },

    changefamily: function (component, event, helper) {

        var product = component.get('v.selectedLookUpRecord');
        var compEvent = $A.get('e.c:BT_CLearLightningLookupEvent');
        compEvent.setParams({
            "recordByEvent": product
        });
        compEvent.fire();
        // component.set('v.newprojecttakeoffline.buildertek__Item_Name__c', '');
        //  component.set('v.newprojecttakeoffline.buildertek__Unit_Price__c', '');  

    },
    changeEvent: function (component, event, helper) {

        var product = component.get('v.selectedLookUpRecord');
        var compEvent = $A.get('e.c:BT_CLearLightningLookupEvent');
        compEvent.setParams({
            "recordByEvent": product
        });
        compEvent.fire();

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
})