Template.postNew.events({
    'submit form': function(e) {
        e.preventDefault();

        var post = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        };

        Meteor.call('postInsert', post, function(error, result) {
            // display error to the user and abort
            if (error)
                return $.notify(error.reason, 'error');
            else if (result.postExists)
                return $.notify('Post already exists!', 'warn');
            else
                $.notify('Post created successfully!', 'success');

            Router.go('home');
        });
    }
})
