trigger PaymentTrigger on BT_Payment__c (before insert, after insert, before update, after update, after undelete, after delete) {
    PaymentTriggerHandler handler = new PaymentTriggerHandler();
    if (Trigger.isInsert && Trigger.isAfter){
         handler.afterInsert(Trigger.new, Trigger.newMap);
    }
    if (Trigger.isUpdate && Trigger.isAfter){
        handler.afterUpdate(Trigger.old, Trigger.new, Trigger.oldMap, Trigger.newMap);
    }  
    
    if (Trigger.isdelete && Trigger.isAfter){ 
        handler.afterDelete(Trigger.old, Trigger.new, Trigger.oldMap, Trigger.newMap);
    }
   
}