// Saves options locally
function save_options() {
  var database = document.getElementById('database').checked;
  var secure = document.getElementById('secure').checked;
  var highlight = document.getElementById('highlight').checked;
  var foriegn = document.getElementById('foriegn').checked;
  chrome.storage.local.set({
    'UseDatabase': database,
    'CheckSecure': secure,
    'Highlight': highlight,
    'CheckForiegnCharacters': foriegn
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in locally.
function restore_options() {
  //Default is all true
  chrome.storage.local.get({
    UseDatabase: true,
    CheckSecure: true,
    Highlight: true,
    CheckForiegnCharacters: true
  }, function(items) {
    document.getElementById('database').checked = items.UseDatabase;
    document.getElementById('secure').checked = items.CheckSecure;
    document.getElementById('highlight').checked = items.Highlight;
    document.getElementById('foriegn').checked = items.CheckForiegnCharacters;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);