import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Lightbulb as LightIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Settings as SettingsIcon,
  Link as LinkIcon,
  LinkOff as LinkOffIcon,
} from '@mui/icons-material';

const RGBManager = ({ components }) => {
  const [syncEnabled, setSyncEnabled] = useState(true);

  const rgbEcosystems = {
    ASUS_AURA: 'Asus Aura Sync',
    MSI_MYSTIC: 'MSI Mystic Light',
    GIGABYTE_RGB: 'Gigabyte RGB Fusion',
    CORSAIR_ICUE: 'Corsair iCUE',
    RAZER_CHROMA: 'Razer Chroma',
    NZXT_CAM: 'NZXT CAM',
  };

  const getComponentEcosystem = (component) => {
    if (!component?.rgb) return null;
    return component.rgb.ecosystem;
  };

  const analyzeRGBCompatibility = () => {
    const ecosystems = new Set();
    const components = [];
    const issues = [];
    let totalPorts = 0;
    let usedPorts = 0;

    // Analyze each component
    Object.entries(components).forEach(([type, component]) => {
      if (component?.rgb) {
        ecosystems.add(component.rgb.ecosystem);
        components.push({
          type,
          name: component.name,
          ecosystem: component.rgb.ecosystem,
          ports: component.rgb.ports || 0,
          controller: component.rgb.controller || false,
        });
        
        if (component.rgb.controller) {
          totalPorts += component.rgb.ports || 0;
        }
        usedPorts += 1;
      }
    });

    // Check for ecosystem conflicts
    if (ecosystems.size > 1) {
      issues.push({
        severity: 'warning',
        message: 'Multiple RGB ecosystems detected. Some components may not sync properly.',
        affected: Array.from(ecosystems).join(', '),
      });
    }

    // Check for port availability
    if (usedPorts > totalPorts) {
      issues.push({
        severity: 'error',
        message: `Insufficient RGB headers. Need ${usedPorts} but only have ${totalPorts} available.`,
        affected: 'RGB Controllers',
      });
    }

    return {
      ecosystems: Array.from(ecosystems),
      components,
      issues,
      totalPorts,
      usedPorts,
    };
  };

  const compatibility = analyzeRGBCompatibility();

  const renderEcosystemSection = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          RGB Ecosystems
          <Tooltip title="Detected RGB ecosystems in your build">
            <IconButton size="small">
              <LightIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {compatibility.ecosystems.map((ecosystem) => (
            <Chip
              key={ecosystem}
              label={rgbEcosystems[ecosystem]}
              icon={<LightIcon />}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={syncEnabled}
              onChange={(e) => setSyncEnabled(e.target.checked)}
            />
          }
          label="RGB Sync"
        />
      </CardContent>
    </Card>
  );

  const renderCompatibilitySection = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Compatibility Status
        </Typography>

        {compatibility.issues.map((issue, index) => (
          <Alert
            key={index}
            severity={issue.severity}
            icon={issue.severity === 'error' ? <WarningIcon /> : <LinkOffIcon />}
            sx={{ mb: 2 }}
          >
            <Typography variant="subtitle2">{issue.message}</Typography>
            <Typography variant="body2" color="text.secondary">
              Affected: {issue.affected}
            </Typography>
          </Alert>
        ))}

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            RGB Headers: {compatibility.usedPorts} / {compatibility.totalPorts} used
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderComponentsList = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          RGB Components
        </Typography>

        <List>
          {compatibility.components.map((component, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {component.controller ? <SettingsIcon /> : <LightIcon />}
              </ListItemIcon>
              <ListItemText
                primary={component.name}
                secondary={`${rgbEcosystems[component.ecosystem]}${
                  component.controller ? ` (${component.ports} ports)` : ''
                }`}
              />
              {syncEnabled && (
                <Chip
                  icon={
                    compatibility.ecosystems.length === 1 ? (
                      <LinkIcon />
                    ) : (
                      <LinkOffIcon />
                    )
                  }
                  label={
                    compatibility.ecosystems.length === 1
                      ? 'Synced'
                      : 'Sync Limited'
                  }
                  color={
                    compatibility.ecosystems.length === 1
                      ? 'success'
                      : 'warning'
                  }
                  size="small"
                />
              )}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        RGB Sync Manager
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {renderEcosystemSection()}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderCompatibilitySection()}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderComponentsList()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RGBManager;
