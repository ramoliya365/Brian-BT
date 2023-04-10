trigger AccountPayableTrigger on buildertek__Account_Payable__c (before insert,before update,before delete, after insert, after update) {
    if (Trigger.isBefore) {
        if(Trigger.isInsert || Trigger.isUpdate) {
            list<Account_Payable__c> AccountPayableList = new list<Account_Payable__c>();
            for(Account_Payable__c AccountPayable : trigger.New){
                if(AccountPayable.Balance__c <= 0 && AccountPayable.Payments__c != 0){
                    AccountPayable.Status__c = 'Paid'; 
                }
                else if(AccountPayable.Balance__c > 0 && AccountPayable.Payments__c > 0){
                    AccountPayable.Status__c = 'Partially Paid';
                }
                AccountPayableList.add(AccountPayable);
                
            }
            
            BT_Utils.genrateAutoNumber([Select Id, Auto_Number1__c from Account_Payable__c 
                                            where Purchase_Order__c =:AccountPayableList[0].Purchase_Order__c 
                                            ORDER BY CREATEDDATE DESC  LIMIT 1], AccountPayableList, 'Auto_Number1__c');
         AccountPayableHelper.onbeforeUpdate(trigger.new);
        }else if(Trigger.isDelete){
            AccountPayableHelper.beforeDelete(Trigger.old);    
        }
    } else if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            AccountPayableHelper.OnAfterInsert(Trigger.new, Trigger.newMap); 
        } else if(Trigger.isUpdate){
            AccountPayableHelper.afterUpdate(Trigger.old, Trigger.new, Trigger.newMap, trigger.oldMap);   
        }
    }
}