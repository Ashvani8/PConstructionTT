import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import axios from 'axios';

const categories = [
  'Laptops',
  'Desktops',
  'Components',
  'Peripherals',
  'Networking',
  'Software'
];

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stock: '',
    brand: '',
    specifications: {}
  });

  const [specs, setSpecs] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse specifications from JSON string
      const parsedSpecs = specs ? JSON.parse(specs) : {};
      
      const productData = {
        ...product,
        specifications: parsedSpecs,
        price: parseFloat(product.price),
        stock: parseInt(product.stock)
      };

      const response = await axios.post('/api/products', productData);
      
      if (response.data) {
        setAlert({
          open: true,
          message: 'Product added successfully!',
          severity: 'success'
        });
        
        // Reset form
        setProduct({
          name: '',
          description: '',
          price: '',
          category: '',
          imageUrl: '',
          stock: '',
          brand: '',
          specifications: {}
        });
        setSpecs('');
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Error adding product',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Add New Product
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Price"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  inputProps={{ step: "0.01", min: "0" }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageUrl"
                  value={product.imageUrl}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Stock"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  inputProps={{ min: "0" }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Brand"
                  name="brand"
                  value={product.brand}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Specifications (JSON format)"
                  value={specs}
                  onChange={(e) => setSpecs(e.target.value)}
                  helperText="Enter specifications in JSON format, e.g., {'CPU': 'Intel i7', 'RAM': '16GB'}"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Add Product
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddProduct;
