$(document).ready(function() {
	console.log("script loaded");

	// make GET request to scrap route, then show success notification
	$(document).on("click", "#scrape", function() {
		console.log("scrape was clicked");
		$.ajax({
			url: "/scrape",
			type: "GET"
		})
			.done(function() {
				console.log("success");
				$(".scrape-success").show();
			})
			.fail(function() {
				console.log("error");
				$(".scrape-fail").show();
			})
			.always(function() {
				console.log("complete");
			});
	});
	// Closes scrape success messages
	$(document).on("click", ".refresh", function() {
		console.log("refresh was clicked");
		$(this)
			.parent()
			.hide();
	});
	// Show comments modal, then populate with the article's comments
	$(document).on("click", ".toggle-comments", function() {
		var id = $(this).attr("data-id");
		console.log("show comments was clicked");
		$.ajax({
			url: `/comments/${id}`,
			type: "GET"
		}).done(results => {
			console.log(results);
			// First, clear comments container
			$("#comments-container").empty();
			// populate modal with saved comments, if exists.
			if (results.comments.length) {
				results.comments.forEach(comment => {
					console.log(comment);
					$("#comments-container").append(
						`<p>${comment.body}</p><br>`
					);
				});
			} else {
				// Else prompt user to enter the first comment
				$("#comments-container").append(
					`<p class="text-muted">Be the first to comment!</p>`
				);
			}
			// Set comment submit buttons data-id to article's id
			console.log("before setting button data-id", results._id);
			$("button.post-comment").attr("data-id", results._id);
			// then display modal
			$(".comments-modal").addClass("is-active");
		});
	});
	// Posts a comment to DB, and to the comments modal
	$(document).on("click", ".post-comment", function(event) {
		event.preventDefault();
		var id = $(this).attr("data-id");
		console.log("post a comment was clicked");
		var body = $("#comment_body")
			.val()
			.trim();
		$.ajax({
			url: `/comments/${id}`,
			type: "POST",
			data: {
				body: body
			}
		}).done(results => {
			console.log(results);
			$("#comments-container").prepend(`<p>${body}</p><br>`);
		});
	});
	// Close comments modal
	$(document).on("click", ".modal-close", function() {
		console.log("hide comments was clicked");
		$(".comments-modal").removeClass("is-active");
	});
	$(document).on("click", ".modal-background", function() {
		console.log("hide comments was clicked");
		$(".comments-modal").removeClass("is-active");
	});
});
