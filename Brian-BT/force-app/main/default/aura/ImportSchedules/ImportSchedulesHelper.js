({
    save : function(component) {
        var MAX_FILE_SIZE = 750000; /* 1 000 000 * 3/4 to account for base64 */
        var fileInput = component.find("file").getElement();
    	var file = fileInput.files[0];
        if(file.size > this.MAX_FILE_SIZE) {
            alert('File size cannot exceed ' + this.MAX_FILE_SIZE + ' bytes.\n' + 'Selected file size: ' + file.size);
    	    return;
        }
    	
        var fr = new FileReader();
		var self = this;
		
       	fr.onload = function() {
            var fileContents = fr.result;
    	    var base64Mark = 'base64,';
            var dataStart = fileContents.indexOf(base64Mark) + base64Mark.length;

            fileContents = fileContents.substring(dataStart);
        
    	    self.upload(component, file, fileContents);
        };

        fr.readAsDataURL(file);
    },
    
    upload: function(component, file, fileContents) {
        var action = component.get("c.importSchedules"); 
        
        action.setParams({
            parentId: component.get("v.parentId"),
            base64Data: encodeURIComponent(fileContents)
        });

        action.setCallback(this, function(a) {
            var state = response.getState();
            
            if(state == "SUCCESS") {
                var result = response.getReturnValue();
                if(result.isSuccess) {
                    helper.showToast("Success", result.strMessage, "success");
                    $A.get("e.force:closeQuickAction").fire();
                }
                else {
                    helper.showToast("Error", result.strMessage, "error");
                }
            }
        });
        
        $A.enqueueAction(action);
    },
    
    showToast : function(title, message, type) {
        var toastEvent = $A.get("e.force:showToast");  
        
        toastEvent.setParams({ 
            "title" : title,
            "message" : message,  
            "type" : type 
        });  
        
        toastEvent.fire(); 
    }
})