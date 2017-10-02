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

    cjs.Calendar.googleCalendar = function (token) {
        var obj = {};
        var calendars = {};

        function getCalendarList(promise) {
            gapi.client.calendar.calendarList.list().then(function (e) {
                e.result.items.forEach(function (c) {
                    calendars[c.id] = c;
                });
                promise.resolve();
            });
        }

        obj.setToken = function(access_token) {
            gapi.client.setToken({ access_token: access_token });
        };

        obj.init = function (config) {
            var promise = cjs.Need();
            gapi.load('client:auth2', function () {
                if (token) {
                    gapi.client.setToken({
                        access_token: token
                    });
                    gapi.client.load('calendar', 'v3', function () {
                        getCalendarList(promise);
                    });
                } else {
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
                }
            });
            return promise;
        };

        obj.get = function (calendarId, datetime) {
            var cal = calendars[calendarId];
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

        obj.insert = function (calendarId, params) {
            var summary = params.summary, start= params.start,
                end = params.end, description = params.description, processId = params.processId;
            var promise = cjs.Need();
            var cal = calendars[calendarId];
            gapi.client.calendar.events.insert({
                calendarId: cal.id,
                resource: {
                    summary: summary,
                    location: cal.location,
                    start: { "dateTime": start.toISOString(), timeZone: cal.timeZone},
                    end: { "dateTime": end.toISOString(), timeZone: cal.timeZone },
                    description: description,
                    extendedProperties: {private: {processId: processId}}
                }
            }).then(function (e) {
                promise.resolve(e.result.id);
            });
            return promise;
        };

        obj.delete = function (calendarId, eventId) {
            var cal = calendars[calendarId];
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

        obj.update = function (calendarId, eventId, modify) {
            var cal = calendars[calendarId];
            var promise = cjs.Need();
            gapi.client.calendar.events.get({calendarId: cal.id,eventId: eventId}).then(function (e) {
                var params = {
                    calendarId: cal.id,
                    eventId: eventId,
                    summary: modify.summary || e.result.summary,
                    location: cal.location,
                    start: { "dateTime": modify.start ? modify.start.toISOString() : e.result.start.dateTime, timeZone: cal.timeZone},
                    end: { "dateTime": modify.end ? modify.end.toISOString() : e.result.end.dateTime, timeZone: cal.timeZone },
                    description: modify.description || e.result.description,
                    extendedProperties: {private: { processId: modify.processId || (e.result.extendedProperties ? e.result.extendedProperties.private.processId : undefined) }}
                };
                gapi.client.calendar.events.update(params).then(function(err) {
                    promise.resolve();
                });
            });
            return promise;
        };

        obj.getCalendars = function (calendarId) {
            return calendarId ? calendars[calendarId] : calendars;
        };

        return obj;
    };

    cjs.Calendar.staticJSONAdapter = function (privateData) {
        var obj = {};
        return obj
    }

})();
