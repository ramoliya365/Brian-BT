public class ExpenseToBudgetItemTriggerHandler {
    
    //Boolean variable to allow skipping execution of trigger in certain scenarios
    public static Boolean blnSkipExpenseUpdateTrigger = false;
     
    private boolean m_isExecuting = false;
    private integer BatchSize = 0;
    
    public ExpenseToBudgetItemTriggerHandler (boolean isExecuting, integer size){
        m_isExecuting = isExecuting;
        BatchSize = size;
    }
    
    public void OnAfterInsert(buildertek__Expense__c[] newExpense, Map<ID, buildertek__Expense__c> newExpenseMap){ 
        list<Id> expenseids = new list<Id>();
        list<Id> expenseprojectids = new list<Id>();
        list<Id> projectids = new list<Id>();
        list<Id> expids = new list<Id>();
        // Create Expense to Budget Item link
       CreateBudgetLineItemForExpenseAC.createExpenseToBudgetItemLink(newExpense);
       CreateBudgetLineItemForExpenseAC.RollUpExpenseAmount(newExpenseMap.KeySet());
    }
    public void AfterInsert(buildertek__Expense__c[] newExpense, Map<ID, buildertek__Expense__c> newExpenseMap){ 
        list<Id> expenseids = new list<Id>();
        list<Id> expenseprojectids = new list<Id>();
        list<Id> projectids = new list<Id>();
        list<Id> expids = new list<Id>();
        // Create Expense to Budget Item link
        string BudgetId = '';
       list<buildertek__Admin_Interface_Node_Configuration__c> adminInterfaceNodeConfigurations = [Select Id,
                                                                                                  buildertek__Automatically_add_Expense_to_Budget__c 
                                                                                                  from buildertek__Admin_Interface_Node_Configuration__c
                                                                                                  WHERE Name=:'Budget Configuration' and buildertek__Automatically_add_Expense_to_Budget__c !=false limit 1];
        if(adminInterfaceNodeConfigurations.size()>0 ){
            if(adminInterfaceNodeConfigurations[0].buildertek__Automatically_add_Expense_to_Budget__c == true){
                for(buildertek__Expense__c exprec : newExpense){
                    if(exprec.buildertek__Budget__c != null){
                          BudgetId  = exprec.buildertek__Budget__c;
                        CreateBudgetLineItemForExpenseAC.createBudgetLineFromExpense(exprec.id,BudgetId);
                    }else if(exprec.buildertek__Budget__c == null && exprec.buildertek__Project__c != null){
                        expenseprojectids.add(exprec.buildertek__Project__c);
                        expenseids.add(exprec.id);
                    }else if(exprec.buildertek__Budget__c == null && exprec.buildertek__Project__c == null){
                        expids.add(exprec.id); 
                    }
                } 
                if(expenseprojectids.size()>0){
                  /*  list<buildertek__Project__c> projlist = [select id,Name from buildertek__Project__c where id IN:expenseprojectids];
                    for(buildertek__Project__c projRec : projlist){
                        projectids.add(projRec.id);
                    }
                    system.debug('projectids'+projectids); */
                    list<buildertek__Budget__c> budgetist = [select id,Name from buildertek__Budget__c where buildertek__Project__c =: expenseprojectids ORDER BY CreatedDate ASC limit 1];
                   // system.debug('budgetlist'+budgetist);
                    list<buildertek__Expense__c> expList = [select id,Name from buildertek__Expense__c Where ID IN: expenseids];
                    for(buildertek__Budget__c budgetRec : budgetist){
                        for(buildertek__Expense__c exp : expList){
                            BudgetId  = budgetRec.id;
                            CreateBudgetLineItemForExpenseAC.createBudgetLineFromExpense(exp.id,BudgetId);                  
                        }
                    }
                }
                if(expids.size()>0){
                    list<buildertek__Budget__c> budgetist = [select id,Name from buildertek__Budget__c ORDER BY CreatedDate ASC limit 1];
                    list<buildertek__Expense__c> expList = [select id,Name from buildertek__Expense__c Where Id IN: expids];
                    for(buildertek__Expense__c exp : expList){
                        for(buildertek__Budget__c budgetRec : budgetist){
                            BudgetId  = budgetRec.id;
                            CreateBudgetLineItemForExpenseAC.createBudgetLineFromExpense(exp.id,BudgetId);                  
                        }
                    }
                }
            }
        }
    }
     
    public void OnAfterUpdate(buildertek__Expense__c[] oldExpense, buildertek__Expense__c[] updatedExpense, Map<ID, buildertek__Expense__c> ExpenserecMap, Map<Id, buildertek__Expense__c> oldExpenseMap){
       // if(!CreateBudgetLineItemForExpenseAC.isUpdateExpense){
            CreateBudgetLineItemForExpenseAC.createExpenseToBudgetItemLink(updatedExpense);  
      //  }
      CreateBudgetLineItemForExpenseAC.RollUpExpenseAmount(ExpenserecMap.KeySet());
       list<Id> budgetitemIds = new list<Id>();
       List<buildertek__Expense__c> expenseList = new List<buildertek__Expense__c>();
       List<buildertek__Expense__c> expenseWObudget = new List<buildertek__Expense__c>();
       List<buildertek__Expense__c> expenseWOBL = new List<buildertek__Expense__c>();
        for(buildertek__Expense__c exp : updatedExpense){
            if(oldExpenseMap.get(exp.Id).buildertek__Budget_Line__c != exp.buildertek__Budget_Line__c){
                expenseList.add(oldExpenseMap.get(exp.Id));
                budgetitemIds.add(oldExpenseMap.get(exp.Id).buildertek__Budget_Line__c);
            }
            // if(oldExpenseMap.get(exp.Id).buildertek__Budget__c == null && exp.buildertek__Budget__c != null){
            //     expenseWObudget.add(exp);
            // }
            if(oldExpenseMap.get(exp.Id).buildertek__Budget__c != exp.buildertek__Budget__c){
                expenseWObudget.add(exp);
            }

            if(oldExpenseMap.get(exp.Id).buildertek__Budget_Line__c != null && exp.buildertek__Budget_Line__c == null){
                expenseWOBL.add(exp);
            }
        }

        if(budgetitemIds.size() > 0){
            
           //CreateBudgetLineItemForExpenseAC.deletemethod(budgetitemIds); 
           CreateBudgetLineItemForExpenseAC.deletemethodJunction(expenseList,budgetitemIds); 
        }

        if(expenseWObudget.size() > 0){
            for(buildertek__Expense__c exp : expenseWObudget){
                CreateBudgetLineItemForExpenseAC.updateBudgetItem(exp.Id); 
            }
        }

        if(expenseWOBL.size() > 0){
            for(buildertek__Expense__c exp : expenseWOBL){
                CreateBudgetLineItemForExpenseAC.deleteBudgetItem(exp.Id, oldExpenseMap.get(exp.Id).buildertek__Budget_Line__c);
            }
        }
    }

    public void OnBeforeDelete(buildertek__Expense__c[] oldExpense, Map<Id, buildertek__Expense__c> oldExpenseMap){
        System.debug('oldExpense-->>'+oldExpense);
        for(buildertek__Expense__c exp:oldExpense){
            System.debug('In For Loop');
            if(exp.buildertek__Finance_Transaction__c != null){
                exp.addError('You cannot delete this Expense because it is related to a Finance Transaction record. Please delete the Finance Transaction record first, then try again.');
            }
        }
    }
}