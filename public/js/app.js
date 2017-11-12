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
			// then display modal
			$(".comments-modal").addClass("is-active");
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
