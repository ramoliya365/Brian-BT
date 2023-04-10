({
   doInit : function(component, event, helper) {
       helper.doInitHelper(component, event, helper)
   }, 

   closeCmp : function(component, event, helper) {
       component.set("v.openProductBox", false);
    //    $A.get("e.force:closeQuickAction").fire() 

   }, 

   changePricebook: function(component, event, helper) {
       helper.changePricebookHelper(component, event, helper);
   },

   searchInDatatable: function(component, event, helper){
       helper.searchInDatatableHelper(component, event, helper);
   }, 

   goToEditModal: function(component, event, helper) {
       helper.goToEditModalHelper(component, event, helper);
   },
   
   goToProductModal: function(component, event, helper) {
       var quoteLineList = component.get("v.quoteLineList");
       var checkAll = true;
       quoteLineList.forEach(element => {
           if (!element.Selected) {
               checkAll = false
           }
       });
       
       component.set("v.sProductFamily", '');
       component.set("v.sProductName", '');

       component.set("v.tableDataList", quoteLineList);
       component.set("v.selecteProducts", true);
       component.find("selectAll").set("v.checked", checkAll);
   },


   checkAllProduct: function(component, event, helper){
       var value = event.getSource().get("v.checked"); 
       var tableDataList = component.get("v.tableDataList");
       tableDataList.forEach(element => {
           element.Selected = value;
       });
       component.set("v.tableDataList", tableDataList);
   }, 

   checkboxChange : function(component, event, helper) {
       var tableDataList = component.get("v.tableDataList");
       var checkAll = true;
       tableDataList.forEach(element => {
           if (!element.Selected) {
               checkAll = false
           }
       });
       component.find("selectAll").set("v.checked", checkAll);
   },

   saveQuoteLine : function(component, event, helper){
       component.set("v.Spinner", true);
       console.log('saveQuoteLine');
       var listQlines = component.get("v.selectedProducts");
       var action10 = component.get("c.QuoteLinesInsert");
       action10.setParams({
           "Quotelines": listQlines,
           "QuoteId": component.get("v.quoteId")
       });

       action10.setCallback(this, function(response) {
           console.log(response.getReturnValue());
           component.set("v.openQuoteLineBox", false);
           $A.get("e.force:refreshView").fire();
           component.set("v.Spinner", false);
           component.set("v.openProductBox", false);        
           var toastEvent = $A.get("e.force:showToast");
           toastEvent.setParams({
               title: 'Success',
               message: 'Quote Lines are created successfully',
               duration: ' 5000',
               key: 'info_alt',
               type: 'success',
               mode: 'pester'
           });
           toastEvent.fire();
       });
       $A.enqueueAction(action10);
   }

})