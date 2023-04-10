({
	getBudgetGrouopFieldSet : function(component, event, helper) {
		var fieldsetName, recordTypeDeveloperName;
        fieldsetName = 'Budget_Line_Group_Fields';

        var getObjectFieldSet = component.get("c.getFieldSet");
        getObjectFieldSet.setParams({
            fieldSetName: fieldsetName,
            objectName: "budget_Line_Group__c"
        });

        getObjectFieldSet.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.groupFields", response.getReturnValue());
            }
        });
        $A.enqueueAction(getObjectFieldSet);
	},
	
	 /*This method is used for fields set validation on input fields*/
    validateInputFields: function(component, event, helper) {
        var inputFieldValue, inputFields, isValid, fieldName, fValue, fClass, inputErrorMessage;
        inputFields = component.find("inputFields");
        inputErrorMessage = component.find('inputErrorMessage');
        isValid = true;
        for (var i in inputFields) {
            fieldName = inputFields[i].get("v.fieldName");
            fValue = inputFields[i].get("v.value");
            fClass = inputFields[i].get("v.class");

            if (($A.util.hasClass(inputFields[i], 'customvalidation')) &&
                ($A.util.isUndefinedOrNull(fValue) || $A.util.isEmpty(fValue))) {
                $A.util.removeClass(inputErrorMessage[i], 'slds-hide');
                $A.util.addClass(inputFields[i], 'slds-has-error');
                isValid = false;
            } else if (!$A.util.hasClass(inputErrorMessage[i], 'slds-hide')) {
                $A.util.addClass(inputErrorMessage[i], 'slds-hide');
                $A.util.removeClass(inputFields[i], 'slds-has-error');
            }
        }
        return isValid;
    },
    
    
    addSelectedProducts : function(component, event, helper, items) {
        var action;
        action = component.get("c.createBudgetItem");
        action.setParams({
            budgetItemsJSON: JSON.stringify(items)
        });
        action.setCallback(this, function (response) {
            if (component.isValid() && response.getState() === "SUCCESS") {
                var toastEvent = $A.get("e.force:showToast");
                
		        toastEvent.setParams({
		            message: component.get("v.groupId") ?"Budget Group Updated Successfully": "New Budget Group Added Successfully.",
		            type: 'Success',
		        });
		        toastEvent.fire();
		        component.set("v.lines",[]);
		        var onSuccess = component.get("v.onSuccess");
		        if (!$A.util.isUndefinedOrNull(onSuccess)) {
		            onSuccess();
		        } 
		        
		        helper.closePopup(component);
		        //$A.get("e.c:BT_SpinnerEvent").setParams({"action" : "HIDE" }).fire();
            } else {
                var toastEvent = $A.get("e.force:showToast");
                console.log(response.getError()[0].message);
                toastEvent.setParams({
                    "type":"error",
                    "title": "Error!",
                    "message":  response.getError()[0].message
                });
                toastEvent.fire();
            }
        });
        
        $A.enqueueAction(action);
    },
    
    deleteGroup: function(component, event, helper, dataToDelete){
			
            var action = component.get("c.deleteGroups");
            action.setParams({ groups : dataToDelete});
            action.setCallback(this, function(response) {
                var state = response.getState();
                
                if (state === "SUCCESS") {
                    var toastEvent = $A.get("e.force:showToast");
			        toastEvent.setParams({
			            message: "Budget Group Deleted Successfully",
			            type: 'Success',
			        });
			        toastEvent.fire();
			        
			        var onDelete = component.get("v.onDelete");
			        if (!$A.util.isUndefinedOrNull(onDelete)) {
			            onDelete();
			        }
			        helper.closePopup(component);
                }
            });
            $A.enqueueAction(action);
	},
    
    /* Close the overlay library modal*/
	closePopup : function(component) {
		component.find("overlayLib").notifyClose();
	},
	
	/* This is close confirmation and other modal pop-up.*/
	closeModalPop : function(component) {
		component.get('v.modalPromise').then(function (modal) {
            modal.close();
        });
	}
	
})