import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Chip,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CrossIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const CompatibilityMatrix = ({ components, selectedComponents }) => {
  const compatibilityRules = {
    cpu: {
      motherboard: (cpu, mobo) => ({
        compatible: cpu.socket === mobo.socket,
        message: cpu.socket === mobo.socket
          ? 'CPU socket matches motherboard'
          : `Socket mismatch: CPU requires ${cpu.socket}, motherboard has ${mobo.socket}`,
      }),
      cooling: (cpu, cooling) => ({
        compatible: cooling.tdp >= cpu.tdp,
        message: cooling.tdp >= cpu.tdp
          ? 'Cooler TDP sufficient for CPU'
          : `Cooler TDP (${cooling.tdp}W) insufficient for CPU TDP (${cpu.tdp}W)`,
      }),
    },
    motherboard: {
      memory: (mobo, memory) => {
        const totalMemory = Array.isArray(memory)
          ? memory.reduce((sum, mem) => sum + mem.capacity, 0)
          : memory.capacity;
        return {
          compatible: totalMemory <= mobo.maxMemory && memory.type === mobo.memoryType,
          message: totalMemory <= mobo.maxMemory && memory.type === mobo.memoryType
            ? 'Memory compatible with motherboard'
            : `Memory incompatible: ${memory.type} not supported or ${totalMemory}GB exceeds ${mobo.maxMemory}GB limit`,
        };
      },
      case: (mobo, pcCase) => ({
        compatible: pcCase.formFactors.includes(mobo.formFactor),
        message: pcCase.formFactors.includes(mobo.formFactor)
          ? `Case supports ${mobo.formFactor} form factor`
          : `Case does not support ${mobo.formFactor} form factor`,
      }),
    },
    gpu: {
      case: (gpu, pcCase) => ({
        compatible: gpu.length <= pcCase.maxGpuLength,
        message: gpu.length <= pcCase.maxGpuLength
          ? 'GPU fits in case'
          : `GPU length (${gpu.length}mm) exceeds case limit (${pcCase.maxGpuLength}mm)`,
      }),
      psu: (gpu, psu) => ({
        compatible: psu.wattage >= gpu.recommendedPsu,
        message: psu.wattage >= gpu.recommendedPsu
          ? 'PSU wattage sufficient for GPU'
          : `PSU wattage (${psu.wattage}W) below GPU recommended (${gpu.recommendedPsu}W)`,
      }),
    },
  };

  const getCompatibilityStatus = (component1Type, component1, component2Type, component2) => {
    if (!component1 || !component2) return null;

    const rule = compatibilityRules[component1Type]?.[component2Type];
    if (!rule) return null;

    return rule(component1, component2);
  };

  const renderCompatibilityCell = (component1Type, component2Type) => {
    const status = getCompatibilityStatus(
      component1Type,
      selectedComponents[component1Type],
      component2Type,
      selectedComponents[component2Type]
    );

    if (!status) return null;

    return (
      <Tooltip title={status.message}>
        <Box>
          {status.compatible ? (
            <CheckIcon color="success" />
          ) : (
            <CrossIcon color="error" />
          )}
        </Box>
      </Tooltip>
    );
  };

  const componentTypes = [
    'cpu',
    'motherboard',
    'memory',
    'gpu',
    'storage',
    'psu',
    'case',
    'cooling',
  ];

  const calculateOverallCompatibility = () => {
    const issues = [];
    
    for (const type1 of componentTypes) {
      for (const type2 of componentTypes) {
        const status = getCompatibilityStatus(
          type1,
          selectedComponents[type1],
          type2,
          selectedComponents[type2]
        );
        
        if (status && !status.compatible) {
          issues.push(status.message);
        }
      }
    }
    
    return {
      compatible: issues.length === 0,
      issues,
    };
  };

  const calculateTotalPower = () => {
    let totalPower = 0;
    const components = selectedComponents;

    if (components.cpu) totalPower += components.cpu.tdp;
    if (components.gpu) totalPower += components.gpu.tdp;
    // Add other component power consumption...

    return totalPower;
  };

  const overallCompatibility = calculateOverallCompatibility();
  const totalPower = calculateTotalPower();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Compatibility Check
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Overall Compatibility
                </Typography>
                {overallCompatibility.compatible ? (
                  <Chip
                    icon={<CheckIcon />}
                    label="All Components Compatible"
                    color="success"
                  />
                ) : (
                  <Chip
                    icon={<WarningIcon />}
                    label="Compatibility Issues Found"
                    color="error"
                  />
                )}
              </Box>

              {!overallCompatibility.compatible && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {overallCompatibility.issues.map((issue, index) => (
                    <Typography key={index} variant="body2">
                      • {issue}
                    </Typography>
                  ))}
                </Alert>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Estimated Power Consumption: {totalPower}W
                </Typography>
                {selectedComponents.psu && (
                  <Typography variant="body2" color="text.secondary">
                    PSU Capacity: {selectedComponents.psu.wattage}W
                    ({Math.round((totalPower / selectedComponents.psu.wattage) * 100)}% utilized)
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Component</TableCell>
                  {componentTypes.map((type) => (
                    <TableCell key={type} align="center">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {componentTypes.map((type1) => (
                  <TableRow key={type1}>
                    <TableCell component="th" scope="row">
                      {type1.charAt(0).toUpperCase() + type1.slice(1)}
                    </TableCell>
                    {componentTypes.map((type2) => (
                      <TableCell key={type2} align="center">
                        {renderCompatibilityCell(type1, type2)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompatibilityMatrix;
