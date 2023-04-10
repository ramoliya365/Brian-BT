({
    doInit: function (component, event, helper) {
        component.set('v.isLoading', true);
        helper.getTableFieldSet(component, event, helper);
        helper.getAdminValues(component, event, helper);
        helper.nameTheTab(component, event, helper);
        var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        helper.createQuoteLineWrapperList(component, event, helper);
        helper.QuoteLineGroups(component, event, helper);
        var action = component.get("c.getpricebooks");
        action.setParams({
            recordId:component.get('v.recordId')
        })
        action.setCallback(this, function (response) {
            var state = response.getState();
            console.log({state});
            console.log(response.getReturnValue());
            if (state === "SUCCESS") {
                var pricebookList = response.getReturnValue();
                var pricebookOptions = [];
                pricebookOptions.push({
                    label : 'None',
                    value : '',
                })
                for(var key in pricebookList){
                    pricebookOptions.push({
                        label : key,
                        value : pricebookList[key],
                    })
                }
                console.log('pricebookOptions',pricebookOptions);
                component.set("v.pricebookOptions",pricebookOptions);
                component.set('v.isLoading', false);

            }
        });
        $A.enqueueAction(action);
    },

    deleteRow : function(component, event, helper) {
        var index = event.target.getAttribute('data-index');
        console.log('index',index);
        var quoteLineWrapperList = component.get("v.quoteLineWrapperList");
        quoteLineWrapperList.splice(index, 1);
        component.set("v.quoteLineWrapperList", quoteLineWrapperList);
    },

    getFamily : function(component, event, helper) {
        var quoteLineWrapperList = component.get("v.quoteLineWrapperList");
        component.set('v.isLoading', true);       
        var priceBookId = event.getSource().get("v.value");
        var index = event.getSource().get("v.name");
        if(priceBookId != ''){
            helper.getFamily(component, event, helper, priceBookId, index);
        }else{
            var quoteLineWrapperList = component.get("v.quoteLineWrapperList");
            quoteLineWrapperList[index].productFamilyList = [
                {
                    label : 'Plese Select Pricebook',
                    value : '',
                }];
            quoteLineWrapperList[index].productOptionList = [
                {
                    label : 'Plese Select Family',
                    value : '',
                }];
            quoteLineWrapperList[index].productList = [];
            quoteLineWrapperList[index].QuoteLine = {
                buildertek__Quote__c : component.get('v.recordId'),
                buildertek__Product__c : '',
                Name : '',
                buildertek__Grouping__c : '',
                buildertek__Notes__c : '',
                buildertek__Quantity__c : '',
                buildertek__Unit_Cost__c : '',
                buildertek__Margin__c : '',
                buildertek__Markup__c : '',
            }
            component.set("v.quoteLineWrapperList", quoteLineWrapperList);
            component.set('v.isLoading', false);

        }

    },

    getProduct : function(component, event, helper) {
        component.set('v.isLoading', true);
        var quoteLineWrapperList = component.get("v.quoteLineWrapperList");
        var index = event.getSource().get("v.name");
        var family = event.getSource().get("v.value");
        if(family != ''){
            helper.getProduct(component, event, helper, family, index);
        }else{
            var productList = quoteLineWrapperList[index].productList;
            var productOptionList = [
                {
                    label : 'Please Select Product',
                    value : '',
                }
            ];
            for(var i=0;i<productList.length;i++){
                productOptionList.push({
                    label : productList[i].Name,
                    value : productList[i].Id,
                });
            }
            quoteLineWrapperList[index].productOptionList = productOptionList;
            quoteLineWrapperList[index].QuoteLine = {
                buildertek__Quote__c : component.get('v.recordId'),
                buildertek__Product__c : '',
                Name : '',
                buildertek__Grouping__c : '',
                buildertek__Notes__c : '',
                buildertek__Quantity__c : '',
                buildertek__Unit_Cost__c : '',
                buildertek__Margin__c : '',
                buildertek__Markup__c : '',
            }
            component.set("v.quoteLineWrapperList", quoteLineWrapperList);
            component.set('v.isLoading', false);
        }
        
    },

    gotProduct : function(component, event, helper) {
        component.set('v.isLoading', true);
        var index = event.getSource().get("v.name");
        var productId = event.getSource().get("v.value");
        console.log('productId',productId);
        if(productId != ''){
            helper.setProductDetails(component, event, helper, index, productId);
        }else{
            helper.resetProductDetails(component, event, helper, index);
        }
    },

    onAddClick: function (component, event, helper) {
        var quoteLineWrapperList = component.get("v.quoteLineWrapperList");
        for(var i = 0; i < 5; i++) {
            let quoteLineWrapper = helper.createQuoteLineWrapper(component, event, helper);
            quoteLineWrapperList.push(quoteLineWrapper);
        }
        component.set("v.quoteLineWrapperList", quoteLineWrapperList);
    },

    onMassUpdate: function (component, event, helper) {
        component.set('v.loading', true);
        var quoteLineWrapperList = component.get("v.quoteLineWrapperList");
        var quotelineList = [];
        console.log('on Save quotelinewrapperlist: ',quoteLineWrapperList);
        for(var i=0;i<quoteLineWrapperList.length;i++){
            if(quoteLineWrapperList[i].QuoteLine.Name != ''){
                quotelineList.push(quoteLineWrapperList[i].QuoteLine);                
            }
        }
        // console.log('quotelinelist',quotelineList);
        if(quotelineList.length > 0){
            helper.saveQuoteLine(component, event, helper, quotelineList);
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please enter atleast one Quote Line.',
                duration: ' 3000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
            // helper.createQuoteLineWrapperList(component, event, helper);
            component.set('v.loading', false);
        }
    },

    onMassUpdateCancel: function (component, event, helper) {
        helper.closeNrefresh(component, event, helper);
    },

    closeScreen: function (component, event, helper) {
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

    closeCancelModal: function (component, event, helper) {
        component.set('v.isCancelModalOpen', false);
    },

    deleteRecord: function (component, event, helper) {
        var target = event.target;
        var index = target.getAttribute("data-index");
        var records = component.get('v.listOfRecords');
        if (records[index].Id != undefined) {
            component.set('v.selectedRecordIndex', index);
            component.set('v.quoteLineName', records[index].Name);
            component.set('v.isModalOpen', true);
        } else if (records[index].Id == undefined) {
            records.splice(index, 1);
            component.set('v.listOfRecords', records);
        }
    },
    deletequotelineRecord: function (component, event, helper) {
        var dataAttr = event.currentTarget.dataset.recordid.split("_");
        var recordid = dataAttr[0]; 
        var recordList;
        if(JSON.parse(JSON.stringify(component.get("v.deleteQuoteLines"))).length){
            recordList = JSON.parse(JSON.stringify(component.get("v.deleteQuoteLines")));
        }else{
            recordList =[];
        }
        var quoteLines = component.get("v.listOfRecords");
        quoteLines.splice(Number(dataAttr[1]),1);
        if(recordid){
            recordList.push(recordid);
        }
        component.set("v.listOfRecords",quoteLines);
        component.set("v.deleteQuoteLines",recordList);
    },
    handleNext: function (component, event, helper) {
        component.set('v.isLoading', true);
        var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        pageNumber++;
        helper.getTableRows(component, event, helper, pageNumber, pageSize);
    },

    handlePrev: function (component, event, helper) {
        component.set('v.isLoading', true);
        var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        pageNumber--;
        helper.getTableRows(component, event, helper, pageNumber, pageSize);
    },

    handleCancel: function (component, event, helper) {
        component.set('v.isModalOpen', false);
    },

    handleDelete: function (component, event, helper) {
        var records = component.get('v.listOfRecords');
        var index = component.get('v.selectedRecordIndex');
        if (records[index].Id != undefined) {
            helper.delete(component, event, helper, records[index].Id);
            component.set('v.isModalOpen', false);
        }
    }, 

    reloadMethod: function (component, event, helper){
        console.log('************ reloadMethod ************');
        var action = component.get("c.getFieldSet");
        action.setCallback(this, function (response) {
            console.log('Field Set Values::', response.getReturnValue());
            var fieldSetObj = JSON.parse(response.getReturnValue());
            component.set("v.fieldSetValues", fieldSetObj);
        })
        $A.enqueueAction(action);
    },
})