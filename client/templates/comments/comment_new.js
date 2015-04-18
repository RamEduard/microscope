Template.commentNew.events({
    'submit form': function(e, template) {
        e.preventDefault();
        
        var $body = $(e.target).find('[name=body]');
        var comment = {
            body: $body.val(),
            postId: template.data._id
        };
        
        if (!comment.body) 
            return $.notify('Please write some content.', 'warn');
        
        Meteor.call('commentInsert', comment, function(error, result) {
            if (error)
                return $.notify(error.reason, 'error');
            else if (result.commentExists)
                return $.notify('Comment already exists!', 'warn');
            else {
                $.notify('Comment submitted successfully!', 'success');
                $body.val('');
            }
        });
    }
});