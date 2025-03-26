import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { FaEdit, FaUserPlus, FaUserMinus, FaUser } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { PostContext } from "../context/PostContext";
import PostCard from "../components/feed/PostCard";

const ProfilePage = () => {
  const { id } = useParams();
  const { currentUser, getUser, toggleFollow, users } = useContext(AuthContext);
  const { getUserPosts } = useContext(PostContext);

  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userData = await getUser(id);
        setProfileUser(userData);

        // Find followers for this user from our static users
        const followers = users.filter(
          (user) => user.following && user.following.includes(id)
        );
        setFollowerCount(followers.length);

        // Check if current user is following this profile
        if (currentUser) {
          setIsFollowing(currentUser.following.includes(id));
        }

        const posts = await getUserPosts(id);
        setUserPosts(posts);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, getUser, getUserPosts, currentUser, users]);

  const handleToggleFollow = async () => {
    if (!currentUser) return;

    try {
      await toggleFollow(id);
      setIsFollowing(!isFollowing);
      setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (!profileUser) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">User not found</h2>
        <p className="text-gray-600 mb-4">
          The user you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="text-blue-500 hover:underline">
          Return to home page
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-4 md:mb-0 md:mr-6">
            <img
              src={
                profileUser.profilePicture || "https://via.placeholder.com/150"
              }
              alt={profileUser.username}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{profileUser.fullName}</h2>
                <p className="text-gray-600">@{profileUser.username}</p>
              </div>

              <div className="mt-4 md:mt-0">
                {currentUser && currentUser.id === profileUser.id ? (
                  <Link
                    to="/profile/edit"
                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </Link>
                ) : currentUser ? (
                  <button
                    onClick={handleToggleFollow}
                    className={`inline-flex items-center px-4 py-2 rounded-lg transition duration-200 ${
                      isFollowing
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <FaUserMinus className="mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <FaUserPlus className="mr-2" />
                        Follow
                      </>
                    )}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap mb-4">
              <div className="mr-6">
                <span className="font-bold">{userPosts.length}</span>{" "}
                <span className="text-gray-600">posts</span>
              </div>
              <div className="mr-6">
                <span className="font-bold">{followerCount}</span>{" "}
                <span className="text-gray-600">followers</span>
              </div>
              <div>
                <span className="font-bold">
                  {profileUser.following ? profileUser.following.length : 0}
                </span>{" "}
                <span className="text-gray-600">following</span>
              </div>
            </div>

            {profileUser.bio && (
              <p className="text-gray-700">{profileUser.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaUser className="mr-2" />
          {currentUser && currentUser.id === profileUser.id
            ? "Your Posts"
            : `${profileUser.fullName}'s Posts`}
        </h3>

        {userPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">
              {currentUser && currentUser.id === profileUser.id
                ? "You haven't posted anything yet."
                : `${profileUser.fullName} hasn't posted anything yet.`}
            </p>
            {currentUser && currentUser.id === profileUser.id && (
              <Link
                to="/"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                Create your first post
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
