import React, { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  // Static post data for demo purposes
  const initialPosts = [
    {
      id: "1",
      userId: "1",
      content: "Just finished a new design project. What do you think?",
      image:
        "https://plus.unsplash.com/premium_photo-1661698763470-55da05629e50?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c21hbGwlMjBzaXplfGVufDB8fDB8fHww",
      createdAt: "2025-03-24T10:30:00Z",
      likes: ["2"],
      comments: [
        {
          id: "1",
          postId: "1",
          userId: "2",
          content: "Looks great! Love the colors.",
          createdAt: "2025-02-24T11:15:00Z",
        },
      ],
    },
    {
      id: "2",
      userId: "2",
      content: "Working on some new UI components today!",
      image:
        "https://plus.unsplash.com/premium_photo-1661698763470-55da05629e50?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c21hbGwlMjBzaXplfGVufDB8fDB8fHww",
      createdAt: "2023-03-09T18:20:00Z",
      likes: ["1"],
      comments: [],
    },
  ];

  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);

  // Get all posts
  const getAllPosts = () => {
    return new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        resolve(posts);
      }, 500);
    });
  };

  // Get posts for a specific user
  const getUserPosts = (userId) => {
    return new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        const userPosts = posts.filter((post) => post.userId === userId);
        setLoading(false);
        resolve(userPosts);
      }, 500);
    });
  };

  // Create a new post
  const createPost = (content, image = null) => {
    return new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        const newPost = {
          id: (posts.length + 1).toString(),
          userId: currentUser.id,
          content,
          image,
          createdAt: new Date().toISOString(),
          likes: [],
          comments: [],
        };

        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        setLoading(false);
        resolve(newPost);
      }, 500);
    });
  };

  // Update an existing post
  const updatePost = (postId, content, image = null) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTimeout(() => {
        const postIndex = posts.findIndex((post) => post.id === postId);

        if (postIndex === -1) {
          setLoading(false);
          reject(new Error("Post not found"));
          return;
        }

        if (posts[postIndex].userId !== currentUser.id) {
          setLoading(false);
          reject(new Error("You can only edit your own posts"));
          return;
        }

        const updatedPost = {
          ...posts[postIndex],
          content,
          image: image || posts[postIndex].image,
        };

        const updatedPosts = [...posts];
        updatedPosts[postIndex] = updatedPost;

        setPosts(updatedPosts);
        setLoading(false);
        resolve(updatedPost);
      }, 500);
    });
  };

  // Delete a post
  const deletePost = (postId) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTimeout(() => {
        const postIndex = posts.findIndex((post) => post.id === postId);

        if (postIndex === -1) {
          setLoading(false);
          reject(new Error("Post not found"));
          return;
        }

        if (posts[postIndex].userId !== currentUser.id) {
          setLoading(false);
          reject(new Error("You can only delete your own posts"));
          return;
        }

        const updatedPosts = posts.filter((post) => post.id !== postId);
        setPosts(updatedPosts);
        setLoading(false);
        resolve(true);
      }, 500);
    });
  };

  // Like or unlike a post
  const toggleLike = (postId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const postIndex = posts.findIndex((post) => post.id === postId);

        if (postIndex === -1) {
          resolve(null);
          return;
        }

        const post = posts[postIndex];
        const isLiked = post.likes.includes(currentUser.id);

        let updatedLikes;
        if (isLiked) {
          updatedLikes = post.likes.filter((id) => id !== currentUser.id);
        } else {
          updatedLikes = [...post.likes, currentUser.id];
        }

        const updatedPost = { ...post, likes: updatedLikes };
        const updatedPosts = [...posts];
        updatedPosts[postIndex] = updatedPost;

        setPosts(updatedPosts);
        resolve(updatedPost);
      }, 300);
    });
  };

  // Add a comment to a post
  const addComment = (postId, content) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postIndex = posts.findIndex((post) => post.id === postId);

        if (postIndex === -1) {
          reject(new Error("Post not found"));
          return;
        }

        const post = posts[postIndex];

        const newComment = {
          id: (post.comments.length + 1).toString(),
          postId,
          userId: currentUser.id,
          content,
          createdAt: new Date().toISOString(),
        };

        const updatedComments = [...post.comments, newComment];
        const updatedPost = { ...post, comments: updatedComments };
        const updatedPosts = [...posts];
        updatedPosts[postIndex] = updatedPost;

        setPosts(updatedPosts);
        resolve(newComment);
      }, 300);
    });
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        getAllPosts,
        getUserPosts,
        createPost,
        updatePost,
        deletePost,
        toggleLike,
        addComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export default PostContext;
