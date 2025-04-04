import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Slider,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Whatshot as PowerIcon,
  VolumeUp as NoiseIcon,
  Speed as PerformanceIcon,
  AcUnit as TempIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const SystemAnalytics = ({ components, usage = 'gaming' }) => {
  const [powerUsage, setPowerUsage] = useState({
    total: 0,
    breakdown: {},
    efficiency: 0,
  });

  const [thermals, setThermals] = useState({
    overall: 0,
    hotspots: [],
    airflow: 0,
  });

  const [noise, setNoise] = useState({
    overall: 0,
    sources: [],
    profile: 'balanced',
  });

  useEffect(() => {
    calculatePowerUsage();
    calculateThermals();
    calculateNoise();
  }, [components, usage]);

  const calculatePowerUsage = () => {
    const breakdown = {};
    let total = 0;

    // CPU Power
    if (components.cpu) {
      const cpuPower = usage === 'gaming' 
        ? components.cpu.tdp * 0.8  // 80% TDP for gaming
        : components.cpu.tdp;       // 100% TDP for workstation
      breakdown.cpu = cpuPower;
      total += cpuPower;
    }

    // GPU Power
    if (components.gpu) {
      const gpuPower = usage === 'gaming'
        ? components.gpu.tdp        // 100% TDP for gaming
        : components.gpu.tdp * 0.6; // 60% TDP for workstation
      breakdown.gpu = gpuPower;
      total += gpuPower;
    }

    // Memory Power
    if (components.memory) {
      const memoryPower = Array.isArray(components.memory)
        ? components.memory.length * 5  // ~5W per stick
        : 5;
      breakdown.memory = memoryPower;
      total += memoryPower;
    }

    // Storage Power
    if (components.storage) {
      const storagePower = components.storage.type === 'hdd' ? 10 : 5;
      breakdown.storage = storagePower;
      total += storagePower;
    }

    // Fans & Cooling
    if (components.cooling) {
      const coolingPower = components.cooling.fans * 2;  // ~2W per fan
      breakdown.cooling = coolingPower;
      total += coolingPower;
    }

    // Calculate PSU efficiency
    const efficiency = components.psu 
      ? (total / components.psu.wattage) * 100
      : 0;

    setPowerUsage({ total, breakdown, efficiency });
  };

  const calculateThermals = () => {
    let totalHeat = 0;
    const hotspots = [];

    // CPU Thermal Analysis
    if (components.cpu && components.cooling) {
      const cpuTemp = components.cpu.tdp / components.cooling.tdp * 70; // Base temp around 70°C
      totalHeat += cpuTemp;
      
      if (cpuTemp > 80) {
        hotspots.push({
          component: 'CPU',
          temp: cpuTemp,
          severity: 'high',
        });
      }
    }

    // GPU Thermal Analysis
    if (components.gpu) {
      const gpuTemp = components.gpu.tdp / 250 * 75; // Base temp around 75°C
      totalHeat += gpuTemp;
      
      if (gpuTemp > 85) {
        hotspots.push({
          component: 'GPU',
          temp: gpuTemp,
          severity: 'high',
        });
      }
    }

    // Case Airflow Analysis
    const airflow = components.case
      ? calculateAirflowScore(components.case, components.cooling)
      : 0;

    setThermals({
      overall: totalHeat / 2, // Average between major components
      hotspots,
      airflow,
    });
  };

  const calculateAirflowScore = (pcCase, cooling) => {
    let score = 0;
    
    // Case airflow rating
    score += pcCase.airflow * 0.4;  // 40% weight
    
    // Number of case fans
    score += (cooling.fans / 6) * 0.3;  // 30% weight
    
    // Mesh front panel bonus
    if (pcCase.meshFront) score += 0.2;  // 20% weight
    
    // Cable management bonus
    if (pcCase.cableManagement) score += 0.1;  // 10% weight
    
    return Math.min(score * 100, 100);  // Convert to percentage
  };

  const calculateNoise = () => {
    const sources = [];
    let totalNoise = 0;

    // CPU Cooler Noise
    if (components.cooling) {
      const coolerNoise = calculateFanNoise(
        components.cooling.rpm,
        components.cooling.fans,
        usage
      );
      sources.push({
        source: 'CPU Cooler',
        level: coolerNoise,
      });
      totalNoise += coolerNoise;
    }

    // GPU Fan Noise
    if (components.gpu) {
      const gpuNoise = calculateFanNoise(
        components.gpu.fanSpeed,
        components.gpu.fans,
        usage
      );
      sources.push({
        source: 'GPU',
        level: gpuNoise,
      });
      totalNoise += gpuNoise;
    }

    // Case Fans Noise
    if (components.case && components.cooling) {
      const caseNoise = calculateFanNoise(
        components.cooling.rpm,
        components.case.fans,
        usage
      );
      sources.push({
        source: 'Case Fans',
        level: caseNoise,
      });
      totalNoise += caseNoise;
    }

    // PSU Fan Noise
    if (components.psu) {
      const psuNoise = calculateFanNoise(
        components.psu.fanSpeed,
        1,
        usage
      );
      sources.push({
        source: 'PSU',
        level: psuNoise,
      });
      totalNoise += psuNoise;
    }

    setNoise({
      overall: totalNoise / sources.length,
      sources,
      profile: determineNoiseProfile(totalNoise / sources.length),
    });
  };

  const calculateFanNoise = (rpm, count, usage) => {
    // Base noise level calculation based on RPM
    let baseNoise = (rpm / 2000) * 30; // 30 dBA at 2000 RPM
    
    // Adjust for number of fans
    baseNoise += Math.log2(count) * 3;
    
    // Usage adjustment
    if (usage === 'gaming') {
      baseNoise *= 1.2; // 20% louder during gaming
    }
    
    return Math.min(baseNoise, 60); // Cap at 60 dBA
  };

  const determineNoiseProfile = (noiseLevel) => {
    if (noiseLevel < 20) return 'Silent';
    if (noiseLevel < 30) return 'Quiet';
    if (noiseLevel < 40) return 'Moderate';
    if (noiseLevel < 50) return 'Loud';
    return 'Very Loud';
  };

  const renderPowerSection = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Power Consumption
          <Tooltip title="Estimated power usage based on component specifications and usage scenario">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {Math.round(powerUsage.total)}W
          </Typography>
          <LinearProgress
            variant="determinate"
            value={powerUsage.efficiency}
            color={powerUsage.efficiency > 80 ? 'error' : 'primary'}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            PSU Load: {Math.round(powerUsage.efficiency)}%
          </Typography>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Power Breakdown
        </Typography>
        <List dense>
          {Object.entries(powerUsage.breakdown).map(([component, power]) => (
            <ListItem key={component}>
              <ListItemIcon>
                <PowerIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={component.toUpperCase()}
                secondary={`${Math.round(power)}W (${Math.round(power/powerUsage.total*100)}%)`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderThermalSection = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thermal Analysis
          <Tooltip title="Temperature and airflow analysis based on component configuration">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {Math.round(thermals.overall)}°C
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(thermals.overall / 100) * 100}
            color={thermals.overall > 80 ? 'error' : 'primary'}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {thermals.hotspots.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Thermal Hotspots
            </Typography>
            <List dense>
              {thermals.hotspots.map((hotspot, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <WarningIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${hotspot.component}: ${Math.round(hotspot.temp)}°C`}
                    secondary={`Temperature above recommended`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Airflow Score: {Math.round(thermals.airflow)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={thermals.airflow}
            color={thermals.airflow < 50 ? 'error' : 'success'}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  const renderNoiseSection = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Noise Analysis
          <Tooltip title="Estimated noise levels based on component specifications">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {Math.round(noise.overall)} dBA
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Profile: {noise.profile}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(noise.overall / 60) * 100}
            color={noise.overall > 40 ? 'error' : 'primary'}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Noise Sources
        </Typography>
        <List dense>
          {noise.sources.map((source, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <NoiseIcon color={source.level > 40 ? 'error' : 'primary'} />
              </ListItemIcon>
              <ListItemText
                primary={source.source}
                secondary={`${Math.round(source.level)} dBA`}
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
        System Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {renderPowerSection()}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderThermalSection()}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderNoiseSection()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemAnalytics;
