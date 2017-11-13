$(document).ready(function() {
	console.log("script loaded");

	// make GET request to scrap route, then show success notification
	$(document).on("click", "#scrape", function() {
		console.log("scrape was clicked");
		$.ajax({
			url: "/scrape",
			type: "GET"
		})
			.done(function(scrape_count) {
				console.log(scrape_count);
				if (scrape_count === 0) {
					console.log("no new articles");
					$(".scrape-fail").show();
				} else {
					// $("#scrape-count").text(scrape_count);
					$(".scrape-success").show();
				}
			})
			.fail(function() {
				console.log("error");
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
			.parent()
			.parent()
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
						`<p>${comment.body}</p><span class="has-text-grey-light">${comment.created_at}</span><br><br>`
					);
				});
			} else {
				// Else prompt user to enter the first comment
				$("#comments-container").append(
					`<p class="text-muted" id="first-commenter">
						<small>Be the first to comment!</small>
					</p><br>`
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
			$("#comment_body").empty();
			$("#first-commenter").text("");
			$("#comments-container").prepend(
				`<p class="has-text-grey-light">${Date().substring(4, 31)}</p>`
			);
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
