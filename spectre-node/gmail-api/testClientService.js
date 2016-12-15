/*
Import utility library and google API modules
 */
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var utils = require('./utils.js');
var modules = require('./modules.js');



/*
Defining token directory & scopes for access token permission
Access token grants access to API's defined in the scopes parameter
Access tokens shall be issued only for the scopes mentioned here,i.e only these scope defined APIs can be accessed by the access token
 */
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var TOKEN_DIR = 'D:/Spectre/spectre-node/' + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'node-client.json';


/*
Reading Oauth2.0 credentials from 'client_secret_key.json'
 */
fs.readFile('client_secret_key.json', function processClientSecretKeys(err, content) {
    if (err) {
        console.log('Error loading client secret file');
        console.log('Err: ' + err);
        return;
    } else {
        var credentials = JSON.parse(content);
        //var oauth2Client = authenticate_authorize(credentials);

        var listLabels = modules.getLabels;
        var getMessages = modules.getMessageList;
        var getMessageById = modules.getMessageByIdDefault;
        var getMessageFromIdCustom = modules.getMessageFromIdCustom;
        authenticate_authorize(credentials, getMessageFromIdCustom);
    }
});

/*
 Create Oauth2 client using application Oauth2.0 credentials
 */
function authenticate_authorize(credentials, callback) {
    //function authenticate_authorize(credentials, callback) {
    var clientId = credentials.installed.client_id;
    var clientSecret = credentials.installed.client_secret;
    var redirectUrl = credentials.installed.redirect_uris[0];
    //using the googleAuth library to create the OAuthClient
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    //Check if access token already exits in dir
    fs.readFile(TOKEN_PATH, function(err, token) {
        if (err) {
            console.log('Error ' + err);
            oauth2Client = getNewToken(oauth2Client);
            callback(oauth2Client);
            //return oauth2Client;
        } else {
            console.log("Token exists in local directory");
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}

/*
To get new token, Generate authentication url for getting user consent for new access token request
Get and store a new access token to APIs after prompting for user authorization & consent
Any request to Google auth server needs Oauth Client
 */
function getNewToken(oauth2Client) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', //offline gets refresh_token(if token expires refreshes automatically)
        scope: SCOPES
    });
    console.log('Authorize this application to access data by visting this url ' + authUrl);

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the code from that page here: ', function(authCode) {
        rl.close();
        //Requesting for access token with authorization code
        oauth2Client.getToken(authCode, function(err, token) {
            if (err) {
                console.log("Error while trying to retrieve access token " + err);
                return;
            } else {
                console.log("New access token generated");
                //store new token in local directory
                storeToken(token);
                oauth2Client.credentials = token;
                return oauth2Client;
            }
        });
    });
}

/*
Store the newly genearted token in local dir
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != "EEXIST") {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to' + TOKEN_PATH);
}
