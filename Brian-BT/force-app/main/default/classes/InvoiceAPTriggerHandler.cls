public class InvoiceAPTriggerHandler {

    public static Boolean isFirstTime = true;

    public void OnAfterInsert(buildertek__Account_Payable_Clone__c[] invoiceList, Map<Id, buildertek__Account_Payable_Clone__c> invoiceNewMap){

        Set<Id> invoiceIds = new Set<Id>();
        for (buildertek__Account_Payable_Clone__c invoice : invoiceList) {
            invoiceIds.add(invoice.Id);
        }
        if (invoiceIds.size() > 0) {
            List<buildertek__Finance_Transaction__c> transactionList = [SELECT Id, Name, buildertek__Payable_Invoice_AP__c FROM buildertek__Finance_Transaction__c WHERE buildertek__Payable_Invoice_AP__c IN: invoiceIds];
            for (buildertek__Finance_Transaction__c fTransaction : transactionList) {
                fTransaction.buildertek__Amount__c = invoiceNewMap.get(fTransaction.buildertek__Payable_Invoice_AP__c).buildertek__Total_Amount__c * (-1);
                fTransaction.buildertek__Debit_Amount__c = invoiceNewMap.get(fTransaction.buildertek__Payable_Invoice_AP__c).buildertek__Total_Amount__c;
            }
            if (transactionList.size() > 0) {
                update transactionList;
            }
        }
    }

    public void OnAfterUpdate(buildertek__Account_Payable_Clone__c[] invoiceList, Map<Id, buildertek__Account_Payable_Clone__c> invoiceNewMap, Map<Id, buildertek__Account_Payable_Clone__c> invoiceOldMap){

        Set<Id> budgetIdSet = new Set<Id>();
        Set<Id> invoiceIds = new Set<Id>();

        for (buildertek__Account_Payable_Clone__c invoice : invoiceList) {
            buildertek__Account_Payable_Clone__c oldInvoiceData = invoiceOldMap.get(invoice.Id);

            /* if (oldInvoiceData.buildertek__Budget_Line__c != null && invoice.buildertek__Budget_Line__c == null) {
                budgetIdSet.add(oldInvoiceData.buildertek__Budget_Line__c);
            } */


            //* Nishit suthar playground start
            
            if (invoice.buildertek__Budget__c != null) {

                //* covering scenario 1 here
                if (invoice.buildertek__Budget__c != null && invoice.buildertek__Budget_Line__c == null && invoice.buildertek__Budget__c != oldInvoiceData.buildertek__Budget__c) {
                    AddBudgetLineItemOnPayableInvoice.createNewBudgetLineItem(invoice.Id);
                }

                //* covering scenario 1 a&b here
                if (oldInvoiceData.buildertek__Budget_Line__c != invoice.buildertek__Budget_Line__c) {
                    AddBudgetLineItemOnPayableInvoice.deleteBudgetItem(invoice.Id, oldInvoiceData.buildertek__Budget_Line__c);
                    AddBudgetLineItemOnPayableInvoice.updateBudgetLineSub(invoice.Id, invoice.buildertek__Budget__c, oldInvoiceData.buildertek__Budget_Line__c);
                }

                if(oldInvoiceData.buildertek__Budget_Line__c != invoice.buildertek__Budget_Line__c && invoice.buildertek__Budget_Line__c != null){
                    System.debug('in 2nd condition');
                    //! calling my apex method here for updating the data in budgetitem
                    AddBudgetLineItemOnPayableInvoice.updateBudgetLine(invoice.Id, invoice.buildertek__Budget__c,invoice.buildertek__Budget_Line__c);
                }
                
            } 
            //* covering scenario 1 a&b here as well
            else if(oldInvoiceData.buildertek__Budget__c != invoice.buildertek__Budget__c && oldInvoiceData.buildertek__Budget_Line__c != invoice.buildertek__Budget_Line__c){
                AddBudgetLineItemOnPayableInvoice.deleteBudgetItem(invoice.Id, oldInvoiceData.buildertek__Budget_Line__c);
                AddBudgetLineItemOnPayableInvoice.updateBudgetLineSub(invoice.Id, invoice.buildertek__Budget__c, oldInvoiceData.buildertek__Budget_Line__c);
            }
            
            //* Nishit suthar playground end
            

            if (invoice.buildertek__Total_Amount__c != oldInvoiceData.buildertek__Total_Amount__c) {
                invoiceIds.add(invoice.Id);
            }
        }

        if (invoiceIds.size() > 0) {
            List<buildertek__Finance_Transaction__c> transactionList = [SELECT Id, Name, buildertek__Payable_Invoice_AP__c FROM buildertek__Finance_Transaction__c WHERE buildertek__Payable_Invoice_AP__c IN: invoiceIds];
            for (buildertek__Finance_Transaction__c fTransaction : transactionList) {
                fTransaction.buildertek__Amount__c = invoiceNewMap.get(fTransaction.buildertek__Payable_Invoice_AP__c).buildertek__Total_Amount__c * (-1);
                fTransaction.buildertek__Debit_Amount__c = invoiceNewMap.get(fTransaction.buildertek__Payable_Invoice_AP__c).buildertek__Total_Amount__c;
            }
            if (transactionList.size() > 0) {
                update transactionList;
            }
        }

        /* if (budgetIdSet.size() > 0) {
            List<buildertek__Budget_Item__c> budgetItemList = [SELECT Id, Name, buildertek__Invoice_total__c FROM buildertek__Budget_Item__c WHERE Id IN: budgetIdSet];
            for (buildertek__Budget_Item__c budget : budgetItemList) {
                budget.buildertek__Invoice_total__c = 0;
            }
            update budgetItemList;
        } */

    }

}