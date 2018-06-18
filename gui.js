var ipcRenderer = require('electron').ipcRenderer;
var db = [];


function render() {
    var output = '';
    db.forEach(function(row, id) {
        output += `<tr id="row-id-${id}"><td>${row.Name}</td><td>${row.Item}</td><td>${row.Email}</td><td>${row.Phone}</td><td>${row.Notified}</td><td>${row.Paid}</td><td>Edit</td><td onclick="deleteRow(${id})">Delete</td></tr>`
    });
    var body = document.getElementById('csvdocs');
    body.innerHTML = output;
}

ipcRenderer.on('update', function(event, updatedDB) {
    db = updatedDB;
    render();
});

function saveDB() {
    ipcRenderer.send('save', db);
}

function deleteRow(id) {
    db.splice(id, 1);
    ipcRenderer.send('update', db);
}

function addRow() {
    var entry = {
        Name: $('#name').val(),
        Item: $('#item').val(),
        Email: $('#email').val(),
        Phone: $('#phone').val(),
        Notified: $('#notified').val(),
    }
    db.push(entry);
    saveDB();
}

function setQuery() {
    var query = $('#search').val();
    console.log(query);
    ipcRenderer.send('query', query);
}

function showEdit(id) {

};

function setUpeditRow(id) {
    var entry = db[id];
    $('#edit-name').val(entry.Name);
    $('#edit-item').val(entry.Item);
    $('#edit-email').val(entry.Email);
    $('#edit-phone').val(entry.Phone);
    $('#edit-notified').val(entry.Notified);
    $('#edit-id').attr('data-id', id);
    showEdit(id);
}


function applyEdit(id) {
    var entry = {
        Name: $('#name').val(),
        Item: $('#item').val(),
        Email: $('#email').val(),
        Phone: $('#phone').val(),
        Notified: $('#notified').val(),
    }
    db[id] = entry;
    saveDB();
}

ipcRenderer.send('open');