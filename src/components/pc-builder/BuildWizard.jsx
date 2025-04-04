import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const steps = [
  'Purpose & Budget',
  'Preferences',
  'Review Recommendation',
];

const purposes = [
  {
    value: 'gaming',
    title: 'Gaming PC',
    description: 'Optimized for high FPS gaming performance',
    icon: '🎮',
  },
  {
    value: 'workstation',
    title: 'Workstation',
    description: 'For professional work, rendering, and development',
    icon: '💼',
  },
  {
    value: 'streaming',
    title: 'Streaming Setup',
    description: 'Balanced for gaming and streaming',
    icon: '🎥',
  },
  {
    value: 'office',
    title: 'Office PC',
    description: 'For general productivity and business use',
    icon: '💻',
  },
];

const brands = [
  'AMD', 'Intel', 'NVIDIA', 'ASUS', 'MSI', 'Gigabyte',
  'Corsair', 'G.Skill', 'EVGA', 'Seasonic', 'NZXT',
];

const BuildWizard = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    purpose: '',
    budget: 1500,
    prioritizePerformance: true,
    preferredBrands: [],
  });
  const [recommendation, setRecommendation] = useState(null);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      // Navigate to PC Builder with recommended components
      navigate('/pc-builder', { state: { recommendation } });
      return;
    }

    if (activeStep === 1) {
      setLoading(true);
      try {
        const response = await fetch('/api/pcbuilder/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preferences),
        });
        const data = await response.json();
        setRecommendation(data);
      } catch (error) {
        console.error('Error getting recommendations:', error);
      } finally {
        setLoading(false);
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleBrandToggle = (brand) => {
    setPreferences(prev => ({
      ...prev,
      preferredBrands: prev.preferredBrands.includes(brand)
        ? prev.preferredBrands.filter(b => b !== brand)
        : [...prev.preferredBrands, brand],
    }));
  };

  const renderPurposeStep = () => (
    <Grid container spacing={3}>
      {purposes.map((purpose) => (
        <Grid item xs={12} sm={6} key={purpose.value}>
          <Card
            onClick={() => setPreferences(prev => ({ ...prev, purpose: purpose.value }))}
            sx={{
              cursor: 'pointer',
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
              ...(preferences.purpose === purpose.value && {
                border: '2px solid',
                borderColor: 'primary.main',
              }),
            }}
          >
            <CardContent>
              <Typography variant="h2" align="center" gutterBottom>
                {purpose.icon}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {purpose.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {purpose.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Paper sx={{ p: 4, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Select Your Budget
          </Typography>
          <Box sx={{ px: 3, mt: 4, mb: 2 }}>
            <Typography variant="h4" align="center" color="primary" gutterBottom>
              ${preferences.budget.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ px: 3, py: 2 }}>
            <Slider
              value={preferences.budget}
              onChange={(_, value) => setPreferences(prev => ({ ...prev, budget: value }))}
              min={500}
              max={5000}
              step={100}
              marks={[
                { value: 500, label: 'Budget ($500)' },
                { value: 1500, label: 'Mid-Range ($1,500)' },
                { value: 3000, label: 'High-End ($3,000)' },
                { value: 5000, label: 'Extreme ($5,000)' },
              ]}
              valueLabelDisplay="on"
              valueLabelFormat={value => `$${value.toLocaleString()}`}
              sx={{
                '& .MuiSlider-rail': {
                  height: 8,
                },
                '& .MuiSlider-track': {
                  height: 8,
                },
                '& .MuiSlider-thumb': {
                  width: 24,
                  height: 24,
                  '&:before': {
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                  },
                },
                '& .MuiSlider-mark': {
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                },
                '& .MuiSlider-markLabel': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginTop: 1,
                },
              }}
            />
          </Box>
          <Box sx={{ px: 3, mt: 2 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Drag the slider to set your budget. This will help us recommend the best components for your needs.
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderPreferencesStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Performance Priority</FormLabel>
            <RadioGroup
              value={preferences.prioritizePerformance}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                prioritizePerformance: e.target.value === 'true',
              }))}
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Maximize performance (may reduce aesthetic budget)"
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Balanced (consider aesthetics and features)"
              />
            </RadioGroup>
          </FormControl>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Preferred Brands
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {brands.map((brand) => (
              <Chip
                key={brand}
                label={brand}
                onClick={() => handleBrandToggle(brand)}
                color={preferences.preferredBrands.includes(brand) ? 'primary' : 'default'}
                clickable
              />
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderRecommendationStep = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!recommendation) {
      return (
        <Typography color="error">
          Error loading recommendations. Please try again.
        </Typography>
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Build Summary
            </Typography>
            <Typography variant="body1" paragraph>
              Based on your {preferences.purpose} needs and ${preferences.budget} budget
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Expected Performance:
              </Typography>
              {recommendation.performanceMetrics && (
                <Grid container spacing={2}>
                  {Object.entries(recommendation.performanceMetrics).map(([key, value]) => (
                    <Grid item xs={6} sm={4} key={key}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">
                          {typeof value === 'number' ? Math.round(value) : value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {key.split(/(?=[A-Z])/).join(' ')}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Components:
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(recommendation.recommendations).map(([type, component]) => (
                <Grid item xs={12} sm={6} md={4} key={type}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {type.toUpperCase()}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {component.name}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        ${component.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Total: ${recommendation.totalPrice}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remaining Budget: ${recommendation.remainingBudget}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPurposeStep();
      case 1:
        return renderPreferencesStep();
      case 2:
        return renderRecommendationStep();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Build Wizard
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {getStepContent(activeStep)}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={
            (activeStep === 0 && !preferences.purpose) ||
            loading
          }
        >
          {activeStep === steps.length - 1 ? 'Start Building' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default BuildWizard;
