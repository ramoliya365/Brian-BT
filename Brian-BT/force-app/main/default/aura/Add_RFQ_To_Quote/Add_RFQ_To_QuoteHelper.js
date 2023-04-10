({
	getPurchaseOrder : function(component, event, helper) {
	   
		var action = component.get("c.getRFQList");  
		action.setParams({
		    recordId: component.get("v.recordId")
		});
        action.setCallback(this, function (response) {
        	if (response.getState() === "SUCCESS") {
        			component.set("v.RFQList",response.getReturnValue());
        	} else {
        	}	        	
        });  
        $A.enqueueAction(action);
	},
	
	getQuote : function(component, event, helper) {
	    var recordId = component.get("v.recordId");
		var action = component.get("c.getQuotelist");
		action.setParams({
		    recordId : recordId
		});
        action.setCallback(this, function (response) {
        	if (response.getState() === "SUCCESS") {         	
        			component.set("v.Quotes",response.getReturnValue());
        	} else {
        		
        	}
        });  
        $A.enqueueAction(action);
	},
	
	sortBy: function(component, helper, field) {
    	var currentDir = component.get("v.isAsc");
    	if (currentDir == true) {  
    	 component.set("v.isAsc", false);
    	} else {
    	 component.set("v.isAsc", true);
    	} 
    	this.onLoad(component, event, field);
    },
    
    onLoad: function(component, event, sortField) {
    	var action = component.get('c.fetchPurchaseOrders');
    	action.setParams({
    	 'sortField': sortField,
    	 'isAsc': component.get("v.isAsc"),
    	 'recordId' : component.get("v.recordId")
    	});
    	action.setCallback(this, function(response) {
    	 var state = response.getState();
    	 if (state === "SUCCESS") {
    	     var result = response.getReturnValue();
    		 component.set('v.RFQList', result); 
    	 }
    	});
    	$A.enqueueAction(action);
    },
	
})