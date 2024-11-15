import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Loader from '../components/Loader';
import Card from '../components/Card';

const Profile = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPosts = async () => {
    try {
      if (!user) return;

      const token = await getAccessTokenSilently();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user-post/user-posts/${encodeURIComponent(user.sub)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();

        // Filter unique posts based on `_id`
        const uniquePosts = result.data.reduce((acc, post) => {
          if (!acc.some((p) => p._id === post._id)) {
            acc.push(post);
          }
          return acc;
        }, []);

        setUserPosts(uniquePosts);
      } else {
        console.error('Error fetching user posts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  return (
    <section 
      className="mt-4 max-w-7xl mx-auto 
      bg-lightBg dark:bg-darkBg 
      text-lightText dark:text-darkText 
      min-h-screen p-8 
      rounded-lg shadow-md 
      transition-colors duration-300 ease-in-out"
    >
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 
          className="font-extrabold 
          text-lightText dark:text-darkText 
          text-4xl mb-4"
        >
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Below are your created posts. You can explore and manage them here.
        </p>
      </div>

      {/* Posts Section */}
      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : userPosts.length ? (
        <div 
          className="grid 
          lg:grid-cols-4 
          sm:grid-cols-3 
          xs:grid-cols-2 
          grid-cols-1 gap-6"
        >
          {userPosts.map((post) => (
            <div 
              key={post._id} 
            >
              <Card {...post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <h2 
            className="text-lightText dark:text-darkText text-xl"
          >
            No posts found.
          </h2>
        </div>
      )}
    </section>
  );
};

export default Profile;
