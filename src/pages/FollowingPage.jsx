import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaUserPlus, FaUserMinus } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const FollowingPage = () => {
  const { currentUser, users, toggleFollow } = useContext(AuthContext);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      if (!currentUser) {
        setFollowingUsers([]);
        setLoading(false);
        return;
      }

      try {
        // Filter users to get those the current user is following
        const following = users.filter((user) =>
          currentUser.following.includes(user.id)
        );

        setFollowingUsers(following);
      } catch (error) {
        console.error("Error fetching following users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowingUsers();
  }, [currentUser, users]);

  const handleToggleFollow = async (userId) => {
    if (!currentUser) return;

    try {
      await toggleFollow(userId);

      // Update the local state
      setFollowingUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading following users...</div>;
  }

  if (!currentUser) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">Not logged in</h2>
        <p className="text-gray-600 mb-4">
          Please log in to see who you're following.
        </p>
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">People You Follow</h2>

      {followingUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <FaUser size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            You're not following anyone yet
          </h3>
          <p className="text-gray-600 mb-4">
            When you follow people, you'll see them here.
          </p>
          <Link to="/" className="text-blue-500 hover:underline">
            Discover people to follow
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {followingUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-start">
                <Link to={`/profile/${user.id}`}>
                  <img
                    src={
                      user.profilePicture || "https://via.placeholder.com/150"
                    }
                    alt={user.username}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    to={`/profile/${user.id}`}
                    className="font-semibold hover:underline"
                  >
                    {user.fullName}
                  </Link>
                  <p className="text-gray-600 text-sm">@{user.username}</p>
                  {user.bio && (
                    <p className="text-gray-700 text-sm mt-1 line-clamp-2">
                      {user.bio}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleToggleFollow(user.id)}
                  className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 text-sm"
                >
                  <FaUserMinus className="mr-1" />
                  Unfollow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowingPage;
