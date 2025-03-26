import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaRegClock } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const Comment = ({ comment }) => {
  const { getUser } = useContext(AuthContext);
  const [commentAuthor, setCommentAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const author = await getUser(comment.userId);
        setCommentAuthor(author);
      } catch (error) {
        console.error("Error fetching comment author:", error);
      }
    };

    fetchAuthor();
  }, [getUser, comment.userId]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!commentAuthor) {
    return <div className="animate-pulse bg-gray-200 h-14 rounded-md"></div>;
  }

  return (
    <div className="flex">
      <img
        src={commentAuthor.profilePicture || "https://via.placeholder.com/150"}
        alt={commentAuthor.username}
        className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          marginRight: "10px",
        }}
      />
      <div className="bg-gray-100 rounded-lg px-3 py-2 flex-grow">
        <div className="flex items-center justify-between">
          <Link
            to={`/profile/${commentAuthor.id}`}
            className="font-semibold text-sm hover:underline"
          >
            {commentAuthor.fullName}
          </Link>
          <span className="text-gray-500 text-xs flex items-center">
            <FaRegClock className="mr-1" size={10} />
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm mt-1">{comment.content}</p>
      </div>
    </div>
  );
};

export default Comment;
