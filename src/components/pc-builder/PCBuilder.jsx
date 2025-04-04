import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Info as InfoIcon,
  ShoppingCart as CartIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const steps = [
  { label: 'CPU', description: 'Choose your processor' },
  { label: 'Motherboard', description: 'Select a compatible motherboard' },
  { label: 'Memory', description: 'Add RAM modules' },
  { label: 'Storage', description: 'Choose storage devices' },
  { label: 'Graphics Card', description: 'Select a graphics card' },
  { label: 'Power Supply', description: 'Choose a power supply' },
  { label: 'Case', description: 'Select a case' },
  { label: 'Cooling', description: 'Add cooling solutions' },
];

import BuildWizard from './BuildWizard';
import SavedBuilds from './SavedBuilds';

const PCBuilder = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [components, setComponents] = useState({
    cpu: null,
    motherboard: null,
    memory: [],
    storage: [],
    gpu: null,
    psu: null,
    case: null,
    cooling: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compatibility, setCompatibility] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalWattage, setTotalWattage] = useState(0);

  useEffect(() => {
    // Calculate total price whenever components change
    const price = Object.values(components).reduce((total, component) => {
      if (Array.isArray(component)) {
        return total + component.reduce((sum, item) => sum + (item?.price || 0), 0);
      }
      return total + (component?.price || 0);
    }, 0);
    setTotalPrice(price);

    // Calculate total wattage
    const wattage = Object.values(components).reduce((total, component) => {
      if (Array.isArray(component)) {
        return total + component.reduce((sum, item) => sum + (item?.wattage || 0), 0);
      }
      return total + (component?.wattage || 0);
    }, 0);
    setTotalWattage(wattage);

    // Check compatibility
    checkCompatibility();
  }, [components]);

  const checkCompatibility = () => {
    const issues = [];

    // CPU and Motherboard socket compatibility
    if (components.cpu && components.motherboard) {
      if (components.cpu.socket !== components.motherboard.socket) {
        issues.push('CPU socket is not compatible with motherboard');
      }
    }

    // Memory compatibility
    if (components.motherboard && components.memory.length > 0) {
      if (components.memory.length > components.motherboard.memorySlots) {
        issues.push('Too many memory modules for motherboard');
      }
      if (components.memory.some(mem => mem.type !== components.motherboard.memoryType)) {
        issues.push('Memory type not compatible with motherboard');
      }
    }

    // Power supply wattage check
    if (components.psu && totalWattage > components.psu.wattage) {
      issues.push('Power supply wattage may be insufficient');
    }

    setCompatibility(issues);
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleComponentSelect = async (component, type) => {
    try {
      setLoading(true);
      // In a real app, you might want to validate the selection with the backend
      if (Array.isArray(components[type])) {
        setComponents(prev => ({
          ...prev,
          [type]: [...prev[type], component],
        }));
      } else {
        setComponents(prev => ({
          ...prev,
          [type]: component,
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      // Add PC build to cart
      const build = {
        components,
        totalPrice,
        totalWattage,
      };
      // In a real app, you would make an API call here
      console.log('Adding build to cart:', build);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBuild = async () => {
    try {
      setLoading(true);
      // Save PC build for later
      const build = {
        components,
        totalPrice,
        totalWattage,
      };
      // In a real app, you would make an API call here
      console.log('Saving build:', build);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    // This would be replaced with actual component data from your backend
    const dummyComponents = [
      {
        id: 1,
        name: 'Sample Component',
        price: 199.99,
        image: 'placeholder.jpg',
        specs: {
          // Component-specific specs
        },
      },
      // More components...
    ];

    return (
      <Grid container spacing={3}>
        {dummyComponents.map((component) => (
          <Grid item xs={12} sm={6} md={4} key={component.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={component.image}
                alt={component.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {component.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${component.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleComponentSelect(component, steps[step].label.toLowerCase())}
                >
                  Select
                </Button>
                <IconButton size="small">
                  <InfoIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // If we have a recommendation from the wizard, use it to initialize the build
  useEffect(() => {
    if (location.state?.recommendation) {
      setComponents(location.state.recommendation.recommendations);
      setActiveTab(1); // Switch to manual builder tab
    }
  }, [location.state]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 4 }}
        >
          <Tab label="Build Wizard" />
          <Tab label="Manual Builder" />
          <Tab label="Saved Builds" />
        </Tabs>

        {activeTab === 0 && <BuildWizard />}
        {activeTab === 1 && (
          <>
            <Typography variant="h4" gutterBottom>
              Custom PC Builder
            </Typography>

            {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {compatibility.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Compatibility Issues:
            </Typography>
            <ul>
              {compatibility.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="subtitle2">{step.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {renderStepContent(activeStep)}
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Build Summary
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Price: ${totalPrice.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Estimated Wattage: {totalWattage}W
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<CartIcon />}
                  onClick={handleAddToCart}
                  fullWidth
                  sx={{ mb: 1 }}
                  disabled={loading || Object.values(components).some(c => !c)}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveBuild}
                  fullWidth
                  disabled={loading || Object.values(components).some(c => !c)}
                >
                  Save Build
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            startIcon={<PrevIcon />}
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button
            endIcon={<NextIcon />}
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
          >
            Next
          </Button>
        </Box>
          </>
        )}
        {activeTab === 2 && <SavedBuilds />}
      </Box>
    </Container>
  );
};

export default PCBuilder;
