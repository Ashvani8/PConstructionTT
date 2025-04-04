import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Slider,
  Checkbox,
  FormControlLabel,
  Divider,
  Chip,
} from '@mui/material';
import { fetchProducts } from '../../store/slices/productSlice';

const categories = [
  {
    name: 'Laptops',
    image: 'https://via.placeholder.com/150',
    subcategories: ['Gaming', 'Business', 'Student', 'Workstation']
  },
  {
    name: 'Desktops',
    image: 'https://via.placeholder.com/150',
    subcategories: ['Gaming PC', 'Workstation', 'All-in-One']
  },
  {
    name: 'Components',
    image: 'https://via.placeholder.com/150',
    subcategories: ['CPUs', 'GPUs', 'Motherboards', 'RAM', 'Storage']
  },
  {
    name: 'Peripherals',
    image: 'https://via.placeholder.com/150',
    subcategories: ['Monitors', 'Keyboards', 'Mice', 'Headsets']
  },
  {
    name: 'Networking',
    image: 'https://via.placeholder.com/150',
    subcategories: ['Routers', 'Switches', 'Network Cards', 'WiFi Adapters']
  },
  {
    name: 'Software',
    image: 'https://via.placeholder.com/150',
    subcategories: ['Operating Systems', 'Office', 'Security', 'Games']
  }
];

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, loading } = useSelector((state) => state.products);
  
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    priceRange: [0, 10000],
    brands: [],
    inStock: false
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerWidth = 280;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setFilters(prev => ({ ...prev, category }));
      dispatch(fetchProducts({ category }));
    }
  }, [location.search, dispatch]);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
    setFilters(prev => ({ ...prev, category }));
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    dispatch(fetchProducts({ ...filters, [type]: value }));
  };

  const FilterDrawer = (
    <Drawer
      variant="persistent"
      anchor="left"
      open={drawerOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          marginTop: '64px', // Height of AppBar
          paddingTop: 2
        },
      }}
    >
      <Container>
        <Typography variant="h6" gutterBottom>Filters</Typography>
        <Divider />
        
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Price Range</Typography>
          <Slider
            value={filters.priceRange}
            onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={10000}
            valueLabelFormat={(value) => `TTD ${value}`}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>Subcategories</Typography>
          <List dense>
            {categories
              .find(cat => cat.name === filters.category)
              ?.subcategories.map((sub) => (
                <ListItem key={sub} disablePadding>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filters.subcategory === sub}
                        onChange={() => handleFilterChange('subcategory', sub)}
                      />
                    }
                    label={sub}
                  />
                </ListItem>
              ))}
          </List>
        </Box>

        <Box sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              />
            }
            label="In Stock Only"
          />
        </Box>
      </Container>
    </Drawer>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {!filters.category ? (
        <>
          <Typography variant="h4" gutterBottom>
            Browse Categories
          </Typography>
          <Grid container spacing={4}>
            {categories.map((category) => (
              <Grid item key={category.name} xs={12} sm={6} md={4}>
                <Card 
                  onClick={() => handleCategoryClick(category.name)}
                  sx={{ 
                    cursor: 'pointer',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={category.image}
                    alt={category.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {category.name}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {category.subcategories.map((sub) => (
                        <Chip key={sub} label={sub} size="small" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Grid container spacing={2}>
          {FilterDrawer}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">
                {filters.category}
              </Typography>
              <Button 
                sx={{ ml: 2 }}
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                {drawerOpen ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </Box>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Grid container spacing={3}>
                {items.map((product) => (
                  <Grid item key={product._id} xs={12} sm={6} md={4}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.images[0]}
                        alt={product.name}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.description.substring(0, 100)}...
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                          TTD {product.price.toFixed(2)}
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ mt: 2 }}
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Categories;
