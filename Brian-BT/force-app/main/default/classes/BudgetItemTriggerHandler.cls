/*
Copyright (c) 2017-2018, BuilderTek.
All rights reserved. 

Developed By: Sagar
Date:  10-Nov-2017
Last Modified By: DILIGENT FORCE LABS
Date: 11-Mar-2020
*/
public with sharing class BudgetItemTriggerHandler {
    //Boolean variable to allow skipping execution of trigger in certain scenarios
	public static Boolean blnSkipBudgetItemTrigger = false;
	 
    private boolean m_isExecuting = false;
    private integer BatchSize = 0;
    
    public BudgetItemTriggerHandler (boolean isExecuting, integer size){
        m_isExecuting = isExecuting;
        BatchSize = size;
    }
    
 	public void OnBeforeInsert(List<Budget_Item__c> newBudgetItems){
     	system.debug('newBudgetItems: ' + newBudgetItems);
        system.debug(newBudgetItems[0].Budget__c);
     	//for()
     	/*BT_Utils.genrateAutoNumber([Select Id, Auto_Number1__c from Budget_Item__c 
 									 where Budget__c =:newBudgetItems[0].Budget__c 
 									 ORDER BY CREATEDDATE DESC  LIMIT 1], newBudgetItems, 'Auto_Number1__c');*/
     	
        List<Budget_Item__c> bItems = new List<Budget_Item__c>();
     	for(Budget_Item__c bItem: newBudgetItems) {
     		if(bItem.buildertek__Group__c == null) { 
     			bItems.add(bItem);
     		}
     	}
     	
        system.debug('bItems.isEmpty(): ' + bItems.isEmpty());
     	// Set default Grouping
     	if(!bItems.isEmpty()) BudgetDAO.setDefaultGrouping(bItems);
     	
     	// Set default procut name to budget item name
     	//BudgetDAO.setProductNameToItemName(newBudgetItems);
     	
     	
 	}
     
 	public void OnBeforeUpdate(Budget_Item__c[] oldBudgetItems, Budget_Item__c[] updatedBudgetItems, Map<ID, Budget_Item__c> BudgetItemMap){
     	
 	}
     
 	public void OnBeforeDelete(Budget_Item__c[] BudgetItemToDelete, Map<ID, Budget_Item__c> BudgetItemMap){
     	
 	}
     
 	public void OnAfterInsert(Budget_Item__c[] newBudgetItems, Map<ID, Budget_Item__c> newBudgetItemsMap){ 
     	
 	}
     
 	public void OnAfterUpdate(Budget_Item__c[] oldBudgetItems, Budget_Item__c[] updatedBudgetItems, Map<ID, Budget_Item__c> BudgetItemMap, Map<Id, Budget_Item__c> oldBudgetItemsMap){
    	
 	}
 	
 	public void OnBeforeUpdate(Budget_Item__c[] newBudgetItems, Map<ID, Budget_Item__c> newBudgetItemsMap){
     
 	}
 	
 	public void OnAfterDelete(Budget_Item__c[] oldBudgetItems){
     
 	}
}