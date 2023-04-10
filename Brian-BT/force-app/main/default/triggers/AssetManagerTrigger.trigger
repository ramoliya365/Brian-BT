trigger AssetManagerTrigger on buildertek__Asset_History__c(before insert,after insert){
    if (!BT_Utils.isTriggerDeactivate('buildertek__Asset_History__c') && !AssestManagerHandler.blnSkipTimecardTrigger){
        AssestManagerHandler handler = new AssestManagerHandler(Trigger.isExecuting, Trigger.size);

        if (Trigger.isInsert && Trigger.isBefore){
          //  handler.OnBeforeInsert(Trigger.new);
        }
        
    }
     system.debug('$$$$$');
    AssestManagerHandler handler = new AssestManagerHandler(Trigger.isExecuting, Trigger.size);
    system.debug('^^^^^^^^^^');
    if (Trigger.isInsert && Trigger.isAfter){
            handler.afterInsert(Trigger.new, Trigger.newMap);
        }
}