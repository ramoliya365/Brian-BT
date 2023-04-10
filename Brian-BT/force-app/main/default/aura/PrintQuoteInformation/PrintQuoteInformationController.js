({
	doInit : function(component, event, helper) {
        // var url = location.href;
        // var baseURL = url.substring(0, url.indexOf('/', 14));
        // component.set("v.BaseURL",baseURL);
        component.set("v.Spinner",true);
        window.setTimeout(
            $A.getCallback(function() {
                component.set("v.Spinner", false); 
                $A.get("e.force:closeQuickAction").fire();
            }), 7000
        );
    }
})