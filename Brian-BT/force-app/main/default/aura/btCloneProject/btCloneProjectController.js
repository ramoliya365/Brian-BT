({
	handleChange : function(component, event, helper) {
		
	},
    handleClick:function(component, event, helper) {
        var itemsToclonned = component.get("v.value");
        if(itemsToclonned){
            itemsToclonned = component.get("v.recordId")+'~'+itemsToclonned ;
        }else {
            itemsToclonned = '';    
        }
        
		var evt = $A.get("e.force:createRecord");
	        evt.setParams({
	            'entityApiName':'buildertek__Project__c',
	            'defaultFieldValues': {
	                'buildertek__Source_Project__c':itemsToclonned
	            }
	        });
	        evt.fire();
	},
})