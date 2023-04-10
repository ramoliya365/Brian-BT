trigger InvoiceAPTrigger on buildertek__Account_Payable_Clone__c (after insert, after update) {

    InvoiceAPTriggerHandler handler = new  InvoiceAPTriggerHandler();

    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            handler.OnAfterInsert(Trigger.new, Trigger.newMap); 
        } else if (Trigger.isUpdate){
            if(InvoiceAPTriggerHandler.isFirstTime){
                handler.OnAfterUpdate(Trigger.new, Trigger.newMap, Trigger.oldMap); 
            }
        }   
    }
}