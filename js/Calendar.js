
var Calendar = (function () {
    var str = "";
    var dateToBe = new Date();
    var dd = ('0' + dateToBe.getDate()).slice(-2);
    var mm = ('0' + (dateToBe.getMonth() + 1)).slice(-2);
    var yy = dateToBe.getFullYear();
    var intailize = function () {
        bindDates();
        bindDateChange();
        resizeEvent();
        resizeDiv();
        $('#todayDate').trigger('click');
        bind12HrFormat();
        changeFormat();
    };
    var bind12HrFormat = function () {
        $('#12Hrs').unbind('change').change(function () {
            changeFormat();

        });
    };
    var changeFormat = function () {
        if ($('#12Hrs').is(':checked')) {
            $('.12Hour').show();
            $('.24Hour').hide();
        } else {
            $('.24Hour').show();
            $('.12Hour').hide();
        }
    };
    var returnDate = function (flag) {

        if ($('#datepicker').val().trim().length == 0) {
            dateToBe = new Date();
        } else {
            dateToBe = new Date($('#datepicker').val());
        }
        if (flag == 0) {
            dateToBe = dateToBe.setDate(dateToBe.getDate() + 1);
        }
        else if (flag == 1) {
            dateToBe = dateToBe.setDate(dateToBe.getDate() - 1);
        } else {
            dateToBe = new Date();
        }
        dateToBe = new Date(dateToBe);
        dd = ('0' + dateToBe.getDate()).slice(-2);
        mm = ('0' + (dateToBe.getMonth() + 1)).slice(-2);
        yy = dateToBe.getFullYear();
    };
    var bindDateChange = function () {
        $('#datepicker').change(function () {
            var datePart = new Date($('#datepicker').val()).toDateString();
            $('.displayDate').html(datePart);
            getEvents(datePart);
        });
    };
    var resizeEvent = function () {
        $(window).resize(function () {
            var width = $('td[data-hour="' + 4 + '"].hour1stHalf').width() - 2;
            $('.eventText').width(width);
            resizeDiv();
        });
    }
    var resizeDiv = function () {

        $('.tableContainer').height(($(window).height()) - ($('.controlsDiv').height()) - 30);
    };
    var getEvents = function (datePart) {
        var startHourTime = [];
        var endHourTime = [];
        var startMinuteTime = [];
        var endMinuteTime = [];
        var eventName = [];
        var events = [];
        var top = 0;
        var bottom = 0;
        var whichHalf = '';
        var endElement, eventHtml = '', startElement, startTime, endTime, tdHeight = $('td[data-hour="' + 4 + '"].hour1stHalf').height(),
            startPixel, endPixel, addStartPixel, addEndPixel, height, startTimeFinal, endTimeFinal;
        var width = $('td[data-hour="' + 4 + '"].hour1stHalf').width() - 2;
        console.clear();
        for (var i = 0; i < jsonData.length; i++) {
            if (new Date(datePart).toDateString() == new Date(jsonData[i].startTime).toDateString()) {
                console.log(jsonData[i].title + "   " + jsonData[i].startTime + "    " + jsonData[i].endTime);
                startTime = new Date(jsonData[i].startTime);
                startHourTime.push(startTime.getHours());
                startMinuteTime.push(startTime.getMinutes());
                endTime = new Date(jsonData[i].endTime);
                endHourTime.push(endTime.getHours());
                endMinuteTime.push(endTime.getMinutes());
                eventName.push(jsonData[i].title);
            }
        }
        for (i = 0; i < startHourTime.length; i++) {

            if (startMinuteTime[i] >= 30) {
                whichHalf = 'hour2ndHalf';
                addStartPixel = ((startMinuteTime[i] - 30) * tdHeight) / 30;
            } else {
                whichHalf = 'hour1stHalf';
                addStartPixel = (startMinuteTime[i] * tdHeight) / 30;
            }
            startElement = $('td[data-hour="' + startHourTime[i] + '"].' + whichHalf);
            if (endMinuteTime[i] >= 30) {
                whichHalf = 'hour2ndHalf';
                addEndPixel = ((endMinuteTime[i] - 30) * tdHeight) / 30;
            } else {
                whichHalf = 'hour1stHalf';
                addEndPixel = (endMinuteTime[i] * tdHeight) / 30;
            }
            endElement = $('td[data-hour="' + endHourTime[i] + '"].' + whichHalf);

            top = $(startElement).position().top + addStartPixel;
            bottom = $(endElement).position().top + addEndPixel;
            height = bottom - top;


            startTimeFinal = get2HourFormat(startHourTime[i], startMinuteTime[i]);
            endTimeFinal = get2HourFormat(endHourTime[i], endMinuteTime[i]);
            eventHtml = eventHtml + '<div  class="eventText" style=" width:' + width + 'px; background-color:#F0F5F6;position:absolute;top:' + top + 'px; height:' + height + 'px; border: 1px solid #00FF39;">\
               <span class="fa fa-calendar calIcon"></span>' + eventName[i] + '<span class="12Hour"> (' + startTimeFinal[0] + ' to ' + endTimeFinal[0] + ')</span> <span class="24Hour"> (' + startTimeFinal[1] + ' to ' + endTimeFinal[1] + ')</span>\
               <span class="btn-group pull-right btn-group-xs" role="group"><button type="button" class="btn btn-default">Edit</button><button type="button" class="btn btn-default">Delete</button><button type="button" class="btn btn-default">Cancel</button></div></div>';


        }
        $('.mainEventTd').html(eventHtml);
        changeFormat();
    };
    var get2HourFormat = function (time, minutes) {
        var time12format, amPM, finalVal, preffix = '';
        if (time >= 13) {
            time12format = time - 12;
            amPM = 'PM';
        }
        else {
            if (time == 0) {
                time12format = 12;
            } else {
                time12format = time;
            }
            amPM = 'AM';
        }
        if (minutes <= 9) {
            preffix = '0';
        }
        return [time12format + '.' + preffix + minutes + ' ' + amPM, time + '.' + preffix + minutes];

    }
    var fillDate = function () {
        $('#datepicker').val(str.concat(yy, "-", mm, "-", (dd)));
        $('#datepicker').trigger('change');
    };
    var bindDates = function () {
        $("#datepicker").datepicker({
            showOn: "button",
            dateFormat: "yy-mm-dd",
            buttonImage: "images/calendar.gif",
            buttonImageOnly: true,
            buttonText: "Select date"
        });
        $('#todayDate').unbind('click').click(function () {
            returnDate(2);
            fillDate();
        });
        $('#previousDate').unbind('click').click(function () {
            returnDate(1);
            fillDate();
        });
        $('#nextDate').unbind('click').click(function () {
            returnDate(0);
            fillDate();
        });
    };

    return {
        start: intailize

    }

})();


$(document).ready(function () {


    Calendar.start();

});