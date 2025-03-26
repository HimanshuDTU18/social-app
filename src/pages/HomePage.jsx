import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PostContext } from "../context/PostContext";
import PostCard from "../components/feed/PostCard";
import PostForm from "../components/feed/PostForm";

const HomePage = () => {
  const { currentUser } = useContext(AuthContext);
  const { getAllPosts, loading } = useContext(PostContext);
  const [posts, setPosts] = useState([]); 

  useEffect(() => {
    // Fetch posts when component mounts
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [getAllPosts]);

  // Handle post creation to update state
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div>
      {/* Post creation form for logged in users */}
      {currentUser && (
        <div style={{ marginBottom: "20px" }}>
          <PostForm onPostCreated={handlePostCreated} />
        </div>
      )}

      {/* Post feed section */}
      <div>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>
          Recent Posts
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "30px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ marginBottom: "10px" }}>No posts to display.</p>
            {!currentUser && (
              <p>
                <Link
                  to="/login"
                  style={{ color: "#1877f2", marginRight: "5px" }}
                >
                  Login
                </Link>{" "}
                or
                <Link
                  to="/register"
                  style={{ color: "#1877f2", marginLeft: "5px" }}
                >
                  Register
                </Link>{" "}
                to create posts.
              </p>
            )}
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
