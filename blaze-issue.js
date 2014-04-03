Posts = new Meteor.Collection('posts');

if (Meteor.isClient) {
  Template.posts.posts = function () {
    return Posts.find();
  };

  Template.comments.comments = function() {
    return _.sortBy(this.comments,function(comment){return comment.order});
  };

  Template.comments.rendered = function() {
    var self = this;
    this.$('.comments-list').sortable({
    helper:"clone",
    update: function(e,ui) {
      var reorderedComments = [];
      $('.comments-list li').each(function(ind,elem) {
        // Not a good pattern, but this really should work
        reorderedComments.push({text:$.trim($(elem).text()),order:ind});
      });
      console.log("Reordered comments:",reorderedComments);
      Posts.update({_id:self.data._id},{$set:{comments:reorderedComments}});
      console.log("Post:",Posts.findOne({_id:self.data._id}));
    }
    }); 
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Posts.find().count()) {
      Posts.insert({
        _id:"1",
        name:"Example post",
        comments:[
          {text:"Comment 1",order:0},
          {text:"Comment 2",order:1}
        ]
      });
    }
  });
}
