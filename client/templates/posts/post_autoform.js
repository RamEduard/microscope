AutoForm.addHooks(['postNew', 'postEdit'], {
    after: {
        insert: function (error, result) {
            if (error) {
                console.log("Insert Error:", error);
            } else {
                // ga("send", "event", "profile", "insert", result.title);
                Router.go('postEdit', {
                    _id: result
                });
            }
        },
        update: function (error, result) {
            if (error) {
                console.log("Update Error:", error);
            } else {
                // ga("send", "event", "profile", "update", result.title);
                Router.go('postEdit', {
                    _id: Router.current().params._id
                });
            }
        }
    }
});
