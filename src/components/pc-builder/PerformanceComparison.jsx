import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Tooltip,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  Info as InfoIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Whatshot as PowerIcon,
} from '@mui/icons-material';

const benchmarks = {
  gaming: {
    'Cyberpunk 2077': {
      '1080p': { low: 30, medium: 60, high: 100, ultra: 144 },
      '1440p': { low: 20, medium: 45, high: 80, ultra: 120 },
      '4K': { low: 15, medium: 30, high: 60, ultra: 100 },
    },
    'Fortnite': {
      '1080p': { low: 60, medium: 120, high: 200, ultra: 240 },
      '1440p': { low: 45, medium: 90, high: 144, ultra: 200 },
      '4K': { low: 30, medium: 60, high: 100, ultra: 144 },
    },
    'Microsoft Flight Simulator': {
      '1080p': { low: 30, medium: 60, high: 90, ultra: 120 },
      '1440p': { low: 25, medium: 45, high: 70, ultra: 100 },
      '4K': { low: 20, medium: 35, high: 50, ultra: 80 },
    },
  },
  productivity: {
    'Video Rendering': { low: 20, medium: 40, high: 60, ultra: 100 },
    'Code Compilation': { low: 30, medium: 50, high: 70, ultra: 100 },
    'CAD Performance': { low: 25, medium: 45, high: 65, ultra: 100 },
  },
};

const PerformanceComparison = ({ buildSpecs, comparisonBuild = null }) => {
  const calculateGamingScore = (specs, game, resolution) => {
    const { cpu, gpu, memory } = specs;
    let score = 0;

    // CPU contribution (30%)
    if (cpu) {
      const cpuScore = (cpu.cores * cpu.threads * cpu.baseSpeed) / 10;
      score += cpuScore * 0.3;
    }

    // GPU contribution (50%)
    if (gpu) {
      const gpuScore = (gpu.vram * 5) + (gpu.wattage / 10);
      score += gpuScore * 0.5;
    }

    // Memory contribution (20%)
    if (memory) {
      const totalMemory = Array.isArray(memory)
        ? memory.reduce((sum, mem) => sum + mem.capacity, 0)
        : memory.capacity;
      score += (totalMemory / 1024) * 0.2;
    }

    // Resolution scaling
    const resolutionMultiplier = {
      '1080p': 1,
      '1440p': 0.75,
      '4K': 0.5,
    }[resolution] || 1;

    return score * resolutionMultiplier;
  };

  const calculateProductivityScore = (specs, task) => {
    const { cpu, memory, storage } = specs;
    let score = 0;

    // CPU contribution (40%)
    if (cpu) {
      const cpuScore = (cpu.cores * cpu.threads * cpu.baseSpeed) / 5;
      score += cpuScore * 0.4;
    }

    // Memory contribution (40%)
    if (memory) {
      const totalMemory = Array.isArray(memory)
        ? memory.reduce((sum, mem) => sum + mem.capacity, 0)
        : memory.capacity;
      score += (totalMemory / 512) * 0.4;
    }

    // Storage contribution (20%)
    if (storage) {
      const storageMultiplier = {
        'NVMe': 1,
        'SSD': 0.8,
        'HDD': 0.4,
      }[storage.storageType] || 0.4;
      score += storageMultiplier * 0.2;
    }

    return score;
  };

  const renderGamingBenchmarks = () => (
    <Grid container spacing={2}>
      {Object.entries(benchmarks.gaming).map(([game, resolutions]) => (
        <Grid item xs={12} key={game}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {game}
              </Typography>
              {Object.entries(resolutions).map(([resolution, targets]) => {
                const score = calculateGamingScore(buildSpecs, game, resolution);
                const comparisonScore = comparisonBuild
                  ? calculateGamingScore(comparisonBuild, game, resolution)
                  : null;
                const maxScore = targets.ultra;
                
                return (
                  <Box key={resolution} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{resolution}</Typography>
                      <Typography variant="body2">
                        {Math.round(score)} FPS
                        {comparisonScore && ` (vs ${Math.round(comparisonScore)} FPS)`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                      <LinearProgress
                        variant="determinate"
                        value={(score / maxScore) * 100}
                        sx={{ 
                          width: '100%',
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'action.hover',
                        }}
                      />
                      {comparisonScore && (
                        <Box
                          sx={{
                            position: 'absolute',
                            left: `${(comparisonScore / maxScore) * 100}%`,
                            transform: 'translateX(-50%)',
                            width: 2,
                            height: 16,
                            backgroundColor: 'secondary.main',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderProductivityBenchmarks = () => (
    <Grid container spacing={2}>
      {Object.entries(benchmarks.productivity).map(([task, targets]) => {
        const score = calculateProductivityScore(buildSpecs, task);
        const comparisonScore = comparisonBuild
          ? calculateProductivityScore(comparisonBuild, task)
          : null;
        const maxScore = targets.ultra;

        return (
          <Grid item xs={12} sm={6} md={4} key={task}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {task}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Performance Score</Typography>
                  <Typography variant="body2">
                    {Math.round(score)}
                    {comparisonScore && ` (vs ${Math.round(comparisonScore)})`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <LinearProgress
                    variant="determinate"
                    value={(score / maxScore) * 100}
                    sx={{
                      width: '100%',
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'action.hover',
                    }}
                  />
                  {comparisonScore && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: `${(comparisonScore / maxScore) * 100}%`,
                        transform: 'translateX(-50%)',
                        width: 2,
                        height: 16,
                        backgroundColor: 'secondary.main',
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Performance Analysis
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Gaming Performance
          <Tooltip title="Estimated FPS based on component specifications">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        {renderGamingBenchmarks()}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Productivity Performance
          <Tooltip title="Relative performance scores for various productivity tasks">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        {renderProductivityBenchmarks()}
      </Paper>
    </Box>
  );
};

export default PerformanceComparison;
