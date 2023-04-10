public class createCO {
    @AuraEnabled
    public static String changeOrderList(buildertek__Change_Order__c cOrder , String optionId) {
		buildertek__Change_Order__c b = new buildertek__Change_Order__c();
        buildertek__Question__c optionList = new buildertek__Question__c();
        optionList = [SELECT Id , Name, buildertek__Quantity__c, buildertek__Change_Order__c, buildertek__Purchase_Order__c, buildertek__Upgrade_Costs__c, buildertek__Manufacturer__c, buildertek__Question_Group__r.buildertek__Section__r.buildertek__Selection__r.buildertek__Project__c FROM buildertek__Question__c WHERE Id =: optionId];

        if (optionList.buildertek__Change_Order__c == null) {
            if(String.isBlank(cOrder.Name)){
                cOrder.Name = optionList.Name;
            }
        
            cOrder.buildertek__Date_Created__c = Date.Today();
            cOrder.buildertek__Customer_Account__c = optionList.buildertek__Manufacturer__c;
            cOrder.buildertek__Purchase_Order__c = optionList.buildertek__Purchase_Order__c;
            cOrder.buildertek__Project__c = optionList.buildertek__Question_Group__r.buildertek__Section__r.buildertek__Selection__r.buildertek__Project__c;
            cOrder.buildertek__Status__c = 'Pending';
            cOrder.buildertek__Type__c = 'Customer';             
            insert cOrder;             
    
            buildertek__Change_Order_Item__c orderLine = new buildertek__Change_Order_Item__c();
            orderLine.Name = optionList.Name;
            orderLine.buildertek__Quantity__c = optionList.buildertek__Quantity__c ;
            orderLine.buildertek__Unit_Price__c = optionList.buildertek__Upgrade_Costs__c;
            orderLine.buildertek__Change_Order__c = cOrder.Id;
            insert orderLine;

            optionList.buildertek__Change_Order__c = cOrder.Id;
            optionList.buildertek__Change_Order_Line__c = orderLine.Id;
            update optionList;

            return cOrder.Id;
        } else {
            return 'Error';
        }
       
    }

 
}