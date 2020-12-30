// sign--in derived from quickstart https://developers.google.com/calendar/quickstart/js
// from Chrome Developer Console
var CLIENT_ID = '448597758647-6upk7tbq1vm2vesqlhgvp74l2860of1e.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBf7EYyZz_D8fDHzqwtMlHI-d8ge9Sald0';

// API Discovery Docs
var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];

// auth scopes required by API
var SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

// get buttons
var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

// on load called to load auth2 library and API client library
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// initializes API client library and sets up sign-in state listeners
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // handle the initial sign-in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2))
    });
}

// called when signinStatus changes
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listUpcomingEvents();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

// Sign in the user upon button click
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

// Sign out the user upon button click
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

// Append a pre element to the body giving results of API call
// @param {string} message Text to be placed in pre element.
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

// print the summary and start datetime/date of the next 10 events in the authorized user's calendar
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function(response) {
        var events = response.result.items;
        appendPre('Upcoming events:');

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                appendPre(event.summary + ' (' + when + ')')
            }
        } else {
            appendPre('No upcoming events found.');
        }
    });
}