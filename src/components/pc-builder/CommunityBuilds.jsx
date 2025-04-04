import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  IconButton,
  Button,
  Rating,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Favorite,
  Share,
  Comment,
  BookmarkAdd,
  FilterList,
  Sort,
} from '@mui/icons-material';

const CommunityBuilds = () => {
  const [filters, setFilters] = useState({
    purpose: 'all',
    priceRange: 'all',
    sortBy: 'popular'
  });
  const [showBuildDialog, setShowBuildDialog] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState(null);

  const purposes = [
    { value: 'all', label: 'All Purposes' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'workstation', label: 'Workstation' },
    { value: 'streaming', label: 'Streaming' },
    { value: 'office', label: 'Office' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'budget', label: '$500 - $800' },
    { value: 'midrange', label: '$800 - $1500' },
    { value: 'highend', label: '$1500 - $2500' },
    { value: 'extreme', label: '$2500+' }
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' }
  ];

  const sampleBuilds = [
    {
      id: 1,
      title: "Ultimate Gaming Rig",
      author: "TechMaster",
      purpose: "gaming",
      price: 2799,
      rating: 4.8,
      likes: 342,
      comments: 56,
      image: "https://example.com/build1.jpg",
      specs: {
        cpu: "AMD Ryzen 9 5950X",
        gpu: "NVIDIA RTX 4090",
        ram: "32GB DDR4 3600MHz",
        storage: "2TB NVMe SSD"
      },
      description: "Built for 4K gaming and streaming",
      tags: ["4K Gaming", "Streaming", "RGB"],
      performance: {
        gaming: 95,
        workstation: 90,
        thermal: 85
      }
    },
    // Add more sample builds...
  ];

  const handleBuildClick = (build) => {
    setSelectedBuild(build);
    setShowBuildDialog(true);
  };

  const renderBuildCard = (build) => (
    <Grid item xs={12} sm={6} md={4} key={build.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="200"
          image={build.image}
          alt={build.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" noWrap>
              {build.title}
            </Typography>
            <Rating value={build.rating} precision={0.1} size="small" readOnly />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {build.author}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Chip
              label={`$${build.price}`}
              color="primary"
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip
              label={build.purpose}
              variant="outlined"
              size="small"
            />
          </Box>

          <Typography variant="body2" color="text.secondary" paragraph>
            {build.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {build.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <IconButton size="small">
                <Favorite />
              </IconButton>
              <Typography variant="body2" component="span">
                {build.likes}
              </Typography>
              <IconButton size="small">
                <Comment />
              </IconButton>
              <Typography variant="body2" component="span">
                {build.comments}
              </Typography>
            </Box>
            <Box>
              <IconButton size="small">
                <Share />
              </IconButton>
              <IconButton size="small">
                <BookmarkAdd />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderBuildDialog = () => (
    <Dialog
      open={showBuildDialog}
      onClose={() => setShowBuildDialog(false)}
      maxWidth="md"
      fullWidth
    >
      {selectedBuild && (
        <>
          <DialogTitle>
            {selectedBuild.title}
            <Typography variant="subtitle2" color="text.secondary">
              by {selectedBuild.author}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <img
                  src={selectedBuild.image}
                  alt={selectedBuild.title}
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Specifications
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {Object.entries(selectedBuild.specs).map(([key, value]) => (
                    <Box key={key} sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {key.toUpperCase()}
                      </Typography>
                      <Typography variant="body1">
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                {Object.entries(selectedBuild.performance).map(([key, value]) => (
                  <Box key={key} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Typography>
                      <Typography variant="body2">
                        {value}/100
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          width: `${value}%`,
                          height: '100%',
                          bgcolor: 'primary.main'
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowBuildDialog(false)}>Close</Button>
            <Button variant="contained" color="primary">
              Clone Build
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Community Builds
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore and share PC builds from the community
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Purpose</InputLabel>
              <Select
                value={filters.purpose}
                label="Purpose"
                onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}
              >
                {purposes.map((purpose) => (
                  <MenuItem key={purpose.value} value={purpose.value}>
                    {purpose.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Price Range</InputLabel>
              <Select
                value={filters.priceRange}
                label="Price Range"
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              >
                {priceRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort By"
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {sampleBuilds.map(renderBuildCard)}
      </Grid>

      {renderBuildDialog()}
    </Box>
  );
};

export default CommunityBuilds;
