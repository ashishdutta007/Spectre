var google = require('googleapis');
var googleAuth = require('google-auth-library');
var fs = require('fs');
var utils = require('./utils.js');

//global option
//google.options({ auth: oauth2Client });

/*
@param oauth2Client
@return list of Labels 
*/
exports.getLabels = function listLabels(oauth2Client) {
    //From the list of all google apis in 'google' we need the api for gmail('v1')
    var gmail = google.gmail('v1');

    //Setting oauth2Client as a service level option
    //In the gmail api we need the list method in the [Users.labels] resource
    gmail.users.labels.list({
        auth: oauth2Client,
        userId: 'me'
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        } else {
            var labels = response.labels;
            if (labels.length === 0) {
                console.log('No labels found.');
            } else {
                console.log('Labels:');
                labels.forEach(function(element, index) {
                    console.log('-', element.name);
                });
            }
        }
    });
};

/*
@oauth2Client
@return List of messages based on query parameters
 */
exports.getMessageList = function listMessages(oauth2Client) {

    var gmail = google.gmail({
        auth: oauth2Client,
        version: 'v1'
    });
    gmail.users.messages.list({
        includeSpamTrash: false,
        maxResults: 500,
        q: "",
        userId: 'me'
    }, function(err, response) {
        if (err) {
            console.log("The API returned an error " + err);
            return;
        } else {
            /*msgs = response.messages;
            msgs.forEach(function(index, el) {
                console.log('-' + el);
            });*/
            console.log(response.messages);
        }
    });
};

/*
@param messageList retrieved from inbox
@param oauth2Client
@return get message by messageID
 */
exports.getMessageByIdDefault = function getMessage(messageList, oauth2Client) {

    var writeMsgId2File = utils.writeAllMsgIds;
    var gmail = google.gmail({
        auth: oauth2Client,
        version: 'v1'
    });
    messageList.forEach(function(element) {
        messageId = element.id;
        gmail.users.messages.get({
            'userId': 'me',
            'id': messageId
        }, function(err, response) {
            if (err) {
                console.log("The API returned an error " + err);
                return;
            } else {
                console.log(response.payload.body.data);
                data = JSON.stringify(response.payload.body.data + "\n");
                fs.writeFile('./message.txt', data, function(err) {
                    if (err) {
                        console.log("Error while writing to file");
                        return;
                    } else {
                        console.log("Data is saved to file");
                    }
                });
            }
        });
    });
};

/*
@param oauth2client
@returns Stores the messages to a file retrieved by their IDs
*/
exports.getMessageFromIdCustom = function getMessageFromIdCustom(oauth2Client) {

    var gmail = google.gmail('v1');
    gmail.users.messages.list({
        auth: oauth2Client,
        includeSpamTrash: false,
        maxResults: 100,
        q: "",
        userId: 'me'
    }, function(error, response) {
        if (error) {
            console.log('The API returned an error 1: ' + error);
            return;
        } else {
            //console.log('response.messages');
            //console.log(response.messages);

            var msgIdList = [];
            for (var i = 0; i < response.messages.length; i++) {
                msgIdList[i] = response.messages[i];
                //console.log("msgIdList[i]- " + msgIdList[i]);
            }
            //msgIdList = [response.messages[0]];
            //console.log('msgIdList- ');
            //console.log(msgIdList);            

            msgIdList.forEach(function(el) {
                var messageId = el.id;
                console.log("- " + messageId);
                gmail.users.messages.get({
                    auth: oauth2Client,
                    userId: 'ashishdutta007@gmail.com',
                    'id': messageId
                }, function(error, response) {
                    if (error) {
                        console.log("The API returned an error 2: " + error);
                        return;
                    } else {
                        /* console.log("Async callback snippet " + response.snippet);
                         var data = JSON.stringify(messageId + ": " + response.snippet) + "\n";
                         fs.appendFile('./snippets.txt', data, function() {
                             if (error) {
                                 console.log("Unable to write snippets to file " + error);
                             } else {
                                 //File I/O(read/write/append) takes time so the previous console is printed ahead 
                                 console.log("Saved to file");
                             }
                         });*/

                        console.log("Response recieved");
                        //console.log(response.payload.headers);

                        var subject = response.payload.headers.filter(function(element) {
                            if (element.name == 'Subject') {
                                return element.value;
                            }
                        });
                        var _from = response.payload.headers.filter(function(element) {
                            if (element.name == 'From') {
                                return element.value;
                            }
                        });

                        var data = JSON.stringify("From: " + _from[0].value + " Subject: " + subject[0].value) + "\n";
                        fs.appendFile('./mailSubjects.txt', data, function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Subject of mail saved");
                            }
                        });
                    }
                });
            });
            //asynchronous prints first
            console.log("msgIdList.length: " + msgIdList.length);
        }
    });
};
