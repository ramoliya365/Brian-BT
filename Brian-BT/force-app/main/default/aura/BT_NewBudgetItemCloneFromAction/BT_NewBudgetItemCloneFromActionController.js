({
	doInit : function(component, event, helper) {
		var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:BT_NewBudgetItemClone",
            componentAttributes: {
                recordId : component.get("v.recordId"),
                isbudget : component.get("v.isbudget")
            }
        });
        evt.fire();	
	}
})