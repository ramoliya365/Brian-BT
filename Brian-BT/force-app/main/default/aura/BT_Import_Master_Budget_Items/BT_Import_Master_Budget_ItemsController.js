({
	doInit : function(component, event, helper) {
	    component.set("v.Spinner", true);
        var action = component.get("c.getMasterBudgets");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var pageSize = component.get("v.pageSize");
                var result = response.getReturnValue();
                component.set("v.masterBudgetsList", result);
                component.set("v.totalRecords", component.get("v.masterBudgetsList").length);
                component.set("v.startPage",0);
                component.set("v.endPage",pageSize-1);
                var PaginationList = [];
                for(var i=0; i< pageSize; i++){
                    if(component.get("v.masterBudgetsList").length> i)
                        PaginationList.push(result[i]);    
                }
                //alert('PaginationList Length ------> '+PaginationList.length);
                component.set('v.PaginationList', PaginationList);
                component.set("v.Spinner", false);
            }
        });
	    $A.enqueueAction(action);
	},
	
	handleCheck : function(component, event, helper) {
        var checkbox = event.getSource();  
        var Submittals = component.get("v.masterBudgetsList");
	    /*for(var i=0 ; i < Submittals.length;i++){
	        console.log('=========> ',i +' '+ Submittals.length);
	        if(Submittals[i].quoteRecord.Id == checkbox.get("v.text") && Submittals[i].quoteCheck == false){
	            Submittals[i].quoteCheck = true;
	            if(Submittals.length > 1){
	                component.find("checkContractor")[i].set("v.value", true);
	            }
	            else{
	                component.find("checkContractor").set("v.value", true);
	            }
	        }
	        else if(Submittals[i].quoteRecord.Id == checkbox.get("v.text") && Submittals[i].quoteCheck == true){
	             Submittals[i].quoteCheck = false;
	             component.find("checkContractors").set("v.value", false);
	        }
	    }*/
	    
	    for(var i=0 ; i < Submittals.length;i++){
	        if(Submittals[i].budgetRecord != null){
	            if(Submittals[i].budgetRecord.Id == checkbox.get("v.text") && Submittals[i].budgetCheck == false){
    	            Submittals[i].budgetCheck = true;
    	        }
    	        else if(Submittals[i].budgetRecord.Id == checkbox.get("v.text") && Submittals[i].budgetCheck == true){
    	             Submittals[i].budgetCheck = false;
    	        }    
	        }else if(Submittals[i].masterBudgetRecord != null){
	            if(Submittals[i].masterBudgetRecord.Id == checkbox.get("v.text") && Submittals[i].budgetCheck == false){
    	            Submittals[i].budgetCheck = true;
    	        }
    	        else if(Submittals[i].masterBudgetRecord.Id == checkbox.get("v.text") && Submittals[i].budgetCheck == true){
    	             Submittals[i].budgetCheck = false;
    	        }    
	        }
	        
	    }
    },
    
    selectAll : function(component, event, helper) {        
        var selectedHeaderCheck = event.getSource().get("v.value"); 
		var Submittals = component.get("v.masterBudgetsList");
        var getAllId = component.find("checkContractor"); 
        if(Submittals != null){
            if(Submittals.length > 1){
                if(! Array.isArray(getAllId)){
                   if(selectedHeaderCheck == true){ 
                      component.find("checkContractor").set("v.value", true); 
                   }else{
                       component.find("checkContractor").set("v.value", false);
                   }
                }
                else{ 
                    if (selectedHeaderCheck == true) {
                        for (var i = 0; i < getAllId.length; i++) {
        					component.find("checkContractor")[i].set("v.value", true); 
        					var checkbox = component.find("checkContractor")[i].get("v.text");  
                    	        Submittals[i].budgetCheck = true;
                    	    
                        }
                    } 
                    else{
                        for (var i = 0; i < getAllId.length; i++) {
            				component.find("checkContractor")[i].set("v.value", false); 
            				
            				var checkbox = component.find("checkContractor")[i].get("v.text"); 
            				var Submittals = component.get("v.masterBudgetsList");
            	                Submittals[i].budgetCheck = false;
                       }
                   } 
                } 
            }
            else{
                var i=0;
                    if (selectedHeaderCheck == true) {
                        	component.find("checkContractor").set("v.value", true); 
        					var checkbox = component.find("checkContractor").get("v.text");  
                    	        Submittals[i].budgetCheck = true;
                    	    
                        
                    } 
                    else{
                       		component.find("checkContractor").set("v.value", false); 
            				
            				var checkbox = component.find("checkContractor").get("v.text"); 
            				var Submittals = component.get("v.masterBudgetsList");
            	                Submittals[i].budgetCheck = false;
                       
                   } 
            }
        }
     
    },
	
	closeModel : function(component, event, helper){
	    $A.get("e.force:closeQuickAction").fire();    
	},
	
	importBudget : function(component, event, helper){
	    component.set("v.Spinner", true);
	    var budgetsList = component.get("v.masterBudgetsList");
	    console.log('quotesList ---------> '+JSON.stringify(budgetsList));
	    var budgetIds = [];
	    for(var i=0 ; i < budgetsList.length;i++){
	        //alert('quoteCheck -------> '+quotesList[i].quoteCheck);
	        
	        if(budgetsList[i].budgetCheck == true){
	            if(budgetsList[i].masterBudgetRecord != null){
	                budgetIds.push(budgetsList[i].masterBudgetRecord.Id);    
	            }else if(budgetsList[i].budgetRecord != null){
	                budgetIds.push(budgetsList[i].budgetRecord.Id);    
	            }
	        }
	    }
	    if(budgetIds.length > 0){
	        var action = component.get("c.importMasterBudgetLines");  
	        action.setParams({
	            budgetIds : budgetIds,
	            recordId : component.get("v.recordId")
	        });
	        action.setCallback(this, function(response){
	            var state = response.getState();
	            if(state === "SUCCESS"){
	                var result = response.getReturnValue();  
	                if(result.Status === 'Success'){
	                    var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Success!",
                            "message": result.Message,
                            "type": 'Success'
                        });
                        toastEvent.fire(); 
                        component.set("v.Spinner", false);
                        $A.get("e.force:closeQuickAction").fire();  
                        window.setTimeout(
                            $A.getCallback(function() {
                                document.location.reload(true);    
                            }), 1000
                        );
	                }else{
	                    component.set("v.Spinner", false);
	                    var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Error!",
                            "message": result.Message,
                            "type": 'Error'
                        });
                        toastEvent.fire();    
	                }
	            }
	        });
	        $A.enqueueAction(action);
	    }else{
	        component.set("v.Spinner", false);
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Error!",
                "message": 'Please select atlease one Budget record',
                "type": 'Error',
                "duration": '10000',
				"mode": 'dismissible'
            });    
	    }
	},
	
	next: function (component, event, helper) {
        var sObjectList = component.get("v.masterBudgetsList");
        var end = component.get("v.endPage");
        var start = component.get("v.startPage");
        var pageSize = component.get("v.pageSize");
        var Paginationlist = [];
        var counter = 0;
        for(var i=end+1; i<end+pageSize+1; i++){
            if(sObjectList.length > i){
                Paginationlist.push(sObjectList[i]);
            }
            counter ++ ;
        }
        start = start + counter;
        end = end + counter;
        component.set("v.startPage",start);
        component.set("v.endPage",end);
        component.set('v.PaginationList', Paginationlist);
    },
    previous: function (component, event, helper) {
        var sObjectList = component.get("v.masterBudgetsList"); 
        var end = component.get("v.endPage");
        var start = component.get("v.startPage");
        var pageSize = component.get("v.pageSize");
        var Paginationlist = [];
        var counter = 0;
        for(var i= start-pageSize; i < start ; i++){
            if(i > -1){
                Paginationlist.push(sObjectList[i]);
                counter ++;
            }else{
                start++;
            }
        }
        start = start - counter;
        end = end - counter;
        component.set("v.startPage",start);
        component.set("v.endPage",end);
        component.set('v.PaginationList', Paginationlist);
    },
})