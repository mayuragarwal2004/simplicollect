import React from 'react';
import { Backdrop, Box, Button, Modal, Typography } from '@mui/material';
import axios from 'axios';
import { Visitor } from '../../../models/Visitor';

interface VisitorDeleteProps {
  setBackDropOpen: (open: boolean) => void;
  selectedVisitor: Visitor;
  fetchVisitors: () => void;
}

const VisitorDelete: React.FC<VisitorDeleteProps> = ({
  setBackDropOpen,
  selectedVisitor,
  fetchVisitors,
}) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/visitors/${selectedVisitor.userId}`);
      fetchVisitors();
      setBackDropOpen(false);
    } catch (error) {
      console.error('Failed to delete the user:', error);
    }
  };

  return (
    <div className="bg-white text-black p-5 rounded dark:bg-boxdark">
      <Typography
        className="dark:text-white"
        id="delete-confirmation-title"
        variant="h6"
        component="h2"
      >
        Confirm Deletion
      </Typography>
      <Typography
        className=" dark:text-white"
        id="delete-confirmation-description"
        sx={{ mt: 2 }}
      >
        Are you sure you want to delete this user?
      </Typography>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
        <Button variant="outlined" onClick={() => setBackDropOpen(false)}>
          Cancel
        </Button>
      </Box>
    </div>
  );
};

export default VisitorDelete;
