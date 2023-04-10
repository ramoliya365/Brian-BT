global without sharing class QuoteGroupFromBom {

    public string quoteId;
    public List<buildertek__Quote_Item__c> allQuoteLineList {get;set;}
    public List<BT_Lightning_Utils.dataTableFields> columns {get;set;}
    public quoteLineWrapperClass quoteLineWrapper {get;set;}
    public List<String> groupingList {get;set;}
    public Boolean layer1 {get;set;}
    public Boolean layer2 {get;set;}
    public Boolean layer3 {get;set;}
    public Boolean layer4 {get;set;}
    public Boolean runCls {get;set;}

    public QuoteGroupFromBom() {
        allQuoteLineList = new List<buildertek__Quote_Item__c>();
        columns = new List<BT_Lightning_Utils.dataTableFields>();
        quoteLineWrapper = new quoteLineWrapperClass();
        groupingList = new List<String>();
        layer1 = false;
        layer2 = false;
        layer3 = false;
        layer4 = false;
        runCls = true;
    }

    public void setrelatedToId(string Id){
        this.quoteId = Id;
        if (runCls) {
            runCls = false;
            getQuoteData();
        }
    }
    
    public string getrelatedToId( ){
        return quoteId;
    }

    public void getQuoteData(){
        System.debug('-- getQuoteData --');
        String quoteId = this.quoteId;
        System.debug('quoteId ==> '+quoteId);

        // Grouping field list for set 4 layer grouping on quote lines (Fix Value Used Only For Development)
        groupingList = new List<String>{'buildertek__Grouping__c', 'buildertek__Build_Phase__c', 'buildertek__Location_Detailed_Area__c', 'buildertek__Product_Family__c'};

        // All fields in list that can be available in grouping fields.
        List<String> gorupingFieldList = new List<String>{'id','buildertek__Build_Phase__c', 'buildertek__Build_Reference_1__c','buildertek__Base_Location__c','buildertek__Location_Picklist__c','buildertek__Location_Detailed_Area__c','buildertek__Location_Detail_Reference_1__c','buildertek__BL_SERVICE_CATEGORY__c', 'buildertek__Product_Family__c', 'buildertek__Sub_Group__c', 'buildertek__Grouping__c'};
        String apiString = '';

        // Get field data from buildertek__BT_Related_List_View_Fields field set
        List<BT_Lightning_Utils.dataTableFields> column = BT_Lightning_Utils.getFieldSetForDataTable('buildertek__Quote_Item__c', 'buildertek__BT_Related_List_View_Fields');
        String fieldsType = '[';
        for(BT_Lightning_Utils.dataTableFields dtFields : column){
            if (!gorupingFieldList.contains(dtFields.fieldName)) {
                apiString += dtFields.fieldName + ', ';
            }
            fieldsType += '{"fieldName": "' + dtFields.fieldName + '","fieldType": "' + dtFields.type + '","isEditable":' + dtFields.editable + '},';
        }
        fieldsType = fieldsType.removeEnd(',')+']';

        // SOQL Query for get data from buildertek__Quote_Item__c
        String query = 'SELECT Id, '+apiString+' buildertek__Build_Phase__c, buildertek__Build_Phase__r.Name, buildertek__Build_Reference_1__c, buildertek__Base_Location__c, buildertek__Location_Picklist__c, buildertek__Location_Detailed_Area__c, ';
        query += 'buildertek__Location_Detail_Reference_1__c, buildertek__BL_SERVICE_CATEGORY__c, buildertek__Product_Family__c, buildertek__Sub_Group__c, buildertek__Sub_Group__r.Name, buildertek__Grouping__c, buildertek__Grouping__r.Name ';
        query += 'FROM buildertek__Quote_Item__c WHERE buildertek__Quote__c =\''+quoteId+'\'';
        if (groupingList.size() > 0) {
            query += ' ORDER BY '+groupingList[0];
            layer1 = true;
        }
        if (groupingList.size() > 1) {
            query += ', '+groupingList[1];
            layer2 = true;
        }
        if (groupingList.size() > 2) {
            query += ', '+groupingList[2];
            layer3 = true;
        }
        if (groupingList.size() > 3) {
            query += ', '+groupingList[3];
            layer4 = true;
        }
        query += ' NULLS LAST';
        System.debug('query ==> '+query);

        allQuoteLineList = Database.query(query);
        System.debug('allQuoteLineList ==> '+allQuoteLineList);

        quoteLineWrapper.columns = columns;
        quoteLineWrapper.quoteLineList = allQuoteLineList;

        if (layer1 & allQuoteLineList.size() > 0) {

            List<RecordsDataWrapper> fieldsWrapperList = getQuoteItemData(allQuoteLineList, fieldsType);
            
            quoteLineWrapper.RecordsDataWrapperList = fieldsWrapperList;
            quoteLineWrapper.groupWrapperList = firstLayerGrouping(fieldsWrapperList);
        }

    }

    // Use method for 1st layer grouping
    public List<group1Wrapper> firstLayerGrouping(List<RecordsDataWrapper> quoteLineWrapper){
        System.debug('-- firstLayerGrouping --');
        List<group1Wrapper> group1WrapperList = new List<group1Wrapper>();

        // Total quote line record count
        Integer quoteLineListSize = quoteLineWrapper.size();

        // Check field type of all grouping fields.
        Map<String, Schema.SObjectField> objectMap = Schema.SObjectType.buildertek__Quote_Item__c.fields.getMap();
        Schema.SObjectField field = objectMap.get(groupingList[0]);
        Schema.DisplayType fldType = field.getDescribe().getType();

        String selectedGroupName = '';
        if (String.valueOf(fldType) == 'REFERENCE') {
            if (quoteLineWrapper[0].quoteLine.get(groupingList[0]) != null) {
                selectedGroupName = String.valueOf(quoteLineWrapper[0].quoteLine.getSobject(groupingList[0].removeEnd('c')+'r').get('Name'));
            } else {
                selectedGroupName = 'No Grouping';
            }
        } else {
            selectedGroupName = String.valueOf(quoteLineWrapper[0].quoteLine.get(groupingList[0]));
            if (selectedGroupName == '' || selectedGroupName == null) {
                selectedGroupName = 'No Grouping';
            }
        }

        List<buildertek__Quote_Item__c> newQuoteLineList = new List<buildertek__Quote_Item__c>();
        List<RecordsDataWrapper> newQuoteLineWrapper = new List<RecordsDataWrapper>();

        for (Integer i = 0; i < quoteLineListSize; i++) {
            // Get current grouping name
            String currentGroupName = '';
            if (String.valueOf(fldType) == 'REFERENCE') {
                if (quoteLineWrapper[i].quoteLine.get(groupingList[0]) != null) {
                    currentGroupName = String.valueOf(quoteLineWrapper[i].quoteLine.getSobject(groupingList[0].removeEnd('c')+'r').get('Name'));
                } else {
                    currentGroupName = 'No Grouping';
                }
                currentGroupName = String.valueOf(quoteLineWrapper[i].quoteLine.getSobject(groupingList[0].removeEnd('c')+'r').get('Name'));
            } else {
                currentGroupName = String.valueOf(quoteLineWrapper[i].quoteLine.get(groupingList[0]));
                if (currentGroupName == '' || currentGroupName == null) {
                    currentGroupName = 'No Grouping';
                }
            }

            // create grouping accouring to the currentGroupName value
            if (selectedGroupName == currentGroupName) {

                countTotal();
                
                newQuoteLineList.add(quoteLineWrapper[i].quoteLine);
                newQuoteLineWrapper.add(quoteLineWrapper[i]);
                if (quoteLineListSize == i+1) {
                    group1Wrapper group1Wrap = new group1Wrapper();
                    group1Wrap.index = group1WrapperList.size() +1;
                    group1Wrap.groupName = selectedGroupName;
                    group1Wrap.quoteLineList = newQuoteLineList;
                    group1Wrap.RecordsDataWrapperList = newQuoteLineWrapper;
                    if (layer2) {
                        group1Wrap.groupWrapperList = secordLayerGrouping(newQuoteLineWrapper);
                    }
                    group1WrapperList.add(group1Wrap);
                }
            } else {
                group1Wrapper group1Wrap = new group1Wrapper();
                group1Wrap.index = group1WrapperList.size() +1;
                group1Wrap.groupName = selectedGroupName;
                group1Wrap.quoteLineList = newQuoteLineList;
                group1Wrap.RecordsDataWrapperList = newQuoteLineWrapper;
                if (layer2) {
                    group1Wrap.groupWrapperList = secordLayerGrouping(newQuoteLineWrapper);
                }
                group1WrapperList.add(group1Wrap);

                countTotal();

                newQuoteLineList = new List<buildertek__Quote_Item__c>();
                newQuoteLineWrapper = new List<RecordsDataWrapper>();
                newQuoteLineList.add(quoteLineWrapper[i].quoteLine);
                newQuoteLineWrapper.add(quoteLineWrapper[i]);
                selectedGroupName = currentGroupName;

                if (quoteLineListSize == i+1) {
                    group1Wrapper group1WrapDup = new group1Wrapper();
                    group1WrapDup.index = group1WrapperList.size() +1;
                    group1WrapDup.groupName = selectedGroupName;
                    group1WrapDup.quoteLineList = newQuoteLineList;
                    group1WrapDup.RecordsDataWrapperList = newQuoteLineWrapper;
                    if (layer2) {
                        group1WrapDup.groupWrapperList = secordLayerGrouping(newQuoteLineWrapper);
                    }
                    group1WrapperList.add(group1WrapDup);
                }
            }
        }
        return group1WrapperList;
    }

    // Use method for 2nd layer grouping
    public List<group2Wrapper> secordLayerGrouping(List<RecordsDataWrapper> quoteLineWrapper){
        System.debug('-- secordLayerGrouping --');
        List<group2Wrapper> group2WrapperList = new List<group2Wrapper>();

        Integer quoteLineListSize = quoteLineWrapper.size();

        Map<String, Schema.SObjectField> objectMap = Schema.SObjectType.buildertek__Quote_Item__c.fields.getMap();
        Schema.SObjectField field = objectMap.get(groupingList[1]);
        Schema.DisplayType fldType = field.getDescribe().getType();

        String selectedGroupName = '';
        if (String.valueOf(fldType) == 'REFERENCE') {
            if (quoteLineWrapper[0].quoteLine.get(groupingList[1]) != null) {
                selectedGroupName = String.valueOf(quoteLineWrapper[0].quoteLine.getSobject(groupingList[1].removeEnd('c')+'r').get('Name'));
            } else {
                selectedGroupName = 'No Grouping';
            }
        } else {
            selectedGroupName = String.valueOf(quoteLineWrapper[0].quoteLine.get(groupingList[1]));
            if (selectedGroupName == '' || selectedGroupName == null) {
                selectedGroupName = 'No Grouping';
            }
        }

        List<buildertek__Quote_Item__c> newQuoteLineList = new List<buildertek__Quote_Item__c>();
         List<RecordsDataWrapper> newQuoteLineWrapper = new List<RecordsDataWrapper>();

        for (Integer i = 0; i < quoteLineListSize; i++){
            // Get current grouping name
            String currentGroupName = '';
            if (String.valueOf(fldType) == 'REFERENCE') {
                if (quoteLineWrapper[i].quoteLine.get(groupingList[1]) != null) {
                    currentGroupName = String.valueOf(quoteLineWrapper[i].quoteLine.getSobject(groupingList[1].removeEnd('c')+'r').get('Name'));
                } else {
                    currentGroupName = 'No Grouping';
                }
            } else {
                currentGroupName = String.valueOf(quoteLineWrapper[i].quoteLine.get(groupingList[1]));
                if (currentGroupName == '' || currentGroupName == null) {
                    currentGroupName = 'No Grouping';
                }
            }

            // create grouping accouring to the currentGroupName value
            if (selectedGroupName == currentGroupName) {

                countTotal();

                newQuoteLineList.add(quoteLineWrapper[i].quoteLine);
                newQuoteLineWrapper.add(quoteLineWrapper[i]);
                if (quoteLineListSize == i+1) {
                    group2Wrapper group2Wrap = new group2Wrapper();
                    group2Wrap.index = group2WrapperList.size() +1;
                    group2Wrap.groupName = selectedGroupName;
                    group2Wrap.quoteLineList = newQuoteLineList;
                    group2Wrap.RecordsDataWrapperList = newQuoteLineWrapper;
                    if (layer3) {
                        group2Wrap.groupWrapperList = thirdLayerGrouping(newQuoteLineWrapper);
                    }
                    group2WrapperList.add(group2Wrap);
                }
            } else {
                group2Wrapper group2Wrap = new group2Wrapper();
                group2Wrap.index = group2WrapperList.size() +1;
                group2Wrap.groupName = selectedGroupName;
                group2Wrap.quoteLineList = newQuoteLineList;
                group2Wrap.RecordsDataWrapperList = newQuoteLineWrapper;
                if (layer3) {
                    group2Wrap.groupWrapperList = thirdLayerGrouping(newQuoteLineWrapper);
                }
                group2WrapperList.add(group2Wrap);

                countTotal();

                newQuoteLineList = new List<buildertek__Quote_Item__c>();
                newQuoteLineWrapper = new List<RecordsDataWrapper>();
                newQuoteLineList.add(quoteLineWrapper[i].quoteLine);
                newQuoteLineWrapper.add(quoteLineWrapper[i]);
                selectedGroupName = currentGroupName;

                if (quoteLineListSize == i+1) {
                    group2Wrapper group2WrapDup = new group2Wrapper();
                    group2WrapDup.index = group2WrapperList.size() +1;
                    group2WrapDup.groupName = selectedGroupName;
                    group2WrapDup.quoteLineList = newQuoteLineList;
                    group2WrapDup.RecordsDataWrapperList = newQuoteLineWrapper;
                    if (layer3) {
                        group2WrapDup.groupWrapperList = thirdLayerGrouping(newQuoteLineWrapper);
                    }
                    group2WrapperList.add(group2WrapDup);
                }
            }
        }

        return group2WrapperList;
    }

    // Use method for 3rd layer grouping
    public List<group3Wrapper> thirdLayerGrouping(List<RecordsDataWrapper> quoteLineWrapper){
        System.debug('-- thirdLayerGrouping --');
        List<group3Wrapper> group3WrapperList = new List<group3Wrapper>();

        Integer quoteLineListSize = quoteLineWrapper.size();

        Map<String, Schema.SObjectField> objectMap = Schema.SObjectType.buildertek__Quote_Item__c.fields.getMap();
        Schema.SObjectField field = objectMap.get(groupingList[2]);
        Schema.DisplayType fldType = field.getDescribe().getType();

        String selectedGroupName = '';
        if (String.valueOf(fldType) == 'REFERENCE') {
            if (quoteLineWrapper[0].quoteLine.get(groupingList[2]) != null) {
                selectedGroupName = String.valueOf(quoteLineWrapper[0].quoteLine.getSobject(groupingList[2].removeEnd('c')+'r').get('Name'));
            } else {
                selectedGroupName = 'No Grouping';
            }
        } else {
            selectedGroupName = String.valueOf(quoteLineWrapper[0].quoteLine.get(groupingList[2]));
            if (selectedGroupName == '' || selectedGroupName == null) {
                selectedGroupName = 'No Grouping';
            }
        }

        List<buildertek__Quote_Item__c> newQuoteLineList = new List<buildertek__Quote_Item__c>();
        List<RecordsDataWrapper> newQuoteLineWrapper = new List<RecordsDataWrapper>();

        for (Integer i = 0; i < quoteLineListSize; i++){
            // Get current grouping name
            String currentGroupName = '';
            if (String.valueOf(fldType) == 'REFERENCE') {
                if (quoteLineWrapper[i].quoteLine.get(groupingList[2]) != null) {
                    currentGroupName = String.valueOf(quoteLineWrapper[i].quoteLine.getSobject(groupingList[2].removeEnd('c')+'r').get('Name'));
                } else {
                    currentGroupName = 'No Grouping';
                }
            } else {
                currentGroupName = String.valueOf(quoteLineWrapper[i].quoteLine.get(groupingList[2]));
                if (currentGroupName == '' || currentGroupName == null) {
                    currentGroupName = 'No Grouping';
                }
            }

            // create grouping accouring to the currentGroupName value
            if (selectedGroupName == currentGroupName) {

                countTotal();

                newQuoteLineList.add(quoteLineWrapper[i].quoteLine);
                newQuoteLineWrapper.add(quoteLineWrapper[i]);
                if (quoteLineListSize == i+1) {
                    group3Wrapper group3Wrap = new group3Wrapper();
                    group3Wrap.index = group3WrapperList.size() +1;
                    group3Wrap.groupName = selectedGroupName;
                    group3Wrap.quoteLineList = newQuoteLineList;
                    group3Wrap.RecordsDataWrapperList = newQuoteLineWrapper;
                    if (layer4) {
                        group3Wrap.groupWrapperList = forthLayerGrouping(newQuoteLineWrapper);
                    }
                    group3WrapperList.add(group3Wrap);
                }
            } else {
                group3Wrapper group3Wrap = new group3Wrapper();
                group3Wrap.index = group3WrapperList.size() +1;
                group3Wrap.groupName = selectedGroupName;
                group3Wrap.quoteLineList = newQuoteLineList;
                group3Wrap.RecordsDataWrapperList = newQuoteLineWrapper;
                if (layer4) {
                    group3Wrap.groupWrapperList = forthLayerGrouping(newQuoteLineWrapper);
                }
                group3WrapperList.add(group3Wrap);

                countTotal();

                newQuoteLineList = new List<buildertek__Quote_Item__c>();
                newQuoteLineWrapper = new List<RecordsDataWrapper>();
                newQuoteLineList.add(quoteLineWrapper[i].quoteLine);
                newQuoteLineWrapper.add(quoteLineWrapper[i]);
                selectedGroupName = currentGroupName;

                if (quoteLineListSize == i+1) {
                    group3Wrapper group3WrapDup = new group3Wrapper();
                    group3WrapDup.index = group3WrapperList.size() +1;
                    group3WrapDup.groupName = selectedGroupName;
                    group3WrapDup.quoteLineList = newQuoteLineList;
                    group3WrapDup.RecordsDataWrapperList = newQuoteLineWrapper;
                    if (layer4) {
                        group3WrapDup.groupWrapperList = forthLayerGrouping(newQuoteLineWrapper);
                    }
                    group3WrapperList.add(group3WrapDup);
                }
            }
        }

        return group3WrapperList;
    }

    // Use method for 4th layer grouping
    public List<group4Wrapper> forthLayerGrouping(List<RecordsDataWrapper> quoteLineWrapper){
        System.debug('-- forthLayerGrouping --');
        List<group4Wrapper> group4WrapperList = new List<group4Wrapper>();

        Integer quoteLineListSize = quoteLineWrapper.size();

        Map<String, Schema.SObjectField> objectMap = Schema.SObjectType.buildertek__Quote_Item__c.fields.getMap();
        Schema.SObjectField field = objectMap.get(groupingList[3]);
        Schema.DisplayType fldType = field.getDescribe().getType();

        String selectedGroupName = '';
        if (String.valueOf(fldType) == 'REFERENCE') {
            if (quoteLineWrapper[0].quoteLine.get(groupingList[3]) != null) {
                selectedGroupName = String.valueOf(quoteLineWrapper[0].quoteLine.getSobject(groupingList[3].removeEnd('c')+'r').get('Name'));
            } else {
                selectedGroupName = 'No Grouping';
            }
        } else {
            selectedGroupName = String.valueOf(quoteLineWrapper[0].quoteLine.get(groupingList[3]));
            if (selectedGroupName == '' || selectedGroupName == null) {
                selectedGroupName = 'No Grouping';
            }
        }

        List<buildertek__Quote_Item__c> newQuoteLineList = new List<buildertek__Quote_Item__c>();
        List<RecordsDataWrapper> newQuoteLineWrapper = new List<RecordsDataWrapper>();

        for (Integer i = 0; i < quoteLineListSize; i++){
            // Get current grouping name
            String currentGroupName = '';
            if (String.valueOf(fldType) == 'REFERENCE') {
                if (quoteLineWrapper[i].quoteLine.get(groupingList[3]) != null) {
                    currentGroupName = String.valueOf(quoteLineWrapper[i].quoteLine.getSobject(groupingList[3].removeEnd('c')+'r').get('Name'));
                } else {
                    currentGroupName = 'No Grouping';
                }
            } else {
                currentGroupName = String.valueOf(quoteLineWrapper[i].quoteLine.get(groupingList[3]));
                if (currentGroupName == '' || currentGroupName == null) {
                    currentGroupName = 'No Grouping';
                }
            }

            // create grouping accouring to the currentGroupName value
            if (selectedGroupName == currentGroupName) {

                countTotal();

                newQuoteLineList.add(quoteLineWrapper[i].quoteLine);
                newQuoteLineWrapper.add(quoteLineWrapper[i]);
                if (quoteLineListSize == i+1) {
                    group4Wrapper group4Wrap = new group4Wrapper();
                    group4Wrap.index = group4WrapperList.size() +1;
                    group4Wrap.groupName = selectedGroupName;
                    group4Wrap.quoteLineList = newQuoteLineList;
                    group4Wrap.RecordsDataWrapperList = newQuoteLineWrapper;
                    group4WrapperList.add(group4Wrap);
                }
            } else {
                group4Wrapper group4Wrap = new group4Wrapper();
                group4Wrap.index = group4WrapperList.size() +1;
                group4Wrap.groupName = selectedGroupName;
                group4Wrap.quoteLineList = newQuoteLineList;
                group4Wrap.RecordsDataWrapperList = newQuoteLineWrapper;
                group4WrapperList.add(group4Wrap);

                countTotal();

                newQuoteLineList = new List<buildertek__Quote_Item__c>();
                newQuoteLineWrapper = new List<RecordsDataWrapper>();
                newQuoteLineList.add(quoteLineWrapper[i].quoteLine);
                newQuoteLineWrapper.add(quoteLineWrapper[i]);
                selectedGroupName = currentGroupName;

                if (quoteLineListSize == i+1) {
                    group4Wrapper group4WrapDup = new group4Wrapper();
                    group4WrapDup.index = group4WrapperList.size() +1;
                    group4WrapDup.groupName = selectedGroupName;
                    group4WrapDup.quoteLineList = newQuoteLineList;
                    group4WrapDup.RecordsDataWrapperList = newQuoteLineWrapper;
                    group4WrapperList.add(group4WrapDup);
                }
            }
        }

        return group4WrapperList;
    }

    public List<RecordsDataWrapper> getQuoteItemData(List<buildertek__Quote_Item__c> ListOfRecords, String fieldString){
        System.debug('-- getQuoteItemData --');
        List<RecordsDataWrapper> RecordsDataWrapperList = new List<RecordsDataWrapper>();
        List<RecordsData> RecordsDataList = (List<RecordsData>)System.JSON.deserialize(fieldString, List<RecordsData>.class);

        for (Integer i = 0; i < ListOfRecords.size(); i++){
            RecordsDataWrapper RecordDataWrapper = new RecordsDataWrapper();

            List<RecordsData> recDataList = new List<RecordsData>();
            for (RecordsData field : RecordsDataList){
                RecordsData recData = new RecordsData();
                recData.isEditable = field.isEditable;
                recData.fieldName = field.fieldName;
                recData.fieldType = field.fieldType;
                recData.fieldValue = (ListOfRecords[i].get(field.fieldName) == null) ? '' : ListOfRecords[i].get(field.fieldName);
                recDataList.add(recData);
            }
           
            RecordDataWrapper.quoteLine = ListOfRecords[i];
            RecordDataWrapper.RecordDataList = recDataList;
            RecordsDataWrapperList.add(RecordDataWrapper);
        }

        return RecordsDataWrapperList;
    }

    public void countTotal(){
        System.debug('-- countTotal --');

    }

    public class quoteLineWrapperClass{
        public List<BT_Lightning_Utils.dataTableFields> columns {get; set;}
        public List<buildertek__Quote_Item__c> quoteLineList {get; set;}
        public List<RecordsDataWrapper> RecordsDataWrapperList {get; set;}
        public List<group1Wrapper> groupWrapperList {get; set;}
    }

    public class group1Wrapper{
        public Integer index {get; set;}
        public String groupName {get; set;}
        public List<buildertek__Quote_Item__c> quoteLineList {get; set;}
        public List<RecordsDataWrapper> RecordsDataWrapperList {get; set;}
        public totalFieldClass totalField {get; set;}
        public List<group2Wrapper> groupWrapperList {get; set;}
    }

    public class group2Wrapper{
        public Integer index {get; set;}
        public String groupName {get; set;}
        public List<buildertek__Quote_Item__c> quoteLineList {get; set;}
        public List<RecordsDataWrapper> RecordsDataWrapperList {get; set;}
        public totalFieldClass totalField {get; set;}
        public List<group3Wrapper> groupWrapperList {get; set;}
    }
    
    public class group3Wrapper{
        public Integer index {get; set;}
        public String groupName {get; set;}
        public List<buildertek__Quote_Item__c> quoteLineList {get; set;}
        public List<RecordsDataWrapper> RecordsDataWrapperList {get; set;}
        public totalFieldClass totalField {get; set;}
        public List<group4Wrapper> groupWrapperList {get; set;}
    }

    public class group4Wrapper{
        public Integer index {get; set;}
        public String groupName {get; set;}
        public List<buildertek__Quote_Item__c> quoteLineList {get; set;}
        public List<RecordsDataWrapper> RecordsDataWrapperList {get; set;}
        public totalFieldClass totalField {get; set;}
    }

    public class RecordsDataWrapper{
        public buildertek__Quote_Item__c quoteLine {get; set;}
        public List<RecordsData> RecordDataList {get; set;}
    }

    public class RecordsData{
        public Boolean isEditable {get; set;}
        public String fieldName {get; set;}
        public String fieldType {get; set;}
        public Object fieldValue {get; set;}
    }

    public class totalFieldClass{

    }

}