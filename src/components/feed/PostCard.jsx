import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaEdit,
  FaTrash,
  FaRegClock,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { PostContext } from "../../context/PostContext";
import CommentList from "./CommentList";
import PostForm from "./PostForm";

const PostCard = ({ post }) => {
  const { currentUser, getUser } = useContext(AuthContext);
  const { toggleLike, deletePost } = useContext(PostContext);

  const [postAuthor, setPostAuthor] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    // Fetch post author and set initial like state
    const fetchAuthor = async () => {
      try {
        const authorData = await getUser(post.userId);
        setPostAuthor(authorData);
      } catch (error) {
        console.error("Error fetching post author:", error);
      }
    };

    fetchAuthor();

    // Set initial like state based on current user
    if (currentUser) {
      setIsLiked(post.likes.includes(currentUser.id));
    }
    setLikeCount(post.likes.length);
  }, [getUser, post.userId, post.likes, currentUser]);

  // Handle like/unlike
  const handleLikeToggle = async () => {
    if (!currentUser) return;

    try {
      await toggleLike(post.id);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Handle post deletion
  const handleDeletePost = async () => {
    if (!currentUser || currentUser.id !== post.userId) return;

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post.id);
        // Post will be removed from parent component's state
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Show loading state while fetching author
  if (!postAuthor) {
    return (
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        Loading post...
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Post Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "15px" }}>
        <img
          src={postAuthor.profilePicture || "https://via.placeholder.com/150"}
          alt={postAuthor.username}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
        <div style={{ flex: 1 }}>
          <Link
            to={`/profile/${postAuthor.id}`}
            style={{
              textDecoration: "none",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            {postAuthor.fullName}
          </Link>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#65676b",
              fontSize: "14px",
            }}
          >
            <FaRegClock style={{ marginRight: "5px", fontSize: "12px" }} />
            {formatDate(post.createdAt)}
          </div>
        </div>

        {/* Edit/Delete options for post owner */}
        {currentUser && currentUser.id === post.userId && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#65676b",
              }}
              aria-label="Edit post"
            >
              <FaEdit />
            </button>
            <button
              onClick={handleDeletePost}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#65676b",
              }}
              aria-label="Delete post"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div style={{ padding: "0 15px 15px" }}>
          <PostForm
            initialContent={post.content}
            initialImage={post.image}
            postId={post.id}
            isEditing={true}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <>
          <div style={{ padding: "0 15px 15px" }}>
            <p style={{ whiteSpace: "pre-line" }}>{post.content}</p>
          </div>

          {post.image && (
            <div style={{ width: "100%" }}>
              <img
                src={post.image}
                alt="Post"
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Post Stats */}
      <div
        style={{
          padding: "10px 15px",
          borderTop: "1px solid #f0f2f5",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          color: "#65676b",
        }}
      >
        <div>{likeCount > 0 && <span>{likeCount} likes</span>}</div>
        <div>
          {post.comments.length > 0 && (
            <button
              onClick={() => setShowComments(!showComments)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#65676b",
              }}
            >
              {post.comments.length} comments
            </button>
          )}
        </div>
      </div>

      {/* Post Actions */}
      <div
        style={{
          padding: "5px 15px",
          borderTop: "1px solid #f0f2f5",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <button
          onClick={handleLikeToggle}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 0",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: isLiked ? "#1877f2" : "#65676b",
            fontWeight: isLiked ? "bold" : "normal",
          }}
          disabled={!currentUser}
        >
          {isLiked ? (
            <FaHeart style={{ marginRight: "5px" }} />
          ) : (
            <FaRegHeart style={{ marginRight: "5px" }} />
          )}
          Like
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 0",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#65676b",
          }}
        >
          <FaComment style={{ marginRight: "5px" }} />
          Comment
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentList postId={post.id} comments={post.comments} />
      )}
    </div>
  );
};

export default PostCard;
