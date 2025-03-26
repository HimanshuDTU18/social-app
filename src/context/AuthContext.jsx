import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Static user data for demo purposes
  const staticUsers = [
    {
      id: "1",
      username: "johndoe",
      fullName: "John Doe",
      email: "john@example.com",
      password: "password123",
      bio: "Frontend developer",
      profilePicture:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
      followers: ["2"],
      following: ["2"],
    },
    {
      id: "2",
      username: "janedoe",
      fullName: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
      bio: "UX Designer",
      profilePicture:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
      followers: ["1"],
      following: ["1"],
    },
  ];

  // Check if user is in localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const user = staticUsers.find(
          (user) => user.email === email && user.password === password
        );

        if (user) {
          // Remove password before storing user
          const { password, ...userWithoutPassword } = user;
          setCurrentUser(userWithoutPassword);
          localStorage.setItem("user", JSON.stringify(userWithoutPassword));
          resolve(userWithoutPassword);
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 500);
    });
  };

  // Register function
  const register = (username, email, fullName, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const userExists = staticUsers.some((user) => user.email === email);

        if (userExists) {
          reject(new Error("User with this email already exists"));
        } else {
          // Create new user
          const newUser = {
            id: (staticUsers.length + 1).toString(),
            username,
            fullName,
            email,
            password,
            bio: "",
            profilePicture: "https://via.placeholder.com/150",
            followers: [],
            following: [],
          };

          // Remove password before storing user
          const { password: pwd, ...userWithoutPassword } = newUser;
          setCurrentUser(userWithoutPassword);
          localStorage.setItem("user", JSON.stringify(userWithoutPassword));
          resolve(userWithoutPassword);
        }
      }, 500);
    });
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  // Update profile function
  const updateProfile = (profileData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...currentUser, ...profileData };
        setCurrentUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        resolve(updatedUser);
      }, 500);
    });
  };

  // Get user by ID
  const getUser = (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = staticUsers.find((user) => user.id === userId);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          resolve(userWithoutPassword);
        } else {
          resolve(null);
        }
      }, 300);
    });
  };

  // Toggle follow/unfollow
  const toggleFollow = (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isFollowing = currentUser.following.includes(userId);

        let updatedFollowing;
        if (isFollowing) {
          updatedFollowing = currentUser.following.filter(
            (id) => id !== userId
          );
        } else {
          updatedFollowing = [...currentUser.following, userId];
        }

        const updatedUser = { ...currentUser, following: updatedFollowing };
        setCurrentUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        resolve(updatedUser);
      }, 300);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        getUser,
        toggleFollow,
        users: staticUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
