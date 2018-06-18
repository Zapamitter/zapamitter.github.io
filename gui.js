ipcrender = require('ipcrender');
var db = [];
ipcrender.on('update', function(updatedDB){
    db = updatedDB;
    var output = db.reduce('',function(str,row){
        return `${str} <tr><td>${row.Name}</td><td>${row.Item}</td><td>${row.Email}</td><td>${row.Phone}</td><td>${row.Notified}</td><td>${row.Paid}</td></tr>`
    });
    var body =document.getElementById('csvdocs');
    body.innerHTML = body;

});

function saveDB(){
    ipcrender.send('save', db);
}