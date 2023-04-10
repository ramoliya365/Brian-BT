({
    
    doInit : function(component, event, helper) {
        // helper.tabName(component);
        // helper.getProjects(component);
        component.set("v.transactionTypeOptions", [
            {label: '--None--', value: ''},
            {label: 'Expense', value: 'Expense'},
            {label: 'Invoice(AP)', value: 'Invoice(AP)'},
            // {label: 'Purchase Order', value: 'Purchase Order'},
            {label: 'Time Card', value: 'Time Card'}
        ]);   
        component.set("v.selectedTransactionType", '');  
    },

    changeTransactionType : function(component, event, helper) {
        // component.set("v.selectedProjectId", '');
        component.set("v.tableDataList", []);
        var selectedTransactionType = component.find("selectedTransactionType").get("v.value");
        component.set("v.selectedTransactionType", selectedTransactionType);
        console.log('selectedTransactionType => '+selectedTransactionType);
        component.set("v.SelectExp", false);
        component.set("v.SelectTC", false);
        component.set("v.SelectPO", false);
        component.set("v.SelectInv", false);
        component.set("v.SelectNone", false);

        if(selectedTransactionType == 'Expense'){
            component.set("v.SelectExp", true);
        }else if(selectedTransactionType == 'Time Card'){
            component.set("v.SelectTC", true);
        }else if(selectedTransactionType == 'Purchase Order'){
            component.set("v.SelectPO", true);
        }else if(selectedTransactionType == 'Invoice(AP)'){
            component.set("v.SelectInv", true);
        }else if(selectedTransactionType == 'None'){
            component.set("v.SelectNone", true);
        }
        component.set("v.checkedAll", false);

        helper.getProjectData(component, event, helper);
    },

    // changeProject : function(component, event, helper) {
    //     // var selectedProject = component.find("selectedProject").get("v.value");
    //     // component.set("v.selectedProjectId", selectedProject);
    //     // console.log('selectedProject => '+selectedProject);
    //     var selectedTransactionType = component.get("v.selectedTransactionType");
    //     if(selectedProject != null && selectedProject != ''){
    //         component.set("v.Spinner", true);
    //         if(selectedTransactionType == 'Expense'){
    //             helper.getExpenses(component);
    //         }else if(selectedTransactionType == 'Time Card'){
    //             helper.getTimeCards(component);
    //         }else if(selectedTransactionType == 'Purchase Order'){
    //             helper.getPurchaseOrders(component);
    //         }else if(selectedTransactionType == 'Invoice(AP)'){
    //             helper.getInvoices(component);
    //         }else{
    //             component.set("v.Spinner", false);
    //             var toastEvent = $A.get("e.force:showToast");
    //             toastEvent.setParams({
    //                 title: 'Error',
    //                 message: 'Please select Transaction Type.',
    //                 duration: ' 2000',
    //                 key: 'info_alt',
    //                 type: 'error',
    //                 mode: 'pester'
    //             });
    //             toastEvent.fire();
    //         }
    //     }else{
    //         component.set("v.tableDataList", []);
    //     }
    //     component.set("v.checkedAll", false);
    // },

    page2 : function(component, event, helper) {
        var selectedTransactionType = component.get("v.selectedTransactionType");
        if(selectedTransactionType == 'Expense'){
            helper.ExpensesPage2(component, event, helper);
        }else if(selectedTransactionType == 'Time Card'){
            helper.TimeCardsPage2(component, event, helper);
        }else if(selectedTransactionType == 'Purchase Order'){
            helper.PurchaseOrdersPage2(component, event, helper);
        }else if(selectedTransactionType == 'Invoice(AP)'){
            helper.InvoicesPage2(component, event, helper);
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please select valid Transaction Type.',
                duration: ' 2000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }    
    },

    checkAll : function(component, event, helper) {
        var value = event.getSource().get("v.checked");
        var tableDataList = component.get("v.tableDataList");
        tableDataList.forEach(element => {
            element.selected = value;
        }
        );
        component.set("v.tableDataList", tableDataList);
        console.log('tableDataList => '+JSON.stringify(tableDataList));
    },

    checkboxChange : function(component, event, helper) {
        var tableDataList = component.get("v.tableDataList");
        var checkAll = true;
        tableDataList.forEach(element => {
            if (!element.selected) {
                checkAll = false;
            }
        });
        component.set("v.checkedAll", checkAll);
        // component.find("selectAll").set("v.checked", checkAll);
    },

    changeBudget : function(component, event, helper) {
        var selectedTransactionType = component.get("v.selectedTransactionType");
        if(selectedTransactionType == 'Expense'){
            helper.changeBudgetExpenses(component);
        }else if(selectedTransactionType == 'Time Card'){
            helper.changeBudgetTimeCards(component);
        }else if(selectedTransactionType == 'Purchase Order'){
            helper.changeBudgetPurchaseOrders(component);
        }else if(selectedTransactionType == 'Invoice(AP)'){
            helper.changeBudgetInvoices(component);
        }
    },

    save : function(component, event, helper) {
        var selectedTransactionType = component.get("v.selectedTransactionType");
        if(selectedTransactionType == 'Expense'){
            helper.saveExpenses(component);
        }else if(selectedTransactionType == 'Time Card'){
            helper.saveTimeCards(component);
        }else if(selectedTransactionType == 'Purchase Order'){
            helper.savePurchaseOrders(component);
        }else if(selectedTransactionType == 'Invoice(AP)'){
            helper.saveInvoices(component);
        }
    },

    backtoPage1 : function(component, event, helper) {
        component.set("v.selectedBudgetId", '');
        component.set("v.budgetLinesOptions", []);
        var selectedTransactionType = component.get("v.selectedTransactionType");
        if(selectedTransactionType == 'Expense'){
            helper.ExpensesPage1(component, event, helper);
        }else if(selectedTransactionType == 'Time Card'){
            helper.TimeCardsPage1(component, event, helper);
        }else if(selectedTransactionType == 'Purchase Order'){
            helper.PurchaseOrdersPage1(component, event, helper);
        }else if(selectedTransactionType == 'Invoice(AP)'){
            helper.InvoicesPage1(component, event, helper);
        }
    },

    changeBudgetLine : function(component, event, helper) {
        console.log('changeBudgetLine');
    },

    closeModel: function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },



})