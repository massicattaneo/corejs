/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: calendar.js
 Created Date: 27 September 2017
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016 - The Workshop  All rights reserved.
 //////////////////////////////////////////////////////////////////////////////
 */
(function () {

    cjs.Calendar = function () {};

    cjs.Calendar.googleCalendar = function () {
        var obj = {};
        var calendars = {};

        function getCalendarList(promise) {
            gapi.client.calendar.calendarList.list().then(function (e) {
                e.result.items.forEach(function (c) {
                    calendars[c.summary] = c;
                });
                promise.resolve();
            });
        }

        obj.init = function (config) {
            var promise = cjs.Need();
            gapi.load('client:auth2', function () {
                gapi.client.init({
                    discoveryDocs: config.DISCOVERY_DOCS,
                    clientId: config.CLIENT_ID,
                    scope: config.SCOPES
                }).then(function () {
                    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
                        gapi.auth2.getAuthInstance().signIn().then(function (e) {
                            getCalendarList(promise);
                        });
                    } else {
                        getCalendarList(promise);
                    }
                })
            });
            return promise;
        };

        obj.get = function (calendarOwner, datetime) {
            var cal = calendars[calendarOwner];
            var promise = cjs.Need();
            datetime.setHours(0,0,0,0);
            var timeMin = datetime.toISOString();
            datetime.setHours(23,59,59,999);
            var timeMax = datetime.toISOString();
            var params = {
                calendarId: cal.id,
                timeMin: timeMin,
                timeMax: timeMax,
                timeZone: cal.timeZone
            };
            gapi.client.calendar.events.list(params).then(function(d) {
                promise.resolve(d);
            });
            return promise;
        };

        obj.insert = function (calendarOwner, params) {
            var summary = params.summary, start= params.start, end = params.end, description = params.description;
            var promise = cjs.Need();
            var cal = calendars[calendarOwner];
            gapi.client.calendar.events.insert({
                calendarId: cal.id,
                resource: {
                    summary: summary,
                    location: cal.location,
                    start: { "dateTime": start.toISOString(), timeZone: cal.timeZone},
                    end: { "dateTime": end.toISOString(), timeZone: cal.timeZone },
                    description: description
                }
            }).then(function (e) {
                promise.resolve(e.result.id);
            });
            return promise;
        };

        obj.delete = function (calendarOwner, eventId) {
            var cal = calendars[calendarOwner];
            var promise = cjs.Need();
            var params = {
                calendarId: cal.id,
                eventId: eventId,
            };
            gapi.client.calendar.events.delete(params).then(function(err) {
                promise.resolve();
            });
            return promise;
        };

        obj.getCalendars = function (calendarOwner) {
            return calendarOwner ? calendars[calendarOwner] : calendars;
        };

        return obj;
    };

    cjs.Calendar.staticJSONAdapter = function (privateData) {
        var obj = {};

        return obj
    }

})();
