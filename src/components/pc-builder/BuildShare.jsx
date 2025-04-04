import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Share as ShareIcon,
  FileCopy as CopyIcon,
  Download as DownloadIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Reddit as RedditIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

const BuildShare = ({ build }) => {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [shareLink, setShareLink] = useState('');
  const [exportFormat, setExportFormat] = useState('json');

  const handleOpen = () => {
    setOpen(true);
    // Generate a shareable link
    const link = `https://yourwebsite.com/builds/${build.id}`;
    setShareLink(link);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setSnackbar({
        open: true,
        message: 'Link copied to clipboard!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to copy link',
        severity: 'error'
      });
    }
  };

  const handleExport = (format) => {
    let content;
    let filename;
    let mimeType;

    switch (format) {
      case 'json':
        content = JSON.stringify(build, null, 2);
        filename = 'pc-build.json';
        mimeType = 'application/json';
        break;
      case 'txt':
        content = generateTextExport(build);
        filename = 'pc-build.txt';
        mimeType = 'text/plain';
        break;
      case 'md':
        content = generateMarkdownExport(build);
        filename = 'pc-build.md';
        mimeType = 'text/markdown';
        break;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbar({
      open: true,
      message: `Build exported as ${format.toUpperCase()}`,
      severity: 'success'
    });
  };

  const generateTextExport = (build) => {
    return `
PC Build: ${build.name}
Created by: ${build.author}
Date: ${new Date().toLocaleDateString()}

Components:
${Object.entries(build.components)
  .map(([key, component]) => `${key}: ${component.name} - $${component.price}`)
  .join('\n')}

Total Price: $${Object.values(build.components)
  .reduce((sum, component) => sum + component.price, 0)
  .toLocaleString()}

Performance Metrics:
Gaming: ${build.performance.gaming}/100
Workstation: ${build.performance.workstation}/100
Thermal: ${build.performance.thermal}/100

Notes: ${build.notes || 'No notes provided'}
    `.trim();
  };

  const generateMarkdownExport = (build) => {
    return `
# ${build.name}

## Build Information
- **Author:** ${build.author}
- **Date:** ${new Date().toLocaleDateString()}
- **Total Price:** $${Object.values(build.components)
    .reduce((sum, component) => sum + component.price, 0)
    .toLocaleString()}

## Components

${Object.entries(build.components)
  .map(([key, component]) => `### ${key}
- **Model:** ${component.name}
- **Price:** $${component.price}
- **Specs:** ${component.specs || 'N/A'}`)
  .join('\n\n')}

## Performance Metrics
- Gaming: ${build.performance.gaming}/100
- Workstation: ${build.performance.workstation}/100
- Thermal: ${build.performance.thermal}/100

## Notes
${build.notes || 'No notes provided'}
    `.trim();
  };

  const shareOptions = [
    { icon: <RedditIcon />, name: 'Reddit', action: () => {} },
    { icon: <TwitterIcon />, name: 'Twitter', action: () => {} },
    { icon: <FacebookIcon />, name: 'Facebook', action: () => {} },
    { icon: <EmailIcon />, name: 'Email', action: () => {} },
  ];

  const exportOptions = [
    { icon: <CopyIcon />, name: 'Copy Build Link', action: handleCopyLink },
    { icon: <DownloadIcon />, name: 'Export as JSON', action: () => handleExport('json') },
    { icon: <DownloadIcon />, name: 'Export as Text', action: () => handleExport('txt') },
    { icon: <DownloadIcon />, name: 'Export as Markdown', action: () => handleExport('md') },
    { icon: <ImageIcon />, name: 'Export as Image', action: () => {} },
  ];

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ShareIcon />}
        onClick={handleOpen}
      >
        Share Build
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Share Your Build</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Share Link
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs>
                <TextField
                  fullWidth
                  value={shareLink}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<CopyIcon />}
                  onClick={handleCopyLink}
                >
                  Copy
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Share on Social Media
          </Typography>
          <List>
            {shareOptions.map((option, index) => (
              <ListItem
                key={index}
                button
                onClick={option.action}
              >
                <ListItemIcon>
                  {option.icon}
                </ListItemIcon>
                <ListItemText primary={option.name} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            Export Build
          </Typography>
          <List>
            {exportOptions.map((option, index) => (
              <ListItem
                key={index}
                button
                onClick={option.action}
              >
                <ListItemIcon>
                  {option.icon}
                </ListItemIcon>
                <ListItemText primary={option.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BuildShare;
