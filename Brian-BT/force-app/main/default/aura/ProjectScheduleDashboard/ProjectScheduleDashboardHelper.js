({
    // getTabName: function (component, event, helper) {
    //     var workspaceAPI = component.find("workspacetask");
    //     workspaceAPI.openTab({
    //         url: '/lightning/n/buildertek__Task_Dashboard',
    //         focus: true
    //     }).then(function (response) {
    //         workspaceAPI.setTabLabel({
    //             tabId: response,
    //             label: "Project Dashboard"
    //         })
    //     })
    // },
    // getResources: function (component) {
    //     var action = component.get("c.getAllResourcess");
    //     action.setCallback(this, function (response) {
    //         var state = response.getState();
    //         if (component.isValid() && state === "SUCCESS") {
    //             component.set("v.contactList", response.getReturnValue());
    //         }
    //     });
    //     $A.enqueueAction(action);
    // },

    currentWeekDates: function (component, todayDate) {
        var today = new Date(todayDate);
        var week = [];
        var dayOfWeekStartingSundayZeroIndexBased = today.getDay(); // 0 : Sunday ,1 : Monday,2,3,4,5,6 : Saturday
        var mondayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
        week.push({
            Day: 'Mon',
            Date: $A.localizationService.formatDate(mondayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(mondayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(mondayOfWeek, 'MMMM')
        });
        var tuedayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 2);
        week.push({
            Day: 'Tue',
            Date: $A.localizationService.formatDate(tuedayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(tuedayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(tuedayOfWeek, 'MMMM')
        });
        var weddayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 3);
        week.push({
            Day: 'Wed',
            Date: $A.localizationService.formatDate(weddayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(weddayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(weddayOfWeek, 'MMMM')
        });
        var thuedayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 4);
        week.push({
            Day: 'Thu',
            Date: $A.localizationService.formatDate(thuedayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(thuedayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(thuedayOfWeek, 'MMMM')
        });
        var fridayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 5);
        week.push({
            Day: 'Fri',
            Date: $A.localizationService.formatDate(fridayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(fridayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(fridayOfWeek, 'MMMM')
        });
        var satdayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
        // week.push({Day:'Sat',Date: $A.localizationService.formatDate(satdayOfWeek, 'MM/dd/yyyy')});
        var sundayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);
        week.push({
            Day: 'Sun',
            Date: $A.localizationService.formatDate(sundayOfWeek, 'MM/dd/yyyy'),
            DayMonth: $A.localizationService.formatDate(sundayOfWeek, 'MMMM')
        });
        console.log('currentWeekDates 1 ========> ');
        var nextmondayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 8);
        week.push({
            Day: 'Mon',
            Date: $A.localizationService.formatDate(nextmondayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(nextmondayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(nextmondayOfWeek, 'MMMM')
        });
        var nexttuedayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 9);
        week.push({
            Day: 'Tue',
            Date: $A.localizationService.formatDate(nexttuedayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(nexttuedayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(nexttuedayOfWeek, 'MMMM')
        });
        var nextweddayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 10);
        week.push({
            Day: 'Wed',
            Date: $A.localizationService.formatDate(nextweddayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(nextweddayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(nextweddayOfWeek, 'MMMM')
        });
        var nextthuedayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 11);
        week.push({
            Day: 'Thu',
            Date: $A.localizationService.formatDate(nextthuedayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(nextthuedayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(nextthuedayOfWeek, 'MMMM')
        });
        var nextfridayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 12);
        week.push({
            Day: 'Fri',
            Date: $A.localizationService.formatDate(nextfridayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(nextfridayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(nextfridayOfWeek, 'MMMM')
        });
        var nextsatdayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 13);
        // week.push({Day:'Sat',Date: $A.localizationService.formatDate(nextsatdayOfWeek, 'MM/dd/yyyy')});
        var nextsundayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 14);
        week.push({
            Day: 'Sun',
            Date: $A.localizationService.formatDate(nextsundayOfWeek, 'MM/dd/yyyy'),
            DayMonth: $A.localizationService.formatDate(nextsundayOfWeek, 'MMMM')
        });


        var next2mondayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 15);
        week.push({
            Day: 'Mon',
            Date: $A.localizationService.formatDate(next2mondayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(next2mondayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(next2mondayOfWeek, 'MMMM')
        });
        var next2tuedayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 16);
        week.push({
            Day: 'Tue',
            Date: $A.localizationService.formatDate(next2tuedayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(next2tuedayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(next2tuedayOfWeek, 'MMMM')
        });
        var next2weddayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 17);
        week.push({
            Day: 'Wed',
            Date: $A.localizationService.formatDate(next2weddayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(next2weddayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(next2weddayOfWeek, 'MMMM')
        });
        var next2thuedayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 18);
        week.push({
            Day: 'Thur',
            Date: $A.localizationService.formatDate(next2thuedayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(next2thuedayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(next2thuedayOfWeek, 'MMMM')
        });
        var next2fridayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 19);
        week.push({
            Day: 'Fri',
            Date: $A.localizationService.formatDate(next2fridayOfWeek, 'MM/dd/yyyy'),
            Dayview: $A.localizationService.formatDate(next2fridayOfWeek, 'dd'),
            DayMonth: $A.localizationService.formatDate(next2fridayOfWeek, 'MMMM')
        });
        var next2satdayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 20);
        //week.push({Day:'Sat',Date: $A.localizationService.formatDate(next2satdayOfWeek, 'MM/dd/yyyy'),Dayview : $A.localizationService.formatDate(next2fridayOfWeek, 'dd'),  DayMonth : $A.localizationService.formatDate(next2satdayOfWeek, 'MMMM')});
        var next2sundayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 21);
        week.push({
            Day: 'Sun',
            Date: $A.localizationService.formatDate(next2sundayOfWeek, 'MM/dd/yyyy'),
            DayMonth: $A.localizationService.formatDate(next2sundayOfWeek, 'MMMM')
        });

        var beforeOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 20);
        // var beforeOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()-6);

        console.log('currentWeekDates 2 ========> ');
        component.set("v.weekDates", week);
        component.set("v.beforeweekDate", beforeOfWeek);
        component.set("v.weekfirstDate", mondayOfWeek);
        component.set("v.weeklastDate", next2sundayOfWeek);

        var action = component.get("c.getWeekRecords");
        var fromDate = $A.localizationService.formatDate(mondayOfWeek, 'MM/dd/yyyy');
        var fromdateStr = fromDate.toString()
        var toDate = $A.localizationService.formatDate(sundayOfWeek, 'MM/dd/yyyy');
        var todateStr = toDate.toString();
        console.log('Start Date :: ', fromdateStr);
        console.log('End Date :: ', todateStr);
        console.log('Project Id ::',component.get("v.selectedproject").Id);
        action.setParams({
            fromDate: fromdateStr,
            toDate: todateStr,
            projectId: component.get("v.selectedproject").Id
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            console.log('state ----------' + state + ' ' + JSON.stringify(response.getReturnValue()));
            if (component.isValid() && state === "SUCCESS") {
                var list = response.getReturnValue();
                component.set("v.eventList", list);
                component.set("v.showSpinner", false);
                component.taskdrawTable('');
            } else {
                component.set("v.showSpinner", false);
            }
        });
        $A.enqueueAction(action);
    },


    currentMonthsDates: function (component, todayDate) {
        var today = new Date(todayDate);
    },
})