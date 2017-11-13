var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	body: {
		type: String
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

var Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
