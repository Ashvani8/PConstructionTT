import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  Cable as CableIcon,
  PowerSettingsNew as PowerIcon,
  Storage as StorageIcon,
  Speed as FanIcon,
  Memory as RamIcon,
  Usb as UsbIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

const CableManagement = ({ components, caseType }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [openGuide, setOpenGuide] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const cableTypes = {
    POWER: {
      icon: <PowerIcon />,
      color: 'error',
    },
    DATA: {
      icon: <StorageIcon />,
      color: 'info',
    },
    FAN: {
      icon: <FanIcon />,
      color: 'success',
    },
    USB: {
      icon: <UsbIcon />,
      color: 'warning',
    },
    RGB: {
      icon: <CableIcon />,
      color: 'secondary',
    },
  };

  const requiredCables = {
    motherboard: [
      { type: 'POWER', name: '24-pin ATX', length: '30cm' },
      { type: 'POWER', name: '8-pin CPU', length: '50cm' },
    ],
    cpu: [],
    gpu: [
      { type: 'POWER', name: '8-pin PCIe', length: '40cm', quantity: 2 },
    ],
    storage: [
      { type: 'DATA', name: 'SATA Data', length: '30cm' },
      { type: 'POWER', name: 'SATA Power', length: '40cm' },
    ],
    fans: [
      { type: 'FAN', name: 'Fan Header', length: '30cm' },
      { type: 'POWER', name: 'Fan Power', length: '30cm' },
    ],
    rgb: [
      { type: 'RGB', name: 'RGB Header', length: '30cm' },
    ],
    usb: [
      { type: 'USB', name: 'USB 3.0 Header', length: '30cm' },
      { type: 'USB', name: 'USB 2.0 Header', length: '30cm' },
    ],
  };

  const routingSteps = [
    {
      label: 'Preparation',
      description: 'Before starting cable management:',
      tasks: [
        'Remove all side panels',
        'Identify cable routing holes',
        'Plan cable paths',
        'Gather zip ties and velcro straps',
      ],
      image: 'preparation.jpg',
    },
    {
      label: 'Power Supply Cables',
      description: 'Start with the main power cables:',
      tasks: [
        'Route 24-pin motherboard power',
        'Route 8-pin CPU power behind motherboard tray',
        'Position PCIe power cables for GPU',
        'Bundle unused power cables neatly',
      ],
      image: 'psu_cables.jpg',
    },
    {
      label: 'Storage & Data Cables',
      description: 'Connect storage devices:',
      tasks: [
        'Route SATA data cables',
        'Connect SATA power in series',
        'Bundle excess cable length',
        'Secure cables away from fans',
      ],
      image: 'storage_cables.jpg',
    },
    {
      label: 'Fan & RGB Cables',
      description: 'Manage cooling and lighting:',
      tasks: [
        'Connect fan headers to nearest ports',
        'Route RGB cables through closest holes',
        'Use splitters if needed',
        'Hide controller boxes in back',
      ],
      image: 'fan_rgb_cables.jpg',
    },
    {
      label: 'Front Panel & USB',
      description: 'Connect case cables:',
      tasks: [
        'Route front panel connectors',
        'Connect USB 3.0 and 2.0 headers',
        'Route audio header cable',
        'Secure loose cables',
      ],
      image: 'front_panel.jpg',
    },
    {
      label: 'Final Organization',
      description: 'Clean up and secure:',
      tasks: [
        'Use zip ties every 10-15cm',
        'Create cable bundles',
        'Ensure no cables block fans',
        'Double-check all connections',
      ],
      image: 'final.jpg',
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const renderCableList = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Required Cables
          <Tooltip title="List of cables needed for your build">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        <List>
          {Object.entries(requiredCables).map(([category, cables]) =>
            cables.map((cable, index) => (
              <ListItem key={`${category}-${index}`}>
                <ListItemIcon>
                  {cableTypes[cable.type].icon}
                </ListItemIcon>
                <ListItemText
                  primary={cable.name}
                  secondary={`Length: ${cable.length}${
                    cable.quantity ? ` × ${cable.quantity}` : ''
                  }`}
                />
                <Chip
                  label={cable.type}
                  size="small"
                  color={cableTypes[cable.type].color}
                />
              </ListItem>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );

  const renderGuide = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Cable Management Guide
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical">
          {routingSteps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="subtitle1">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {step.description}
                </Typography>

                <List dense>
                  {step.tasks.map((task, taskIndex) => (
                    <ListItem key={taskIndex}>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={task} />
                    </ListItem>
                  ))}
                </List>

                <Button
                  startIcon={<ImageIcon />}
                  onClick={() => {
                    setSelectedImage(step.image);
                    setOpenGuide(true);
                  }}
                  sx={{ mb: 2 }}
                >
                  View Guide Image
                </Button>

                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === routingSteps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === routingSteps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography paragraph>
              All steps completed! Your cables should now be well-managed.
            </Typography>
            <Button onClick={handleReset}>
              Reset Guide
            </Button>
          </Paper>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Cable Management Helper
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {renderCableList()}
        </Grid>
        <Grid item xs={12} md={8}>
          {renderGuide()}
        </Grid>
      </Grid>

      <Dialog
        open={openGuide}
        onClose={() => setOpenGuide(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Cable Management Guide</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <img
              src={`/images/cable-management/${selectedImage}`}
              alt="Cable Management Guide"
              style={{ width: '100%', borderRadius: 8 }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CableManagement;
