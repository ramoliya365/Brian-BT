public class PaymentTriggerHandler {
    
    public void afterInsert(List<buildertek__BT_Payment__c> newPaymentline, Map<Id, buildertek__BT_Payment__c> newPaymentlineMap){
        
        list<String> invoiceIds = new list<String> ();
        if(!newPaymentline.isEmpty()){
            for(buildertek__BT_Payment__c payment : newPaymentline){
                invoiceIds.add(payment.buildertek__Invoices_AP__c);
            }
        }
        
        system.debug('invoiceIds----->'+invoiceIds);        
        List<buildertek__Account_Payable_Clone__c> invoiceRecList = [select Id, Name, buildertek__Payment_Amount__c  from buildertek__Account_Payable_Clone__c where Id IN: invoiceIds];
        
        List<AggregateResult> result = [SELECT SUM(buildertek__Amount__c)totalCost, buildertek__Invoices_AP__c FROM buildertek__BT_Payment__c
                                        WHERE buildertek__Invoices_AP__c IN: invoiceIds group by buildertek__Invoices_AP__c];
        
        system.debug('result----->'+result);
        Map<String,decimal> invoiceMap = new Map<String,decimal>();
        
        system.debug('invoiceRecList----->'+invoiceRecList);
        if(!invoiceRecList.isEmpty()){
            for(AggregateResult agg : result){
                invoiceMap.put((String)agg.get('buildertek__Invoices_AP__c'), (decimal)agg.get('totalCost'));
            }
        }
        system.debug('invoiceMap----->'+invoiceMap);
        if(!invoiceRecList.isEmpty()){
            for(buildertek__Account_Payable_Clone__c invoice : invoiceRecList){
                invoice.buildertek__Payment_Amount__c = invoiceMap.get(invoice.Id);
            }
            update invoiceRecList;
        }
        system.debug('invoiceRecList----->'+invoiceRecList);
        
    }
    
    
    public void afterUpdate(List<buildertek__BT_Payment__c> oldPaymentline, List<buildertek__BT_Payment__c> newPaymentline, Map<Id, buildertek__BT_Payment__c> oldPaymentlineMap, Map<Id, buildertek__BT_Payment__c> newPaymentlineMap){
        list<String> invoiceIds = new list<String> ();
        if(!newPaymentline.isEmpty()){
            for(buildertek__BT_Payment__c payment : newPaymentline){
                invoiceIds.add(payment.buildertek__Invoices_AP__c);
            }
        }
        
        system.debug('invoiceIds----->'+invoiceIds);        
        List<buildertek__Account_Payable_Clone__c> invoiceRecList = [select Id, Name, buildertek__Payment_Amount__c  from buildertek__Account_Payable_Clone__c where Id IN: invoiceIds];
        
        List<AggregateResult> result = [SELECT SUM(buildertek__Amount__c)totalCost, buildertek__Invoices_AP__c FROM buildertek__BT_Payment__c
                                        WHERE buildertek__Invoices_AP__c IN: invoiceIds group by buildertek__Invoices_AP__c];
        
        system.debug('result----->'+result);
        Map<String,decimal> invoiceMap = new Map<String,decimal>();
        
        system.debug('invoiceRecList----->'+invoiceRecList);
        if(!invoiceRecList.isEmpty()){
            for(AggregateResult agg : result){
                invoiceMap.put((String)agg.get('buildertek__Invoices_AP__c'), (decimal)agg.get('totalCost'));
            }
        }
        system.debug('invoiceMap----->'+invoiceMap);
        if(!invoiceRecList.isEmpty()){
            for(buildertek__Account_Payable_Clone__c invoice : invoiceRecList){
                invoice.buildertek__Payment_Amount__c = invoiceMap.get(invoice.Id);
            }
            update invoiceRecList;
        }
        system.debug('invoiceRecList----->'+invoiceRecList);
    }
    
    public void afterDelete(List<buildertek__BT_Payment__c> oldPaymentline, List<buildertek__BT_Payment__c> newPaymentline, Map<Id, buildertek__BT_Payment__c> oldPaymentlineMap, Map<Id, buildertek__BT_Payment__c> newPaymentlineMap){
        
        list<String> invoiceIds = new list<String> ();
        if(!oldPaymentline.isEmpty()){
            for(buildertek__BT_Payment__c payment : oldPaymentline){
                invoiceIds.add(payment.buildertek__Invoices_AP__c);
            }
        }
        
        system.debug('invoiceIds----->'+invoiceIds);        
        List<buildertek__Account_Payable_Clone__c> invoiceRecList = [select Id, Name, buildertek__Payment_Amount__c  from buildertek__Account_Payable_Clone__c where Id IN: invoiceIds];
        
        List<AggregateResult> result = [SELECT SUM(buildertek__Amount__c)totalCost, buildertek__Invoices_AP__c FROM buildertek__BT_Payment__c
                                        WHERE buildertek__Invoices_AP__c IN: invoiceIds group by buildertek__Invoices_AP__c];
        
        system.debug('result----->'+result);
        Map<String,decimal> invoiceMap = new Map<String,decimal>();
        
        system.debug('invoiceRecList----->'+invoiceRecList);
        if(!invoiceRecList.isEmpty()){
            for(AggregateResult agg : result){
                invoiceMap.put((String)agg.get('buildertek__Invoices_AP__c'), (decimal)agg.get('totalCost'));
            }
        }
        system.debug('invoiceMap----->'+invoiceMap);
        if(!invoiceRecList.isEmpty()){
            for(buildertek__Account_Payable_Clone__c invoice : invoiceRecList){
                invoice.buildertek__Payment_Amount__c = invoiceMap.get(invoice.Id);
            }
            update invoiceRecList;
        }
        system.debug('invoiceRecList----->'+invoiceRecList);
    }    
    
}