exports.getMessageFromIdCustom = function getMessageFromIdCustom(oauth2Client) {

    var gmail = google.gmail('v1');
    gmail.users.messages.list({
        auth: oauth2Client,
        includeSpamTrash: false,
        maxResults: 500,
        q: "",
        userId: 'me'
    }, function(error, response) {
        if (error) {
            console.log('The API returned an error 1: ' + error);
            return;
        } else {
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
                    userId: 'me',
                    'id': messageId
                }, function(error, response) {
                    if (error) {
                        console.log("The API returned an error 2: " + error);
                        return;
                    } else {
                        console.log("Async callback snippet-1- " + response.snippet);
                        var data = JSON.stringify("--" + messageId + ": " + response.snippet);
                        fs.appendFile('./snippets.txt', data, function() {
                            if (error) {
                                console.log("Unable to write snippets to file " + error);
                            } else {
                            		//File I/O takes time so the previous console is printed
                                console.log("File is saved-2-");
                            }
                        });
                        /*console.log(response.payload.body.data);
                        var data = JSON.stringify(response.payload.body.data + "\n");
                        fs.writeFile('./mails.txt', data, function(error) {
                            if (error) {
                                console.log("Unable to write to file " + error);
                            } else {
                                console.log("Mails data saved to file");
                            }
                        });*/
                    }
                });
            });
        }
        //asynchronous prints first
        console.log("msgIdList.length: " + msgIdList.length);
    });
};
