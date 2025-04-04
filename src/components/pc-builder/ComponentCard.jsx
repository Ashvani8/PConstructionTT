import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Info as InfoIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

const ComponentCard = ({
  component,
  onSelect,
  isSelected,
  showDetails = false,
  compatibility = null,
}) => {
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    setDetailsOpen(true);
  };

  const renderSpecs = () => {
    return Object.entries(component.specs || {}).map(([key, value]) => (
      <TableRow key={key}>
        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </TableCell>
        <TableCell>{value}</TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
          ...(isSelected && {
            border: '2px solid',
            borderColor: 'primary.main',
          }),
        }}
        onClick={() => onSelect(component)}
      >
        {isSelected && (
          <Chip
            icon={<CheckIcon />}
            label="Selected"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          />
        )}

        <CardMedia
          component="img"
          height="140"
          image={component.image}
          alt={component.name}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {component.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {component.description}
          </Typography>

          <Box sx={{ mt: 1 }}>
            {component.features?.map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>

          {compatibility && (
            <Box sx={{ mt: 1 }}>
              <Chip
                label={compatibility.message}
                color={compatibility.compatible ? 'success' : 'error'}
                size="small"
              />
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h6" color="primary">
            ${component.price}
          </Typography>
          <Box>
            <Tooltip title="View Details">
              <IconButton size="small" onClick={handleDetailsClick}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Button
              size="small"
              variant={isSelected ? "outlined" : "contained"}
              onClick={() => onSelect(component)}
              sx={{ ml: 1 }}
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
          </Box>
        </CardActions>
      </Card>

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {component.name}
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableBody>
                {renderSpecs()}
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Price
                  </TableCell>
                  <TableCell>${component.price}</TableCell>
                </TableRow>
                {component.wattage && (
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      Power Consumption
                    </TableCell>
                    <TableCell>{component.wattage}W</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              onSelect(component);
              setDetailsOpen(false);
            }}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ComponentCard;
