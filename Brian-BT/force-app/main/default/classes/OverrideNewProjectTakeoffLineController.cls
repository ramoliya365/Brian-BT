public class OverrideNewProjectTakeoffLineController {
  
   

    @AuraEnabled
    public static list<PricebookEntry> getProductPrice(string productId){
        System.debug('########pricebook'+productId);
        list<PricebookEntry> pList;
        if(Schema.sObjectType.pricebookEntry.fields.Id.isAccessible()&&
             Schema.sObjectType.PricebookEntry.fields.UnitPrice.isAccessible() &&
             Schema.sObjectType.PricebookEntry.fields.product2Id.isAccessible() &&
             Schema.sObjectType.Pricebook2.fields.Id.isAccessible() &&
             Schema.sObjectType.Pricebook2.fields.isActive.isAccessible()){
            pList = [select id,UnitPrice from PricebookEntry where 
            product2Id =: productId and
            isActive = true and 
            pricebook2Id IN (select id from Pricebook2 Where isActive =true)];
            }
        system.debug('====pList'+pList);
        return pList;
    }    
        @AuraEnabled 
    public static string getpricebook(string PtoffId){
        list<buildertek__Project_Takeoff__c> projecttakeoffrec = [select id,Name,
                                        buildertek__Project__r.buildertek__Price_Book__c 
                                        from buildertek__Project_Takeoff__c 
                                        where id =: PtoffId ];
            
        if(projecttakeoffrec.size() > 0){ 
            return projecttakeoffrec[0].buildertek__Project__r.buildertek__Price_Book__c ;
        }
        return null;
    }
 @AuraEnabled //get Pricebook Values
    public static Map<String, String> getpricebooks(){
        Map<String, String> options = new Map<String, String>();
        
        list<pricebook2> PriceList;
        
            PriceList = [select Id,Name from pricebook2 WHERE Name!=null];
        
        for (pricebook2 p: PriceList) {
            //Put Picklist Value & Label in Map
            options.put(p.name, p.Id); 
        }
        return options;
    } 
    
     @AuraEnabled public list<productfamilyClass> pfwrapperlst {get;set;}
     //get product family Values
    @AuraEnabled 
    public static list<productfamilyClass> getProductfamilyRecords(String ObjectName,string parentId) {
        system.debug('ObjectName-->' + ObjectName);
        Map<String, String> options = new Map<String, String>();
        List < sObject > returnList = new List < sObject > ();
       
        list<string> ProdIds = new list<string>();
        if(ObjectName == 'Product2' && parentId != null){
            
             list<pricebookEntry> PElist;
             
             PElist = [select id,Product2Id from pricebookEntry where pricebook2Id =: parentId];
           
            for(pricebookEntry PE : PElist){
                ProdIds.add(PE.Product2Id);
            }
         }
        //list<Product2> productfamlylst = [select id, Name,family from Product2 where Id IN :ProdIds AND family != null order by family];
         List<AggregateResult> productfamlylst =[SELECT family FROM Product2  where (Id IN :ProdIds AND family != null) group by family];
        list<productfamilyClass> pfwrapperlst = new list<productfamilyClass>();
        if(productfamlylst.size() > 0 ){
            for(AggregateResult agg : productfamlylst){
                 productfamilyClass pf = new productfamilyClass();
                pf.productfamilyvalues = string.valueof(agg.get('family'));
                pfwrapperlst.add(pf);
                }
            system.debug('pfwrapperlst---->'+pfwrapperlst);
        }
         return pfwrapperlst;
    }
 public class productfamilyClass{
         @AuraEnabled public string productfamilyvalues {get;set;}
     }    
    
    @AuraEnabled
    public static buildertek__Project_Takeoff_Lines__c savePToffline(String takeoffLines, String PtoffId){
        buildertek__Project_Takeoff_Lines__c TakeofflineToInsert = (buildertek__Project_Takeoff_Lines__c)JSON.deserialize(takeoffLines, buildertek__Project_Takeoff_Lines__c.class);
        system.debug('PtoffId---->'+PtoffId);
       // system.debug('checknamelength----'+TakeofflineToInsert.buildertek__Item_Name__c.length());
       
           // TakeofflineToInsert.buildertek__Description__c = TakeofflineToInsert.buildertek__Product__r.name;
           // TakeofflineToInsert.buildertek__Item_Name__c = TakeofflineToInsert.buildertek__Item_Name__c.left(250);
           // TakeofflineToInsert.Name = TakeofflineToInsert.buildertek__Item_Name__c.left(79);
             
         
         TakeofflineToInsert.buildertek__Project_Takeoff__c = PtoffId;
     
        insert TakeofflineToInsert;    
        
        return TakeofflineToInsert;     
    }
    
    }