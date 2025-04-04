import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Build as BuildIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
  PhotoCamera as PhotoIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

const BuildProgress = ({ buildOrder }) => {
  const buildStages = [
    {
      label: 'Order Placed',
      description: 'Parts ordered and payment confirmed',
      icon: <ShippingIcon />,
    },
    {
      label: 'Parts Arriving',
      description: 'Components in transit',
      icon: <LocalShipping />,
    },
    {
      label: 'Assembly Ready',
      description: 'All parts received and verified',
      icon: <CheckIcon />,
    },
    {
      label: 'Building',
      description: 'PC assembly in progress',
      icon: <BuildIcon />,
    },
    {
      label: 'Testing',
      description: 'Performance and stability testing',
      icon: <Speed />,
    },
    {
      label: 'Complete',
      description: 'Build finished and ready',
      icon: <CheckCircle />,
    },
  ];

  const renderDeliveryStatus = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Parts Delivery Status
        </Typography>
        <List>
          {buildOrder.parts.map((part) => (
            <ListItem key={part.id}>
              <ListItemIcon>
                {part.delivered ? (
                  <CheckIcon color="success" />
                ) : (
                  <ScheduleIcon color="action" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={part.name}
                secondary={
                  part.delivered
                    ? `Delivered on ${part.deliveryDate}`
                    : `Expected: ${part.expectedDate}`
                }
              />
              <Chip
                label={part.delivered ? 'Delivered' : 'In Transit'}
                color={part.delivered ? 'success' : 'warning'}
                size="small"
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderBuildPhotos = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Build Progress Photos
        </Typography>
        <Grid container spacing={2}>
          {buildOrder.photos.map((photo, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '100%',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={photo.url}
                  alt={`Build step ${index + 1}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    p: 1,
                  }}
                >
                  {photo.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderTimelineUpdates = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Build Timeline
        </Typography>
        <List>
          {buildOrder.updates.map((update, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {update.type === 'success' ? (
                  <CheckIcon color="success" />
                ) : update.type === 'warning' ? (
                  <WarningIcon color="warning" />
                ) : (
                  <InfoIcon color="info" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={update.message}
                secondary={update.timestamp}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Build Progress Tracker
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Overall Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={buildOrder.progress}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {buildOrder.progress}% Complete
            </Typography>
          </Box>

          <Stepper activeStep={buildOrder.currentStage}>
            {buildStages.map((stage) => (
              <Step key={stage.label}>
                <StepLabel
                  StepIconComponent={() => stage.icon}
                  optional={
                    <Typography variant="caption">
                      {stage.description}
                    </Typography>
                  }
                >
                  {stage.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderDeliveryStatus()}
          {renderTimelineUpdates()}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderBuildPhotos()}
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<PhotoIcon />}
          onClick={() => {/* Handle photo upload */}}
        >
          Upload Build Photo
        </Button>
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          onClick={() => {/* Handle sharing */}}
        >
          Share Progress
        </Button>
      </Box>
    </Box>
  );
};

export default BuildProgress;
