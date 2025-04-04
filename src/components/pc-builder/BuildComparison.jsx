import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  CompareArrows as CompareIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Whatshot as PowerIcon,
} from '@mui/icons-material';

const BuildComparison = ({ builds }) => {
  const getPerformanceScore = (build) => {
    // Calculate a performance score based on components
    let score = 0;
    
    if (build.cpu) {
      score += (build.cpu.cores * build.cpu.threads * build.cpu.baseSpeed) / 10;
    }
    
    if (build.gpu) {
      score += (build.gpu.vram * 5) + (build.gpu.wattage / 10);
    }
    
    if (build.memory) {
      const totalMemory = Array.isArray(build.memory)
        ? build.memory.reduce((sum, mem) => sum + mem.capacity, 0)
        : build.memory.capacity;
      score += totalMemory / 1024;
    }
    
    return Math.round(score);
  };

  const getCompatibilityIssues = (build) => {
    const issues = [];
    
    // Check power supply capacity
    const totalPower = Object.values(build).reduce((sum, component) => {
      return sum + (component?.wattage || 0);
    }, 0);
    
    if (build.psu && totalPower > build.psu.wattage) {
      issues.push('Insufficient power supply');
    }
    
    // Check memory compatibility
    if (build.motherboard && build.memory) {
      if (build.motherboard.maxMemory < build.memory.capacity) {
        issues.push('Memory capacity exceeds motherboard limit');
      }
    }
    
    return issues;
  };

  const renderComponentComparison = (component, label) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          {label}
        </Typography>
      </Grid>
      {builds.map((build, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Card variant="outlined">
            <CardContent>
              {build[component] ? (
                <>
                  <Typography variant="h6">
                    {build[component].name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {build[component].specs}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={`$${build[component].price}`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </>
              ) : (
                <Typography color="text.secondary">
                  Not selected
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <CompareIcon sx={{ mr: 1 }} />
        Build Comparison
      </Typography>

      <Grid container spacing={3}>
        {/* Performance Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Overview
            </Typography>
            <Grid container spacing={2}>
              {builds.map((build, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Build {index + 1}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Performance Score
                        </Typography>
                        <Typography variant="h4">
                          {getPerformanceScore(build)}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Cost
                        </Typography>
                        <Typography variant="h5">
                          ${Object.values(build).reduce((sum, component) => {
                            return sum + (component?.price || 0);
                          }, 0).toLocaleString()}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Compatibility
                        </Typography>
                        {getCompatibilityIssues(build).length === 0 ? (
                          <Chip
                            icon={<CheckIcon />}
                            label="All components compatible"
                            color="success"
                            size="small"
                          />
                        ) : (
                          getCompatibilityIssues(build).map((issue, i) => (
                            <Chip
                              key={i}
                              icon={<CloseIcon />}
                              label={issue}
                              color="error"
                              size="small"
                              sx={{ mb: 1 }}
                            />
                          ))
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Component Comparison */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Component Comparison
            </Typography>
            
            {renderComponentComparison('cpu', 'CPU')}
            <Divider sx={{ my: 3 }} />
            
            {renderComponentComparison('gpu', 'Graphics Card')}
            <Divider sx={{ my: 3 }} />
            
            {renderComponentComparison('memory', 'Memory')}
            <Divider sx={{ my: 3 }} />
            
            {renderComponentComparison('storage', 'Storage')}
            <Divider sx={{ my: 3 }} />
            
            {renderComponentComparison('motherboard', 'Motherboard')}
            <Divider sx={{ my: 3 }} />
            
            {renderComponentComparison('psu', 'Power Supply')}
            <Divider sx={{ my: 3 }} />
            
            {renderComponentComparison('case', 'Case')}
            <Divider sx={{ my: 3 }} />
            
            {renderComponentComparison('cooling', 'Cooling')}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BuildComparison;
