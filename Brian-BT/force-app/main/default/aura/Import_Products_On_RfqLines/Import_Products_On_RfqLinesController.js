({
    doInit : function(component, event, helper) {
     /*   var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        var productFamilyValue = component.get("v.searchProductFamilyFilter");
        var productValue = component.get("v.searchProductFilter");
        var productCategoryValue = component.get("v.searchCategoryFilter");
        var productTypeValue = component.get("v.searchProductTypeFilter");
        var tradeValue = component.get("v.searchTradeTypeFilter");
        var priceBook = component.get("v.searchPriceBookFilter");
        var vendor = component.get("v.searchVendorFilter");
        var recId = component.get("v.mainObjectId");*/
        
         var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        var productFamilyValue = component.get("v.searchProductFamilyFilter");
        var productValue = component.get("v.searchProductFilter").Name;
        var productCategoryValue = component.get("v.searchCategoryFilter");
        var productTypeValue = component.get("v.searchProductTypeFilter");
        var tradeValue = component.get("v.searchTradeTypeFilter");
        var priceBook = component.get("v.searchPriceBookFilter");
        var vendor = component.get("v.searchVendorFilter");
        var recId = component.get("v.mainObjectId");
        
        var pbAction = component.get("c.pricebookList")
        pbAction.setCallback(this, function(response){
            if(response.getState() === "SUCCESS"){
				component.set("v.pbList",response.getReturnValue())
            }     
        });
        
        $A.enqueueAction(pbAction);
        
      /*  var productAction = component.get("c.productfamilyList");
        productAction.setParams({
            "ObjectName" : "Product2"
        });
        productAction.setCallback(this, function(response){
            if(response.getState() === "SUCCESS"){
				component.set("v.listofproductfamily",response.getReturnValue())
            }     
        });
        $A.enqueueAction(productAction);*/
        
		var action = component.get("c.getTradeTypes"); 
        action.setParams({
            "RFQRecId" : recId
        });
        action.setCallback(this, function(response){
            if(response.getState() === "SUCCESS"){
            	component.set("v.rfqtradeType", response.getReturnValue()); 
                 helper.getRfqList(component, event, helper, pageNumber, pageSize, productFamilyValue, tradeValue, productTypeValue, productValue, productCategoryValue, priceBook,vendor);
            }     
        });
        $A.enqueueAction(action);    
    },
    changefamily: function (component, event, helper) {
		var product = component.get('v.selectedLookUpRecord');
		var compEvent = $A.get('e.c:BT_CLearLightningLookupEvent');
		compEvent.setParams({
			"recordByEvent": product
		});
		compEvent.fire();
	},
    changeEvent: function (component, event, helper) {
		var productAction = component.get("c.productfamilyList");
        productAction.setParams({
            ObjectName : "Product2",
            parentId: component.get("v.searchPriceBookFilter")
        });
        productAction.setCallback(this, function(response){
            if(response.getState() === "SUCCESS"){
				component.set("v.listofproductfamily",response.getReturnValue());
                if (component.get("v.listofproductfamily").length > 0) {
                    if(component.get("v.listofproductfamily").length == 1){
                        component.set("v.searchProductFamilyFilter", component.get("v.listofproductfamily")[0].productfamilyvalues);
                    }else{
                        component.set("v.searchProductFamilyFilter", '');
                    }
				}
            }     
        });
        $A.enqueueAction(productAction);
	},

    handleComponentEvent : function(component, event, helper){
        var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        var productFamilyValue = component.get("v.searchProductFamilyFilter");
        var productValue = component.get("v.searchProductFilter").Name;
        var productCategoryValue = component.get("v.searchCategoryFilter");
        var productTypeValue = component.get("v.searchProductTypeFilter");
        var tradeValue = component.get("v.searchTradeTypeFilter");
        var priceBook = component.get("v.searchPriceBookFilter");
        var vendor = component.get("v.searchVendorFilter");
        var recId = component.get("v.mainObjectId");
       helper.getRfqList(component, event, helper, pageNumber, pageSize, productFamilyValue, tradeValue, productTypeValue, productValue, productCategoryValue, priceBook,vendor);
                             
         
    },
    getproductlist : function (component, event, helper) {
        var action = component.get("c.getprodlist"); 
        action.setParams({
            "RFQRecId" : recId
        });
        action.setCallback(this, function(response){
            if(response.getState() === "SUCCESS"){
            	component.set("v.searchProductFilter", response.getReturnValue()); 
            }     
        });
        $A.enqueueAction(action); 
        
    },
    handleNext: function (component, event, helper) {
       
      /*  var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        pageNumber++;
        var productFamilyValue = component.get("v.searchProductFamilyFilter");
        var productValue = component.get("v.searchProductFilter");
        var productCategoryValue = component.get("v.searchCategoryFilter");
        var productTypeValue = component.get("v.searchProductTypeFilter");
        var tradeValue = component.get("v.searchTradeTypeFilter");
         var priceBook = component.get("v.searchPriceBookFilter");
        var vendor = component.get("v.searchVendorFilter");*/
        
        var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
         pageNumber++;
        var productFamilyValue = component.get("v.searchProductFamilyFilter");
        var productValue = component.get("v.searchProductFilter").Name;
        var productCategoryValue = component.get("v.searchCategoryFilter");
        var productTypeValue = component.get("v.searchProductTypeFilter");
        var tradeValue = component.get("v.searchTradeTypeFilter");
        var priceBook = component.get("v.searchPriceBookFilter");
        var vendor = component.get("v.searchVendorFilter");
        helper.getRfqList(component, event, helper, pageNumber, pageSize, productFamilyValue, tradeValue, productTypeValue, productValue, productCategoryValue, priceBook,vendor);
         console.log("List of Ids : ",component.get("v.listOfSelectedRFQIds"))
    },
    
    handlePrev: function (component, event, helper) {
       /* var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        pageNumber--;
        var productFamilyValue = component.get("v.searchProductFamilyFilter");
        var productValue = component.get("v.searchProductFilter");
        var productCategoryValue = component.get("v.searchCategoryFilter");
        var productTypeValue = component.get("v.searchProductTypeFilter");
        var tradeValue = component.get("v.searchTradeTypeFilter");
         var priceBook = component.get("v.searchPriceBookFilter");
        var vendor = component.get("v.searchVendorFilter");*/
        
        var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
         pageNumber--;
        var productFamilyValue = component.get("v.searchProductFamilyFilter");
        var productValue = component.get("v.searchProductFilter").Name;
        var productCategoryValue = component.get("v.searchCategoryFilter");
        var productTypeValue = component.get("v.searchProductTypeFilter");
        var tradeValue = component.get("v.searchTradeTypeFilter");
        var priceBook = component.get("v.searchPriceBookFilter");
        var vendor = component.get("v.searchVendorFilter");
        helper.getRfqList(component, event, helper, pageNumber, pageSize, productFamilyValue, tradeValue, productTypeValue, productValue, productCategoryValue, priceBook,vendor);
         console.log("List of Ids : ",component.get("v.listOfSelectedRFQIds"))
    },
    selectRfq: function (component, event, helper) {
        var checkbox = event.getSource();
        var selectedRfqIds = component.get("v.listOfSelectedRFQIds");
        var getAllId = component.find("checkRFQ");
      /*  for (var i = 0; i < selectedRfqIds.length; i++) {
            if (selectedRfqIds[i].Id == checkbox.get("v.name") && selectedRfqIds[i].productCheck) {
                selectedRfqIds[i].productCheck = true;
            } else if (selectedRfqIds[i].Id == checkbox.get("v.name") && selectedRfqIds[i].productCheck == false) {
                selectedRfqIds[i].productCheck = false;
            }
        }*/
        if(checkbox.get("v.checked")){
            if(selectedRfqIds.indexOf(checkbox.get("v.name")) == -1){
                selectedRfqIds.push(checkbox.get("v.name"));
            }
            if(!Array.isArray(getAllId)) {
                if(!component.find("headCheckRFQ").get("v.checked")){
                    component.find("headCheckRFQ").set("v.checked",true);
                }
            }else{
                if(selectedRfqIds.length == getAllId.length){
                    if(!component.find("headCheckRFQ").get("v.checked")){
                        component.find("headCheckRFQ").set("v.checked",true);
                    }
                }
            }
        }else{
            if(component.find("headCheckRFQ").get("v.checked")){
                component.find("headCheckRFQ").set("v.checked",false);
            }
            if(selectedRfqIds.indexOf(checkbox.get("v.name")) > -1){
                var index = selectedRfqIds.indexOf(checkbox.get("v.name"));
                selectedRfqIds.splice(index,1);
            }
        }
        console.log(selectedRfqIds);
        component.set("v.listOfSelectedRFQIds",selectedRfqIds);
    },
    
    selectAllRfq : function (component, event, helper) {
        var checkStatus = event.getSource().get("v.checked");
        var rfqRecordList = JSON.parse(JSON.stringify(component.get("v.rfqRecordList")));
        var getAllId = component.find("checkRFQ");
        var recordIds = [];
        if(checkStatus){
            if(rfqRecordList.length){
                if (!Array.isArray(getAllId)) {
                    component.find("checkRFQ").set("v.checked", true);
                    var Id = component.find("checkRFQ").get("v.name");
                    if(recordIds.indexOf(Id) == -1){
                        recordIds.push(Id)
                    }
                }else{
                    for (var i = 0; i < getAllId.length; i++) {
                        component.find("checkRFQ")[i].set("v.checked", true);
                        var Id = component.find("checkRFQ")[i].get("v.name");
                        if(recordIds.indexOf(Id) == -1){
                            recordIds.push(Id)
                        }
                        //rfqRecordList[i].checkValue = "true";
                    }
                }
                component.set("v.listOfSelectedRFQIds",recordIds);
            }
        }else{
            if(rfqRecordList.length){
                if (!Array.isArray(getAllId)) {
                    component.find("checkRFQ").set("v.checked", false);
                    var Id = component.find("checkRFQ").get("v.name");
                    if(recordIds.indexOf(Id) > -1){
                        var index = recordIds.indexOf(Id);
                        recordIds.splice(index,1);
                    }
                }else{
                    for (var i = 0; i < getAllId.length; i++) {
                        component.find("checkRFQ")[i].set("v.checked", false);
                        var Id = component.find("checkRFQ")[i].get("v.name");
                        if(recordIds.indexOf(Id) > -1){
                            var index = recordIds.indexOf(Id);
                            recordIds.splice(index,1);
                        }
                        //rfqRecordList[i].checkValue = "true";
                    }
                }
                component.set("v.listOfSelectedRFQIds",recordIds);
            }
        }
        console.log(recordIds);
    },
    
    addToRfqLines: function (component, event, helper) {
        var records = component.get("v.rfqRecordList");
        var productIds = component.get("v.listOfSelectedRFQIds");
        var RfqId = component.get("v.recordId");
        var Spinner = component.get("v.spinner");
        if(productIds.length>0){
            helper.addProductToRfqLines(component, event, helper, productIds, RfqId);
        }else{
            helper.showErrorToast(component,event,helper,'Error!','Please Select Product Lines.');
        }
    },
    
    closeModal: function (component, event, helper) {
        component.get("v.onCancel")();
       // location.reload();
        //$A.get('e.force:refreshView').fire();
    },
    
    doRfqSearch: function (component, event, helper) {
        //var value = component.get("v.searchRfqFilter");//event.getSource().get("v.value");
       /* var pageNumber = component.get("v.PageNumber");
        var pageSize = component.get("v.pageSize");
        var productFamilyValue = component.get("v.searchProductFamilyFilter");
        var productValue = component.get("v.searchProductFilter");
        var productCategoryValue = component.get("v.searchCategoryFilter");
        var productTypeValue = component.get("v.searchProductTypeFilter");
        var tradeValue = component.get("v.searchTradeTypeFilter");
        var priceBook = component.get("v.searchPriceBookFilter");
        var vendor = component.get("v.searchVendorFilter");*/
        
        if(productCategoryValue){
            var categoryAction = component.get(c.showDropDownCategory);
            $A.enqueueAction(categoryAction);
        }
         var pageNumber = 1;//component.get("v.PageNumber");
        var pageSize = 20;//component.get("v.pageSize");
        var productFamilyValue = component.get("v.searchProductFamilyFilter");
        var productValue = component.get("v.searchProductFilter").Name;
        var productCategoryValue = component.get("v.searchCategoryFilter");
        var productTypeValue = component.get("v.searchProductTypeFilter");
        var tradeValue = component.get("v.searchTradeTypeFilter");
        var priceBook = component.get("v.searchPriceBookFilter");
        var vendor = component.get("v.searchVendorFilter");
       // alert(component.get("v.searchPriceBookFilter"));
       // alert(priceBook);
        helper.getRfqList(component, event, helper, pageNumber, pageSize, productFamilyValue, tradeValue, productTypeValue, productValue, productCategoryValue, priceBook,vendor);
    },
    selectRecordOption : function (component, event, helper) {
        event.preventDefault();
        //console.log(event.target)
        //console.log(event.currentTarget)
        event.stopPropagation();
        component.set("v.searchCategoryFilter",event.target.innerText);
        var forOpen = component.find("searchCategoryRes_1");
        if(forOpen){
            forOpen.getElement().style.display = 'none';
        }
    },
    selectRecordOptionforproducttype : function (component, event, helper) {
        event.preventDefault();
        //console.log(event.target)
        //console.log(event.currentTarget)
        event.stopPropagation();
        component.set("v.searchProductTypeFilter",event.target.innerText);
        var forOpen = component.find("searchCategoryRes_2");
        if(forOpen){
            forOpen.getElement().style.display = 'none';
        }
    },
    selectRecordOptionfortradetype : function (component, event, helper) {
        event.preventDefault();
        //console.log(event.target)
        //console.log(event.currentTarget)
        event.stopPropagation();
        component.set("v.searchTradeTypeFilter",event.target.innerText);
        var forOpen = component.find("searchCategoryRes_3");
        if(forOpen){
            forOpen.getElement().style.display = 'none';
        }
    },
    selectRecordOptionforvendor : function (component, event, helper) {
        event.preventDefault();
        //console.log(event.target)
        //console.log(event.currentTarget)
        event.stopPropagation();
        component.set("v.searchVendorFilter",event.target.innerText);
        var forOpen = component.find("searchCategoryRes_4");
        
        if(forOpen){
            forOpen.getElement().style.display = 'none';
        }
    },
    showDropDownCategory : function (component, event, helper) {
      //  $A.util.addClass(component.find("mySpinner"), "slds-show");
      
      var auraId = event.getSource().getLocalId();
        var auraIdName = auraId.split('_')[0];
        var index = auraId.split('_')[1];
        var forOpen = component.find(auraIdName+'Res_'+index);
        for(var i=1;i<=4;i++){
            if(i != index){
                var forClose = component.find(auraIdName+'Res_'+i);
                if(forClose){
                     forClose.getElement().style.display = 'none';
                }
               
            }
        }
           /* $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');*/
        // Get Default 5 Records order by createdDate DESC  
        forOpen.getElement().style.display = 'block'
         var getInputkeyWord = '';
         event.stopPropagation();
        event.preventDefault();
    },
    hideDropDownCategory : function (component, event, helper) {
        event.preventDefault();
      //  $A.util.addClass(component.find("mySpinner"), "slds-show");
        var eve = event.getSource();
        console.log(event.target)
        if(eve.getLocalId() == 'searchCategory_1'){
            window.setTimeout(
                $A.getCallback(function() {
                    var forOpen = component.find('searchCategoryRes_1');
                     if(forOpen){
                        forOpen.getElement().style.display = 'none';
                    }
                }), 1000
            );
        }
        if(eve.getLocalId() == 'searchCategory_2'){
            window.setTimeout(
                $A.getCallback(function() {
                    var forOpen = component.find('searchCategoryRes_2');
                     if(forOpen){
                        forOpen.getElement().style.display = 'none';
                    }
                }), 1000
            );
        }
        if(eve.getLocalId() == 'searchCategory_3'){
            window.setTimeout(
                $A.getCallback(function() {
                    var forOpen = component.find('searchCategoryRes_3');
                     if(forOpen){
                        forOpen.getElement().style.display = 'none';
                    }
                }), 1000
            );
        }
        if(eve.getLocalId() == 'searchCategory_4'){
            window.setTimeout(
                $A.getCallback(function() {
                    var forOpen = component.find('searchCategoryRes_4');
                    if(forOpen){
                        forOpen.getElement().style.display = 'none';
                    }
                }), 1000
            );
        }
        
      /* if(eve.getLocalId() != 'searchCategoryResOption' && eve.getLocalId() != 'searchCategory_1' && eve.getLocalId() != 'searchCategoryRes'){
             forOpen.getElement().style.display = 'none';
       }*/
        //forOpen.getElement().style.display = 'none'
        var getInputkeyWord = '';
       
    },
})