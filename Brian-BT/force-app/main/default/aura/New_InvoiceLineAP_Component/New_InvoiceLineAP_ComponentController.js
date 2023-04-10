({
    doInit : function(component, event, helper) {
        component.set("v.isLoading", true);
        var value = helper.getParameterByName(component, event, 'inContextOfRef');
        console.log('value-->>',{value});
        var context = '';
        var parentRecordId = '';
        component.set("v.parentRecordId", parentRecordId)

        var getFields = component.get("c.getFieldSet");
        getFields.setParams({
            objectName: 'buildertek__Account_Payable_Item_Clone__c',
            fieldSetName: 'buildertek__New_InvoiceLineAP_FiledSet'
        });
        getFields.setCallback(this, function (response) {
            if (response.getState() == 'SUCCESS' && response.getReturnValue()) {
                var listOfFields0 = JSON.parse(response.getReturnValue());
                console.log({listOfFields0});
                component.set("v.listOfFields0", listOfFields0);
                component.set("v.isLoading", false);
            }
        });
        $A.enqueueAction(getFields);
        if (value != null) {
            context = JSON.parse(window.atob(value));
            parentRecordId = context.attributes.recordId;
            component.set("v.parentRecordId", parentRecordId);
            console.log('parentRecordId---->>',{parentRecordId});
        } else {
            var relatedList = window.location.pathname;
            var stringList = relatedList.split("/");
            parentRecordId = stringList[4];
            if (parentRecordId == 'related') {
                var stringList = relatedList.split("/");
                parentRecordId = stringList[3];
            }
            component.set("v.parentRecordId", parentRecordId);
            console.log('parentRecordId-->>',{parentRecordId});
        }
        if(parentRecordId != null && parentRecordId != ''){
            var action = component.get("c.getobjectNames");
            action.setParams({
                recordId: parentRecordId,
            });
            action.setCallback(this, function (response) {
                component.set("v.Spinner", false);
                if (response.getState() == 'SUCCESS' && response.getReturnValue()) {
                    var objName = response.getReturnValue();
                    if(objName == 'buildertek__Account_Payable_Clone__c'){
                        component.set("v.parentInvoiceRecordId", parentRecordId);
                    }
                    if(objName == 'buildertek__Budget__c'){
                        component.set("v.parentBudgetRecordId", parentRecordId);
                    }
                    if(objName == 'buildertek__Budget_Line__c'){
                        component.set("v.parentBudgetLineRecordId", parentRecordId);
                    }
                } 
            });
            $A.enqueueAction(action);
        }
       
    },
    handleSubmit: function (component, event, helper) {
        component.set("v.isDisabled", true);
		component.set("v.isLoading", true);
        event.preventDefault(); // Prevent default submit
        var fields = event.getParam("fields");
        
        let budgetLineId=component.get('v.selectedBudgetLineId');
        console.log(budgetLineId);
        let budgetLineName=component.get('v.selectedBudgetLineName');
        console.log(component.get('v.selectedBudgetLineName'));

         if(budgetLineId == '' || budgetLineName == ''){
            fields["buildertek__Budget_Line__c"] = '';
        }else{
            fields["buildertek__Budget_Line__c"] = component.get("v.selectedBudgetLineId");
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
                    "message": "The record has been saved successfully.",
                    "type": "success"
                });
                toastEvent.fire();
                component.set("v.isDisabled", false);
            }else{
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error!",
                    "message": "Something went wrong. Please try again.",
                    "type": "error"
                });
                toastEvent.fire();
                component.set("v.isDisabled", false);
                component.set("v.isLoading", false);
            }
        });
        $A.enqueueAction(action);
    },
    handlesaveNnew : function(component, event, helper) {
        component.set("v.isSaveNew", true);
    },

    closeModel: function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.closeTab({tabId: focusedTabId});
        })
        .catch(function(error) {
            console.log(error);
        });
        $A.get("e.force:closeQuickAction").fire();
        component.set("v.isOpen", false);
        window.setTimeout(
            $A.getCallback(function() {
                $A.get('e.force:refreshView').fire();
            }), 1000
        );
   },
   onChangeBudget:function(component, event, helper) {
    console.log(event.getSource().get('v.value')[0]);
     component.set('v.parentBudgetRecordId' ,event.getSource().get('v.value')[0]);
    console.log( component.get('v.parentBudgetRecordId'));


   },
   searchBudgetLineData:function(component, event, helper) {
        console.log('searchBudgetLineData');
        component.set('v.displayBudgetLine', true);
        helper.getAllBudgetLine(component, event, helper);
        event.stopPropagation();
    },
    clickHandlerBudgetLine: function(component, event, helper){

        console.log('clickHandlerBudgetLine');
        var recordId = event.currentTarget.dataset.value;
        console.log('recordId ==> '+recordId);
        component.set('v.selectedBudgetLineId', recordId);

        var budgetLineList = component.get("v.budgetLinesOptions");
        budgetLineList.forEach(element => {
            if (recordId == element.Id) {
                component.set('v.selectedBudgetLineName', element.Name);
                component.set('v.displayBudgetLine', false);
                console.log(component.get('v.selectedBudgetLineName'));


            }
        });
       
    },
      
    hideList:function(component, event, helper){
                component.set('v.displayBudgetLine', false);
    },
    keyupBudgetLineData:function(component, event, helper){
        var allRecords = component.get("v.budgetLinesOptions");
        var searchFilter = event.getSource().get("v.value").toUpperCase();
        var tempArray = [];
        var i;
        for (i = 0; i < allRecords.length; i++) {
            if ((allRecords[i].Name && allRecords[i].Name.toUpperCase().indexOf(searchFilter) != -1)) {
                tempArray.push(allRecords[i]);
            }else{
                component.set('v.selectedBudgetLineId' , '');
            }
        }
        component.set("v.budgetLinesOptions", tempArray);

        if(searchFilter == ''){
            helper.getAllBudgetLine(component, event, helper);
        }   
     },


})