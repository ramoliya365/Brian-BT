({
    doInit: function (component, event, helper) {
       // var Name = '';
       
       // component.find("Name").set("v.autocomplete","off");
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
                            component.set("v.NameOfVendor", parentRecordId);
                        }else if(objName == 'buildertek__Purchase_Order__c'){
                            component.set("v.parentpurchaseRecordId", parentRecordId);
                            helper.vendors(component,event,helper);
                        }
                    } 
                });
                $A.enqueueAction(action);
            }
        helper.getFields(component, event, helper);
        
    },
    
    


    closeModel: function (component, event, helper) {
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
                $A.get('e.force:refreshView').fire();
            }), 1000
        );
    },

    handleSubmit: function (component, event, helper) {
        component.set('v.isLoading', true);
        var fields = event.getParam("fields");
         var name = component.find("Name").get("v.value");
        if(name != null){ 
        	fields["Name"] = name;
        }
        event.preventDefault(); // Prevent default submit
        component.find('recordViewForm').submit(fields); // Submit form
    },

    onRecordSuccess: function (component, event, helper) {
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
            var payload = event.getParams().response;
            var url = location.href;
            var baseURL = url.substring(0, url.indexOf('/', 14));
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                mode: 'sticky',
                message: 'Vendor Review created successfully',
                messageTemplate: "Vendor Review created successfully.",
                messageTemplateData: [{
                    url: baseURL + '/lightning/r/buildertek__Vendor_Review__c/' + escape(payload.id) + '/view',
                    label: payload.name,
                }],
                type: 'success',
                duration: '10000',
                mode: 'dismissible'
            });
            toastEvent.fire();

            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
                "recordId": payload.id,
                "slideDevName": "related"
            });
            navEvt.fire();
        }, 200);
    },

    saveAndNew: function (component, event, helper) {
         var Name = component.get("v.NameOfVendorReview");
       // alert(Name);
         if(Name != null){
            // alert("hai");
        component.set('v.isLoading', true);
        event.preventDefault(); // Prevent default submit
        var fields = event.getParam("listOfFields");
        component.find('recordViewForm').submit(fields); // Submit form
        $A.get('e.force:refreshView').fire();
              } else{
                  var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'ERROR',
                        message: 'Please Enter the Vendor Review Name.',
                        duration: "5000",
                        key: "info_alt",
                        type: "error",
                        mode: "pester",
                    });
                    toastEvent.fire();
             }
    }
})