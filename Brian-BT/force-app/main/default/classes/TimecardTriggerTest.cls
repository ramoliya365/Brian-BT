@isTest
private class TimecardTriggerTest {
    @isTest static void testMethod1() {
        buildertek__Time_Cards__c timecard =new buildertek__Time_Cards__c();
        timecard.buildertek__Start_Time__c = system.now();
        timecard.buildertek__End_Time__c = system.now()+1;
        insert timeCard;
        TimeCardTriggerHandler handler = new TimeCardTriggerHandler(true,1);
    }
    
    @isTest static void testMethod2() {
        buildertek__Time_Cards__c timecard =new buildertek__Time_Cards__c();
        timecard.buildertek__Start_Time__c = system.now();
        //timecard.buildertek__End_Time__c = system.now()+1;
        insert timeCard;
        TimeCardTriggerHandler handler = new TimeCardTriggerHandler(true,1);
    }
}