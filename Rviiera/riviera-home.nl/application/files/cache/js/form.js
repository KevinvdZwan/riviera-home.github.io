console.log('It works');
$(document).ready(function () {
    $('.submit').click(function (evt) {
        console.log('Clicked button');
        var salutation = $.('.salutation').val();
        var name = $('.name').val();
        var email = $('.email').val();
        var message = $('.message').val();
        var statusElm = $('.status');
        statusElm.empty();
        if (document.getElementsByName('salutation').checked) {
            //Radio button is checked
        } else {
            evt.preventDefault();
            statusElm.append('<div>Kruis een aanhef aan!</div>')
        }
        if (name.length > 2) {
            statusElm.append('<div>Naam staat goed</div>');
        } else {
            evt.preventDefault();
            statusElm.append('<div>Naam staat niet goed</div>');
        }
        if (email.length > 5 && email.includes('@') && email.includes('.')) {
            statusElm.append('<div>Email staat goed</div>');
        } else {
            evt.preventDefault();
            statusElm.append('<div>Email staat niet goed</div>');
        }
        if (message.length > 20) {
            statusElm.append('<div>Bericht staat goed</div>');
        } else {
            evt.preventDefault();
            statusElm.append('<div>Bericht staat niet goed</div>');
        }
    });
});