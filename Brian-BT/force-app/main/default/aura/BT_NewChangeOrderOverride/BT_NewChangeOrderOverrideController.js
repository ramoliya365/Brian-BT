({
    doInit: function (component, event, helper) {
        
        debugger;
        
        var recordTypeId = component.get( "v.pageReference" ).state.recordTypeId;  
        
        component.set("v.RecordTypeId",recordTypeId);
        
        
        helper.getRecType(component,event,helper);
        
        var action4 = component.get("c.getvendor");
        action4.setCallback(this, function (response) {
            var result4 = response.getReturnValue();
            console.log("result 4 : ",result4);
            if( result4 != null){
                if(result4.IsPortalEnabled == true){
                    console.log("vendor : ",result4.buildertek__Account_Id__c);
                    component.set("v.isCommunity",true);
                    
                    //   component.find("vendorId").set("v.value", result4.buildertek__Account_Id__c);
                    component.set("v.vendorId",result4.buildertek__Account_Id__c);
                    component.set("v.AccountId",result4.buildertek__Account_Id__c); 
                    
                }else{
                    
                }
            }
            
        });
        $A.enqueueAction(action4); 
        
        
        
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
        }
        if(parentRecordId != null && parentRecordId != ''){
            var action = component.get("c.getobjectName");
            action.setParams({
                recordId: parentRecordId,
            });
            action.setCallback(this, function (response) {
                if (response.getState() == 'SUCCESS' && response.getReturnValue()) {
                    var objName = response.getReturnValue();
                    if(objName == 'Account'){
                        component.set("v.CustomerAccountName", parentRecordId);
                    }else if(objName == 'buildertek__Project__c'){
                        component.set("v.parentprojectRecordId", parentRecordId);
                        helper.CustomerAccount(component,event,helper);
                    }else if(objName == 'buildertek__RFQ__c'){
                        component.set("v.parentRFQRecordId", parentRecordId);
                    }else if(objName == 'buildertek__Contract__c'){
                        component.set("v.parentContractRecordId", parentRecordId);
                        helper.getproject(component,event,helper);
                    }else if(objName == 'buildertek__Purchase_Order__c'){
                        component.set("v.parentPurchaseOrderRecordId", parentRecordId);
                    }else if(objName == 'buildertek__Budget__c'){
                        component.set("v.parentbudgetRecordId", parentRecordId);
                    }else if(objName == 'buildertek__Accounting_Period__c'){
                        component.set("v.parentaccountingPeriodRecordId", parentRecordId);
                    }
                } 
            });
            $A.enqueueAction(action);
        }
        
        
        
    },
    
    
    closeModel: function (component, event, helper) {
        component.set('v.isopen',false);
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
        window.setTimeout(
            $A.getCallback(function () {
                //  $A.get('e.force:refreshView').fire();
            }), 1000
        );
        /* $A.get("e.force:closeQuickAction").fire();  
                $A.get('e.force:refreshView').fire();*/ 
    },
    gotoList : function (component, event, helper) {
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
        
        var action = component.get("c.getListViews");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var listviews = response.getReturnValue();
                var navEvent = $A.get("e.force:navigateToList");
                navEvent.setParams({
                    "listViewId": listviews.Id,
                    "listViewName": null,
                    "scope": "buildertek__Change_Order__c"
                });
                navEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    
    handleSubmit: function (component, event, helper) {
        debugger;
        component.set('v.isLoading', true);
        var rfq = component.get('v.parentRFQRecordId');
        var contract = component.get('v.parentContractRecordId');
        var project = component.get('v.parentprojectRecordId');
        var po = component.get('v.parentPurchaseOrderRecordId');
        var budget = component.get('v.parentbudgetRecordId');
        var accountingperiod = component.get('v.parentaccountingPeriodRecordId');
        var fields = event.getParam("fields");
        var name = component.find("Name").get("v.value");
        if(name != null && name != "" ){ 
            fields["Name"] = name;
        }if(rfq != null && rfq != ""){
            fields["buildertek__RFQ__c"] = rfq;
        }
        if(contract != null && contract != ""){
            fields["buildertek__Contract__c"] = contract;
        }
        if(project != null && project != ""){
            fields["buildertek__Project__c"] = project;
        }if(po != null && po != ""){
            fields["buildertek__Purchase_Order__c"] = po;
        } 
        if(budget != null && budget != ""){
            fields["buildertek__Budget__c"] = budget;
        }if(accountingperiod != null && accountingperiod != ""){
            fields["buildertek__Period__c"] = accountingperiod;
        }
        fields["RecordTypeId"] =  component.get("v.RecordTypeId");
        event.preventDefault(); // Prevent default submit  
        component.find('recordViewForm').submit(fields); // Submit form
    },
    
    onRecordSuccess: function (component, event, helper) {
        debugger;
        var payload = event.getParams().response;
        
        var action = component.get("c.updateCOType");
        action.setParams({
            recordId : payload.id
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            console.log(state);
            if (state === "SUCCESS") {
                component.set('v.isLoading', false);
                var result = response.getReturnValue();
                console.log(result);
                if(result == 'success'){
                 
                    var workspaceAPI = component.find("workspace");
                    workspaceAPI.getFocusedTabInfo().then(function (response) {
                        var focusedTabId = response.tabId;
                        workspaceAPI.closeTab({
                            tabId: focusedTabId
                        });
                    }).catch(function (error) {
                        console.log('Error', JSON.stringify(error));
                    });
                    setTimeout(function () {
                        component.set('v.isLoading', false);
                        
                        var url = location.href;
                        var baseURL = url.substring(0, url.indexOf('/', 14));
                        
                        var navEvt = $A.get("e.force:navigateToSObject");
                        navEvt.setParams({
                            "recordId": payload.id,
                            "slideDevName": "detail"
                        });
                        navEvt.fire();
                        
                        
                        
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            mode: 'sticky',
                            message: 'New Change Order created successfully',
                            messageTemplate: "New Change Order created successfully.",
                            messageTemplateData: [{
                                url: baseURL + '/lightning/r/buildertek__Change_Order__c/' + escape(payload.id) + '/view',
                                label: payload.name,
                            }],
                            type: 'success',
                            duration: '10000',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                        
                        
                    }, 2000);
                    
                    $A.get("e.force:closeQuickAction").fire();
                    
                    
                    
                }else{
                    component.set('v.isLoading', false); 
                }
            }else{
                component.set('v.isLoading', false);
            }
        });
        $A.enqueueAction(action);
        
        
        
    },
    
    vendorChanged : function(component, event, helper) {
        debugger;
        //  alert('qwertyuiop');
        var SelVendor = component.find("selectedVendor").get("v.value");
        
        // alert(SelVendor);
        component.set("v.salesforceSelectedV", SelVendor); 
        
    },
    
    handleError: function (cmp, event, helper) {
        var error = event.getParams();
        
        // Get the error message
        var errorMessage = event.getParam("message");
        // alert('errorMessage----->'+errorMessage);
    },
    
    saveAndNew: function (component, event, helper) {
        component.set('v.isLoading', true);
        var fields =  event.getParam("listOfFields");  
        event.preventDefault(); // Prevent default submit        
        component.find('recordViewForm').submit(fields); // Submit form
        $A.get('e.force:refreshView').fire();
    }
})