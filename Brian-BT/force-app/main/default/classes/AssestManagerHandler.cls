public with sharing class AssestManagerHandler{
	public static Boolean blnSkipTimecardTrigger = false;
	private boolean m_isExecuting = false;
	private integer BatchSize = 0;
	public AssestManagerHandler(boolean isExecuting, integer size){
        system.debug('&&&&&&&&&&');
        m_isExecuting = isExecuting;
		BatchSize = size;
	}

	public void OnBeforeInsert(List<buildertek__Asset_History__c> assetHistory){
		Map<Id, buildertek__Asset_History__c> assetHistories = new Map<Id, buildertek__Asset_History__c>();
		for (buildertek__Asset_History__c record : assetHistory){
			assetHistories.put(record.buildertek__Asset_Manager__c, record);
		}

		List<buildertek__Asset_History__c> recordList = [Select Id, Name, buildertek__Asset_Manager__c, buildertek__Date_on_Job__c, buildertek__Date_off_Job__c
		                                                 FROM buildertek__Asset_History__c
		                                                 WHERE buildertek__Asset_Manager__c In :assetHistories.keySet()
		                                                 ORDER by CreatedDate DESC];

		Map<Id, buildertek__Asset_History__c> assetMap = new Map<Id, buildertek__Asset_History__c>();
		for (buildertek__Asset_History__c assets : recordList){
			if (!assetMap.containsKey(assets.buildertek__Asset_Manager__c)){
				assetMap.put(assets.buildertek__Asset_Manager__c, assets);
			}
		}

		if (recordList.size() > 0){
			for (buildertek__Asset_History__c record : assetHistories.values()){
				if (record.buildertek__Asset_Manager__c == assetMap.get(record.buildertek__Asset_Manager__c).buildertek__Asset_Manager__c){
					record.buildertek__Date_on_Job__c = assetMap.get(record.buildertek__Asset_Manager__c).buildertek__Date_off_Job__c;
				}
			}
		}
	}
    public void afterInsert(List<buildertek__Asset_History__c> newAssetHistory, Map<Id, buildertek__Asset_History__c> AssetHistoryMap){
        list<Id> assetManagerId = new list<Id>();
        List<buildertek__Asset_Manager__c> assetManagerList = new List<buildertek__Asset_Manager__c>();
        
        for(buildertek__Asset_History__c assetHistory : newAssetHistory){
            assetManagerId.add(assetHistory.buildertek__Asset_Manager__c);
        }
        if (assetManagerId.size() > 0){
            assetManagerList = [Select Id, Name,buildertek__Current_Project__c,buildertek__Location_on_Jobsite__c
                               FROM buildertek__Asset_Manager__c
                               WHERE Id IN :assetManagerId];
        }
        for (buildertek__Asset_Manager__c assetmanagerRec: assetManagerList){
            for (buildertek__Asset_History__c assethistoryRec : newAssetHistory){
                assetmanagerRec.buildertek__Current_Project__c = assethistoryRec.buildertek__Project__c;
                assetmanagerRec.buildertek__Location_on_Jobsite__c = assethistoryRec.buildertek__Location_on_Jobsite__c;
            }
        }
        update assetManagerList;
    }
}