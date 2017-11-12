$(document).ready(function() {
	console.log("script loaded");

	// make GET request to scrap route, then show success notification
	$(document).on("click", "#scrape", function() {
		console.log("delete was clicked");
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
	$(document).on("click", ".delete", function() {
		console.log("delete was clicked");
		$(this)
			.parent()
			.hide();
	});
	// Show comments modal, then populate with the article's comments
	$(document).on("click", ".toggle-comments", function() {
		var id = $(this).attr("data-id");
		console.log("show comments was clicked");
		$("comments-modal").addClass("is-active");
		$.ajax({
			url: `/comments/${id}`,
			type: "GET"
		});
	});
	// Close comments modal
	// $(document).on("click", ".modal-close", function() {

	// })
});
