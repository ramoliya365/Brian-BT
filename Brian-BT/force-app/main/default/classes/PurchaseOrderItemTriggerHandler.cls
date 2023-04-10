/*
Copyright (c) 2017-2018, BuilderTek.
All rights reserved. 

Developed By: Sagar
Date:  19-Sep-2017
*/
public with sharing class PurchaseOrderItemTriggerHandler {
	
    //Boolean variable to allow skipping execution of trigger in certain scenarios
	public static Boolean blnSkipPurchaseOrderItemUpdateTrigger = false;
	 
    private boolean m_isExecuting = false;
    private integer BatchSize = 0;
    
    public PurchaseOrderItemTriggerHandler (boolean isExecuting, integer size){
        m_isExecuting = isExecuting;
        BatchSize = size;
    }
    
 	public void OnBeforeInsert(Purchase_Order_Item__c[] newPurchaseOrderItems){
 	    List<Purchase_Order_Item__c> poItemList;
 	    if(Schema.sObjectType.Purchase_Order_Item__c.fields.id.isAccessible()
 	        && Schema.sObjectType.Purchase_Order_Item__c.fields.Auto_Number1__c.isAccessible()
 	        && Schema.sObjectType.Purchase_Order_Item__c.fields.Purchase_Order__c.isAccessible()){
 	        poItemList = [Select Id, Auto_Number1__c from Purchase_Order_Item__c 
 									 where purchase_order__c =:newPurchaseOrderItems[0].purchase_order__c 
 									 ORDER BY CREATEDDATE DESC  LIMIT 1];
 	    } 							 
     	BT_Utils.genrateAutoNumber(poItemList, newPurchaseOrderItems, 'Auto_Number1__c');
 	}
     
 	public void OnBeforeUpdate(Purchase_Order_Item__c[] oldPurchaseOrderItems, Purchase_Order_Item__c[] updatedPurchaseOrderItems, Map<ID, Purchase_Order_Item__c> PurchaseOrderItemMap){
     	
 	}
     
 	public void OnBeforeDelete(Purchase_Order_Item__c[] PurchaseOrderItemToDelete, Map<ID, Purchase_Order_Item__c> PurchaseOrderItemMap){
     	
 	}
     
 	public void OnAfterInsert(Purchase_Order_Item__c[] newPurchaseOrderItems, Map<ID, Purchase_Order_Item__c> newPurchaseOrderItemsMap){ 
     	
     	// Create PO Item to Budget Item link
     	PurchaseOrderDAO.createPurchaseOrderItemToBudgetItemLink(newPurchaseOrderItems);
     	PurchaseOrderDAO.RollUpPurchaseOrderItemAmount(newPurchaseOrderItemsMap.KeySet());
     	
     	// create AP Items
     	// TODO: make this configurable
     	//PurchaseOrderDAO.createAPItems(newPurchaseOrderItems);
		List<Id> poids = new List<Id>();
		for(Purchase_Order_Item__c POI : newPurchaseOrderItems){
			poids.add(POI.Id);
		}
		System.debug(poids);
		quickBookCallout(poids);
 	}
     
 	public void OnAfterUpdate(Purchase_Order_Item__c[] oldPurchaseOrderItems, Purchase_Order_Item__c[] updatedPurchaseOrderItems, Map<ID, Purchase_Order_Item__c> PurchaseOrderItemMap, Map<Id, Purchase_Order_Item__c> oldPurchaseOrderItemsMap){
    	
    	PurchaseOrderDAO.RollUpPurchaseOrderItemAmount(PurchaseOrderItemMap.KeySet());
 	}
 	
 	public void OnBeforeUpdate(Purchase_Order_Item__c[] newPurchaseOrderItems, Map<ID, Purchase_Order_Item__c> newPurchaseOrderItemsMap){
     
 	}
 	
 	public void OnAfterDelete(Purchase_Order_Item__c[] oldPurchaseOrderItems){
     
 	}

	@future(callout = true)
	public static void quickBookCallout(List<Id> testlist){
		System.debug('In quickBookCallout Method');
		List<Purchase_Order_Item__c> poiList = new List<Purchase_Order_Item__c>();
		poiList = [SELECT Id, Name, buildertek__Auto_Number1__c, buildertek__Quantity__c, buildertek__Unit_Price__c, buildertek__Tax__c, buildertek__Cost_Code__c, buildertek__Total_Price__c FROM Purchase_Order_Item__c WHERE Id IN :testlist];
		// System.debug('data from the purchase order ===>>>> '+updatedPurchaseOrders);

		// String JSONString = JSON.serialize(updatedPurchaseOrders[0]);
		// System.debug('JSONString ==>> '+JSONString);

		// companyID or realmID ==>  4620816365220119350
		// Change the "Parker Pen" value to the POI Name.
		for(Purchase_Order_Item__c poi : poiList) {
			System.debug('poi--- '+poi);
			String jsonFormatData = '';
			jsonFormatData += '{"Line":[{"Id":"'+poi.buildertek__Auto_Number1__c+'","LineNum":'+Integer.valueOf(poi.buildertek__Auto_Number1__c)+',"Amount":'+Integer.valueof(poi.buildertek__Total_Price__c)+',"DetailType":"ItemBasedExpenseLineDetail","ItemBasedExpenseLineDetail":{"ItemRef":{"value":"7","name":"Parker Pen"},"UnitPrice":'+Integer.valueOf(poi.buildertek__Unit_Price__c)+',"Qty":'+poi.buildertek__Quantity__c+'}}],"VendorRef":{"value":"10","name":"Anand"},"APAccountRef":{"value":"81","name":"Accounts Payable (Creditors)"}}';

			HttpRequest req = new HttpRequest();
			string  endPointURL = 'callout:quickbooks/v3/company/4620816365220119350/purchaseorder?minorversion=65';
			req.setEndpoint(endPointURL);
			req.setMethod('POST');
			req.setHeader('Content-Type','application/json');
			req.setHeader('Accept','application/json'); 
			req.setBody(jsonFormatData);
			req.setTimeout(120000);
			system.debug('--req--'+req);
			Http http = new Http();
			if(!Test.isRunningTest()){
				HTTPResponse response = http.send(req);
				//Response Handle
				if(response.getStatusCode() == 200 ){
					System.debug('---Response---'+response);
					System.debug('-Response--'+response.getBody());
					// system.debug('--deserialize'+JSON.deserializeUntyped(response.getBody()));
					// Map<String, Object> serializeResponseBody = new Map<String, Object>();
					// serializeResponseBody = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
					// System.debug('serializeResponseBody>>'+JSON.serializePretty(serializeResponseBody));
				}
			}
		}
	 }
}