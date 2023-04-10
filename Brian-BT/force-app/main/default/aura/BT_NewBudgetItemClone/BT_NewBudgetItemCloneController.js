({
    initialize: function(component, event, helper) {

    },
    checkToogle: function(component, event, helper) {
        event.preventDefault();
        var page = component.get("v.page") || 1;
        var checked = event.getSource().get("v.name");
        if (checked == "Group By Vendor") {
            component.set("v.groupBytoggle2", false);
            if (!event.getSource().get("v.checked")) {
                component.find("vendor").set("v.checked", true);
                component.set("v.groupBytoggle", true);
                component.set("v.groupByVendortoggle2", false);
                component.set("v.groupByVendortoggle1", false);
                component.set("v.groupByCostCode", false);

            } else {
                component.find("vendor").set("v.checked", false);
                component.set("v.groupBytoggle", false);
                component.set("v.groupByVendortoggle1", false);
                component.set("v.groupByVendortoggle2", false);
                component.set("v.groupByCostCode", false);
            }
        }
        var toggleVal = component.get("v.groupBytoggle");
        helper.getBudgetGroups(component, event, helper, page ,function(){});
    },

    checkToogle1: function(component, event, helper) {
        //  alert("hai");
        console.log('--toogle 1--');
        event.preventDefault();
        var page = component.get("v.page") || 1;
        var checked = event.getSource().get("v.name");
        // alert(checked);
        if (checked == "Group By Cost Code1") {
            if (!event.getSource().get("v.checked")) {
                component.find("Cost Code1").set("v.checked", true);
                component.get("v.groupBytoggle1");
                component.find("vendor").set("v.checked", false);
                component.set("v.groupBytoggle", false);
                component.set("v.groupByVendortoggle1", true);
                component.set("v.groupByCostCode", false);

                // component.set("v.groupByVendortoggle1",true);
            } else {
                component.find("Cost Code1").set("v.checked", false);
                component.find("vendor").set("v.checked", true);
                component.set("v.groupBytoggle", true);

                //alert( component.set("v.groupBytoggle",true));
                component.set("v.groupByVendortoggle2", false);
                component.set("v.groupByVendortoggle1", false);
                component.set("v.groupByCostCode", false);
            }
        }
        var toggleVal = component.get("v.groupBytoggle1");
        helper.getBudgetGroups(component, event, helper, page , function(){});
    },

    checkToogle2: function(component, event, helper) {
        console.log('---toogle2---');
        event.preventDefault();
        var page = component.get("v.page") || 1;
        var checked = event.getSource().get("v.name");
        var bt = component.get("v.Isbtvalue");
        // alert('bt'+bt);
        if (checked == "Group By Cost Code") {
            if (!event.getSource().get("v.checked")) {
                component.find("Cost Code").set("v.checked", true);
                component.set("v.groupBytoggle2", true);
                component.set("v.groupByVendortoggle", false);
                component.set("v.groupByCostCode", false);
                component.set("v.groupBytoggle", false);
            } else {
                component.find("Cost Code").set("v.checked", false);
                component.set("v.groupBytoggle2", false);
                component.set("v.groupByCostCode", false);
                component.set("v.groupBytoggle", false);
            }

        }
        var toggleVal = component.get("v.groupBytoggle2");
        helper.getBudgetGroups(component, event, helper, page , function(){});
    },

    closetab: function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
                var focusedTabId = response.tabId;
                workspaceAPI.closeTab({ tabId: focusedTabId });
            })
            .catch(function(error) {
                console.log(error);
            });
    },

    doInit: function(component, event, helper) {


        var workspaceAPI = component.find("workspace");
        workspaceAPI.getEnclosingTabId().then((response) => {
            let opendTab = response.tabId;
            workspaceAPI.setTabLabel({
                tabId: opendTab,
                label: "Budget"
            });
            workspaceAPI.setTabIcon({
                tabId: opendTab,
                icon: 'custom:custom5',
                iconAlt: 'Budget'
            });
        });



        // alert(component.get("v.recordId"));
        //  $A.get('e.force:refreshView').fire();

        //  alert('main obj');
        /*var action = component.get("c.getBudgetDetails");
            action.setParams({
                budgetRecordId : component.get("v.recordId")
            });
            action.setCallback(this, function (response) {
                if (response.getState() === "SUCCESS") {
                    var result = JSON.parse(JSON.stringify(response.getReturnValue()));
                    component.set("v.sampleNewRecord",result);
                }
            });
            $A.enqueueAction(action);*/
        component.set("v.budgetrecid", component.get("v.recordId"));
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();
        var page = component.get("v.page") || 1;
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            component.set("v.currentTab", focusedTabId);
            //workspaceAPI.closeTab({tabId: focusedTabId});
        })
        var action = component.get("c.getbudget");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                console.log(JSON.parse(JSON.stringify(response.getReturnValue())));
                var budgetData = JSON.parse(JSON.stringify(response.getReturnValue()))
                component.set("v.budgetName", budgetData.Name);
                component.set("v.budgetId", budgetData.Id);
                if (component.find('expandCollapeseAllBtn')) {
                    if (component.find('expandCollapeseAllBtn').get('v.iconName')) {
                        var budgetIdele = component.get("v.budgetId");
                        // alert(budgetIdele);
                        var tabId = component.get("v.currentTab")
                            //alert(tabId);
                        if (tabId) {
                            var spanEle = document.getElementsByClassName(tabId + ' expandAllBtn_' + budgetIdele);
                            // alert(spanEle);
                            if (spanEle[0]) {
                                spanEle[0].style.display = "inline-block";
                            }
                            if (document.getElementsByClassName(tabId + ' CollapeseAllBtn_' + budgetIdele)[0]) {
                                document.getElementsByClassName(tabId + ' CollapeseAllBtn_' + budgetIdele)[0].style.display = "none";
                            }
                        }



                        component.find('expandCollapeseAllBtn').set("v.title", "Expand All");
                        component.find('expandCollapeseAllBtn').set("v.iconName", "utility:add");
                    }
                }
                /*  if(component.find('expandCollapeseAllBtn').get('v.iconName')){
                        var budgetIdele =  component.get("v.budgetId");
                       // alert(budgetIdele);
                        var tabId = component.get("v.currentTab")
                        //alert(tabId);
                        if(tabId){
                            var spanEle = document.getElementsByClassName(tabId+' CollapeseAllBtn_'+budgetIdele);
                           // alert(spanEle);
                            if(spanEle[0]){
                                spanEle[0].style.display="inline-block";
                            }
                            if(document.getElementsByClassName(tabId+' expandAllBtn_'+budgetIdele)[0]){
                                document.getElementsByClassName(tabId+' expandAllBtn_'+budgetIdele)[0].style.display="none";
                            } 
                        }
                       
                        
                       
                        component.find('expandCollapeseAllBtn').set("v.title", "Collapse All");
                        component.find('expandCollapeseAllBtn').set("v.iconName", "utility:add");
                    }
                }*/
            }
        })
        $A.enqueueAction(action);

        //   helper.getBudgetGroups(component, event, helper, page); //, start, output);
        helper.fetchPickListVal(component, event, helper);
        helper.fetchpricebooks(component, event, helper);
        //helper.fetchCORecordType(component, event, helper);
        //helper.fetchInvoiceRecordType(component, event, helper);
        helper.getcurr(component, event, helper);
        //helper.getmulticur(component, event, helper);
        component.set("v.listofproductfamily", '');
        
        //var bt = component.get("v.Isbtvalues");
        //alert('kkkkkk'+bt);
        var btadminaction = component.get("c.getadminvalues");
        
        //alert("haii");
        btadminaction.setCallback(this, function(response) {
            console.log(response.getError() , '::::::ERROR MESSAGE::::::');
            if (response.getState() === 'SUCCESS') {
                var result = response.getReturnValue();
                console.log('Admin Data ==> ',result);

                var page = component.get("v.page") || 1;
                component.set("v.Isbtvalue", true);
                // result.buildertek__Budget_Grouping_Data__c = 'test'
                if (result.buildertek__Budget_Grouping_Data__c == 'Group By Category') {
                    // component.find("Cost Code").set("v.checked", true);
                    component.set("v.groupBytoggle2", true);
                    component.set("v.groupByVendortoggle", false);
                    component.set("v.groupByCostCode", false);
                    component.set("v.groupBytoggle", false);
                    helper.getBudgetGroups(component, event, helper, page ,function(){});

                } else if(result.buildertek__Budget_Grouping_Data__c == 'Group By Vendor') {
                    component.set("v.groupBytoggle2", false);
                    component.set("v.groupBytoggle", true);
                    component.set("v.groupByVendortoggle2", false);
                    component.set("v.groupByVendortoggle1", false);
                    component.set("v.groupByCostCode", false);
                    component.set("v.groupByVendortoggle", true);
                    helper.getBudgetGroups(component, event, helper, page ,function(){});
                    
                } else if(result.buildertek__Budget_Grouping_Data__c == 'Group By Cost Code') {
                    console.log('-----))))----');
                    component.set("v.groupBytoggle", false);
                    component.set("v.groupByVendortoggle", false);
                    component.set("v.groupByVendortoggle1", false);
                    component.set("v.groupByVendortoggle2", false);
                    component.set("v.groupBytoggle2", false);
                    helper.CostCodeFilterHelper(component, event, helper, page);
                    helper.getBudgetGroups(component, event, helper, page ,function(){});


                } else {
                    component.set("v.groupByVendortoggle", false);
                    helper.getBudgetGroups(component, event, helper, page ,function(){});

                }

            }

        });
        $A.enqueueAction(btadminaction);




    },

    /*sectionOne : function(component, event, helper) {
          helper.helperFun(component,event,'articleOne');
       },*/


    navigate: function(component, event, helper) {
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();
        var page = component.get("v.page") || 1;
        // get the previous button label  
        var direction = event.getSource().get("v.label");
        ///alert('direction ---------> '+direction); 
        // set the current page,(using ternary operator.)  
        page = direction === "Previous" ? (page - 1) : (page + 1);
        // call the helper function

        var groupByCostCode = component.get("v.groupByCostCode");
        console.log('groupByCostCode ==> '+groupByCostCode);
        if (groupByCostCode == true) {
            helper.CostCodeFilterHelper(component, event, helper, page);
        } else{
            helper.getBudgetGroups(component, event, helper, page , function(){});
        }

    },

    changefamily: function(component, event, helper) {
        var product = component.get('v.selectedLookUpRecord');
        var compEvent = $A.get('e.c:BT_CLearLightningLookupEvent');
        compEvent.setParams({
            "recordByEvent": product
        });
        compEvent.fire();
        component.set('v.newBudgetLine.Name', '');
        component.set('v.newBudgetLine.buildertek__Unit_Price__c', '');
        component.set('v.newBudgetLine.buildertek__Sales_Price__c', '');
    },

    onContingency: function(component, event, helper) {
        component.set('v.isContingency', true);
    },

    closeContingencyModel: function(component, event, helper) {
        component.set('v.isContingency', false);
    },

    handleCancel: function(component, event, helper) {
        component.find("overlayLib").notifyClose();
    },

    changeEvent: function(component, event, helper) {
        var group = component.find('costCodeId');
        group.set("v._text_value", '');
        var product = component.get('v.selectedLookUpRecord');
        var compEvent = $A.get('e.c:BT_CLearLightningLookupEvent');
        compEvent.setParams({
            "recordByEvent": product
        });
        compEvent.fire();
        component.set('v.productfamily', undefined);
        component.set('v.newBudgetLine.Name', '');
        component.set('v.selectedContractor', null);
        component.set('v.newBudgetLine.buildertek__Group__c', '');
        component.set('v.newBudgetLine.buildertek__Sub_Grouping__c', null);
        component.set('v.options', '');
        component.set('v.newBudgetLine.buildertek__Sales_Price__c', '');
        component.set('v.newBudgetLine.buildertek__Unit_Price__c', '');
        component.set('v.newBudgetLine.buildertek__Quantity__c', '1');
        component.set('v.newBudgetLine.buildertek__Cost_Code__c', '');
        $A.enqueueAction(component.get("c.clearLookupValue"));
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "HIDE"
        }).fire();

        //$A.get('e.force:refreshView').fire();

        var action = component.get("c.getProductfamilyRecords");
        var pribooknames = component.get("v.pricebookName");
        // set param to method  
        action.setParams({
            'ObjectName': "Product2",
            'parentId': component.get("v.pricebookName")
        });
        // set a callBack    
        action.setCallback(this, function(response) {
            $A.util.removeClass(component.find("mySpinner"), "slds-show");
            var state = response.getState();
            if (state === "SUCCESS") {
                helper.fetchPickListVal(component, event, helper);
                var storeResponse = response.getReturnValue();
                console.log('storeResponse --> ', storeResponse);
                // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                if (storeResponse.length == 0) {
                    component.set("v.Message", 'No Result Found...');
                } else {
                    component.set("v.Message", '');
                }
                // set searchResult list with return value from server.
                component.set("v.listofproductfamily", storeResponse);
                if (component.get("v.listofproductfamily").length > 0) {
                    component.set("v.productfamily", component.get("v.listofproductfamily")[0].productfamilyvalues);
                }
                console.log('productfamily --> ', component.get("v.productfamily"));
                console.log('listofproductfamily --> ', component.get("v.listofproductfamily"));
            }

        });
        // enqueue the Action  
        $A.enqueueAction(action);
    },

    handleSaveSuccess: function(component, event, helper) {
        if (event) {
            if (event.getParams().message && event.getParams().message.indexOf('was saved') != -1) {
                var page = component.get("v.page") || 1
                helper.getBudgetGroups(component, event, helper, page , function(){});
                $A.get("e.force:refreshView").fire();
            }
        }
    },

    doView: function(component, event, helper) {
        ////console.log(event.currentTarget.dataset.record);
        var editRecordEvent = $A.get("e.force:navigateToSObject");
        editRecordEvent.setParams({
            "recordId": event.currentTarget.dataset.record
        });
        editRecordEvent.fire();
    },

    onBudgetChange: function(component, event, helper) {
        helper.getBudgetLine(component, event, helper);
    },

    closeSelectBox: function(component, event, helper) {
        $A.util.removeClass(component.find("selectedlookUp"), "slds-show");
    },

    closeDropDown: function(component, event, helper) {
        window.setTimeout(
            $A.getCallback(function() {
                $A.util.removeClass(component.find("selectedlookUp"), "slds-show");
            }), 1000
        );
    },

    search: function(component, event, helper) {},

    searchAll: function(component, value) {
        $A.util.addClass(component.find("selectedlookUp"), "slds-show");
    },

    itemSelected: function(component, event, helper) {
        console.log("event " + event);
        $A.util.removeClass(component.find("selectedlookUp"), "slds-show");
        component.set("v.budgetItemId", event.target.id);
        component.set("v.budgetLineItemName", event.target.title);
    },

 
    saveSelectedTC: function(component, event, helper) {
        console.log(event);
        component.set("v.selectedExistingTC", event.currentTarget.id);
    },

    // saveSelectedINVO: function(component, event, helper) {
    //     console.log(event);
    //     component.set("v.selectedExistingINVO", event.currentTarget.id);
    // },
    addTimeCard: function(component, event, helper) {
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();
        var selectedRecs = component.get('v.selectedRecs');

        selectedRecs.filter((item,index) => selectedRecs.indexOf(item) === index);

        console.log('v.selectedRecs ==> ', { selectedRecs });
        if (selectedRecs.length > 0) {
            if(selectedRecs.length == 1){

                var BudgetIds = [];
                var rowData;
                var newPOItems = [];
            // if (selectedRecs.length > 0) {
                var budgetlineid = BudgetIds[0];
                var action=component.get("c.BudgetItemList");
                action.setParams({
                    BudgetIds: selectedRecs
                });
                action.setCallback(this, function(response) {
                    console.log(response.getState() , '::::::::STATE;;;;;;;');
                    if (component.isValid() && response.getState() === "SUCCESS") {
                        $A.get("e.c:BT_SpinnerEvent").setParams({
                            "action": "HIDE"
                        }).fire();
                        for (var i = 0; i < response.getReturnValue().length; i++) {
                            component.set("v.addtcsection", true);
                            var pageNumber = component.get("v.PageNumber");
                            var pageSize = component.get("v.pageSize");
                            component.set("v.isExistingTc", true);
                            helper.gettcList(component, pageNumber, pageSize);
                        }
                    }
                });
                $A.enqueueAction(action);


            // } else {
            //     $A.get("e.c:BT_SpinnerEvent").setParams({
            //         "action": "HIDE"
            //     }).fire();
            //     component.find('notifLib').showNotice({
            //         "variant": "error",
            //         "header": "Please Select Budget Line!",
            //         "message": "Please Select Budget Line to Create TimeCard.",
            //         closeCallback: function() {}
            //     });
            // }


            }else{
                $A.get("e.c:BT_SpinnerEvent").setParams({
                    "action": "HIDE"
                }).fire();
                component.find('notifLib').showNotice({
                    "variant": "error",
                    "header": "Select Budget Line",
                    "message": "Please Select only 1 Budget Line to Create Time Card.",
                    //"header": "No Budget Lines",
                    //"message": "Please select a Budget Line.",
                    closeCallback: function() {}
                });

            }
            
        } else {
            $A.get("e.c:BT_SpinnerEvent").setParams({
                "action": "HIDE"
            }).fire();
            component.set("v.addtcsection", true);
            var pageNumber = component.get("v.PageNumber");
            var pageSize = component.get("v.pageSize");
            component.set("v.isExistingTc", true);
            helper.gettcList(component, pageNumber, pageSize);
          
        }
    },
    addInvoice: function(component, event, helper) {
        console.log('addInvoice');
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();
        var selectedRecs = component.get('v.selectedRecs');
        console.log('v.selectedRecs ==> ', { selectedRecs });
        if (selectedRecs.length > 0) {
            var BudgetIds = [];
            var rowData;
            var newPOItems = [];

            if (selectedRecs.length > 0 && selectedRecs.length == 1 ) {
                var budgetlineid = BudgetIds[0];
                var action;
                action = component.get("c.BudgetItemList");
                action.setParams({
                    BudgetIds: selectedRecs
                });
                action.setCallback(this, function(response) {
                    console.log('response ==> ', response );
                    if (component.isValid() && response.getState() === "SUCCESS") {
                        $A.get("e.c:BT_SpinnerEvent").setParams({
                            "action": "HIDE"
                        }).fire();
                        for (var i = 0; i < response.getReturnValue().length; i++) {
                            component.set("v.addinvsection", true);
                            var pageNumber = component.get("v.PageNumber");
                            var pageSize = component.get("v.pageSize");
                            component.set("v.isExistingInvo", true);
                            helper.getInvoiceList(component, pageNumber, pageSize);
                        }
                    }
                });
                $A.enqueueAction(action);
            }else if(selectedRecs.length >1){
                $A.get("e.c:BT_SpinnerEvent").setParams({
                    "action": "HIDE"
                }).fire();
                component.find('notifLib').showNotice({
                    "variant": "error",
                    "header": "Too many Budget Lines selected.",
                    "message": "Please Select only 1 Budget Line to Create Invoice.",
                    closeCallback: function() {}
                });
            }
             else {
                $A.get("e.c:BT_SpinnerEvent").setParams({
                    "action": "HIDE"
                }).fire();
                component.find('notifLib').showNotice({
                    "variant": "error",
                    "header": "Please Select Budget Line!",
                    "message": "Please Select Budget Line to Create TimeCard.",
                    closeCallback: function() {}
                });
            }
        } else {
            $A.get("e.c:BT_SpinnerEvent").setParams({
                "action": "HIDE"
            }).fire();
            component.set("v.addinvsection", true);
            var pageNumber = component.get("v.PageNumber");
            var pageSize = component.get("v.pageSize");
            component.set("v.isExistingInvo", true);
            helper.getInvoiceList(component, pageNumber, pageSize);



        }
    },
    addPO: function(component, event, helper) {
        var selectedRecs = component.get('v.selectedRecs');
        console.log('v.selectedRecs ==> ', { selectedRecs });
        if (selectedRecs.length > 0) {
            var BudgetIds = [];
            var rowData;
            var newPOItems = [];

            if (selectedRecs.length > 0) {
                var budgetlineid = BudgetIds[0];
                var action;
                action = component.get("c.BudgetItemList");
                action.setParams({
                    BudgetIds: selectedRecs
                });
                action.setCallback(this, function(response) {
                    if (component.isValid() && response.getState() === "SUCCESS") {
                        for (var i = 0; i < response.getReturnValue().length; i++) {
                            component.set("v.addposection", true);
                            var pageNumber = component.get("v.PageNumber");
                            var pageSize = component.get("v.pageSize");
                            component.set("v.isExistingPo", true);
                            helper.getpoList(component, pageNumber, pageSize);
                        }
                    }
                });
                $A.enqueueAction(action);


            } else {
                component.find('notifLib').showNotice({
                    "variant": "error",
                    "header": "Please Select Budget Line!",
                    "message": "Please Select Budget Line to Create PO.",
                    closeCallback: function() {}
                });
            }
        } else {
            component.find('notifLib').showNotice({
                "variant": "error",
                "header": "Select Budget Line",
                "message": "Please Select at least One Budget Line to Add PO.",
                closeCallback: function() {}
            });
        }
    },
    onClickAddlines: function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef: "c:BT_BudgetAddLines",
            /*componentAttributes: {
                recordId: component.get("v.recordId + 'groups'"),
                // "_gFiled": "buildertek__Group__c",
                //"_gSobject": "buildertek__Budget_Item__c",
                //"_gFilter": "buildertek__Budget__c = '" + component.get("v.recordId") + "'"
                
            }*/
            componentAttributes: {
                recordId: component.get("v.recordId"),
            }
        });
        evt.fire();


    },

    addProduct: function(component, event, helper) {
        var overlayLib;
        $A.createComponents([
                ["c:BT_ProductsAdder", {
                    "aura:id": "btSelectProducts",
                    "recordId": component.get("v.recordId"),
                    "_gFiled": "buildertek__Group__c",
                    "_gSobject": "buildertek__Budget_Item__c",
                    "_gFilter": "buildertek__Budget__c = '" + component.get("v.recordId") + "'",
                    "saveCallback": function(Items) {
                        //console.log('items',Items);
                        var newBudgetItems = [];
                        for (var i = 0; i < Items.length; i++) {
                            var newBi = new Object();
                            newBi.buildertek__Product__c = Items[i].productId;
                            newBi.Name = Items[i].productName;
                            newBi.buildertek__budget__c = component.get("v.recordId");
                            newBi.buildertek__Unit_Price__c = Items[i].salesPrice;
                            newBi.buildertek__quantity__c = Items[i].quantity;
                            newBi.buildertek__Group__c = Items[i].groupid;
                            newBudgetItems.push(newBi);
                        }
                        overlayLib.close();
                        $A.get("e.c:BT_SpinnerEvent").setParams({
                            "action": "SHOW"
                        }).fire();
                        helper.addSelectedProducts(component, event, helper, newBudgetItems);
                    },
                    "cancelCallback": function() {
                        overlayLib.close();
                    }
                }],

            ],
            function(components, status, errorMessage) {
                if (status === "SUCCESS") {
                    component.find('overlayLib').showCustomModal({
                        header: "Add Product(s) in Budget",
                        body: components[0],
                        footer: "",
                        showCloseButton: true,
                        cssClass: "btmodal_80",
                        closeCallback: function() {
                            overlayLib.close();
                        }
                    }).then(function(overlay) {
                        overlayLib = overlay;
                    });
                }
            });

    },


    eventAction: function(component, event, helper) {
        if (event.getParam("action") == 'transfer_budget') {
            var defaultValue = new Object();
            defaultValue.buildertek__From__c = event.getParam("budgetitemid");
            helper.createForceRecordEditComp(component, event, helper, "", "NEW", "Transfer Budget Amount", "buildertek__Budget_Modifications__c", defaultValue);
        }
    },

    checkSchedules: function(component, event, helper) {
        component.set("v.selectedScheduleRecords", []);
        component.set("v.isCreateNewSchedule", false);
        var selectedRecs = component.get('v.selectedRecs');
        if (selectedRecs.length > 0) {
            var checkScheduleAction = component.get("c.checkSchedulesRecords");
            checkScheduleAction.setParams({
                "projectId": component.get("v.sampleNewRecord").buildertek__Project__c
                    //scheduleItems : scheduleItems
            });
            checkScheduleAction.setCallback(this, function(response) {
                if (component.isValid() && response.getState() === "SUCCESS") {
                    console.log(response.getReturnValue());
                    var schedules = JSON.parse(JSON.stringify(response.getReturnValue()));
                    if (schedules.length > 0) {
                        // create popup
                        // scheduleRecords
                        component.set("v.scheduleRecords", schedules);
                        component.set("v.showSelectSchedule", true);
                        //  component.set("createNewSchedule",true);
                    } else if (schedules.length == 0) {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({

                            message: 'You need to create a Schedule for this Project before you can create a new Schedule Line.',
                            duration: ' 5000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                    } else {
                        // call proceed function
                        //component.set("v.scheduleRecords",schedules);
                        var schedule = JSON.parse(JSON.stringify(schedules));
                        component.set("v.selectedScheduleRecords", schedules[0].Id);
                        component.set("v.showSelectSchedule", false);
                        $A.enqueueAction(component.get("c.createScheduleItem"));
                    }
                }
            });
            $A.enqueueAction(checkScheduleAction);
        } else {
            component.find('notifLib').showNotice({
                "variant": "error",
                "header": "Select Budget Line",
                "message": "Please Select at least One Budget Line to Create Scheduled Items.",
                //"header": "No Budget Lines ",
                // "message": "No Budget Lines Records.",
                closeCallback: function() {}
            });
        }
    },

    selectedSchedule: function(component, event, helper) {
        var selectedSchedule = component.get("v.selectedScheduleRecords");
        var id = event.getSource().get("v.name");
        if (event.getSource().get("v.checked")) {
            if (selectedSchedule.indexOf(id) == -1) {
                selectedSchedule.push(id);
            }
        } else {
            if (selectedSchedule.indexOf(id) > -1) {
                var index = selectedSchedule.indexOf(id);
                selectedSchedule.splice(index, 1);
            }
        }
        component.set("v.selectedScheduleRecords", selectedSchedule);
    },


    createScheduleItem: function(component, event, helper) {
        var selectecSchedule = component.get("v.selectedScheduleRecords");
        if (selectecSchedule.length || component.get("v.isCreateNewSchedule")) {
            component.set("v.showSelectSchedule", false);
            var selectedRecs = component.get('v.selectedRecs');
            if (selectedRecs.length > 0) {
                var rowData;
                var newScheduledItems = [];
                if (selectedRecs.length > 0) {
                    var action;
                    action = component.get("c.BudgetItemList");
                    action.setParams({
                        "BudgetIds": selectedRecs
                    });
                    action.setCallback(this, function(response) {
                        if (component.isValid() && response.getState() === "SUCCESS") {
                            for (var i = 0; i < response.getReturnValue().length; i++) {
                                rowData = response.getReturnValue()[i];
                                var now = new Date();
                                console.log($A.localizationService.formatDate(now, "yyyy-M-dd"));
                                var newScheduledItem = new Object();
                                newScheduledItem.Name = rowData.Name + ' Task';
                                newScheduledItem.buildertek__Budget_Line__c = rowData.Id;
                                newScheduledItem.buildertek__Start__c = $A.localizationService.formatDate(now, "yyyy-MM-dd");
                                newScheduledItem.buildertek__Duration__c = 1;
                                newScheduledItem.buildertek__Project__c = component.get("v.sampleNewRecord").buildertek__Project__c;
                                //newScheduledItem.buildertek__Schedule__c = null;
                                newScheduledItems.push(newScheduledItem);
                            }
                            var overlayLib;
                            $A.createComponents([
                                    ["c:BT_New_Schedule_Items", {
                                        "aura:id": "btNewScheduleItems",
                                        "projectID": component.get("v.sampleNewRecord").buildertek__Project__c,
                                        "isCreateNewScheduleAttr": component.get("v.isCreateNewSchedule"),
                                        "newScheduledItems": newScheduledItems,
                                        "selectedScheduleRecords": JSON.parse(JSON.stringify(component.get("v.selectedScheduleRecords"))),
                                        "saveCallback": component.get("v.refreshGridAction"),
                                        "cancelCallback": function() {
                                            var selected = [];
                                            component.set("v.selectedScheduleRecords", selected);
                                            component.set("v.isCreateNewSchedule", false);
                                            overlayLib.close();
                                        }
                                    }],
                                ],
                                function(components, status, errorMessage) {
                                    if (status === "SUCCESS") {
                                        //component.set('v.selectedRecs',[]);
                                        //component.set("v.selectedScheduleRecords",[]);
                                        component.find('overlayLib').showCustomModal({
                                            header: "Create Schedule Items",
                                            body: components[0],
                                            footer: components[0].find("footer").get("v.body"),
                                            showCloseButton: true,
                                            cssClass: 'slds-modal_medium',
                                            closeCallback: function() {}
                                        }).then(function(overlay) {
                                            overlayLib = overlay;
                                        });
                                    }
                                }
                            );
                        }
                    });
                    $A.enqueueAction(action);
                } else {
                    component.find('notifLib').showNotice({
                        "variant": "error",
                        "header": " Select Budget Line",
                        "message": "Please Select Budget Line to Create Schedule Items.",
                        closeCallback: function() {}
                    });
                }
            } else {
                component.find('notifLib').showNotice({
                    "variant": "error",
                    "header": "Select Budget Line",
                    "message": "Please Select at least One Budget Line to Create Scheduled Items.",
                    //"header": "No Budget Lines",
                    //"message": "No Budget Lines Records.",
                    closeCallback: function() {}
                });
            }
        } else {
            component.find('notifLib').showNotice({
                "variant": "error",
                "header": "Select Schedule",
                "message": "Please Select Schedule Records.",
                closeCallback: function() {}
            });
        }
    },

    newRFQ: function(component, event, helper) {
        var selectedRecs = component.get('v.selectedRecs');
        if (selectedRecs.length > 0) {
            var rowData;
            var newRFQItems = [];
            if (selectedRecs.length > 0) {
                var action;
                action = component.get("c.BudgetItemList");
                action.setParams({
                    BudgetIds: selectedRecs
                });
                action.setCallback(this, function(response) {
                    if (component.isValid() && response.getState() === "SUCCESS") {
                        for (var i = 0; i < response.getReturnValue().length; i++) {
                            rowData = response.getReturnValue()[i];
                            var newRFQItem = new Object();
                            newRFQItem.Name = rowData.Name;
                            newRFQItem.buildertek__Product__c = rowData.buildertek__Product__c;
                            newRFQItem.buildertek__Budget_Item__c = rowData.Id;
                            newRFQItem.buildertek__Description__c = rowData.buildertek__Description__c;
                            if (rowData.buildertek__Quantity__c != undefined) {
                                newRFQItem.buildertek__Quantity__c = rowData.buildertek__Quantity__c;
                            } else {
                                newRFQItem.buildertek__Quantity__c = 1;
                            }

                            newRFQItem.buildertek__Unit_Price__c = rowData.buildertek__Unit_Price__c;
                            newRFQItem.buildertek__Trade_Type__c = rowData.buildertek__Trade_Type__c;
                            newRFQItems.push(newRFQItem);
                        }
                        var rfq = component.get("v.newRFQ");
                        rfq.buildertek__Budget__c = component.get("v.sampleNewRecord").Id;
                        rfq.buildertek__Project__c = component.get("v.sampleNewRecord").buildertek__Project__c;
                        var overlayLib;
                        $A.createComponents([
                                ["c:BT_New_RFQ", {
                                    "aura:id": "btNewRFQ",
                                    "newRFQ": rfq,
                                    "newRFQItems": newRFQItems,
                                    "saveCallback": component.get("v.refreshGridAction"),
                                    "cancelCallback": function() {
                                        overlayLib.close();
                                    }
                                }],
                            ],
                            function(components, status, errorMessage) {
                                if (status === "SUCCESS") {
                                    component.find('overlayLib').showCustomModal({
                                        header: "New RFQ",
                                        body: components[0],
                                        footer: components[0].find("footer").get("v.body"),
                                        showCloseButton: true,
                                        cssClass: 'slds-modal_medium',
                                        closeCallback: function() {}
                                    }).then(function(overlay) {
                                        overlayLib = overlay;
                                    });
                                }
                            }
                        );
                    }
                });
                $A.enqueueAction(action);
            } else {
                component.find('notifLib').showNotice({
                    "variant": "error",
                    "header": "Please Select Budget Line!",
                    "message": "Please Select Budget Line to Create RFQ.",
                    closeCallback: function() {}
                });
            }
        } else {
            component.find('notifLib').showNotice({
                "variant": "error",
                "header": " Select Budget Line",
                "message": "Please Select at least One  Budget Line to Create RFQ.",
                //"header": "No Budget Lines",
                //"message": "No Budget Lines Records.",
                closeCallback: function() {}
            });
        }
    },

    newCO: function(component, event, helper) {
        component.set("v.disableAddCO", true);
        var selectedRecs = component.get('v.selectedRecs');
        console.log('selectedRecs ==> ',{selectedRecs});
        helper.fetchCORecordType(component, event, helper);
        if (selectedRecs.length > 0) {
            var rowData;
            var newCOItems = [];
            if (selectedRecs.length > 0) {
                var budgetlineid = selectedRecs[0];
                var action;
                action = component.get("c.BudgetItemList");
                action.setParams({
                    BudgetIds: selectedRecs
                });
                action.setCallback(this, function(response) {
                    if (component.isValid() && response.getState() === "SUCCESS") {
                        for (var i = 0; i < response.getReturnValue().length; i++) {
                            rowData = response.getReturnValue()[i];
                            var newCOItem = new Object();
                            newCOItem.Name = rowData.Name;
                            newCOItem.Item_Name__c = rowData.Name;
                            newCOItem.buildertek__Product__c = rowData.buildertek__Product__c;
                            newCOItem.buildertek__Budget_Item__c = rowData.Id;
                            newCOItem.buildertek__Description__c = rowData.Name;
                            newCOItem.buildertek__Quantity__c = rowData.buildertek__Quantity__c;
                            newCOItem.buildertek__Unit_Price__c = rowData.buildertek__Unit_Price__c;
                            // newCOItem.buildertek__Markup__c = rowData.buildertek__Gross_Profit_Percemtage__c;
                            newCOItems.push(newCOItem);
                        }
                        // component.set("v.selectedCol", []);
                        var CO = component.get("v.newCO");
                        CO.buildertek__Budget__c = component.get("v.sampleNewRecord").Id;
                        CO.buildertek__Project__c = component.get("v.sampleNewRecord").buildertek__Project__c;
                        CO.buildertek__Status__c = 'Pending';
                        CO.RecordTypeId = component.get("v.COCustomerRecordType");
                        var overlayLib;
                        $A.createComponents([
                                ["c:BT_New_Change_Order", {
                                    "aura:id": "btNewco",
                                    "newCO": CO,
                                    "newCOItems": newCOItems,
                                    "budgetlineid": budgetlineid,
                                    "saveCallback": component.get("v.refreshGridAction"),
                                    "cancelCallback": function() {
                                        overlayLib.close();
                                        component.set("v.disableAddCO", false);
                                    }
                                }],
                            ],
                            function(components, status, errorMessage) {
                                if (status === "SUCCESS") {
                                    component.find('overlayLib').showCustomModal({
                                        header: "New Change Order",
                                        body: components[0],
                                        footer: components[0].find("footer").get("v.body"),
                                        showCloseButton: true,
                                        cssClass: 'slds-modal_medium',
                                        closeCallback: function() {
                                            component.set("v.disableAddCO", false);
                                        }
                                    }).then(function(overlay) {
                                        overlayLib = overlay;
                                    });
                                }
                            }
                        );
                    }
                });
                $A.enqueueAction(action);
            } else {
                component.find('notifLib').showNotice({
                    "variant": "error",
                    "header": " Select Budget Line",
                    "message": "Please Select Budget Line to Create Change Order.",
                    closeCallback: function() {}
                });
                component.set("v.disableAddCO", false);
            }
        } else {
            component.find('notifLib').showNotice({
                "variant": "error",
                "header": " Select Budget Line",
                "message": "Please Select at least One Budget Line to Create Change Order.",
                //"header": "No Budget Lines"
                //"message": "No Budget Lines Records.",
                closeCallback: function() {}
            });
            component.set("v.disableAddCO", false);
        }
    },

    updateBudgetLineInvoice: function(component, event, helper) {
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();
        var selectedInvoiceRecords = component.get("v.recordList");    
        console.log({selectedInvoiceRecords});    
        let selectedInvoiceList=[];
        selectedInvoiceRecords.forEach(element => {
            if (element.Selected) {
                selectedInvoiceList.push(element);
            }
        });

        console.log('selectedInvoiceList ==>',selectedInvoiceList);


        var selectedInvoiceId = component.get('v.selectedExistingINVO');
        selectedInvoiceId = selectedInvoiceId.toString();


        var selectedRecords = component.get('v.selectedRecs');
        if (selectedRecords.length > 0){

            selectedRecords = selectedRecords.toString();
            var action = component.get("c.updateInvoicePrice");
            action.setParams({
                recordId : selectedInvoiceId,
                budgeLineIds : selectedRecords
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                var result = response.getReturnValue();
                if (result === 'Success') {
                    component.set('v.selectedRecs',[]);
                    $A.get("e.c:BT_SpinnerEvent").setParams({
                        "action": "HIDE"
                    }).fire();
                    helper.showToast(component, event, helper, 'Success', 'Invoice Price updated successfully', 'success');

                    var action1 = component.get("c.doInit");
                    $A.enqueueAction(action1);
                }else if (result === 'null'){
                    $A.get("e.c:BT_SpinnerEvent").setParams({
                        "action": "HIDE"
                    }).fire();
                    helper.showToast(component, event, helper, 'Error', 'Please Select Invoice', 'error');
                }
                else{
                    $A.get("e.c:BT_SpinnerEvent").setParams({
                        "action": "HIDE"
                    }).fire();
                    helper.showToast(component, event, helper, 'Error', 'something goes wrong', 'error');
                }

            });
            $A.enqueueAction(action);
            
            var a = component.get('c.doCancel');
            $A.enqueueAction(a);
        }else{
            console.log('Create New Budget Line');
            var recId = component.get("v.recordId");
            var action = component.get("c.CreateLineAddInvoice");
            action.setParams({
                selectedInvoices: selectedInvoiceList,
                RecId: recId
            });
            action.setCallback(this, function (result) {
                $A.get("e.c:BT_SpinnerEvent").setParams({
                    "action": "HIDE"
                }).fire();
                var state = result.getState();
                if (state === "SUCCESS") {
                    component.set('v.selectedRecs',[]);
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        type: 'SUCCESS',
                        message: 'Invoice added Successfully',
                        duration: '5000',
                    });
                    toastEvent.fire();
    
                    var action1 = component.get("c.doInit");
                    $A.enqueueAction(action1);
                } else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        type: 'ERROR',
                        message: 'Something Went Wrong',
                        duration: '5000',
                    });
                    toastEvent.fire();
                }
                component.set("v.addinvsection", false);
                var a = component.get('c.doCancel');
                $A.enqueueAction(a);
            });
            $A.enqueueAction(action);
            
        }
    },
    updateBudgetLine: function(component, event, helper) {
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();

        var selectedTimeCardRecords = component.get("v.recordList");        
        let selectedTimeCardList=[];
        selectedTimeCardRecords.forEach(element => {
            if (element.Selected) {
                selectedTimeCardList.push(element);
            }
        });
        console.log({selectedTimeCardList});

        var timeCardId = component.get("v.selectedExistingTC");
        timeCardId = timeCardId.toString();
        var selectedRecords = component.get('v.selectedRecs');
        if (selectedRecords.length > 0) {

            selectedRecords = selectedRecords.toString();
            var action = component.get("c.updateLaborPrice");
            action.setParams({
                recordId : timeCardId,
                budgeLineIds : selectedRecords
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                var result = response.getReturnValue();
                console.log(state , ':::::::::::::::::STATE::::::::::::');
                console.log(response.getReturnValue());
                if (result === 'Success') {
                    $A.get("e.c:BT_SpinnerEvent").setParams({
                        "action": "HIDE"
                    }).fire();
                    helper.showToast(component, event, helper, 'Success', 'Labor Price updated successfully', 'success');
                }else if (result === 'null'){
                    $A.get("e.c:BT_SpinnerEvent").setParams({
                        "action": "HIDE"
                    }).fire();
                    helper.showToast(component, event, helper, 'Error', 'Please Select Time Card', 'error');
                }
                else{
                    $A.get("e.c:BT_SpinnerEvent").setParams({
                        "action": "HIDE"
                    }).fire();
                    helper.showToast(component, event, helper, 'Error', 'something goes wrong', 'error');
                }
                console.log('selectedRecords --> ',{selectedRecords});
            });
            $A.enqueueAction(action);
            
            var a = component.get('c.doCancel');
            $A.enqueueAction(a);
        }else{
            console.log('Create New Budget Line');
            var recId = component.get("v.recordId");
            var action = component.get("c.CreateLineAddLabor");
            action.setParams({
                selectedTimeCard: selectedTimeCardList,
                RecId: recId
            });
            action.setCallback(this, function (result) {
                $A.get("e.c:BT_SpinnerEvent").setParams({
                    "action": "HIDE"
                }).fire();
                var state = result.getState();
                if (state === "SUCCESS") {
                    component.set('v.selectedRecs',[]);
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        type: 'SUCCESS',
                        message: 'Labor added Successfully',
                        duration: '5000',
                    });
                    toastEvent.fire();
    
                    var action1 = component.get("c.doInit");
                    $A.enqueueAction(action1);
                } else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        type: 'ERROR',
                        message: 'Something Went Wrong',
                        duration: '5000',
                    });
                    toastEvent.fire();
                }
            component.set("v.addtcsection", false);
                var a = component.get('c.doCancel');
                $A.enqueueAction(a);
            });
            $A.enqueueAction(action);


        }
    },

    newPO: function(component, event, helper) {
        var selectedRecs = component.get('v.selectedRecs');
        if (selectedRecs.length > 0) {
            var BudgetIds = [];
            var rowData;
            var newPOItems = [];

            var budgetlineid = BudgetIds[0];
            console.log({budgetlineid});
            var action=component.get("c.BudgetItemList");
            action.setParams({
                BudgetIds: selectedRecs
            });
            action.setCallback(this, function(response) {
                if (component.isValid() && response.getState() === "SUCCESS") {

                    for (var i = 0; i < response.getReturnValue().length; i++) {

                        rowData = response.getReturnValue()[i];
                        console.log({rowData});
                        var newPOItem = new Object();
                        newPOItem.Name = rowData.Name;
                        newPOItem.buildertek__Product__c = rowData.buildertek__Product__c;
                        newPOItem.buildertek__Budget_Item__c = rowData.Id;
                        newPOItem.buildertek__Description__c = rowData.Name; //rowData.buildertek__Description__c;
                        newPOItem.buildertek__Quantity__c = rowData.buildertek__Quantity__c;
                        newPOItem.buildertek__Unit_Price__c = rowData.buildertek__Unit_Price__c;
                        newPOItems.push(newPOItem);
                        console.log({newPOItems});

                    }

                    var isExisting = component.get("v.isExistingPo");
                    console.log({isExisting});
                    if (!isExisting) {
                        var PO = component.get("v.newPO");
                        PO.buildertek__Budget__c = component.get("v.sampleNewRecord").Id;
                        PO.buildertek__Project__c = component.get("v.sampleNewRecord").buildertek__Project__c;
                        PO.buildertek__Status__c = 'Pending';
                    }


                    var overlayLib;
                    if (isExisting) {

                        let getExistPoList=component.get("v.selectedExistingPO");
                        console.log({getExistPoList});
                        if (getExistPoList.length > 0) {
                            component.set("v.isExistingPo", false);
                            component.set("v.addposection", false);
                            selectedRecs.forEach(function(value , i){
                                console.log(i, '====selected Budget Lines');
                                getExistPoList.forEach(function(element , Index){
                                    console.log('Craete Component :::::' , Index);
                                    $A.createComponents([
                                        ["c:BT_New_Purchase_Order", {
                                            "aura:id": "btNewPo",
                                            "newPOItems": newPOItems,
                                            "selectedPO":element,
                                            "isFromExistingPOs": isExisting,
                                            "budgetlineid": budgetlineid,
                                            "saveCallback": component.get("v.refreshGridAction"),
                                            "selectedbudgetRecs": value,
                                            "cancelCallback": function() {
                                                // component.set("v.selectedExistingPO", "");
                                            }
                                        }],
                                    ],
                                    function(components, status, errorMessage) {
                                        if (status === "SUCCESS") {
                                            $A.get('e.force:refreshView').fire();
                                            
                                        }
    
                                    }
                                );
    
                                })

                            })
                            
                           

                        } else {
                            component.set("v.addposection", true);
                            component.find('notifLib').showNotice({
                                "variant": "error",
                                "header": "Select Purchase Order",
                                "message": "Please Select a Purchase Order.",
                                closeCallback: function() {}
                            });
                        }
                    } else {
                        $A.createComponents([
                                ["c:BT_New_Purchase_Order", {
                                    "aura:id": "btNewPo",
                                    "newPO": PO,
                                    "newPOItems": newPOItems,
                                    "selectedPO": component.get("v.selectedExistingPO"),
                                    "isFromExistingPOs": isExisting,
                                    "budgetlineid": budgetlineid,
                                    "saveCallback": component.get("v.refreshGridAction"),
                                    "cancelCallback": function() {
                                        overlayLib.close();
                                    }
                                }],
                            ],
                            function(components, status, errorMessage) {
                                if (status === "SUCCESS") {

                                    $A.get('e.force:refreshView').fire();
                                    component.find('overlayLib').showCustomModal({
                                        header: "New Purchase Order",
                                        body: components[0],
                                        footer: components[0].find("footer").get("v.body"),
                                        showCloseButton: true,
                                        cssClass: "btmodal",
                                        closeCallback: function() {}
                                    }).then(function(overlay) {
                                        overlayLib = overlay;
                                    });
                                    $A.get('e.force:refreshView').fire();
                                }

                            }
                        );
                    }
                }
            });
            $A.enqueueAction(action);

           
        } else {
            component.find('notifLib').showNotice({
                "variant": "error",
                "header": "Select Budget Line",
                "message": "Please Select at least One Budget Line to Create PO.",
                closeCallback: function() {}
            });
            $A.get('e.force:refreshView').fire();

        }
    },

    newExpense: function(component, event, helper) {
        component.set("v.isNewExpense", true);
        component.set("v.budgetItemId", '');
        var budgetId = component.get("v.sampleNewRecord").Id;
        var selectedRecs = component.get('v.selectedRecs');
        // alert(selectedRecs);
        component.set("v.expensebudget", budgetId);
        //  alert(budgetId);
        if (selectedRecs.length > 0) {
            if (selectedRecs.length > 0) {
                var budgetitemId = selectedRecs[0];
                component.set('v.budgetItemId', budgetitemId);
                component.set('v.isExpenseUpdate', true);
                component.set("v.addExpenseSection", false);
            } else {
                component.set('v.isExpenseUpdate', false);
            }
        }
        helper.getBudgetLine(component, event, helper);
    },
    submitForm: function(component, event, helper) {
        var expenseDescription = component.get("v.expenseDescription");
        var expenseType = component.get("v.expenseType");
        var expensePaymentMethod = component.get("v.expensePaymentMethod");
        var expenseAmount = component.get("v.expenseAmount");
        var action = component.get("c.duplicateExpense");
        action.setParams({
            "expenseDescription": expenseDescription,
            "expenseType": expenseType,
            "expensePaymentMethod": expensePaymentMethod,
            "expenseAmount": expenseAmount,
        });
        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var result = response.getReturnValue();
                // alert(JSON.stringify(result));
                if (result == 'DuplicateExpense') {
                    component.set("v.duplicateExp", true);
                    component.set("v.isNewExpense", false);
                } else {
                    component.set('v.isLoading', true);
                    helper.doSave(component, event, helper);
                    $A.get('e.force:refreshView').fire();
                }
            }
        });
        $A.enqueueAction(action);
    },
    doSave: function(component, event, helper) {
        helper.doSave(component, event, helper);
        $A.get('e.force:refreshView').fire();
        component.set("v.budgetItemId", null);
    },

    

    newInvoice: function(component, event, helper) {
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();
        var selectedRecs = component.get('v.selectedRecs');
        helper.fetchInvoiceRecordType(component, event, helper);
        if (selectedRecs.length > 0 ) {
            var action = component.get("c.checkforBidgetItem");
            action.setParams({
                "BudgetIds": selectedRecs
            });
            action.setCallback(this, function(response) {
                if (response.getState() === "SUCCESS") {
                    var result = response.getReturnValue();
                    if (result.length > 0) {
                        console.log("result__>",{result});
                        var budgetline = '';
                        //run a loop on the result and append the name from the result to the budgetline variable
                        for (var i = 0; i < result.length; i++) {
                            budgetline += result[i].Name + ', ';
                        }
                        budgetline = budgetline.slice(0, -2);
                        console.log(budgetline);
                        $A.get("e.c:BT_SpinnerEvent").setParams({
                            "action": "HIDE"
                        }).fire();
                        component.find('notifLib').showNotice({
                            "variant": "error",
                            "header": "The selected Budget Line(s) have already been invoiced. Please select another Budget Line(s).",
                            "message": "Budget Line: " + budgetline ,
                            closeCallback: function() {}
                        });
                    }
                    else {
                        var rowData;
                        var newInvoiceItems = [];
                        var budgetlineid = selectedRecs[0];
                        var action;
                        action = component.get("c.BudgetItemList");
                        action.setParams({
                            BudgetIds: selectedRecs
                        });
                        action.setCallback(this, function(response) {
                            if (component.isValid() && response.getState() === "SUCCESS") {
                                for (var i = 0; i < response.getReturnValue().length; i++) {
                                    rowData = response.getReturnValue()[i];
                                    if (rowData.buildertek__Unit_Price__c == null) {
                                        rowData.buildertek__Unit_Price__c = 0;
                                    }
                                    var newInvoiceItem = new Object();
                                    newInvoiceItem.Name = rowData.Name;
                                    newInvoiceItem.buildertek__Item_Title__c = rowData.Name;
                                    newInvoiceItem.buildertek__Product__c = rowData.buildertek__Product__c;
                                    newInvoiceItem.buildertek__Budget_Line__c = rowData.Id;
                                    newInvoiceItem.buildertek__Description__c = rowData.Name;
                                    newInvoiceItem.buildertek__Quantity__c = rowData.buildertek__Quantity__c;
                                    newInvoiceItem.buildertek__Unit_Price__c = rowData.buildertek__Unit_Price__c;
                                    newInvoiceItems.push(newInvoiceItem);
                                }
                                // component.set("v.selectedCol", []);
                                var Invoice = component.get("v.newInvoice1");
                                Invoice.buildertek__Budget__c = component.get("v.sampleNewRecord").Id;
                                Invoice.buildertek__Project__c = component.get("v.sampleNewRecord").buildertek__Project__c;
                                //Invoice.buildertek__Purchase_Order__c = "a1W1K000003mQzWUAU";
                                //Invoice.RecordTypeId = component.get("v.InvoiceCustomerRecordType"); 
                                var overlayLib;
                                $A.get("e.c:BT_SpinnerEvent").setParams({
                                    "action": "HIDE"
                                }).fire();

                                $A.createComponents([
                                        ["c:BT_New_Invoice", {
                                            "aura:id": "btNewco",
                                            "newCO": Invoice,
                                            "newCOItems": newInvoiceItems,
                                            //"budgetId" : component.get("v.recordId"),
                                            "budgetlineid": budgetlineid,
                                            "saveCallback": component.get("v.refreshGridAction"),
                                            "cancelCallback": function() {
                                                overlayLib.close();
                                            }
                                        }],
                                    ],
                                    function(components, status, errorMessage) {
                                        if (status === "SUCCESS") {
                                            component.find('overlayLib').showCustomModal({
                                                header: "New Invoice",
                                                body: components[0],
                                                footer: components[0].find("footer").get("v.body"),
                                                showCloseButton: true,
                                                cssClass: 'slds-modal_medium',
                                                closeCallback: function() {

                                                }
                                            }).then(function(overlay) {
                                                overlayLib = overlay;
                                            });
                                        }
                                    }
                                );
                            }
                        });
                        $A.enqueueAction(action);
                    }
                }
            });
            $A.enqueueAction(action);
        } else {
            $A.get("e.c:BT_SpinnerEvent").setParams({
                "action": "HIDE"
            }).fire();
            component.find('notifLib').showNotice({
                "variant": "error",
                "header": "Select Budget Line",
                "message": "In order to create Invoice, you need to select at least one Budget Line.",
                //"header": "No Budget Lines",
                //"message": "No Budget Lines Records.",
                closeCallback: function() {}
            });
        }
    },

    newInvoiceAR: function(component, event, helper) {
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();
        console.log('In AR');
        var selectedRecs = component.get('v.selectedRecs');
        // helper.fetchInvoiceRecordType(component, event, helper);
        console.log('selectedRecs--->>>',{selectedRecs});
        if (selectedRecs.length > 0 ) {
            var action = component.get("c.checkforBidgetItemAR");
            action.setParams({
                "BudgetIds": selectedRecs
            });
            action.setCallback(this, function(response) {
                if (response.getState() === "SUCCESS") {
                    var result = response.getReturnValue();
                    if (result.length > 0) {
                        console.log("result__>",{result});
                        var budgetline = '';
                        //run a loop on the result and append the name from the result to the budgetline variable
                        for (var i = 0; i < result.length; i++) {
                            budgetline += result[i].Name + ', ';
                        }
                        budgetline = budgetline.slice(0, -2);
                        console.log(budgetline);
                        $A.get("e.c:BT_SpinnerEvent").setParams({
                            "action": "HIDE"
                        }).fire();
                        component.find('notifLib').showNotice({
                            "variant": "error",
                            "header": "The selected Budget Line(s) have already been invoiced. Please select another Budget Line(s).",
                            "message": "Budeget Lines : " + budgetline ,
                            closeCallback: function() {}
                        });
                    }
                    else {
                        console.log('In Else');
                        var rowData;
                        var newInvoiceItems = [];

                        var budgetlineid = selectedRecs[0];
                        var action;
                        action = component.get("c.BudgetItemList");
                        action.setParams({
                            BudgetIds: selectedRecs
                        });
                        action.setCallback(this, function(response) {
                            if (component.isValid() && response.getState() === "SUCCESS") {
                                console.log('IF--->>>');
                                for (var i = 0; i < response.getReturnValue().length; i++) {
                                    rowData = response.getReturnValue()[i];
                                    if (rowData.buildertek__Sales_Price__c == null) {
                                        rowData.buildertek__Sales_Price__c = 0;
                                    }
                                    var newInvoiceItem = new Object();
                                    newInvoiceItem.Name = rowData.Name;
                                    newInvoiceItem.buildertek__Item_Title__c = rowData.Name;
                                    newInvoiceItem.buildertek__Product__c = rowData.buildertek__Product__c;
                                    newInvoiceItem.buildertek__Budget_Line__c = rowData.Id;
                                    newInvoiceItem.buildertek__Description__c = rowData.Name;
                                    newInvoiceItem.buildertek__Quantity__c = rowData.buildertek__Quantity__c;
                                    newInvoiceItem.buildertek__Unit_Price__c = rowData.buildertek__Sales_Price__c;
                                    newInvoiceItems.push(newInvoiceItem);
                                }
                                var Invoice = component.get("v.newInvoiceAR");
                                Invoice.buildertek__Budget__c = component.get("v.sampleNewRecord").Id;
                                Invoice.buildertek__Project__c = component.get("v.sampleNewRecord").buildertek__Project__c;
                                var overlayLib;
                                console.log('=====');
                                $A.get("e.c:BT_SpinnerEvent").setParams({
                                    "action": "HIDE"
                                }).fire();
                                $A.createComponents([
                                        ["c:BT_New_InvoiceAR", {
                                            "aura:id": "btNewco",
                                            "newCO": Invoice,
                                            "newCOItems": newInvoiceItems,
                                            "budgetlineid": budgetlineid,
                                            "saveCallback": component.get("v.refreshGridAction"),
                                            "cancelCallback": function() {
                                                overlayLib.close();
                                            }
                                        }],
                                    ],
                                    function(components, status, errorMessage) {
                                        if (status === "SUCCESS") {
                                            component.find('overlayLib').showCustomModal({
                                                header: "New Invoice (AR)",
                                                body: components[0],
                                                footer: components[0].find("footer").get("v.body"),
                                                showCloseButton: true,
                                                cssClass: 'slds-modal_medium',
                                                closeCallback: function() {

                                                }
                                            }).then(function(overlay) {
                                                overlayLib = overlay;
                                            });
                                        }
                                    }
                                );
                            }
                        });
                        $A.enqueueAction(action);
                    }
                }
            });
            $A.enqueueAction(action);
        } else {
            $A.get("e.c:BT_SpinnerEvent").setParams({
                "action": "HIDE"
            }).fire();
            component.find('notifLib').showNotice({
                "variant": "error",
                "header": "Select Budget Line",
                "message": "In order to create Invoice, you need to select at least one Budget Line.",
                closeCallback: function() {}
            });
        }
    },

    /*doSave: function (component, event, helper) {
    	debugger;
    	$A.get("e.c:BT_SpinnerEvent").setParams({
    		"action": "SHOW"
    	}).fire();
    	component.set("v.isNewExpense", false);
    	var expenseDescription = component.get("v.expenseDescription");
    	var expensebudget = component.get("v.expensebudget");
    	var expenseType = component.get("v.expenseType");
    	var expenseCostCode = component.get("v.expenseCostCode");
    	var expensePaymentMethod = component.get("v.expensePaymentMethod");
    	var expenseRefNo = component.get("v.expenseRefNo");
    	var expenseAmount = component.get("v.expenseAmount");
    	var expenseNote = component.get("v.expenseNote");
    	var isExpenseUpdate = component.get("v.isExpenseUpdate");
    	var budgetItemId = component.get("v.budgetItemId");
    	//Update Expense  
    	if (budgetItemId != undefined && isExpenseUpdate) {
    		var action = component.get("c.updateBudgetItemFromExpenseItem");
    		action.setParams({
    			"expenseDescription": expenseDescription,
    			"expensebudgetId": expensebudget,
    			"expenseType": expenseType,
    			"expenseCostCode": expenseCostCode,
    			"expensePaymentMethod": expensePaymentMethod,
    			"expenseRefNo": expenseRefNo,
    			"expenseAmount": expenseAmount,
    			"expenseNote": expenseNote,
    			"projectId": component.get("v.sampleNewRecord").buildertek__Project__c,
    			'budgetItemId': budgetItemId
    		});
    		action.setCallback(this, function (response) {
    			if (response.getState() === "SUCCESS") {
    				$A.get("e.c:BT_SpinnerEvent").setParams({
    					"action": "HIDE"
    				}).fire();
    				$A.getCallback(function () {
    					var toastEvent = $A.get("e.force:showToast");
    					toastEvent.setParams({
    						mode: 'sticky',
    						message: 'Budget Line created successfully',
    						type: 'success',
    						duration: '10000',
    						mode: 'dismissible'
    					});
    					toastEvent.fire();
    				});
    				$A.get('e.force:refreshView').fire();
    				component.refreshData();
    				component.set("v.expenseDescription", null);
    				component.set("v.expensebudget", null);
    				component.set("v.expenseType", null);
    				component.set("v.expenseCostCode", null);
    				component.set("v.expensePaymentMethod", null);
    				component.set("v.expenseRefNo", null);
    				component.set("v.expenseAmount", null);
    				component.set("v.expenseNote", null);
    			} else if (response.getState() === "ERROR") {
    				let errors = response.getError();
    				let message = 'Unknown error'; // Default error message
    				// Retrieve the error message sent by the server
    				if (errors && Array.isArray(errors) && errors.length > 0) {
    					message = errors[0].message;
    				}
    				// Display the message
    				console.error(message);
    				$A.getCallback(function () {
    					var toastEvent = $A.get("e.force:showToast");
    					toastEvent.setParams({
    						mode: 'sticky',
    						message: 'Budget Line not created',
    						type: 'ERROR',
    						duration: '10000',
    						mode: 'dismissible'
    					});
    					toastEvent.fire();
    				});
    				$A.get('e.force:refreshView').fire();
    			}
    		});
    		$A.enqueueAction(action);
    	} else {
    		// alert('hello');
    		var action = component.get("c.createBudgetItemFromExpenseItem");
    		action.setParams({
    			"expenseDescription": expenseDescription,
    			"expensebudgetId": expensebudget,
    			"expenseType": expenseType,
    			"expenseCostCode": expenseCostCode,
    			"expensePaymentMethod": expensePaymentMethod,
    			"expenseRefNo": expenseRefNo,
    			"expenseAmount": expenseAmount,
    			"expenseNote": expenseNote,
    			"projectId": component.get("v.sampleNewRecord").buildertek__Project__c
    		});
    		action.setCallback(this, function (response) {
    			if (response.getState() === "SUCCESS") {
    				$A.get("e.c:BT_SpinnerEvent").setParams({
    					"action": "HIDE"
    				}).fire();
    				$A.getCallback(function () {
    					var toastEvent = $A.get("e.force:showToast");
    					toastEvent.setParams({
    						mode: 'sticky',
    						message: 'Budget Line created successfully',
    						type: 'success',
    						duration: '10000',
    						mode: 'dismissible'
    					});
    					toastEvent.fire();
    				});
    				$A.get('e.force:refreshView').fire();
    				component.refreshData();
    				component.set("v.expenseDescription", null);
    				component.set("v.expensebudget", null);
    				component.set("v.expenseType", null);
    				component.set("v.expenseCostCode", null);
    				component.set("v.expensePaymentMethod", null);
    				component.set("v.expenseRefNo", null);
    				component.set("v.expenseAmount", null);
    				component.set("v.expenseNote", null);
    			} else if (response.getState() === "ERROR") {
    				let errors = response.getError();
    				let message = 'Unknown error'; // Default error message
    				// Retrieve the error message sent by the server
    				if (errors && Array.isArray(errors) && errors.length > 0) {
    					message = errors[0].message;
    				}
    				// Display the message
    				console.error(message);
    				$A.getCallback(function () {
    					var toastEvent = $A.get("e.force:showToast");
    					toastEvent.setParams({
    						mode: 'sticky',
    						message: 'Budget Line not created',
    						type: 'ERROR',
    						duration: '10000',
    						mode: 'dismissible'
    					});
    					toastEvent.fire();
    				});
    				$A.get('e.force:refreshView').fire();
    			}
    		});
    		$A.enqueueAction(action);
    	}

    },*/
    doCancel: function(component, event, helper) {
        component.set("v.selectedExistingPO", "");
        component.set("v.selectedExistingTC", "");
        component.set("v.selectedExistingINVO", "");
        component.set("v.isExistingPo", false);
        component.set("v.isExistingTc", false);
        component.set("v.isExistingInvo", false);
        component.set("v.addposection", false);
        component.set("v.addtcsection", false);
        component.set("v.addinvsection", false);
        component.set("v.addcosection", false);
        component.set("v.addExpenseSection", false);

        component.set("v.showSelectSchedule", false);
        component.set("v.isNewExpense", false);
        component.set("v.duplicateExp", false);
        component.set("v.createNewSchedule", false);
        component.set("v.showSelectSchedule", false);

        component.set("v.expenseDescription", null);
        component.set("v.expensebudget", null);
        component.set("v.expenseType", null);
        component.set("v.expenseCostCode", null);
        component.set("v.expensePaymentMethod", null);
        component.set("v.expenseRefNo", null);
        component.set("v.expenseAmount", null);
        component.set("v.expenseNote", null);
        component.set('v.budgetItemId', '');

        $A.get('e.force:refreshView').fire();
    },
    importCSV: function(component, event, helper) {

    },

    refreshList: function(component, event, helper) {
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();
        //$A.enqueueAction(component.get('c.doInit'));
        var page = component.get("v.page") || 1;
        component.set("v.TotalRecords", {});
        component.set('v.selectedRecs', []);
        component.set("v.selectedScheduleRecords", []);
        component.set("v.isCreateNewSchedule", false);
        component.set("v.selectedExistingPO", "");
        component.set("v.selectedExistingTC", "");
        component.set("v.selectedExistingINVO", "");
        component.set("v.isExistingPo", false);
        component.set("v.isExistingTc", false);
        component.set("v.isExistingInvo", false);
        
        component.set("v.addposection", false);
        component.set("v.addtcsection", false);
        component.set("v.addinvsection", false);
        component.set("v.addcosection", false);
        component.set("v.addExpenseSection", false);


        // $A.get('e.force:refreshView').fire();

        helper.getBudgetGroups(component, event, helper, page , function(){});
    },
    onSaveSuccess: function(component, event, helper) {
        if (event) {
            if (event.getParams().message && event.getParams().message.indexOf('Budget Item') != -1 && event.getParams().message.indexOf('was saved') != -1) {
                $A.get("e.c:BT_SpinnerEvent").setParams({
                    "action": "SHOW"
                }).fire();
                //$A.enqueueAction(component.get('c.doInit'));
                var page = component.get("v.page") || 1
                component.set("v.TotalRecords", {});
                component.set('v.selectedRecs', []);
                helper.getBudgetGroups(component, event, helper, page , function(){});
            }
        }
    },

    /*saveBudgetItemRecord: function (component, event, helper) {

$A.get("e.c:BT_SpinnerEvent").setParams({"action" : "SHOW" }).fire();
//console.log("######## on change Save Budget Record############");
var budgetLineObject = component.get("v.newBudgetLine");
//console.log("##### Budget Line Object "+JSON.stringify(budgetLineObject));
var action = component.get("c.saveBudgetLineItem");
action.setParams({"budgetLineRecord":budgetLineObject});
action.setCallback(this,function(respo){
if (component.isValid() && respo.getState() === "SUCCESS") {
var toastEvent = $A.get("e.force:showToast");
toastEvent.setParams({
"title": "",
"message": "Budget Line Added succesfully.",
"type": "success"
});
//$A.enqueueAction(component.get('c.doInit'));
$A.get("e.c:BT_SpinnerEvent").setParams({"action" : "HIDE" }).fire();
}
});
$A.enqueueAction(action);
},	
handleComponentEvent : function(component, event, helper) {
// get the selected Account record from the COMPONETN event 	 
var selectedAccountGetFromEvent = event.getParam("recordByEvent");
//console.log("##################################record By Event",JSON.stringify(selectedAccountGetFromEvent)); 
component.set("v.productId",selectedAccountGetFromEvent.Id);
component.set("v.productName",selectedAccountGetFromEvent.Name);
helper.getProductDetails(component,event,helper);
},*/


    newGroup: function(component, event, helper) {
        $A.createComponents(
            [
                ["aura:html", {
                    "tag": "h2",
                    "body": "New Budget Group",
                    "HTMLAttributes": {
                        "class": "slds-text-heading_medium slds-hyphenate"
                    }
                }],
                ["c:BT_NewBudgetGroup", {
                    "budgetId": component.get("v.recordId"),
                    "onSuccess": function() {
                        var page = component.get("v.page") || 1
                        component.set("v.TotalRecords", {});
                        helper.getBudgetGroups(component, event, helper, page , function(){});
                    }
                }],

            ],
            function(components, status) {
                if (status === 'SUCCESS') {
                    component.find('overlayLib').showCustomModal({
                        header: components[0],
                        body: components[1],
                        footer: components[1].find("footer"),
                        showCloseButton: true,
                        cssClass: 'slds-modal_large'
                    });

                }
            });
    },

    saveBudgetItemRecord: function(component, event, helper) {
        //alert("hi");
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();
        var recordId = component.get("v.recordId");
        component.set("v.newBudgetLine.buildertek__Budget__c", recordId);
        //alert('Budget --> '+component.get("v.newBudgetLine.buildertek__Product__c"));
        var uom = component.get("v.UOMvalues");
        component.set("v.newBudgetLine.buildertek__UOM__c", uom);
        var budgetLineObject = component.get("v.newBudgetLine");

        var tradeType;
        var contractor;
        /*  Comment by Laxman 08-07-2020
        var selectedTradetype = component.get("v.selectedTradeType");
        if (selectedTradetype != undefined) {
        	tradeType = selectedTradetype.Id;
        } else {
        	tradeType = null;
        } */
        console.log('=============================================================');
        console.log('Sub Group::', JSON.stringify(budgetLineObject));
        var selectedContractor = component.get("v.selectedContractor");
        if (selectedContractor != undefined) {
            contractor = selectedContractor.Id;
        } else {
            contractor = null;
        }

        /*var selectedCostcode = component.get("v.selectedCostcode");
		if (selectedCostcode != undefined) {
			contractors = selectedCostcode.Id;
		} else {
			contractors = null;
		}*/

        // If we want tarade type value we have to pass parameter like "tradeType:tradeType"
        var action = component.get("c.saveBudgetLineItem");
        action.setParams({
            "budgetLineRecord": JSON.stringify(budgetLineObject),
            recordId: recordId,
            contractor: contractor,

        });
        action.setCallback(this, function(respo) {
            if (component.isValid() && respo.getState() === "SUCCESS") {
                //  alert(JSON.stringify(respo));
                var url = location.href;
                var baseURL = url.substring(0, url.indexOf('/', 14));
                var result = respo.getReturnValue();
                var group = component.find('costCodeId');
                group.set("v._text_value", '');
                var costCode = component.find('groupId');
                costCode.set("v._text_value", '');
                var product = component.get('v.selectedLookUpRecord');
                var compEvent = $A.get('e.c:BT_CLearLightningLookupEvent');
                compEvent.setParams({
                    "recordByEvent": product
                });
                compEvent.fire();
                component.set('v.newBudgetLine.Name', '');
                //component.set('v.selectedContractor', null);
                component.set('v.selectedContractor', null);
                component.set('v.newBudgetLine.buildertek__Group__c', '');
                component.set('v.newBudgetLine.buildertek__Sub_Grouping__c', null);
                component.set('v.newBudgetLine.buildertek__UOM__c', '');
                component.set('v.newBudgetLine.buildertek__Notes__c', '');
                component.set('v.newBudgetLine.buildertek__Unit_Price__c', '');
                component.set('v.newBudgetLine.buildertek__Quantity__c', '1');
                component.set('v.newBudgetLine.buildertek__Sales_Price__c', '');
                component.set('v.newBudgetLine.buildertek__Cost_Code__c', '');
                component.set('v.UOMvalues', '');
              //  component.set('v.Notevalues', '');

                $A.enqueueAction(component.get("c.clearLookupValue"));
                $A.get("e.c:BT_SpinnerEvent").setParams({
                    "action": "HIDE"
                }).fire();

                /*$A.get('e.force:refreshView').fire();
                alert('TS');*/
                window.setTimeout(
                    $A.getCallback(function() {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            mode: 'sticky',
                            message: 'Budget Line created successfully',
                            type: 'success',
                            duration: '10000',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                    }), 3000
                );
                //$A.get('e.force:refreshView').fire();
                component.refreshData();
            }
        });
        $A.enqueueAction(action);

    },
    clearLookupValue: function(component, event, helper) {
        var childCmp = component.find("tradeTypeId");
        var retnMsg = childCmp.clearLookup();
        var childCmp = component.find("accountId");
        var retnMsg = childCmp.clearLookup();
    },
    handleComponentEvent: function(component, event, helper) {
        // get the selected Account record from the COMPONETN event 	 
        var selectedAccountGetFromEvent = event.getParam("recordByEvent");
        component.set("v.productId", selectedAccountGetFromEvent.Id);
        component.set("v.productName", selectedAccountGetFromEvent.Name);
        helper.getProductDetails(component, event, helper);
        helper.getUOMValues(component, event, helper);
    },

    /*handleEvent  : function(component, event, helper){
var message = event.getParam("message");
var toastEvent = $A.get("e.force:showToast");
toastEvent.setParams({
"title": "",
"message": message,
"type": "success"
});
component.refreshData();
$A.get("e.c:BT_SpinnerEvent").setParams({"action" : "HIDE" }).fire();
},*/


    editBudget: function(component, event, helper) {
        var recordId = event.currentTarget.dataset.id;
        var editRecordEvent = $A.get("e.force:editRecord");
        editRecordEvent.setParams({
            "recordId": recordId
        });
        editRecordEvent.fire();
    },

    deleteBudget: function(component, event, helper) {
        component.set("v.isOpen", true);
        var recordId = event.currentTarget.dataset.id;
        component.set("v.quoteItemId", recordId);
    },

    removegrouping: function(component, event, helper) {
        component.set("v.isremovegroup", true);
        var groupingrecordId = event.currentTarget.dataset.id;
        component.set("v.groupingid", groupingrecordId);
        component.set("v.budgetrecid", component.get("v.recordId"));
    },

    handleSelectAll: function(component, event, helper) {
        helper.handleSelectAll(component, event, helper);

    },

    addProductAtParentGroup: function(component, event, helper) {

    },

    closeAddProductFromGroup: function(component, event, helper) {

    },

    addProductAtChildGroup: function(component, event, helper) {

    },

    deleteSelectedBudgetItem: function(component, event, helper) {
        var selectedRecs = component.get('v.selectedRecs');
        console.log('selected:id', selectedRecs);
        if (component.get('v.selectedRecs') != undefined) {
            // $A.get("e.c:BT_SpinnerEvent").setParams({
            //     "action": "SHOW"
            // }).fire();
            var BudgetIds = component.get('v.selectedRecs');
            var rowData;
            var newRFQItems = [];
            var delId = [];
            /*var getAllId = component.find("checkQuoteItem");
            if (!Array.isArray(getAllId)) {
            	if (getAllId.get("v.value") == true) {
            		BudgetIds.push(getAllId.get("v.text"));
            	}
            } else {
            	for (var i = 0; i < getAllId.length; i++) {
            		if (getAllId[i].get("v.value") == true) {
            			BudgetIds.push(getAllId[i].get("v.text"));
            		}
            	}
            }*/
            if (BudgetIds.length > 0) {
                component.set("v.BudgetlinePopupHeader", "Delete Budget Lines");
                component.set("v.BudgetlinePopupDescription", "Are you sure you want to delete Budget Lines?");
                component.set("v.isBudgetlinedelete", true);
                component.set("v.isSelectAll", false);
                /* var action = component.get('c.deleteSelectedItems');
			action.setParams({
				"recordIds": BudgetIds
			});
			action.setCallback(this, function (response) {
				var state = response.getState();
				if (state === "SUCCESS") {
					$A.get("e.force:refreshView").fire();
					//$A.get("e.c:BT_SpinnerEvent").setParams({"action" : "HIDE" }).fire(); 
					window.setTimeout(
						$A.getCallback(function () {
							var toastEvent = $A.get("e.force:showToast");
							toastEvent.setParams({
								mode: 'sticky',
								message: 'Selected Budget Lines was deleted',
								type: 'success',
								duration: '10000',
								mode: 'dismissible'
							});
							toastEvent.fire();
						}), 3000
					);
					 window.setTimeout(
                        $A.getCallback(function() {
                            document.location.reload(true);    
                        }), 4000
                    ); 
					
				}
			});
			$A.enqueueAction(action); */
            } else {
                component.find('notifLib').showNotice({
                    "variant": "error",
                    "header": " Select Budget Line",
                    "message": "Please select the Budget Line you would like to Delete.",
                    closeCallback: function() {
                        $A.get("e.c:BT_SpinnerEvent").setParams({
                            "action": "HIDE"
                        }).fire();
                    }
                });
            }
        }
    },
    createnewbudgetlinegroup: function(component, event, helper) {

        // var budgetlinegroup = JSON.stringify(component.get("v.newbudgetgrouprec"));
        var groupName = component.find('gpnameid').get("v.value");
        var groupdescrption = component.find('gpdescid').get("v.value");
        //alert('groupName---' + groupName);
        if (groupName != undefined && groupName != null) {
            $A.get("e.c:BT_SpinnerEvent").setParams({
                "action": "SHOW"
            }).fire();
            var action = component.get("c.savenewbudgetlinegroup");
            action.setParams({
                newbudgetllinegroup: groupName,
                newbudgetllinegroupdes: groupdescrption

            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    $A.get("e.c:BT_SpinnerEvent").setParams({
                        "action": "HIDE"
                    }).fire();
                    var result = response.getReturnValue();
                    //alert('result' + result);
                    if (result == 'Success') {
                        component.set("v.budgetllinegroupdescription", '');
                        component.set("v.budgetllinegroupName", '');
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            mode: 'sticky',
                            message: 'New Budget Line Group created Successfully ',
                            type: 'success',
                            duration: '1000',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                        //component.set("v.newbudgetgrouprec", '');
                        component.set("v.isnewbudgetgroup", false);

                    } else {
                        //alert('noname')
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            mode: 'sticky',
                            message: 'This name is alredy exist. Please try with another name.',
                            type: 'warning',
                            duration: '1000',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                    }
                }
            });

            $A.enqueueAction(action);
        } else {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                mode: 'sticky',
                message: 'Please enter Name',
                type: 'error',
                duration: '1000',
                mode: 'dismissible'
            });
            toastEvent.fire();
        }

    },


    createNewBudgetSubGroup: function(component, event, helper) {
        var budgetLineSubGroupName = component.find('budgetLineSubGroupName').get("v.value");
        var budgetLineSubGroupDescription = component.find('budgetLineSubGroupDescription').get("v.value");
        if (budgetLineSubGroupName != undefined && budgetLineSubGroupName != null) {
            $A.get("e.c:BT_SpinnerEvent").setParams({
                "action": "SHOW"
            }).fire();
            var action = component.get("c.saveNewBudgetSubGroup");
            action.setParams({
                budgetLineSubGroupName: budgetLineSubGroupName,
                budgetLineSubGroupDescription: budgetLineSubGroupDescription
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    $A.get("e.c:BT_SpinnerEvent").setParams({
                        "action": "HIDE"
                    }).fire();
                    var result = response.getReturnValue();
                    if (result == 'Success') {
                        component.set("v.budgetLineSubGroupDescription", '');
                        component.set("v.budgetLineSubGroupName", '');
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            mode: 'sticky',
                            message: 'New Budget Line Sub Group created Successfully ',
                            type: 'success',
                            duration: '1000',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                        component.set("v.isNewBudgetSubGroup", false);

                    } else {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            mode: 'sticky',
                            message: 'This name is already exist. Please try with another name.',
                            type: 'warning',
                            duration: '1000',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                    }
                }
            });
            $A.enqueueAction(action);
        } else {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                mode: 'sticky',
                message: 'Please enter Name',
                type: 'error',
                duration: '1000',
                mode: 'dismissible'
            });
            toastEvent.fire();
        }
    },

    newbudgetGroup: function(component, event, helper) {
        component.set("v.isnewbudgetgroup", true);
    },

    newBudgetSubGroup: function(component, event, helper) {
        component.set("v.isNewBudgetSubGroup", true);
    },


    newgroupcloseModel: function(component, event, helper) {
        // for Hide/Close Model,set the "new budgetline group" attribute to "Fasle"  

        component.set("v.budgetllinegroupdescription", '');
        component.set("v.budgetllinegroupName", '');
        component.set("v.isnewbudgetgroup", false);
    },

    newGroupBudgetSubGroupClose: function(component, event, helper) {
        component.set("v.budgetLineSubGroupDescription", '');
        component.set("v.budgetLineSubGroupName", '');
        component.set("v.isNewBudgetSubGroup", false);
    },
    closeModel: function(component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        component.set("v.isOpen", false);
    },
    removegroupingcloseModel: function(component, event, helper) {
        // for Hide/Close Model,set the "isremovegroup" attribute to "Fasle"  

        component.set("v.isremovegroup", false);


    },
    closeBudgetlineModel: function(component, event, helper) {
        component.set("v.isBudgetlinedelete", false);
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "HIDE"
        }).fire();
    },
    removegroupingBudgetItems: function(component, event, helper) {
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();
        var action = component.get("c.RemovegroupingBudgetLineItems");
        action.setParams({
            "groupingid": component.get("v.groupingid"),
            "budgetId": component.get("v.budgetrecid")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {

                var result = response.getReturnValue();
                component.set("v.isremovegroup", false);

                window.setTimeout(
                    $A.getCallback(function() {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            mode: 'sticky',
                            message: 'Grouping  was deleted',
                            type: 'success',
                            duration: '1000',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                    }), 2000
                );

                var page = component.get("v.page") || 1
                    //To much loading on deletion problem
                component.set("v.TotalRecords", {});
                helper.getBudgetGroups(component, event, helper, page , function(){});
            }
        });
        $A.enqueueAction(action);
    },
    deleteBudgetItems: function(component, event, helper) {
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();
        var recordId = component.get("v.quoteItemId");
        //alert('recordId ----------> '+recordId);
        var action = component.get("c.deleteBudgetLineItem");
        action.setParams({
            "budgetId": recordId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                component.set("v.isOpen", false);
                window.setTimeout(
                    $A.getCallback(function() {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            mode: 'sticky',
                            message: 'Budget Line was deleted',
                            //messageTemplate: "Budget Line {0} was deleted.",
                            messageTemplateData: [{
                                label: result.Name,
                            }],
                            type: 'success',
                            duration: '10000',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                    }), 3000
                );
                var page = component.get("v.page") || 1
                    //To much loading on deletion problem
                component.set("v.TotalRecords", {});
                helper.getBudgetGroups(component, event, helper, page , function(){});
            }
        });
        $A.enqueueAction(action);
    },

    deleteSelectedBudgetItemlines: function(component, event, helper) {
        var selectedRecs = component.get('v.selectedRecs');
        console.log('selected:id when delete--->>>', selectedRecs);
        if (component.get('v.selectedRecs') != undefined) {
            $A.get("e.c:BT_SpinnerEvent").setParams({
                "action": "SHOW"
            }).fire();
            var BudgetIds = component.get('v.selectedRecs');
            console.log('BudgetIds--->>>',{BudgetIds});
            var rowData;
            var newRFQItems = [];
            var delId = [];
            var getAllId = component.find("checkQuoteItem");
            if (BudgetIds.length > 0) {
                var action = component.get('c.deleteSelectedItems');
                action.setParams({
                    "recordIds": BudgetIds
                });
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        component.set("v.isBudgetlinedelete", false);
                        $A.get("e.force:refreshView").fire();

                        component.refreshData();
                        var noRecord = [];
                        component.set('v.selectedRecs', noRecord);
                        var page = component.get("v.page") || 1
                        component.set("v.TotalRecords", {});
                        helper.getBudgetGroups(component, event, helper, page ,function() {
                            // Callback function to execute after the helper method has finished
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                              mode: 'sticky',
                              message: 'Selected Budget Lines were deleted',
                              type: 'success',
                              duration: '10000',
                              mode: 'dismissible'
                            });
                            toastEvent.fire();
                          });
                    }
                });
                $A.enqueueAction(action);
            } else {
                component.find('notifLib').showNotice({
                    "variant": "error",
                    "header": "Please Select Quote Line!",
                    "message": "Please select the Quote Line you would like to Delete.",
                    closeCallback: function() {
                        $A.get("e.c:BT_SpinnerEvent").setParams({
                            "action": "HIDE"
                        }).fire();
                    }
                });
            }
        }
    },

    inlineEdit: function(component, event, helper) {
        var recordId = event.currentTarget.dataset.id;
        var fieldName = event.currentTarget.dataset.label;
        var groupId = event.currentTarget.dataset.group;
        component.set("v.editedGroupId", groupId);
        component.set("v.quoteItemId", recordId);
        var editMode = component.get("v.isEditMode");
        component.set("v.isEditMode", true);
        component.set("v.fieldName", fieldName);

    },

    onblur: function(component, event, helper) {
        component.set("v.isEditMode", false);

    },

    updateQuoteData: function(component, event, helper) {
        if (!component.get("v.enableMassUpdate")) {
            var recordId = component.get("v.quoteItemId");
            var quoteList = component.get("v.datalist");
            var finString = component.get("v.finalString");
            var delId = {};
            var newId = {};
            if (finString == null) {
                delId = {
                    "Id": recordId
                }
                component.set("v.finalString", delId);
            } else {
                var isVal = 'True';
                for (var k = 0; k < quoteList.length; k++) {
                    if (quoteList[k].Id == recordId) {
                        newId = component.get("v.finalString");
                        isVal = 'false';
                    }
                }
                if (isVal == 'True') {
                    newId = {
                        "Id": recordId
                    };
                    component.set("v.finalString", newId);
                }

            }
            var finString = component.get("v.finalString");

            var flList = [];
            var fieldName = component.get("v.fieldName");
            var getAllId = component.find("inputId");
            var finalList = [];
            if (!Array.isArray(getAllId)) {
                if (getAllId.get("v.value") != null) {
                    if (finString.Id == recordId) {
                        finString[fieldName] = getAllId.get("v.value");
                        quoteList.push(finString);
                    } else {
                        var isValue = 'True';
                        for (var l = 0; l < quoteList.length; l++) {
                            if (quoteList[l].Id == recordId) {
                                newId = quoteList[l];
                                newId[fieldName] = getAllId.get("v.value");
                                quoteList.push(newId);
                                break;
                            }
                        }
                    }
                }
            } else {
                //alert('else');
                for (var i = 0; i < getAllId.length; i++) {
                    if (getAllId[i].get("v.value") != null) {
                        if (finString.Id == recordId) {
                            //alert('if statement');
                            finString[fieldName] = getAllId[i].get("v.value");
                            //alert('finString ------> '+finString);
                            quoteList.push(finString);
                        } else {
                            //alert('else statement -->');
                            newId[fieldName] = getAllId[i].get("v.value");
                            quoteList.push(newId);
                        }
                    }
                }
            }
            //alert('finalList ---------> '+JSON.stringify(quoteList));
            component.set("v.finalList", finalList);
            component.set("v.datalist", quoteList);
            component.set("v.showButtons", true);

            var action = component.get("c.prepareString");
            action.setParams({
                "budgetString": JSON.stringify(quoteList),
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    //console.log('result ---------> '+result);
                    component.set("v.budgetList", result);

                }
            });
            $A.enqueueAction(action);
        } else {
            component.set("v.isChangeData", true);
        }
    },

    closeInlineEditForm: function(component, event, helper) {
        component.set("v.isEditMode", false);
        component.set("v.showButtons", false);
        //$A.enqueueAction(component.get('c.doInit'));
        var page = component.get("v.page") || 1
        component.set("v.TotalRecords", {});
        helper.getBudgetGroups(component, event, helper, page , function(){});
    },
    SaveEditedValues: function(component, event, helper) {
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();
        var recordId = component.get("v.quoteItemId");
        var action = component.get("c.saveUpdatedValues");
        action.setParams({
            "budgetItemList": component.get("v.budgetList")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.isEditMode", false);
                component.set("v.showButtons", false);
                component.set("v.QuoteString", '');
                component.set("v.datalist", []);
                $A.get("e.force:refreshView").fire();
                window.setTimeout(
                    $A.getCallback(function() {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            mode: 'sticky',
                            message: 'Your changes are saved',
                            type: 'success',
                            duration: '10000',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                    }), 3000
                );
                var page = component.get("v.page") || 1
                component.set("v.TotalRecords", {});
                helper.getBudgetGroups(component, event, helper, page , function(){});
            }
        });
        $A.enqueueAction(action);
    },
    //mass Functionality start

    onclickDuplicate: function(component, event, helper) {
        var currentId = event.currentTarget.getAttribute("data-id");
        component.set("v.currentId", currentId);
        component.set("v.isDuplicate", true);
    },
    closeDuplicateModel: function(component, event, helper) {
        // for Hide/Close Model,set the "isDuplicate" attribute to "Fasle"  
        component.set("v.isOpen", false);
        component.set("v.isDuplicate", false);
        component.set("v.isMassDuplicate", false);
        component.set("v.currentId", "");
    },

    duplicateBudget: function(component, event, helper) {
        var budgetid = component.get("v.budgetid");
        var currentId = component.get("v.currentId");
        if (currentId != "" && currentId != undefined) {
            component.set("v.isDuplicate", false);
            $A.get("e.c:BT_SpinnerEvent").setParams({
                "action": "SHOW"
            }).fire();
            var checkvalue = component.find("selectAll");
            var duplicateRecs = [];
            duplicateRecs.push(currentId);
            var action = component.get("c.massDuplicateBudgetLineItem");
            action.setParams({
                "recordid": budgetid,
                "budgetLineRecords": duplicateRecs
            });
            action.setCallback(this, function(respo) {
                console.log('response is : ', respo.getState());
                if (respo.getState() === "SUCCESS") {

                    //checkvalue.set("v.value", false);
                    component.set("v.currentId", "");
                    var projlist = respo.getReturnValue();
                    component.set("v.projectlist", projlist);
                    var fieldValue = component.get("v.projectlist");
                    console.log(JSON.stringify(fieldValue)); // i am getting all the values based on the query.
                    console.log('Value ::::::: ' + fieldValue);
                    $A.get('e.force:refreshView').fire();
                    window.setTimeout(
                        $A.getCallback(function() {
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                mode: 'sticky',
                                message: 'Duplicate records for selected budget items created successfully.',
                                type: 'success',
                                duration: '10000',
                                mode: 'dismissible'
                            });
                            toastEvent.fire();
                        }), 3000
                    );
                    var page = component.get("v.page") || 1
                    component.set("v.TotalRecords", {});
                    helper.getBudgetGroups(component, event, helper, page , function(){});
                }
            });
            $A.enqueueAction(action);
        }
    },

    onMassDuplicate: function(component, event, helper) {
        var duplicateRecs = component.get("v.selectedRecs");
        component.set("v.isMassDuplicate", false);

        if (duplicateRecs.length > 0) {
            $A.get("e.c:BT_SpinnerEvent").setParams({
                "action": "SHOW"
            }).fire();
            var action = component.get("c.massDuplicateBudgetLineItem");
            action.setParams({
                "budgetLineRecords": duplicateRecs
            });
            action.setCallback(this, function(respo) {
                console.log('response is : ', respo.getState());
                if (respo.getState() === "SUCCESS") {
                    component.set("v.selectedRecs", []);
                    $A.get('e.force:refreshView').fire();
                    window.setTimeout(
                        $A.getCallback(function() {
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                mode: 'sticky',
                                message: 'Duplicate records for selected budget items created successfully.',
                                type: 'success',
                                duration: '10000',
                                mode: 'dismissible'
                            });
                            toastEvent.fire();
                        }), 3000
                    );
                    var page = component.get("v.page") || 1
                    component.set("v.TotalRecords", {});
                    component.set("v.selectedRecs", []);
                    helper.getBudgetGroups(component, event, helper, page , function(){});
                }
            });
            $A.enqueueAction(action);
        } else {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                mode: 'sticky',
                message: 'Please select any record.',
                type: 'error',
                duration: '10000',
                mode: 'dismissible'
            });
            toastEvent.fire();
        }
    },

    onClickMassDuplicate: function(component, event, helper) {
        var selectedRecs = component.get('v.selectedRecs');
        //alert('selectedRecs'+selectedRecs);
        if (selectedRecs.length > 0) {
            component.set("v.isMassDuplicate", true);
        } else {
            component.find('notifLib').showNotice({
                "variant": "error",

                "header": "Select Budget Line",
                "message": "Please Select at least One Budget Line to Duplicate.",
                // "header": "No Budget Lines when",
                //"message": "Please select a Budget Line.",
                closeCallback: function() {}
            });
        }
    },

    unCheckAll: function(component, event, helper) {
        console.log('call uncheck All');

        console.log(event.currentTarget.id + '::::::ID:::::');
        var selectedIndex = event.currentTarget.name; //event.getSource().get("v.name");
        var isSelected = event.currentTarget.checked //event.getSource().get('v.checked');
        console.log(isSelected);
        var parentIndex = selectedIndex.split('-')[0];
        var childIndex = selectedIndex.split('-')[1];
        var recordIndex = selectedIndex.split('-')[2];
        var totalRecords = component.get('v.TotalRecords').groupHierarchy;
        var listofRecs = component.get('v.selectedRecs');



        var getId=totalRecords[parentIndex].subGroupRecords[childIndex].records[recordIndex].recordId;
        if (isSelected) {
            listofRecs.push(totalRecords[parentIndex].subGroupRecords[childIndex].records[recordIndex].recordId);
        } else {

            console.log(document.getElementById(totalRecords[parentIndex].groupId));
            document.getElementById(totalRecords[parentIndex].groupId).checked=false;
            listofRecs.forEach((value , index)=>{
                if(value == getId){
                    listofRecs.splice(index , 1);
                }
            });
            // try {
            //     var totalRecordsTest = component.get('v.TotalRecords');
            //     totalRecordsTest.groupHierarchy[parentIndex].isSelected = false;
            //     component.set('v.TotalRecords',totalRecordsTest);
            //     console.log('totalRecordsTest ==> ',{totalRecordsTest});

            // } catch (error) {
            //     console.log('error==>',{error});
            // }
        }
        component.set('v.selectedRecs', listofRecs);
        console.log(listofRecs);
    },

    //mass Functionality end

    onClickMassUpdateCancel: function(component, event, helper) {
        component.set("v.enableMassUpdate", component.get("v.enableMassUpdate") == true ? false : true);
        component.set("v.isChangeData", false);
        //component.set("v.isExpandGrp",false);
        component.set("v.Spinner", true);
        var page = component.get("v.page") || 1;
        component.set("v.TotalRecords", {});
        helper.getBudgetGroups(component, event, helper, page , function(){});
    },
    changeNameHandler: function(component, event, helper) {
        component.set('v.isChangeData', true)
    },

    onClickMassUpdate: function(component, event, helper) {
        component.set("v.isExpandGrp", false);

        component.set("v.enableMassUpdate", component.get("v.enableMassUpdate") == true ? false : true);
        // component.set("v.isExpandGrp",false);
        if (component.get("v.enableMassUpdate") == false && component.get('v.isChangeData')) {
            // var start = new Date().getTime();
            // var output = "";                        
            // for (var i = 1; i <= 1e6; i++) {
            //     output += i;
            // } 
            $A.get("e.c:BT_SpinnerEvent").setParams({
                action: "SHOW",
            }).fire();
            var groupHierarchy = component.get('v.TotalRecords').groupHierarchy;
            //  alert(JSON.stringify(groupHierarchy));
            var newMassQi = [];
            var newMassQuoteItem = {};
            var newnames = [];


            // var Name = component.get("v.productName");
            //alert(Name);
            //var expandallicon = document.getElementsByClassName(tabId+' expandAllBtn_'+budgetIdele);
            for (var i in groupHierarchy) {
                for (var j in groupHierarchy[i].subGroupRecords) {
                    var subGroupRecs = groupHierarchy[i].subGroupRecords[j].records;
                    for (var k in subGroupRecs) {
                        newMassQuoteItem = {};
                        var recordList = subGroupRecs[k].recordList;
                        for (var l in recordList) {
                            var currency = recordList[l].recordValue;
                            var recordValue = Number(currency.replace(/[^0-9.-]+/g, ""));
                            if (recordValue != recordList[l].originalValue) {
                                if (recordList[l].fieldName == 'Name') {
                                    newMassQuoteItem.Name = subGroupRecs[k].recordName;
                                    console.log('subGroupRecs.recordName::::::', subGroupRecs[k].recordName);
                                } else if (recordList[l].fieldName == 'buildertek__Quantity__c') {
                                    if (recordList[l].originalValue != '') {
                                        newMassQuoteItem.buildertek__Quantity__c = recordList[l].originalValue;
                                    } else {
                                        newMassQuoteItem.buildertek__Quantity__c = 1;
                                    }
                                } else if (recordList[l].fieldName == 'buildertek__Unit_Price__c') {
                                    newMassQuoteItem.buildertek__Unit_Price__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Complete__c') {
                                    newMassQuoteItem.buildertek__Complete__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Forecast_To_Complete__c') {
                                    newMassQuoteItem.buildertek__Forecast_To_Complete__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Sales_Price__c') {
                                    newMassQuoteItem.buildertek__Sales_Price__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Notes__c') {
                                    newMassQuoteItem.buildertek__Notes__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Cost_Code__c') {
                                    newMassQuoteItem.buildertek__Cost_Code__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__UOM__c') {
                                    newMassQuoteItem.buildertek__UOM__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Amount_In__c') {
                                    newMassQuoteItem.buildertek__Amount_In__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Amount_Out_2__c') {
                                    newMassQuoteItem.buildertek__Amount_Out_2__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Base_Sq_Feet__c') {
                                    newMassQuoteItem.buildertek__Base_Sq_Feet__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Item_Name__c') {
                                    newMassQuoteItem.buildertek__Item_Name__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Forecast_To_Complete__c') {
                                    newMassQuoteItem.buildertek__Forecast_To_Complete__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Cost_Type__c') {
                                    newMassQuoteItem.buildertek__Cost_Type__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Description__c') {
                                    newMassQuoteItem.buildertek__Description__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Discount__c') {
                                    newMassQuoteItem.buildertek__Discount__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Eligible_Amount__c') {
                                    newMassQuoteItem.buildertek__Eligible_Amount__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Group__c') {
                                    newMassQuoteItem.buildertek__Group__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Previously_Billed__c') {
                                    newMassQuoteItem.buildertek__Previously_Billed__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Product__c') {
                                    newMassQuoteItem.buildertek__Product__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Regional_Factor__c') {
                                    newMassQuoteItem.buildertek__Regional_Factor__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Trade_Type__c') {
                                    newMassQuoteItem.buildertek__Trade_Type__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Upgrades__c') {
                                    newMassQuoteItem.buildertek__Upgrades__c = recordList[l].originalValue;
                                } else if (recordList[l].fieldName == 'buildertek__Contractor__c') {
                                    // alert('hello');
                                    //  alert('&&'+recordList[l].originalValue);
                                    newMassQuoteItem.buildertek__Contractor__c = recordList[l].originalValue;
                                    // alert('&&'+newMassQuoteItem.buildertek__Cost_Code__c );
                                    // alert('&&'+recordList[l].originalValue);
                                }else if (recordList[l].fieldName == 'buildertek__Tax__c') {
                                    newMassQuoteItem.buildertek__Tax__c = recordList[l].originalValue;
                                }else if (recordList[l].fieldName == 'buildertek__Markup__c') {
                                    newMassQuoteItem.buildertek__Markup__c = recordList[l].originalValue;
                                }
                            }
                        }

                        newMassQuoteItem.Id = subGroupRecs[k].recordId;
                        newMassQuoteItem.Name = subGroupRecs[k].recordName;
                        newMassQi.push(newMassQuoteItem);
                        newnames.push(newMassQuoteItem.Name);
                        //alert( JSON.stringify(newnames));
                    }
                }
            }
            // for (var i = 0; i < ListOfEachRecordLength; i++) {
            // 	var newMassQuoteItem = {};
            // 	newMassQuoteItem.sobjectType = 'buildertek__Budget_Item__c';
            // 	var countUnchangedValue = 0;
            // 	for (var j = 0; j < ListOfEachRecord[i].recordList.length; j++) {
            // 		var listOfRecord = ListOfEachRecord[i].recordList.length;
            // 		var currency = ListOfEachRecord[i].recordList[j].recordValue;
            // 		var recordValue = Number(currency.replace(/[^0-9.-]+/g, ""));
            // 		if (recordValue != ListOfEachRecord[i].recordList[j].originalValue) {

            // 			if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Quantity__c') {
            // 				if (ListOfEachRecord[i].recordList[j].originalValue != '') {
            // 					newMassQuoteItem.buildertek__Quantity__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 				} else {
            // 					newMassQuoteItem.buildertek__Quantity__c = 1;
            // 				}
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Unit_Price__c') {
            // 				debugger;
            // 				newMassQuoteItem.buildertek__Unit_Price__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Forecast_To_Complete__c') {
            // 				newMassQuoteItem.buildertek__Forecast_To_Complete__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Sales_Price__c') {
            // 				newMassQuoteItem.buildertek__Sales_Price__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Notes__c') {
            // 				newMassQuoteItem.buildertek__Notes__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Cost_Code__c') {
            // 				newMassQuoteItem.buildertek__Cost_Code__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__UOM__c') {
            // 				newMassQuoteItem.buildertek__UOM__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Amount_In__c') {
            // 				newMassQuoteItem.buildertek__Amount_In__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Amount_Out_2__c') {
            // 				newMassQuoteItem.buildertek__Amount_Out_2__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Base_Sq_Feet__c') {
            // 				newMassQuoteItem.buildertek__Base_Sq_Feet__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Item_Name__c') {
            // 				newMassQuoteItem.buildertek__Item_Name__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Forecast_To_Complete__c') {
            // 				newMassQuoteItem.buildertek__Forecast_To_Complete__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Cost_Type__c') {
            // 				newMassQuoteItem.buildertek__Cost_Type__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Description__c') {
            // 				newMassQuoteItem.buildertek__Description__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Discount__c') {
            // 				newMassQuoteItem.buildertek__Discount__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Eligible_Amount__c') {
            // 				newMassQuoteItem.buildertek__Eligible_Amount__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Group__c') {
            // 				newMassQuoteItem.buildertek__Group__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Previously_Billed__c') {
            // 				newMassQuoteItem.buildertek__Previously_Billed__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Product__c') {
            // 				newMassQuoteItem.buildertek__Product__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Regional_Factor__c') {
            // 				newMassQuoteItem.buildertek__Regional_Factor__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Trade_Type__c') {
            // 				newMassQuoteItem.buildertek__Trade_Type__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Upgrades__c') {
            // 				newMassQuoteItem.buildertek__Upgrades__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			} else if (ListOfEachRecord[i].recordList[j].fieldName == 'buildertek__Contractor__c') {
            // 				newMassQuoteItem.buildertek__Contractor__c = ListOfEachRecord[i].recordList[j].originalValue;
            // 			}
            // 		} else {
            // 			countUnchangedValue++;
            // 		}
            // 	}
            // 	newMassQuoteItem.Id = ListOfEachRecord[i].recordId;
            // 	newMassQuoteItem.Name = ListOfEachRecord[i].recordName;
            // 	newMassQi.push(newMassQuoteItem);
            // }
            for (var i = 0; i < newnames.length; i++) {

                //alert('hii'+ newMassQuoteItem.Name.length);
                //alert('bye'+ newMassQi.Name.length);
                //if(newMassQi[i].Name == undefine){
                if (newnames[i].length > 80) {
                    $A.get("e.c:BT_SpinnerEvent").setParams({
                        "action": "HIDE"
                    }).fire();
                    component.set("v.Spinner", false);
                    component.set("v.isDescription", true);
                    //alert("1");
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        message: 'Please assign the product name lessthan 80 characters.',
                        duration: ' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
                    component.set("v.enableMassUpdate", true);
                    component.set("v.Spinner", false);
                    //var page = component.get("v.page") || 1;
                    //component.set("v.TotalRecords", {});
                    //helper.getBudgetGroups(component, event, helper, page);
                    // helper.getBudgetGroups(component, event, helper,page);
                } else {
                    component.set("v.isDescription", false);
                }
            }
            if (component.get("v.isDescription") == false) {
                //if (newMassQi.length > 0) {

                //alert("2");
                var action = component.get("c.massUpdateBudgetLineItem");
                action.setParams({
                    "budgetLineRecords": JSON.stringify(newMassQi)
                });

                action.setCallback(this, function(respo) {
                    component.set("v.isChangeData", false);
                    // alert(JSON.stringify(respo.getState()));
                    if (respo.getState() === "SUCCESS") {

                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            mode: 'sticky',
                            message: 'Budget Line Updated successfully',
                            type: 'success',
                            duration: '1000',
                            mode: 'dismissible'
                        });
                        toastEvent.fire();
                        var page = component.get("v.page") || 1;
                        component.set("v.TotalRecords", {});
                        helper.getBudgetGroups(component, event, helper, page , function(){}) //,start,output);
                    }
                });
                $A.enqueueAction(action);
            }
        }

        if (component.get("v.enableMassUpdate")) {
            console.log(component.get("v.TotalRecords").groupHierarchy);
            var budgetIdele = component.get("v.budgetId");
            var tabId = component.get("v.currentTab")
                // var spanEle = event.currentTarget.dataset.iconname;
                //console.log(spanEle)
            var expandallicon = document.getElementsByClassName(tabId + ' expandAllBtn_' + budgetIdele);
            //var labelName =spanEle
            var collapeallIcon = document.getElementsByClassName(tabId + ' CollapeseAllBtn_' + budgetIdele);

            expandallicon[0].style.display = 'none';
            collapeallIcon[0].style.display = 'inline-block';


            var groups = component.get("v.TotalRecords").groupHierarchy;
            var budgetId = component.get("v.budgetId")
            for (var j = 0; j < groups.length; j++) {
                var grpIndex = j;
                var expandicon = document.getElementsByClassName(tabId + ' ' + budgetId + ' expandGrpIcon_' + grpIndex);
                var collapeIcon = document.getElementsByClassName(tabId + ' ' + budgetId + ' collapseGrpIcon_' + grpIndex);
                var className = tabId + ' ' + budgetId + " groupRows_" + grpIndex;
                var grpRows = document.getElementsByClassName(className);
                component.set("v.isExpandGrp", true);

                expandicon[0].style.display = 'none';
                collapeIcon[0].style.display = 'inline-block';

                for (var i = 0; i < grpRows.length; i++) {
                    var item = grpRows[i];

                    if (!expandicon[0].classList.contains(tabId + 'hideExpandIcon')) {
                        expandicon[0].classList.add(tabId + 'hideExpandIcon')
                    }
                    if (expandicon[0].classList.contains(tabId + 'hideExpandIconhideCollapseIcon')) {
                        expandicon[0].classList.remove(tabId + 'hideExpandIconhideCollapseIcon')
                    }
                    if (item.style.display == "none") {
                        item.style.display = 'table-row';
                    }
                }
            }
        }
    },

    handleLookUpEvent: function(component, event, helper) {
        var selectedRecordId = event.getParam("selectedRecordId");
        var index = event.getParam('index');
        //  alert('index'+index);
        var groupIndex = event.getParam('groupIndex');
        //  alert('groupIndex'+groupIndex);
        var TotalRecords = component.get("v.TotalRecords");
        var fieldName = event.getParam('fieldName');
        var ListOfEachRecord = TotalRecords.tarTable.ListOfEachRecord;
        if (ListOfEachRecord[index] != undefined) {
            if (ListOfEachRecord[index].recordList != undefined) {
                for (var i in ListOfEachRecord[index].recordList) {
                    if (ListOfEachRecord[index].recordList[i].fieldName == fieldName) {
                        ListOfEachRecord[index].recordList[i].originalValue = selectedRecordId;
                    }
                }
            }
        }
        component.set("v.isChangeData", true);
        component.set("v.TotalRecords", TotalRecords);
    },

    doSearch: function(component, event, helper) {
        var searchValue = component.get("v.searchFilter");
        console.log(searchValue);
        var filter = "";
        var flag = component.get("v.isFirstSearch");
        var orgRecords;
        if (flag) {
            orgRecords = Object.assign({}, JSON.parse(JSON.stringify(component.get("v.TotalRecords"))));
            component.set("v.TotalRecordsCopy", orgRecords);
            component.set("v.isFirstSearch", false);
        }
        if (searchValue) {
            filter = searchValue.toUpperCase();
        }
        console.log(JSON.parse(JSON.stringify(component.get("v.TotalRecords"))));
        //component.set("v.TotalRecords",{});
        if (filter != "") {
            var records = JSON.parse(JSON.stringify(component.get("v.TotalRecordsCopy")));
            var TotalRecordsClone = Object.assign({}, records);
            TotalRecordsClone.groupHierarchy = [];
            for (var i = 0; i < records.groupHierarchy.length; i++) {
                if (records.groupHierarchy[i].groupName.toUpperCase().indexOf(filter) > -1) {
                    console.log(records.groupHierarchy[i]);
                    TotalRecordsClone.groupHierarchy.push(records.groupHierarchy[i]);
                    var deleteRec = [];
                    for (var j = 0; j < records.groupHierarchy[i].subGroupRecords.length; j++) {
                        for (var k = 0; k < records.groupHierarchy[i].subGroupRecords[j].records.length; k++) {
                            var record = records.groupHierarchy[i].subGroupRecords[j].records;
                            var match = false;
                            if (String(record[k].recordValue[0]).indexOf(filter) > -1) {
                                match = true;
                            } else if (String(record[k].recordValue[2]).indexOf(filter) > -1) {
                                match = true;
                            } else if (String(record[k].recordName).toUpperCase().indexOf(filter) > -1) {
                                match = true;
                            }
                            console.log(match);
                            if (!match) {
                                deleteRec.push(k);
                            }
                        }
                        var filterList = records.groupHierarchy[i].subGroupRecords[j].records.filter(function(item, index) {
                            if (deleteRec.indexOf(index) == -1) {
                                return item;
                            }
                        });
                        if (filterList.length && j) {
                            records.groupHierarchy[i].subGroupRecords[j].records.push(filterList);
                        } else if (filterList.length) {
                            records.groupHierarchy[i].subGroupRecords[j].records = filterList;
                        }
                        if (!filterList.length) {
                            console.log(records.groupHierarchy);
                        }
                        console.log("record:", records, "filter:", filterList);
                    }
                } else {
                    var deleteRec = [];
                    var deleteSubGroup = [];
                    for (var j = 0; j < records.groupHierarchy[i].subGroupRecords.length; j++) {
                        for (var k = 0; k < records.groupHierarchy[i].subGroupRecords[j].records.length; k++) {
                            var record = records.groupHierarchy[i].subGroupRecords[j].records;
                            var match = false;
                            if (String(record[k].recordValue[0]).indexOf(filter) > -1) {
                                match = true;
                            } else if (String(record[k].recordValue[2]).indexOf(filter) > -1) {
                                match = true;
                            } else if (String(record[k].recordName).toUpperCase().indexOf(filter) > -1) {
                                match = true;
                            }
                            if (!match) {
                                deleteRec.push(k);
                            }
                        }
                        var filterList = records.groupHierarchy[i].subGroupRecords[j].records.filter(function(item, index) {
                            if (deleteRec.indexOf(index) == -1) {
                                return item;
                            }
                        });
                        console.log("recordBefore:", records, "filter:", filterList);
                        if (filterList.length && j) {
                            records.groupHierarchy[i].subGroupRecords[j].records.push(filterList);
                        } else if (filterList.length) {
                            records.groupHierarchy[i].subGroupRecords[j].records = filterList;
                        }
                        if (!filterList.length) {
                            deleteSubGroup.push(j);
                            records.groupHierarchy[i].subGroupRecords[j] = [];
                            //records.groupHierarchy = records.groupHierarchy.splice(i,1);
                            console.log(records.groupHierarchy);
                        }
                        console.log("recordAfter:", records, "filter:", filterList);
                    }
                }
            }
            var recordList = records.groupHierarchy.filter(function(item) {
                if (item.subGroupRecords.length) {
                    for (var x = 0; x < item.subGroupRecords.length; x++) {
                        if (Object.keys(item.subGroupRecords[x]).length) {
                            return item;
                        }
                    }
                }
            });
            console.log(recordList);
            records.groupHierarchy = recordList;
            component.set("v.TotalRecords", records);
        } else {
            component.set("v.TotalRecords", JSON.parse(JSON.stringify(component.get("v.TotalRecordsCopy"))));
        }
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "HIDE"
        }).fire();
    },
    doSearchBudget: function(component, event, helper) {
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();
        if (!component.get("v.searchFilter")) {
            var promise = function() {
                return new Promise($A.getCallback(function(resolve, reject) {
                    resolve("Resolved");
                }))
            }
            promise().then(function(result) {
                $A.enqueueAction(component.get("c.doSearch"));
            });
            //$A.enqueueAction(component.get("c.doSearch"));
        }
    },
    expandCollapeAll: function(component, event, helper) {
        //component.set("v.ShowSpinner",true);
        console.log(component.get("v.TotalRecords").groupHierarchy);



        // console.log(event.getSource());
        /* var iconName = event.getSource().get("v.iconName")
         var labelName = event.getSource().get("v.title");
         if(labelName == 'Expand All'){
             event.getSource().set("v.title", "Collapse All");
             event.getSource().set("v.iconName", "utility:dash");
         }else if(labelName == 'Collapse All'){
             event.getSource().set("v.title", "Expand All");
             event.getSource().set("v.iconName", "utility:add");
         }*/

        var budgetIdele = component.get("v.budgetId");
        var tabId = component.get("v.currentTab")
        var spanEle = event.currentTarget.dataset.iconname;
        console.log(spanEle)
        var expandallicon = document.getElementsByClassName(tabId + ' expandAllBtn_' + budgetIdele);
        var collapeallIcon = document.getElementsByClassName(tabId + ' CollapeseAllBtn_' + budgetIdele);
        var labelName = spanEle
        if (labelName == 'Expand All') {
            /*$A.util.toggleClass(expandallicon[0], 'hideExpandIcon');
                         $A.util.toggleClass(collapeallIcon[0], 'hideCollapseIcon');*/
            expandallicon[0].style.display = 'none';
            collapeallIcon[0].style.display = 'inline-block';
            //event.getSource().set("v.title", "Collapse All");
            // event.getSource().set("v.iconName", "utility:dash");
        } else if (labelName == 'Collapse All') {
            /*$A.util.toggleClass(expandallicon[0], 'hideExpandIcon');
            $A.util.toggleClass(collapeallIcon[0], 'hideCollapseIcon');*/
            expandallicon[0].style.display = 'inline-block';
            collapeallIcon[0].style.display = 'none';
            // event.getSource().set("v.title", "Expand All");
            //event.getSource().set("v.iconName", "utility:add");
        }

        var groups = component.get("v.TotalRecords").groupHierarchy;
        var budgetId = component.get("v.budgetId")
        for (var j = 0; j < groups.length; j++) {
            var grpIndex = j;
            var expandicon = document.getElementsByClassName(tabId + ' ' + budgetId + ' expandGrpIcon_' + grpIndex);
            var collapeIcon = document.getElementsByClassName(tabId + ' ' + budgetId + ' collapseGrpIcon_' + grpIndex);
            var className = tabId + ' ' + budgetId + " groupRows_" + grpIndex;
            var grpRows = document.getElementsByClassName(className);
            if ( /*!expandicon[0].classList.contains('hideExpandIcon') && collapeIcon[0].classList.contains('hideCollapseIcon') &&*/ labelName == 'Expand All') {
                component.set("v.isExpandGrp", true);

                expandicon[0].style.display = 'none';
                collapeIcon[0].style.display = 'inline-block';
                /*$A.util.toggleClass(expandicon[0], 'hideExpandIcon');
                $A.util.toggleClass(collapeIcon[0], 'hideCollapseIcon');*/
                for (var i = 0; i < grpRows.length; i++) {
                    var item = grpRows[i];
                    /*if(!item.classList.contains('showRows')){
                        item.classList.add('showRows')
                    }*/
                    if (!expandicon[0].classList.contains(tabId + 'hideExpandIcon')) {
                        expandicon[0].classList.add(tabId + 'hideExpandIcon')
                    }
                    if (expandicon[0].classList.contains(tabId + 'hideExpandIconhideCollapseIcon')) {
                        expandicon[0].classList.remove(tabId + 'hideExpandIconhideCollapseIcon')
                    }
                    if (item.style.display == "none") {
                        item.style.display = 'table-row';
                    }
                }

            } else if ( /*expandicon[0].classList.contains('hideExpandIcon') && !collapeIcon[0].classList.contains('hideCollapseIcon') &&*/ labelName == 'Collapse All') {
                collapeIcon[0].style.display = 'none';
                expandicon[0].style.display = 'inline-block';

                /* $A.util.toggleClass(expandicon[0], 'hideExpandIcon');
                $A.util.toggleClass(collapeIcon[0], 'hideCollapseIcon');*/
                component.set("v.isExpandGrp", false);
                for (var i = 0; i < grpRows.length; i++) {
                    var item = grpRows[i];
                    /*if(item.classList.contains('showRows')){
                        item.classList.remove('showRows')
                    }*/
                    if (!expandicon[0].classList.contains(tabId + 'hideExpandIconhideCollapseIcon')) {
                        expandicon[0].classList.add(tabId + 'hideExpandIconhideCollapseIcon')
                    }
                    if (expandicon[0].classList.contains(tabId + 'hideExpandIcon')) {
                        expandicon[0].classList.remove(tabId + 'hideExpandIcon')
                    }
                    if (item.style.display == "table-row") {
                        item.style.display = 'none';
                    }
                }
                console.log(document.getElementsByClassName(className)[0]);
            }
        }
        // window.setTimeout(function(){component.set("v.ShowSpinner",false);},800)


    },
    expandCollapseGroups: function(component, event, helper) {
        var budgetId = component.get("v.budgetId")
        var tabId = component.get("v.currentTab")
        var grpIndex = event.currentTarget.dataset.grpindex;
        var expandicon = document.getElementsByClassName(tabId + ' ' + budgetId + ' expandGrpIcon_' + grpIndex);
        var collapeIcon = document.getElementsByClassName(tabId + ' ' + budgetId + ' collapseGrpIcon_' + grpIndex);
        var className = tabId + ' ' + budgetId + " groupRows_" + grpIndex;
        var grpRows = document.getElementsByClassName(className);
        var allGroups = component.get("v.TotalRecords").groupHierarchy;
        console.log(expandicon[0].style.display)
        console.log(collapeIcon[0].style.display)
            // if(!expandicon[0].classList.contains('hideExpandIcon') && collapeIcon[0].classList.contains('hideCollapseIcon') )  {   
        if (expandicon[0].style.display == "inline-block" && collapeIcon[0].style.display == "none") {
            component.set("v.isExpandGrp", true);
            expandicon[0].style.display = 'none';
            collapeIcon[0].style.display = 'inline-block';

            if (!expandicon[0].classList.contains(tabId + 'hideExpandIcon')) {
                expandicon[0].classList.add(tabId + 'hideExpandIcon')
            }
            if (expandicon[0].classList.contains(tabId + 'hideExpandIconhideCollapseIcon')) {
                expandicon[0].classList.remove(tabId + 'hideExpandIconhideCollapseIcon')
            }
            //$A.util.toggleClass(collapeIcon[0], 'hideCollapseIcon');
            for (var i = 0; i < grpRows.length; i++) {
                var item = grpRows[i];
                if (item.style.display == "none") {
                    item.style.display = 'table-row';
                    // $A.util.toggleClass(expandicon[0], 'hideExpandIcon');
                }
            }
            var hideCollapseIconEles = document.getElementsByClassName(budgetId + ' ' + tabId + 'hideExpandIcon') //document.getElementsByClassName('hideCollapseIcon');
            if (hideCollapseIconEles.length == allGroups.length) {
                var expandallicon = document.getElementsByClassName(tabId + ' expandAllBtn_' + budgetId);
                var collapeallIcon = document.getElementsByClassName(tabId + ' CollapeseAllBtn_' + budgetId);
                collapeallIcon[0].style.display = "inline-block";
                expandallicon[0].style.display = "none";
            }


        } //else if(expandicon[0].classList.contains('hideExpandIcon') && !collapeIcon[0].classList.contains('hideCollapseIcon')){
        else if (expandicon[0].style.display == "none" && collapeIcon[0].style.display == "inline-block") {
            collapeIcon[0].style.display = 'none';
            expandicon[0].style.display = 'inline-block';

            if (!expandicon[0].classList.contains(tabId + 'hideExpandIconhideCollapseIcon')) {
                expandicon[0].classList.add(tabId + 'hideExpandIconhideCollapseIcon')
            }
            if (expandicon[0].classList.contains(tabId + 'hideExpandIcon')) {
                expandicon[0].classList.remove(tabId + 'hideExpandIcon')
            }
            component.set("v.isExpandGrp", false);
            for (var i = 0; i < grpRows.length; i++) {
                var item = grpRows[i];
                if (item.style.display == "table-row") {
                    item.style.display = 'none';
                    // $A.util.toggleClass(collapeIcon[0], 'hideCollapseIcon');
                }
            }
            var hideExpandIconEles = document.getElementsByClassName(budgetId + ' ' + tabId + 'hideExpandIconhideCollapseIcon')
            if (hideExpandIconEles.length == allGroups.length) {
                var expandallicon = document.getElementsByClassName(tabId + ' expandAllBtn_' + budgetId);
                var collapeallIcon = document.getElementsByClassName(tabId + ' CollapeseAllBtn_' + budgetId);
                /* var btn = component.find("expandCollapeseAllBtn");
                btn.set("v.title", "Expand All");
                btn.set("v.iconName", "utility:add");*/
                expandallicon[0].style.display = "inline-block";
                collapeallIcon[0].style.display = "none";
            }





            console.log(document.getElementsByClassName(className)[0]);
        }

    },


    createANewSchedule: function(component, event, helper) {
        component.set("v.selectedScheduleRecords", []);
        //component.set("v.createNewSchedule",true);
        component.set("v.showSelectSchedule", false);

        component.set("v.isCreateNewSchedule", true);
        var action = component.get("c.createScheduleItem")
        $A.enqueueAction(action)
    },

    handleOnSuccess: function(component, event, helper) {

        component.set("v.showSelectSchedule", false);
        component.set("v.createNewSchedule", false);

        var params = event.getParams(); //get event params
        var recordId = params.response.id; //get record id

        console.log('Record Id - ' + recordId);
        //  alert(recordId);
        component.set("v.newScheduleId", recordId);
        component.set("v.selectedScheduleRecords", recordId);
        $A.get("e.force:closeQuickAction").fire();

        var selectecSchedule = component.get("v.selectedScheduleRecords");

        if (selectecSchedule.length) {
            component.set("v.showSelectSchedule", false);
            var selectedRecs = component.get('v.selectedRecs');
            if (selectedRecs.length > 0) {
                var rowData;
                var newScheduledItems = [];
                if (selectedRecs.length > 0) {
                    var action;
                    action = component.get("c.BudgetItemList");
                    action.setParams({
                        "BudgetIds": selectedRecs
                    });
                    action.setCallback(this, function(response) {
                        if (component.isValid() && response.getState() === "SUCCESS") {

                            //    component.find("saveSchedule").submit();

                            for (var i = 0; i < response.getReturnValue().length; i++) {
                                rowData = response.getReturnValue()[i];
                                var now = new Date();
                                console.log($A.localizationService.formatDate(now, "yyyy-M-dd"));
                                var newScheduledItem = new Object();
                                newScheduledItem.Name = rowData.Name + ' Task';
                                newScheduledItem.buildertek__Budget_Line__c = rowData.Id;
                                newScheduledItem.buildertek__Start__c = $A.localizationService.formatDate(now, "yyyy-MM-dd");
                                newScheduledItem.buildertek__Duration__c = 1;
                                newScheduledItem.buildertek__Project__c = component.get("v.sampleNewRecord").buildertek__Project__c;
                                //newScheduledItem.buildertek__Schedule__c = null;
                                newScheduledItems.push(newScheduledItem);
                            }
                            var overlayLib;
                            $A.createComponents([
                                    ["c:BT_New_Schedule_Items", {
                                        "aura:id": "btNewScheduleItems",
                                        "newScheduledItems": newScheduledItems,
                                        "selectedScheduleRecords": JSON.parse(JSON.stringify(component.get("v.selectedScheduleRecords"))),
                                        "saveCallback": component.get("v.refreshGridAction"),
                                        "cancelCallback": function() {
                                            overlayLib.close();
                                        }
                                    }],
                                ],
                                function(components, status, errorMessage) {
                                    if (status === "SUCCESS") {
                                        //component.set('v.selectedRecs',[]);
                                        //component.set("v.selectedScheduleRecords",[]);
                                        component.find('overlayLib').showCustomModal({
                                            header: "Create Schedule Items",
                                            body: components[0],
                                            footer: components[0].find("footer").get("v.body"),
                                            showCloseButton: true,
                                            cssClass: 'slds-modal_medium',
                                            closeCallback: function() {}
                                        }).then(function(overlay) {
                                            overlayLib = overlay;
                                        });
                                    }
                                }
                            );
                        }
                    });
                    $A.enqueueAction(action);
                } else {
                    component.find('notifLib').showNotice({
                        "variant": "error",
                        "header": " Select Budget Line",
                        "message": "Please Select Budget Line to Create Schedule Items.",
                        closeCallback: function() {}
                    });
                }
            } else {
                component.find('notifLib').showNotice({
                    "variant": "error",
                    "header": " Select Budget Line",
                    "message": "Please Select at least One Budget Line to Create Scheduled Items.",
                    // "header": "No Budget Lines",
                    // "message": "No Budget Lines Records.",
                    closeCallback: function() {}
                });
            }
        } else {
            component.find('notifLib').showNotice({
                "variant": "error",
                "header": "No Schedule",
                "message": "No Schedule Records.",
                closeCallback: function() {}
            });
        }
    },

    toggleByCost: function(component, event, helper){

        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();
        
        component.set("v.page", 1);
        var page = 1;

        var groupByCostCode = component.get("v.groupByCostCode");
        console.log('groupByCostCode ==> '+groupByCostCode);

        if (groupByCostCode == true) {
            component.set("v.groupBytoggle", false);
            component.set("v.groupByVendortoggle", false);
            component.set("v.groupByVendortoggle1", false);
            component.set("v.groupByVendortoggle2", false);
            component.set("v.groupBytoggle2", false);
            helper.CostCodeFilterHelper(component, event, helper, page);
        } else{
            helper.getBudgetGroups(component, event, helper, page , function(){});
        }

    }, 

    addCO: function(component, event, helper){
        var selectedRecs = component.get('v.selectedRecs');
        console.log('v.selectedRecs ==> ', { selectedRecs });
        if (selectedRecs.length > 0){
            helper.getcoList(component, event, helper);
        } else{
            component.find('notifLib').showNotice({
                "variant": "error",
                "header": "Please Select Budget Line!",
                "message": "Please Select at least One Budget Line to Add CO.",
                closeCallback: function() {}
            });
        }
    }, 

    saveSelectedCO: function(component, event, helper) {
        var selectedCO = event.getSource().get("v.text");
        console.log('selectedExistingCO --->'+selectedCO);
        component.set("v.selectedExistingCO", selectedCO);
    },

    addNewCO: function(component, event, helper){
        var recId = component.get("v.recordId");
        var selectedRecords = component.get('v.selectedRecs');
        selectedRecords = selectedRecords.toString();

        var selectedCO = component.get("v.selectedExistingCO");   
        console.log('selectedCO ==> '+selectedCO);
        if (selectedCO != '' && selectedCO != null) {
            var action = component.get("c.addCoToBudget");
            action.setParams({
                budgeLineIds: selectedRecords,
                selectedCO: selectedCO,
                RecId: recId
            });
            action.setCallback(this, function (result) {
                var state = result.getState();
                if (state === "SUCCESS") {
                    if (result.getReturnValue() == 'Success') {   
                        component.set('v.selectedRecs',[]);
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            type: 'SUCCESS',
                            message: 'CO added Successfully',
                            duration: '5000',
                        });
                        toastEvent.fire();
                        
                        var action1 = component.get("c.doInit");
                        $A.enqueueAction(action1);
                    }
                    else{
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            type: 'Error',
                            message: 'There Are No CO Line In Selected CO',
                            duration: '5000',
                        });
                        toastEvent.fire();
                    }
                } else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        type: 'ERROR',
                        message: 'Something Went Wrong',
                        duration: '5000',
                    });
                    toastEvent.fire();
                }
                component.set("v.addcosection", false);
                var a = component.get('c.doCancel');
                $A.enqueueAction(a);
            });
            $A.enqueueAction(action);
        } else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                type: 'Error',
                message: 'Please Select CO First',
                duration: '5000',
            });
        }

        
    }, 

    addExpense: function(component, event, helper){
        var selectedRecs = component.get('v.selectedRecs');
        console.log('v.selectedRecs ==> ', { selectedRecs });
        helper.getExpenseList(component, event, helper);
    }, 


    addNewExpense: function(component, event, helper){     
        var selectedRecords = component.get('v.selectedRecs');

        var ExpenseRecordList = component.get("v.ExpenseRecordList");
        let selectedExpenseList=[];
        ExpenseRecordList.forEach(element => {
            if (element.Selected) {
                selectedExpenseList.push(element);
            }
        });

        console.log('selectedExpenseList ==>',selectedExpenseList);
        
        $A.get("e.c:BT_SpinnerEvent").setParams({
            "action": "SHOW"
        }).fire();

        if (selectedRecords.length > 0){

            selectedRecords = selectedRecords.toString();
            var action = component.get("c.addExpenseToBudget");
            action.setParams({
                budgeLineIds: selectedRecords,
                selectedExpenses: selectedExpenseList
            });
            action.setCallback(this, function (result) {
                $A.get("e.c:BT_SpinnerEvent").setParams({
                    "action": "HIDE"
                }).fire();
                var state = result.getState();
                if (state === "SUCCESS") {
                    component.set('v.selectedRecs',[]);
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        type: 'SUCCESS',
                        message: 'Expense added Successfully',
                        duration: '5000',
                    });
                    toastEvent.fire();
    
                    var action1 = component.get("c.doInit");
                    $A.enqueueAction(action1);
                } else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        type: 'ERROR',
                        message: 'Something Went Wrong',
                        duration: '5000',
                    });
                    toastEvent.fire();
                }
                component.set("v.addExpenseSection", false);
                var a = component.get('c.doCancel');
                $A.enqueueAction(a);
            });
            $A.enqueueAction(action);
        } else{
            console.log('Create New Budget Line and add expense');
            var recId = component.get("v.recordId");
            var action = component.get("c.CreateLineAddExpense");
            action.setParams({
                selectedExpenses: selectedExpenseList,
                RecId: recId
            });
            action.setCallback(this, function (result) {
                $A.get("e.c:BT_SpinnerEvent").setParams({
                    "action": "HIDE"
                }).fire();
                var state = result.getState();
                if (state === "SUCCESS") {
                    component.set('v.selectedRecs',[]);
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        type: 'SUCCESS',
                        message: 'Expense added Successfully',
                        duration: '5000',
                    });
                    toastEvent.fire();
    
                    var action1 = component.get("c.doInit");
                    $A.enqueueAction(action1);
                } else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        type: 'ERROR',
                        message: 'Something Went Wrong',
                        duration: '5000',
                    });
                    toastEvent.fire();
                }
                component.set("v.addExpenseSection", false);
                var a = component.get('c.doCancel');
                $A.enqueueAction(a);
            });
            $A.enqueueAction(action);
        }
        
    },

    checkExpensee: function(component, event, helper){
        var tableDataList = component.get("v.ExpenseRecordList");
        console.log('tableDataList ==> ',tableDataList);
        var checkedAll = true;
        tableDataList.forEach(element => {
            if (!element.Selected) {
                checkedAll = false;
            }
        });
        component.find("selectAllExpense").set("v.checked", checkedAll);
    },

    checkAllExpense: function(component, event, helper){
        var value = event.getSource().get("v.checked"); 
        var tableDataList = component.get("v.ExpenseRecordList");
        let expenseIdList=[];
        tableDataList.forEach(element => {
            console.log({element});
            element.Selected = value;
            expenseIdList.push(element.Id);

        });
        component.set("v.ExpenseRecordList", tableDataList);

    },
    checkAllPO:function(component, event, helper){
        var value = event.getSource().get("v.checked"); 
        console.log({value});
        var tableDataList = component.get("v.recordList");
        let expenseIdList=[];
        tableDataList.forEach(element => {
            console.log({element});
            element.Selected = value;
            expenseIdList.push(element.Id);

        });
        component.set("v.recordList", tableDataList);
        component.set("v.selectedExistingPO", expenseIdList);
        console.log( component.get("v.selectedRecs") , 'selectedRecs::::::::');


    },
    checkPO:function(component, event, helper){
        var tableDataList = component.get("v.recordList");
        var existingPoId=[];
        var checkedAll = true;
        tableDataList.forEach(element => {
            if (!element.Selected) {
                checkedAll = false;
            }else{
                existingPoId.push(element.Id);
            }
        });
        component.find("selectAllPO").set("v.checked", checkedAll); 
        component.set("v.selectedExistingPO", existingPoId);
        console.log( component.get("v.selectedRecs") , 'selectedRecs::::::::');

    },
    checkAllInvoices:function(component, event, helper){
        var value= event.getSource().get('v.value');
        let listOfRecords= component.get("v.recordList");
        var existingId=[];

        listOfRecords.forEach(function(element){
            element.Selected=value;
            existingId.push(element.Id);

        });
        component.set("v.recordList", listOfRecords);
        component.set("v.selectedExistingINVO", existingId);

    },
    checkInvoice:function(component, event, helper){
        let listOfRecords= component.get("v.recordList");
        let checkedAll= true;
        var existingId=[];

        listOfRecords.forEach(function(element){
            if(!element.Selected){
                checkedAll=false;
            }else{
                existingId.push(element.Id);
            }
        });

        component.find("selectAllInvoices").set("v.checked", checkedAll); 
        component.set("v.selectedExistingINVO", existingId);



    },
    checkAllTimeCards:function(component, event, helper){
        var value= event.getSource().get('v.value');
        let listOfRecords= component.get("v.recordList");
        var existingId=[];

        listOfRecords.forEach(function(element){
            element.Selected=value;
            existingId.push(element.Id);

        });
        component.set("v.recordList", listOfRecords);
        component.set("v.selectedExistingTC", existingId);

    },
    checkTimeCard:function(component, event, helper){
        let listOfRecords= component.get("v.recordList");
        let checkedAll= true;
        var existingId=[];

        listOfRecords.forEach(function(element){
            if(!element.Selected){
                checkedAll=false;
            }else{
                existingId.push(element.Id);
            }
        });

        component.find("selectAllTimeCards").set("v.checked", checkedAll); 
        component.set("v.selectedExistingTC", existingId);



    }
    

})