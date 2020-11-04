$(document).ready(function () {

  // listContainer holds all of our posts
  var listContainer = $(".list-container");
  var postUrgencySelect = $("#urgency");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete-btn", handlePostDelete);
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
    $.get("/api/posts" + urgencyString, function (data) {
      // console.log("Posts", data);
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
      .then(function(response) {
        console.log(response);
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=like+a+boss&api_key=dc6zaTOxFJmzC&limit=1";
    
        // call ajax that allows you to make a query of info on the web
        // ajax takes url and get method 
        $.ajax({
            url: queryURL,
            method: "GET",
        })
    
            //after you look at api- run this
            .then(function (response) {
                console.log(response);
                // saving img to imgeURL
                var imageURL = response.data[0].url;
                console.log(response.data[0].url);
                // creating and storing an img tag
                var likeABoss = $("<img>");
    
                // image element likeABoss and change the souce is the url
                //add an alt attribute 
                likeABoss.attr("src", imageURL);
                likeABoss.attr("alt", "like a boss image");
    
                //
                $("#images").prepend(likeABoss);
            });
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
    if (post.urgency === "low") {
      dueDate = 60;
    }
    else if (post.urgency === "medium") {
      dueDate = 30;
    }
    else if (post.urgency === "high") {
      dueDate = 7;
    }
    var newPostCard = $("<div>");
    newPostCard.addClass("card");
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("✓");
    deleteBtn.addClass("delete-btn");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-default");
    var newPostTitle = $("<h2>");
    newPostTitle.addClass("title");
    var newPostDate = $("<small>");
    newPostDate.addClass("date");
    var newPostUrgency = $("<h5>");
    newPostUrgency.addClass("urgency");
    newPostUrgency.text(post.urgency);
    newPostUrgency.css({
      float: "right"
    });
    var newPostCardBody = $("<div>");
    newPostCardBody.addClass("card-body");
    newPostCardBody.append(deleteBtn);
    newPostCardBody.append(editBtn);
    var newPostBody = $("<p>");
    newPostTitle.text(post.title + " ");
    newPostBody.text(post.body);
    var formattedDate = new Date(post.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do, YYYY");
    newPostDate.text(formattedDate);
    newPostTitle.append(newPostDate);
    newPostTitle.append(newPostUrgency);



    newPostCardHeading.append(newPostTitle);
    // newPostCardHeading.append(newPostUrgency);
    newPostCardBody.append(newPostBody);
    newPostCard.append(newPostCardHeading);
    newPostCard.append(newPostCardBody);
    newPostCard.data("post", post);
    return newPostCard;
  }

  


  // conencting urgency level to date 
  // var lowUrgency = newmoment().add(2, 'month');
  // var mediumUrgency = newmoment().add(30, 'month');
  // var highUrgency = newmoment().add(1, 'week');

  // $("lowUrgency-date").text(lowUrgency.format("MMMM Do, YYYY")
  // $("mediumUrgency-date").text(mediumUrgency.format("MMMM Do, YYYY")
  // $("highUrgency-date").text(Urgency.format("MMMM Do, YYYY")


  // This function figures out which post we want to delete and then calls
  // deletePost
  function handlePostDelete() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    deletePost(currentPost.id)
    // if (deletePost)
    // return 
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
    var messageH2 = $("<h6>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("Need to add a task? <br> Let's get started. <br> <a class='here' href='/todo'>New Task</a>");
    listContainer.append(messageH2);
    messageH2.addClass("messageH2");
  }

  // This function handles reloading new posts when the urgency changes
  function handleUrgencyChange() {
    var newPostUrgency = $(this).val();
    getPosts(newPostUrgency);
  }

});
