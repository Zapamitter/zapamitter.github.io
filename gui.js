var ipcRenderer = require('electron').ipcRenderer;
var db = [],
    queryStr = '';

function query(queryStr, entry) {
    if (!queryStr) {
        return true;
    }

    return entry.Name.toUpperCase().includes(queryStr) ||
        entry.Phone.toUpperCase().includes(queryStr) ||
        entry.Item.toUpperCase().includes(queryStr) ||
        entry.Email.toUpperCase().includes(queryStr);

}

function render() {
    var output = '';
    db.forEach(function(row, id) {
        var valid = query(queryStr, row);
        console.log(valid, row);
        if (valid) {
            output += `<tr id="row-id-${id}"><td>${row.Name}</td><td>${row.Item}</td><td>${row.Email}</td><td>${row.Phone}</td><td>${row.Notified}</td><td>${row.Paid}</td><td onclick="setUpEditRow('${id}')" class="pointer">Edit</td><td onclick="deleteRow(${id})" class="pointer">Delete</td></tr>`
        }
    });
    var body = document.getElementById('csvdocs');
    body.innerHTML = output;
}

ipcRenderer.on('update', function(event, updatedDB) {
    db = updatedDB;
    render();
});

ipcRenderer.on('saved', function() {
    alert('Saved!');
});

function saveDB() {
    ipcRenderer.send('update', db);
}

function deleteRow(id) {
    db.splice(id, 1);
    saveDB();
}

function addRow() {
    var entry = {
        Name: $('#name').val(),
        Item: $('#item').val(),
        Email: $('#email').val(),
        Phone: $('#phone').val(),
        Paid: $('#paid').val(),
        Notified: $('#notified').val(),
    }

    console.log('addRow');
    if (!entry.Name) {
        alert('Name Required!');
        return;
    }
    if (!entry.Item) {
        alert('Item Required!');
        return;
    }
    if (!entry.Email) {
        alert('Email Required!');
        return;
    }
    if (!entry.Phone) {
        alert('Phone Required!');
        return;
    }
    if (!entry.Paid) {
        alert('Paid Required!');
        return;
    }
    if (!entry.Notified) {
        alert('Notified Required!');
        return;
    }
    console.log('new entry', entry)
    db.push(entry);
    console.log
    saveDB();
    $('#name').val('');
    $('#item').val('');
    $('#email').val('');
    $('#phone').val('');
    $('#paid').val('No');
    $('#notified').val('No');

}

function setQuery() {
    queryStr = $('#search').val().toUpperCase();
    console.log(queryStr);
    render();
}


function setUpEditRow(id) {
    var entry = db[id];
    $('#edit-name').val(entry.Name);
    $('#edit-item').val(entry.Item);
    $('#edit-email').val(entry.Email);
    $('#edit-phone').val(entry.Phone);
    $('#edit-paid').val(entry.Paid);
    $('#edit-notified').val(entry.Notified);
    $('#edit-id').attr('data-id', id);
    $('#editModal').modal('show');
}


function applyEdit() {
    var entry = {
            Name: $('#edit-name').val(),
            Item: $('#edit-item').val(),
            Email: $('#edit-email').val(),
            Phone: $('#edit-phone').val(),
            Paid: $('#edit-paid').val(),
            Notified: $('#edit-notified').val(),
        },
        id = $('#edit-id').attr('data-id');


    if (!entry.Name) {
        alert('Name Required!');
        return;
    }
    if (!entry.Item) {
        alert('Item Required!');
        return;
    }
    if (!entry.Email) {
        alert('Email Required!');
        return;
    }
    if (!entry.Phone) {
        alert('Phone Required!');
        return;
    }
    if (!entry.Paid) {
        alert('Paid Required!');
        return;
    }
    if (!entry.Notified) {
        alert('Notified Required!');
        return;
    }
    db[id] = entry;
    console.log(db);
    saveDB();
    $('#editModal').modal('hide');

}

ipcRenderer.send('open');