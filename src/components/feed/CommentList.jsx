import React, { useState, useContext } from "react";
import Comment from "./Comment";
import { AuthContext } from "../../context/AuthContext";
import { PostContext } from "../../context/PostContext";

const CommentList = ({ postId, comments }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState(comments);

  const { currentUser } = useContext(AuthContext);
  const { addComment } = useContext(PostContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim() || !currentUser) return;

    setIsSubmitting(true);

    try {
      const createdComment = await addComment(postId, newComment);
      setLocalComments([...localComments, createdComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
      {/* Comment Form */}
      {currentUser && (
        <form onSubmit={handleSubmit} className="flex items-center mb-4">
          <img
            src={
              currentUser.profilePicture || "https://via.placeholder.com/150"
            }
            alt={currentUser.username}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </form>
      )}

      {/* Comments */}
      <div className="space-y-3">
        {localComments.length === 0 ? (
          <p className="text-gray-500 text-center py-2">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          localComments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;
