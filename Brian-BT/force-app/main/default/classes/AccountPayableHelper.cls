public with sharing class AccountPayableHelper {
    public static void beforeDelete(List<buildertek__Account_Payable__c> listAccountPayable) {
        for(buildertek__Account_Payable__c currPayable : listAccountPayable) {
            if(String.isNotBlank(currPayable.buildertek__Status__c)) {
                if(currPayable.buildertek__Status__c.equalsIgnoreCase('Approved') || currPayable.buildertek__Status__c.equalsIgnoreCase('Paid') 
                   || currPayable.buildertek__Status__c.equalsIgnoreCase('Partial Payment')) {
                       currPayable.addError('You cannot delete this record.');
                   }
            }
        }
    }
   
    public static void afterUpdate(buildertek__Account_Payable__c[] oldPayableList, buildertek__Account_Payable__c[] updatedPayableList, Map<ID, buildertek__Account_Payable__c> PayableMap, Map<Id, buildertek__Account_Payable__c> oldPayableMap){
        SET<Id> purchaseOderIdSet = new SET<Id>();
        SET<Id> budgetIdSet = new SET<Id>();
        SET<Id> budgetPurchaseOderIdSet = new SET<Id>();
        decimal totalAmount = 0;
        Map<String, String> purchaseOrderMap = new Map<String, String>();
        Map<String, Decimal> budgetMap = new Map<String, Decimal>();
        List<buildertek__Budget__c> budgetListToUpdate = new List<buildertek__Budget__c>();
        Set<Id> invoiceIds = new Set<Id>();
        for(buildertek__Account_Payable__c pay : updatedPayableList){ 
            purchaseOderIdSet.add(pay.buildertek__Purchase_Order__c); 

            if (pay.buildertek__Net_Amount__c != oldPayableMap.get(pay.Id).buildertek__Net_Amount__c) {
                invoiceIds.add(pay.Id);
            }
        } 
        system.debug('purchaseOderIdSet --------> '+purchaseOderIdSet);
         List<buildertek__Purchase_Order__c> purchaseOrderList = new  List<buildertek__Purchase_Order__c>();
        
            
             purchaseOrderList = [SELECT Id,
                                        Name,
                                        buildertek__Budget__c
                                        FROM buildertek__Purchase_Order__c
                                        WHERE Id IN: purchaseOderIdSet];
          
        if(purchaseOrderList.size() > 0){
            for(buildertek__Purchase_Order__c PO : purchaseOrderList){
                if(PO.buildertek__Budget__c !=null){
                budgetIdSet.add(PO.buildertek__Budget__c); 
                }
            }
        }
            List<buildertek__Purchase_Order__c> budgetPurchaseOrderList = new List<buildertek__Purchase_Order__c>();
             
        if(budgetIdSet !=null)  {          
                budgetPurchaseOrderList= [SELECT Id,
                                            Name,
                                            buildertek__Budget__c
                                            FROM buildertek__Purchase_Order__c
                                            WHERE buildertek__Budget__c IN: budgetIdSet];
            
        }
        if(budgetPurchaseOrderList.size() > 0){
            system.debug('budgetPurchaseOrderList Size --------> '+budgetPurchaseOrderList.size());
            for(buildertek__Purchase_Order__c purchaseOrder : budgetPurchaseOrderList){
                budgetPurchaseOderIdSet.add(purchaseOrder.Id);
                purchaseOrderMap.put(purchaseOrder.Id, purchaseOrder.buildertek__Budget__c);
            } 
        }
            List<buildertek__Account_Payable__c> payablesList = new  List<buildertek__Account_Payable__c>();
        if(budgetPurchaseOderIdSet !=null){
            
                        payablesList = [SELECT Id,
                                        Name,
                                        buildertek__Purchase_Order__c,
                                        buildertek__Purchase_Order__r.buildertek__Budget__c,
                                        buildertek__Payments__c
                                        FROM buildertek__Account_Payable__c
                                        WHERE buildertek__Purchase_Order__c IN: budgetPurchaseOderIdSet];
            
                                                    
            system.debug('payablesList --------> '+payablesList);
            system.debug('payablesList Size --------> '+payablesList.size());
        }
        if(payablesList.size()>0){
            for(buildertek__Account_Payable__c payable : payablesList){ 
                //totalAmount += invoice.buildertek__Total_Amount_Tax__c;
                if(budgetMap.get(payable.buildertek__Purchase_Order__r.buildertek__Budget__c) == null){
                    budgetMap.put(payable.buildertek__Purchase_Order__r.buildertek__Budget__c, payable.buildertek__Payments__c);    
                }else{
                   decimal finalTotalAmount = budgetMap.get(payable.buildertek__Purchase_Order__r.buildertek__Budget__c) + payable.buildertek__Payments__c; 
                   budgetMap.put(payable.buildertek__Purchase_Order__r.buildertek__Budget__c, finalTotalAmount);
                }
                 
            }  
        }                                            
            for(String budgetId : budgetMap.keySet()){
                if(budgetId != null ){
                    
                        buildertek__Budget__c newBudget =  new buildertek__Budget__c();
                        newBudget.Id = budgetId;
                        newBudget.buildertek__Paid_To_Date__c = budgetMap.get(budgetId);
                        budgetListToUpdate.add(newBudget);    
                    
                }
            } 
            if(budgetListToUpdate.size() > 0){
                if ( Schema.sObjectType.buildertek__Budget__c.fields.buildertek__Paid_To_Date__c.isUpdateable()) {
                   update budgetListToUpdate;  
                        }
            }   
            
        if (invoiceIds.size() > 0) {
            List<buildertek__Finance_Transaction__c> transactionList = [SELECT Id, Name, buildertek__Contractor_Invoice_PO__c FROM buildertek__Finance_Transaction__c WHERE buildertek__Contractor_Invoice_PO__c IN: invoiceIds];
            for (buildertek__Finance_Transaction__c fTransaction : transactionList) {
                fTransaction.buildertek__Amount__c = PayableMap.get(fTransaction.buildertek__Contractor_Invoice_PO__c).buildertek__Net_Amount__c * (-1);
                fTransaction.buildertek__Debit_Amount__c = PayableMap.get(fTransaction.buildertek__Contractor_Invoice_PO__c).buildertek__Net_Amount__c;
            }
            if (transactionList.size() > 0) {
                update transactionList;
            }
        }
    }
    public static void onbeforeUpdate(buildertek__Account_Payable__c[] updatedPayableList){ 
        for(buildertek__Account_Payable__c inv : updatedPayableList){ 
            if(inv.buildertek__Terms__c == 'Due on Receipt'){
            inv.buildertek__Due_Date__c = Date.today();
            }if(inv.buildertek__Date_Received__c != null && inv.buildertek__Terms__c != 'Due on Receipt'){
                if(inv.buildertek__Terms__c == 'Net 15'){
                    inv.buildertek__Due_Date__c = inv.buildertek__Date_Received__c + 15;
                }else if(inv.buildertek__Terms__c == 'Net 30'){
                    inv.buildertek__Due_Date__c = inv.buildertek__Date_Received__c + 30;
                }else if(inv.buildertek__Terms__c == 'Net 60'){
                    inv.buildertek__Due_Date__c = inv.buildertek__Date_Received__c + 60;
                }
            }
            
        }
    }

    public static void OnAfterInsert(buildertek__Account_Payable__c[] invoiceList, Map<Id, buildertek__Account_Payable__c> invoiceNewMap){

        Set<Id> invoiceIds = new Set<Id>();
        for (buildertek__Account_Payable__c invoice : invoiceList) {
            invoiceIds.add(invoice.Id);
        }
        if (invoiceIds.size() > 0) {
            List<buildertek__Finance_Transaction__c> transactionList = [SELECT Id, Name, buildertek__Contractor_Invoice_PO__c FROM buildertek__Finance_Transaction__c WHERE buildertek__Contractor_Invoice_PO__c IN: invoiceIds];
            for (buildertek__Finance_Transaction__c fTransaction : transactionList) {
                fTransaction.buildertek__Amount__c = invoiceNewMap.get(fTransaction.buildertek__Contractor_Invoice_PO__c).buildertek__Net_Amount__c * (-1);
                fTransaction.buildertek__Debit_Amount__c = invoiceNewMap.get(fTransaction.buildertek__Contractor_Invoice_PO__c).buildertek__Net_Amount__c;
            }
            if (transactionList.size() > 0) {
                update transactionList;
            }
        }
    }
    
}