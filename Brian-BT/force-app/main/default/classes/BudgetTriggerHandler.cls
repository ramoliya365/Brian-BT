/*
Copyright (c) 2017-2018, BuilderTek.
All rights reserved. 

Developed By: Sagar
Date:  19-Sep-2017
*/
public with sharing class BudgetTriggerHandler {
    //Boolean variable to allow skipping execution of trigger in certain scenarios
	public static Boolean blnSkipBudgetTrigger = false;
	 
    private boolean m_isExecuting = false;
    private integer BatchSize = 0;
    
    public BudgetTriggerHandler (boolean isExecuting, integer size){
        m_isExecuting = isExecuting;
        BatchSize = size;
    }
    
 	public void OnBeforeInsert(Budget__c[] newBudgets){
     	BT_Utils.genrateAutoNumber([Select Id, Auto_Number__c from Budget__c 
 									 where Project__c =:newBudgets[0].Project__c 
 									 ORDER BY CREATEDDATE DESC  LIMIT 1], newBudgets, 'Auto_Number__c');
 	}
     
 	public void OnBeforeUpdate(Budget__c[] oldBudgets, Budget__c[] updatedBudgets, Map<ID, Budget__c> BudgetMap){
     	
 	}
     
 	public void OnBeforeDelete(Budget__c[] BudgetToDelete, Map<ID, Budget__c> BudgetMap){
     	
 	}
     
 	public void OnAfterInsert(Budget__c[] newBudgets, Map<ID, Budget__c> newBudgetsMap){ 
     	
 	}
     
 	public void OnAfterUpdate(Budget__c[] oldBudgets, Budget__c[] updatedBudgets, Map<ID, Budget__c> BudgetMap, Map<Id, Budget__c> oldBudgetsMap){
    	
 	}
 	
 	public void OnBeforeUpdate(Budget__c[] newBudgets, Map<ID, Budget__c> newBudgetsMap){
     
 	}
 	
 	public void OnAfterDelete(Budget__c[] oldBudgets){
     
 	}
}