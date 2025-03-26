import React, { useState, useContext } from "react";
import { PostContext } from "../../context/PostContext";
import { AuthContext } from "../../context/AuthContext";
import { FaImage, FaTimes } from "react-icons/fa";

const PostForm = ({
  initialContent = "",
  initialImage = null,
  onPostCreated,
  isEditing = false,
  onCancel,
}) => {
  const [content, setContent] = useState(initialContent);
  const [image, setImage] = useState(initialImage);
  const [previewUrl, setPreviewUrl] = useState(initialImage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { createPost } = useContext(PostContext);
  const { currentUser } = useContext(AuthContext);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match("image.*")) {
      setError("Please select an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setImage(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    setError("");
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !image) {
      setError("Please enter some content or add an image");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // For demo purposes, we're just passing the preview URL as the image
      const newPost = await createPost(content, previewUrl);
      setContent("");
      setImage(null);
      setPreviewUrl(null);

      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex items-center mb-4">
        <img
          src={currentUser.profilePicture || "https://via.placeholder.com/150"}
          alt={currentUser.username}
          className="w-10 h-10 rounded-full mr-3"
        />
        <span className="font-medium">{currentUser.fullName}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {previewUrl && (
          <div className="relative mt-3 mb-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-100"
              aria-label="Remove image"
            >
              <FaTimes />
            </button>
          </div>
        )}

        <div className="flex mt-3 justify-between">
          <label className="flex items-center cursor-pointer text-gray-600 hover:text-blue-500">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <FaImage className="mr-2" />
            Add Image
          </label>

          <div className="flex space-x-2">
            {isEditing && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : isEditing ? "Update" : "Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
