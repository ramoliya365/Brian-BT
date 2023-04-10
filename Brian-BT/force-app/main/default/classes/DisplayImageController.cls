public with sharing class DisplayImageController{
    public String baseURL{ get; set; }
    
    public string documentId{ get; set; }
    
    public string orgId{ get; set; }
    
    public decimal height{ get; set; }
    
    public decimal width{ get; set; }
    
    public string customLabelValue{ get; set; }
    
    public List<Document> lstDocument{ get; set; }
    
    public List<buildertek__ConfirmationPageSiteURL__c> confirmationURL{ get; set; }
    
    public String siteUrl{ get; set; }
    
    public DisplayImageController(){
        baseURL = URL.getSalesforceBaseUrl().toExternalForm();
        orgId = UserInfo.getOrganizationId();
        customLabelValue = System.Label.Company_Logo;
        confirmationURL = buildertek__ConfirmationPageSiteURL__c.getAll().values();
        
        if (confirmationURL.size() > 0){
            siteUrl = confirmationURL[0].buildertek__SiteURL__c;
        }
        /*if(Schema.sObjectType.Document.fields.Id.isAccessible()&&
		Schema.sObjectType.Document.fields.Name.isAccessible() ){*/
        lstDocument = [Select Id, Name
                       from Document
                       where Name = :customLabelValue
                       limit 1];
        /*}*/
        list<buildertek__Display_Images_Setting__mdt> displayimagemetadatelist= [select Id,DeveloperName,buildertek__Height__c,buildertek__Width__c from buildertek__Display_Images_Setting__mdt  Where DeveloperName='Logo_Settings' limit 1];
        if(displayimagemetadatelist.size() >0){
            height  = displayimagemetadatelist[0].buildertek__Height__c;
            width = displayimagemetadatelist[0].buildertek__Width__c;
        }
        if (lstDocument.size() > 0){
            documentId = lstDocument[0].Id;
        }
        system.debug('documentId-----' + documentId);
    }
}