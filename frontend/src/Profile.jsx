import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem } from '@mui/material';
import axios from 'axios';

function Profile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/user/profile/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  return (
    <div>
      <Typography variant="h4">Profile</Typography>
      {user && (
        <>
          <Typography>Username: {user.username}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Transcription: {user.transcription}</Typography>
          <Typography>Keywords: {user.keywords.join(', ')}</Typography>
        </>
      )}
    </div>
  );
}

export default Profile;