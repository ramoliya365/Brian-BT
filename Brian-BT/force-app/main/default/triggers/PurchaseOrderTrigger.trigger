/*
 Copyright (c) 2017-2018, BuilderTek.
 All rights reserved.

 Developed By: Sagar
 Date: 15/09/2017
 */
trigger PurchaseOrderTrigger on Purchase_Order__c(after delete, after insert, after undelete, after update, before delete, before insert, before update ){
    System.debug('In trigger');

    if (!BT_Utils.isTriggerDeactivate('Purchase_Order__c') && !PurchaseOrderTriggerHandler.blnSkipPurchaseOrderUpdateTrigger){

        PurchaseOrderTriggerHandler handler = new PurchaseOrderTriggerHandler(Trigger.isExecuting, Trigger.size);

        if (Trigger.isInsert && Trigger.isBefore){
            handler.OnBeforeInsert(Trigger.new);
        } else if (Trigger.isInsert && Trigger.isAfter){
            handler.OnAfterInsert(Trigger.new, Trigger.newMap);
            handler.updateTotalCostOnBudgetLine(Trigger.new, Trigger.newMap,trigger.oldMap);
        } else if (Trigger.isUpdate && Trigger.isBefore){
        //    handler.OnBeforeUpdate(Trigger.old, Trigger.new, Trigger.oldMap, Trigger.newMap);
           handler.OnBeforeUpdate(Trigger.new, Trigger.newMap, Trigger.oldMap);
        } else if (Trigger.isUpdate && Trigger.isAfter ){
                 handler.updateTotalCostOnBudgetLine(Trigger.new, Trigger.newMap,trigger.oldMap);
            handler.OnAfterUpdate(Trigger.old, Trigger.new, Trigger.newMap, trigger.oldMap);
            //handler.afterUpdate(Trigger.old, Trigger.new, Trigger.oldMap, Trigger.newMap);
        } else if (Trigger.isDelete && Trigger.isBefore){
            handler.OnBeforeDelete(Trigger.old, Trigger.oldMap);
        } else if (Trigger.isDelete && Trigger.isAfter){
            handler.OnAfterDelete(Trigger.old);
        } 
    }
}