var google = require('googleapis');
var googleAuth = require('google-auth-library');
var fs = require('fs');

exports.writeAllMsgIds = function writeAllMsgIds(messageList) {
    messageList.forEach(function(element) {
        var msgId = element.id;
        var data = JSON.stringify(msgId + ",");
        fs.writeFile('./messageIds.txt', msgId, function(error) {
            if (error) {
                console.log("Error while wriring file" + error);
                return;
            } else {
                console.log("Data saved to file");
            }
        });
    });
};

exports.readAllMsgIds = function readAllMsgIds(fileName) {
    fs.readFile();
};


