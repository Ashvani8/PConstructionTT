import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Tooltip,
  Chip,
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  ShoppingCart as CartIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const BuildSummary = ({
  components,
  compatibility,
  totalPrice,
  totalWattage,
  onRemoveComponent,
  onAddToCart,
  onSaveBuild,
}) => {
  const renderComponentList = () => {
    return Object.entries(components).map(([type, component]) => {
      if (!component || (Array.isArray(component) && component.length === 0)) {
        return (
          <ListItem key={type}>
            <ListItemText
              primary={type.charAt(0).toUpperCase() + type.slice(1)}
              secondary="Not selected"
              sx={{ color: 'text.disabled' }}
            />
          </ListItem>
        );
      }

      if (Array.isArray(component)) {
        return component.map((item, index) => (
          <ListItem key={`${type}-${index}`}>
            <ListItemText
              primary={item.name}
              secondary={
                <React.Fragment>
                  <Typography variant="body2" color="text.secondary">
                    ${item.price}
                  </Typography>
                  {item.wattage && (
                    <Typography variant="caption" color="text.secondary">
                      Power: {item.wattage}W
                    </Typography>
                  )}
                </React.Fragment>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                size="small"
                onClick={() => onRemoveComponent(type, index)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ));
      }

      return (
        <ListItem key={type}>
          <ListItemText
            primary={component.name}
            secondary={
              <React.Fragment>
                <Typography variant="body2" color="text.secondary">
                  ${component.price}
                </Typography>
                {component.wattage && (
                  <Typography variant="caption" color="text.secondary">
                    Power: {component.wattage}W
                  </Typography>
                )}
              </React.Fragment>
            }
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              size="small"
              onClick={() => onRemoveComponent(type)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  };

  const isComplete = Object.values(components).every(
    component => component && (!Array.isArray(component) || component.length > 0)
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Build Summary
      </Typography>

      {compatibility.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="error" gutterBottom>
            <WarningIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Compatibility Issues:
          </Typography>
          <List dense>
            {compatibility.map((issue, index) => (
              <ListItem key={index}>
                <ListItemText
                  secondary={issue}
                  sx={{ color: 'error.main' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <List dense>
        {renderComponentList()}
      </List>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Total Price: ${totalPrice.toFixed(2)}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Estimated Wattage: {totalWattage}W
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<CartIcon />}
          onClick={onAddToCart}
          disabled={!isComplete || compatibility.length > 0}
          fullWidth
        >
          Add to Cart
        </Button>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={onSaveBuild}
          disabled={!isComplete}
          fullWidth
        >
          Save Build
        </Button>
      </Box>

      {!isComplete && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 1, textAlign: 'center' }}
        >
          Please select all components to continue
        </Typography>
      )}
    </Paper>
  );
};

export default BuildSummary;
