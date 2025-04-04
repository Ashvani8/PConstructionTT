import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Box,
} from '@mui/material';
import { fetchProducts } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, totalPages, currentPage, loading } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    category: '',
    sort: 'price:asc',
  });

  useEffect(() => {
    dispatch(fetchProducts({ ...filters, page: currentPage }));
  }, [dispatch, filters, currentPage]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddToCart = (productId) => {
    if (user) {
      dispatch(addToCart({ userId: user.id, productId, quantity: 1 }));
    }
  };

  const handlePageChange = (event, value) => {
    dispatch(fetchProducts({ ...filters, page: value }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                label="Category"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Laptops">Laptops</MenuItem>
                <MenuItem value="Desktops">Desktops</MenuItem>
                <MenuItem value="Components">Components</MenuItem>
                <MenuItem value="Peripherals">Peripherals</MenuItem>
                <MenuItem value="Networking">Networking</MenuItem>
                <MenuItem value="Software">Software</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                name="sort"
                value={filters.sort}
                label="Sort By"
                onChange={handleFilterChange}
              >
                <MenuItem value="price:asc">Price: Low to High</MenuItem>
                <MenuItem value="price:desc">Price: High to Low</MenuItem>
                <MenuItem value="rating:desc">Highest Rated</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          items.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <Card className="product-card">
                <CardMedia
                  component="img"
                  height="200"
                  image={product.images[0]}
                  alt={product.name}
                  className="product-image"
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {product.description.substring(0, 100)}...
                  </Typography>
                  <Typography variant="h6" color="primary" className="price">
                    TTD {product.price.toFixed(2)}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/product/${product._id}`}
                    variant="outlined"
                    sx={{ mt: 2, mr: 1 }}
                    fullWidth
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleAddToCart(product._id)}
                    disabled={!user}
                    sx={{ mt: 1 }}
                    fullWidth
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default ProductList;
