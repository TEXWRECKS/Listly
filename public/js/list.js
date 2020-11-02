$(document).ready(function() {

  // API call for random quote
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://rapidapi.p.rapidapi.com/?cat=famous&count=1",
    "method": "POST",
    "headers": {
      "x-rapidapi-key": "f86a554f3bmsh110a109aec20174p15e8f3jsn57a3f8c92af2",
      "x-rapidapi-host": "andruxnet-random-famous-quotes.p.rapidapi.com"
    }
  };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
  });


  // listContainer holds all of our posts
  var listContainer = $(".list-container");
  var postUrgencySelect = $("#urgency");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);
  postUrgencySelect.on("change", handleUrgencyChange);
  var posts;
  var dueDate;
  

  // This function grabs posts from the database and updates the view
  function getPosts(urgency) {
    var urgencyString = urgency || "";
    if (urgencyString) {
      urgencyString = "/urgency/" + urgencyString;
    }
    $.get("/api/posts" + urgencyString, function(data) {
      console.log("Posts", data);
      posts = data;
      if (!posts || !posts.length) {
        displayEmpty();
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete posts
  function deletePost(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/posts/" + id
    })
      .then(function() {
        getPosts(postUrgencySelect.val());
      });
  }

  // Getting the initial list of posts
  getPosts();
  // InitializeRows handles appending all of our constructed post HTML inside
  // listContainer
  function initializeRows() {
    listContainer.empty();
    var postsToAdd = [];
    for (var i = 0; i < posts.length; i++) {
      postsToAdd.push(createNewRow(posts[i]));
    }
    listContainer.append(postsToAdd);
  }

  // This function constructs a post's HTML
  function createNewRow(post) {
    if (post.urgency === "low"){
    dueDate = 120;
  }
    else if (post.urgency === "medium"){
      dueDate = 60;
    }
    else if (post.urgency === "high"){
      dueDate = 30;
    }
    var newPostCard = $("<div>");
    newPostCard.addClass("card");
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-default");
    var newPostTitle = $("<h2>");
    var newPostDate = $("<small>");
    var newPostUrgency = $("<h5>");
    newPostUrgency.text(post.urgency);
    newPostUrgency.css({
      float: "right",
      "font-weight": "700",
      "margin-top":
      "-15px"
    });
    var newPostCardBody = $("<div>");
    newPostCardBody.addClass("card-body");
    var newPostBody = $("<p>");
    newPostTitle.text(post.title + " ");
    newPostBody.text(post.body);
    var formattedDate = new Date(post.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    newPostDate.text(formattedDate);
    newPostTitle.append(newPostDate);
    newPostCardHeading.append(deleteBtn);
    newPostCardHeading.append(editBtn);
    newPostCardHeading.append(newPostTitle);
    newPostCardHeading.append(newPostUrgency);
    newPostCardBody.append(newPostBody);
    newPostCard.append(newPostCardHeading);
    newPostCard.append(newPostCardBody);
    newPostCard.data("post", post);
    return newPostCard;
  }

  // This function figures out which post we want to delete and then calls
  // deletePost
  function handlePostDelete() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    deletePost(currentPost.id);
  }

  // This function figures out which post we want to edit and takes it to the
  // Appropriate url
  function handlePostEdit() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    window.location.href = "/todo?post_id=" + currentPost.id;
  }

  // This function displays a message when there are no posts
  function displayEmpty() {
    listContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No list yet for this urgency, navigate <a href='/todo'>here</a> in order to create a new list.");
    listContainer.append(messageH2);
  }

  // This function handles reloading new posts when the urgency changes
  function handleUrgencyChange() {
    var newPostUrgency = $(this).val();
    getPosts(newPostUrgency);
  }

});
