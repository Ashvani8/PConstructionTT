import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SavedBuilds = () => {
  const [builds, setBuilds] = useState([]);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedBuilds();
  }, []);

  const fetchSavedBuilds = async () => {
    try {
      const response = await fetch('/api/pcbuilder/builds');
      const data = await response.json();
      setBuilds(data);
    } catch (error) {
      console.error('Error fetching saved builds:', error);
    }
  };

  const handleDelete = async (buildId) => {
    try {
      await fetch(`/api/pcbuilder/builds/${buildId}`, {
        method: 'DELETE',
      });
      fetchSavedBuilds();
    } catch (error) {
      console.error('Error deleting build:', error);
    }
  };

  const handleEdit = (build) => {
    navigate('/pc-builder', { state: { savedBuild: build } });
  };

  const handleAddToCart = async (build) => {
    try {
      // Add build components to cart
      // This would need to be implemented based on your cart system
      console.log('Adding build to cart:', build);
    } catch (error) {
      console.error('Error adding build to cart:', error);
    }
  };

  const handleViewDetails = (build) => {
    setSelectedBuild(build);
    setDetailsOpen(true);
  };

  const renderBuildDetails = () => {
    if (!selectedBuild) return null;

    return (
      <List>
        {Object.entries(selectedBuild.components).map(([type, component]) => {
          if (!component || (Array.isArray(component) && component.length === 0)) {
            return null;
          }

          if (Array.isArray(component)) {
            return component.map((item, index) => (
              <React.Fragment key={`${type}-${index}`}>
                <ListItem>
                  <ListItemText
                    primary={item.name}
                    secondary={`$${item.price} | ${item.wattage}W`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ));
          }

          return (
            <React.Fragment key={type}>
              <ListItem>
                <ListItemText
                  primary={component.name}
                  secondary={`$${component.price} | ${component.wattage}W`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Saved Builds
      </Typography>

      <Grid container spacing={3}>
        {builds.map((build) => (
          <Grid item xs={12} sm={6} md={4} key={build.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {build.name || `Build #${build.id}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Price: ${build.totalPrice}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Power: {build.totalWattage}W
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    size="small"
                    onClick={() => handleViewDetails(build)}
                  >
                    View Details
                  </Button>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(build)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(build.id)}
                      sx={{ mr: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleAddToCart(build)}
                    >
                      <CartIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedBuild?.name || `Build #${selectedBuild?.id}`}
        </DialogTitle>
        <DialogContent>
          {renderBuildDetails()}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">
              Total Price: ${selectedBuild?.totalPrice}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Total Power: {selectedBuild?.totalWattage}W
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleAddToCart(selectedBuild);
              setDetailsOpen(false);
            }}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavedBuilds;
