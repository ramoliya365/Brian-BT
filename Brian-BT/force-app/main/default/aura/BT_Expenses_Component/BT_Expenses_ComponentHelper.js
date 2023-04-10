({

    // getProjects : function(component) {
    //     var action = component.get("c.getProjects");
    //     action.setCallback(this, function(response){
    //         var state = response.getState();
    //         if(state === "SUCCESS"){
    //             console.log(response.getReturnValue());
    //             //add none option
    //             var noneOption = {
    //                 Name: "--None--",
    //                 Id: ""
    //             };
    //             // component.set("v.selectedProjectId", '');
    //             var projects = response.getReturnValue();
    //             projects.unshift(noneOption);
    //             component.set("v.projectsOptions", projects);
    //         }
    //     });
    //     $A.enqueueAction(action);
    // },

    tabName : function(component) {
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.setTabLabel({
                tabId: focusedTabId,
                label: "BT Expense Component"
            });
            workspaceAPI.setTabIcon({
                tabId: focusedTabId,
                icon: "standard:link",
                iconAlt: "BT Expense Component"
            });
        }
        ).catch(function(error) {
            console.log(error);
        }); 

    },

    getExpenses : function(component) {
        var action = component.get("c.getExpenses");
        action.setParams({
            "projectId": component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                console.log(response.getReturnValue());
                var expenses = response.getReturnValue();
                expenses.forEach(function(expense){
                    expense.selected = false;
                    expense.buildertek__Budget_Line__c = "";
                    expense.buildertek__Budget__c = "";
                });
                component.set("v.expenses", expenses);
                component.set("v.tableDataList", expenses);
                component.set("v.Spinner", false);
            }
        });
        $A.enqueueAction(action);
    },

    handleSelectedExpenses : function(component) {
        var expenses = component.get("v.expenses");
        console.log('expenses => ',expenses);
        var selectedExpenses = [];
        expenses.forEach(function(expense){
            if(expense.selected){
                selectedExpenses.push(expense);
            }
        }
        );
        component.set("v.selectedExpenses", selectedExpenses);
        console.log('selectedExpenses => ',selectedExpenses);
    },

    getBudegts : function(component) {
        var action = component.get("c.getBudgets");
        action.setParams({
            "projectId": component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var budgets = response.getReturnValue();
                console.log('budgetsOptions => ',budgets);
                if(budgets.length > 1){
                    component.set("v.budgetsOptions", budgets);
                }
                if(budgets.length == 1){
                    component.set("v.selectedBudgetId", budgets[0].Id);
                    component.set("v.budgetsOptions", budgets);
                    this.getBudgetLines(component);
                }
            }
        });
        $A.enqueueAction(action);
    },

    getBudgetLines : function(component) {
        var action = component.get("c.getBudgetLines");
        action.setParams({
            "budgetId": component.get("v.selectedBudgetId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var budgetLines = response.getReturnValue();
                console.log('budgetLinesOptions => ',budgetLines);
                component.set("v.budgetLinesOptions", budgetLines);
                component.set("v.Spinner", false);
            }
        });
        $A.enqueueAction(action);
    },

    saveExpenses : function(component) {
        component.set("v.selectedExpenses", component.get("v.selectedExpenses").map(function(expense){
            if(!expense.buildertek__Budget_Line_Item__c){
                expense.buildertek__Budget_Line_Item__c = null;
            }
            return expense;
        }));
        if(component.get("v.selectedBudgetId")){
            component.set("v.Spinner", true);
            var expenses = component.get("v.selectedExpenses");
            var saveExp = component.get("c.saveExp");
            saveExp.setParams({
                "expenses": expenses
            });
            saveExp.setCallback(this, function(response){
                var state = response.getState();
                if(state === "SUCCESS"){
                    console.log('response => ',response.getReturnValue());
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'Success',
                        message: 'Expenses are updated successfully',
                        duration: ' 5000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                }
                component.set("v.Spinner", false);
                $A.get("e.force:closeQuickAction").fire();
            }
            );
            $A.enqueueAction(saveExp);
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please select a Budget.',
                duration: ' 2000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }

    },

    getTimeCards : function(component) {
        var action = component.get("c.getTimeCards");
        action.setParams({
            "projectId": component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var timeCards = response.getReturnValue();
                timeCards.forEach(function(timeCard){
                    timeCard.selected = false;
                    timeCard.buildertek__Budget_Line__c = "";
                    timeCard.buildertek__Budget__c = "";
                });
                console.log('timeCards => ',timeCards);
                component.set("v.timeCards", timeCards);
                component.set("v.tableDataList", timeCards);
                component.set("v.Spinner", false);
            }
        });
        $A.enqueueAction(action);
    },

    ExpensesPage2 : function(component, event, helper) {
        helper.handleSelectedExpenses(component);
        if(component.get("v.selectedExpenses").length > 0){    
            component.set("v.Page1", false);
            component.set("v.SelectExp", false);
            component.set("v.SelectBLines", true);
            component.set("v.Page2", true);
            helper.getBudegts(component);
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please select at least one Expense.',
                duration: ' 2000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
    },

    handleSelectedTimeCards : function(component) {
        var timeCards = component.get("v.timeCards");
        console.log('timeCards => ',timeCards);
        var selectedTimeCards = [];
        timeCards.forEach(function(timeCard){
            if(timeCard.selected){
                selectedTimeCards.push(timeCard);
            }
        }
        );
        component.set("v.selectedTimeCards", selectedTimeCards);
        console.log('selectedTimeCards => ',selectedTimeCards);
    },

    TimeCardsPage2 : function(component, event, helper) {
        helper.handleSelectedTimeCards(component);
        if(component.get("v.selectedTimeCards").length > 0){    
            component.set("v.Page1", false);
            component.set("v.SelectTC", false);
            component.set("v.Page2", true);
            component.set("v.TimeCardP2", true);
            helper.getBudegts(component);
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please select at least one Time Card.',
                duration: ' 2000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
    },

    ExpensesPage1 : function(component, event, helper) {
        component.set("v.Page1", true);
        component.set("v.SelectExp", true);
        component.set("v.SelectBLines", false);
        component.set("v.Page2", false);
    },

    changeBudgetExpenses : function(component, event, helper) {
        component.set("v.Spinner", true);
        var selectedBudget = component.find("selectedBudget").get("v.value");
        component.set("v.selectedBudgetId", selectedBudget);
        console.log('selectedBudget => '+selectedBudget);
        if(selectedBudget){    
            component.set("v.selectedExpenses", component.get("v.selectedExpenses").map(function(expense){
                expense.buildertek__Budget__c = selectedBudget;
                return expense;
            }));
            console.log('selectedExpenses => '+JSON.stringify(component.get("v.selectedExpenses")));
            this.getBudgetLines(component);
        }else{
            component.set("v.selectedBudgetName", '');
            component.set("v.selectedExpenses", component.get("v.selectedExpenses").map(function(expense){
                expense.buildertek__Budget__c = '';
                return expense;
            }
            ));
            console.log('selectedExpenses => '+JSON.stringify(component.get("v.selectedExpenses")));
            component.set("v.budgetLinesOptions", []);
            component.set("v.Spinner", false);
        }
    },

    changeBudgetTimeCards : function(component, event, helper) {
        component.set("v.Spinner", true);
        var selectedBudget = component.find("selectedBudget").get("v.value");
        component.set("v.selectedBudgetId", selectedBudget);
        console.log('selectedBudget => '+selectedBudget);
        if(selectedBudget){    
            component.set("v.selectedBudgetName", component.get("v.budgetsOptions").find(function(budget){
                return budget.Id == selectedBudget;
            }).Name);
            console.log('selectedBudgetName => '+component.get("v.selectedBudgetName"));
            component.set("v.selectedTimeCards", component.get("v.selectedTimeCards").map(function(timeCard){
                timeCard.buildertek__Budget__c = selectedBudget;
                return timeCard;
            }));
            console.log('selectedTimeCards => '+JSON.stringify(component.get("v.selectedTimeCards")));
            this.getBudgetLines(component);
        }else{
            component.set("v.selectedBudgetName", '');
            component.set("v.selectedTimeCards", component.get("v.selectedTimeCards").map(function(timeCard){
                timeCard.buildertek__Budget__c = '';
                return timeCard;
            }
            ));
            console.log('selectedTimeCards => '+JSON.stringify(component.get("v.selectedTimeCards")));
            component.set("v.budgetLinesOptions", []);
            component.set("v.Spinner", false);
        }
        
    },

    TimeCardsPage1 : function(component, event, helper) {
        component.set("v.Page1", true);
        component.set("v.SelectTC", true);
        component.set("v.TimeCardP2", false);
        component.set("v.Page2", false);
    },

    saveTimeCards : function(component, event, helper) {
        component.set("v.selectedTimeCards", component.get("v.selectedTimeCards").map(function(timecard){
            if(!timecard.buildertek__Budget_Line__c){
                timecard.buildertek__Budget_Line__c = null;
            }
            return timecard;
        }));
        if(component.get("v.selectedBudgetId")){
            component.set("v.Spinner", true);
            var TimeCard = component.get("v.selectedTimeCards");
            var action = component.get("c.saveTC");
            action.setParams({
                "TimeCard": TimeCard
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'Success',
                        message: 'Time Cards have been saved.',
                        duration: ' 2000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                }
                console.log('TimeCard => '+JSON.stringify(TimeCard));
                component.set("v.Spinner", false);
                $A.get("e.force:closeQuickAction").fire();
            });
            $A.enqueueAction(action);
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please select a Budget.',
                duration: ' 2000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
    },

    getInvoices : function(component, event, helper) {
        component.set("v.Spinner", true);
        var action = component.get("c.getInvoices");
        action.setParams({
            "projectId": component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var invoices = response.getReturnValue();
                invoices = invoices.map(function(invoice){
                    invoice.selected = false;
                    invoice.buildertek__Budget__c = '';
                    invoice.buildertek__Budget_Line__c = '';
                    return invoice;
                });
                console.log('invoices => '+JSON.stringify(invoices));
                component.set("v.invoices", invoices);
                component.set("v.tableDataList", invoices);
                component.set("v.Spinner", false);
            }
        });
        $A.enqueueAction(action);
    },

    handleSelectedInvoices : function(component, event, helper) {
        var invoices = component.get("v.invoices");
        console.log('invoices => ',invoices);
        var selectedInvoices = [];
        invoices.forEach(function(invoice){
            if(invoice.selected){
                selectedInvoices.push(invoice);
            }
        }
        );
        component.set("v.selectedInvoices", selectedInvoices);
        console.log('selectedInvoices => ',selectedInvoices);
    },

    InvoicesPage2 : function(component, event, helper) {
        helper.handleSelectedInvoices(component);
        if(component.get("v.selectedInvoices").length > 0){
            component.set("v.Page2", true);
            component.set("v.SelectInv", false);
            component.set("v.InvoiceP2", true);
            component.set("v.Page1", false);
            helper.getBudegts(component);
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please select at least one Invoice.',
                duration: ' 2000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
    },

    changeBudgetInvoices : function(component, event, helper) {
        component.set("v.Spinner", true);
        var selectedBudget = component.get("v.selectedBudgetId");
        console.log('selectedBudget => '+selectedBudget);
        if(selectedBudget){
            component.set("v.selectedInvoices", component.get("v.selectedInvoices").map(function(invoice){
                invoice.buildertek__Budget__c = selectedBudget;
                return invoice;
            }));
            console.log('selectedInvoices => '+JSON.stringify(component.get("v.selectedInvoices")));
            this.getBudgetLines(component);
         }
        else{
            component.set("v.selectedBudgetName", '');
            component.set("v.selectedInvoices", component.get("v.selectedInvoices").map(function(invoice){
                invoice.buildertek__Budget__c = '';
                return invoice;
            }
            ));
            console.log('selectedInvoices => '+JSON.stringify(component.get("v.selectedInvoices")));
            component.set("v.budgetLinesOptions", []);
            component.set("v.Spinner", false);
        }
    },

    InvoicesPage1 : function(component, event, helper) {
        component.set("v.Page1", true);
        component.set("v.SelectInv", true);
        component.set("v.InvoiceP2", false);
        component.set("v.Page2", false);
    },

    saveInvoices : function(component, event, helper) {
        component.set("v.selectedInvoices", component.get("v.selectedInvoices").map(function(invoice){
            if(!invoice.buildertek__Budget_Line__c){
                invoice.buildertek__Budget_Line__c = null;
            }
            return invoice;
        }));
        if(component.get("v.selectedBudgetId")){
            component.set("v.Spinner", true);
            var Invoices = component.get("v.selectedInvoices");
            var action = component.get("c.saveInv");
            action.setParams({
                "Invoices": Invoices
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'Success',
                        message: 'Invoices have been saved.',
                        duration: ' 2000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                }
                console.log('Invoices => '+JSON.stringify(Invoices));
                component.set("v.Spinner", false);
                $A.get("e.force:closeQuickAction").fire();
            });
            $A.enqueueAction(action);
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please select a Budget.',
                duration: ' 2000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
    },

    getPurchaseOrders : function(component, event, helper) {
        component.set("v.Spinner", true);
        var action = component.get("c.getPurchaseOrders");
        action.setParams({
            "projectId": component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var purchaseOrders = response.getReturnValue();
                purchaseOrders = purchaseOrders.map(function(purchaseOrder){
                    purchaseOrder.selected = false;
                    purchaseOrder.buildertek__Budget__c = '';
                    purchaseOrder.buildertek__Budget_Line__c = '';
                    return purchaseOrder;
                });
                console.log('purchaseOrders => '+JSON.stringify(purchaseOrders));
                component.set("v.purchaseOrders", purchaseOrders);
                component.set("v.tableDataList", purchaseOrders);
                component.set("v.Spinner", false);
            }
        });
        $A.enqueueAction(action);
    },

    selectedPurchaseOrders : function(component, event, helper) {
        var purchaseOrders = component.get("v.purchaseOrders");
        var selectedPurchaseOrders = [];
        purchaseOrders.forEach(function(purchaseOrder){
            if(purchaseOrder.selected){
                selectedPurchaseOrders.push(purchaseOrder);
            }
        }
        );
        component.set("v.selectedPurchaseOrders", selectedPurchaseOrders);
        console.log('selectedPurchaseOrders => '+JSON.stringify(selectedPurchaseOrders));
    },


    PurchaseOrdersPage2 : function(component, event, helper) {
        helper.handleSelectedPurchaseOrders(component);
        if(component.get("v.selectedPurchaseOrders").length > 0){
            component.set("v.Page2", true);
            component.set("v.SelectPO", false);
            component.set("v.PurchaseOrderP2", true);
            component.set("v.Page1", false);
            helper.getBudegts(component);
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please select at least one Purchase Order.',
                duration: ' 2000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
    },

    handleSelectedPurchaseOrders : function(component){
        var purchaseOrders = component.get("v.purchaseOrders");
        var selectedPurchaseOrders = [];
        purchaseOrders.forEach(function(purchaseOrder){
            if(purchaseOrder.selected){
                selectedPurchaseOrders.push(purchaseOrder);
            }
        }
        );
        component.set("v.selectedPurchaseOrders", selectedPurchaseOrders);
        console.log('selectedPurchaseOrders => '+JSON.stringify(selectedPurchaseOrders));
    },

    changeBudgetPurchaseOrders : function(component, event, helper) {
        component.set("v.Spinner", true);
        var selectedBudget = component.get("v.selectedBudgetId");
        console.log('selectedBudget => '+selectedBudget);
        if(selectedBudget){
            component.set("v.selectedPurchaseOrders", component.get("v.selectedPurchaseOrders").map(function(purchaseOrder){
                purchaseOrder.buildertek__Budget__c = selectedBudget;
                return purchaseOrder;
            }));
            console.log('selectedPurchaseOrders => '+JSON.stringify(component.get("v.selectedPurchaseOrders")));
            this.getBudgetLines(component);
        }
        else{
            component.set("v.selectedBudgetName", '');
            component.set("v.selectedPurchaseOrders", component.get("v.selectedPurchaseOrders").map(function(purchaseOrder){
                purchaseOrder.buildertek__Budget__c = '';
                return purchaseOrder;
            }));
            console.log('selectedPurchaseOrders => '+JSON.stringify(component.get("v.selectedPurchaseOrders")));
            component.set("v.budgetLinesOptions", []);
            component.set("v.Spinner", false);
        }

    },

    PurchaseOrdersPage1 : function(component, event, helper) {
        component.set("v.Page1", true);
        component.set("v.SelectPO", true);
        component.set("v.PurchaseOrderP2", false);
        component.set("v.Page2", false);
    },

    savePurchaseOrders : function(component, event, helper) {
        component.set("v.selectedPurchaseOrders", component.get("v.selectedPurchaseOrders").map(function(purchaseOrder){
            if(!purchaseOrder.buildertek__Budget_Line__c){
                purchaseOrder.buildertek__Budget_Line__c = null;
            }
            return purchaseOrder;
        }));
        if(component.get("v.selectedBudgetId")){
            component.set("v.Spinner", true);
            var purchaseOrders = component.get("v.selectedPurchaseOrders");
            var action = component.get("c.savePO");
            action.setParams({
                "PurchaseOrder": purchaseOrders
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: 'Success',
                        message: 'Purchase Orders have been saved.',
                        duration: ' 2000',
                        key: 'info_alt',
                        type: 'success',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                }
                console.log('purchaseOrders => '+JSON.stringify(purchaseOrders));
                component.set("v.Spinner", false);
                $A.get("e.force:closeQuickAction").fire();
            });
            $A.enqueueAction(action);
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please select a Budget.',
                duration: ' 2000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
    },

    getProjectData : function(component, event, helper) {
        var selectedTransactionType = component.get("v.selectedTransactionType");
        component.set("v.Spinner", true);
        if(selectedTransactionType == 'Expense'){
            helper.getExpenses(component);
        }else if(selectedTransactionType == 'Time Card'){
            helper.getTimeCards(component);
        }else if(selectedTransactionType == 'Purchase Order'){
            helper.getPurchaseOrders(component);
        }else if(selectedTransactionType == 'Invoice(AP)'){
            helper.getInvoices(component);
        }else{
            component.set("v.Spinner", false);
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Error',
                message: 'Please select Transaction Type.',
                duration: ' 2000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
  
        component.set("v.checkedAll", false);
    },



})