import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  TextField,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { fetchProductById, addReview } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
  });

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (user) {
      dispatch(addToCart({ userId: user.id, productId: id, quantity }));
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (user) {
      dispatch(
        addReview({
          productId: id,
          review: { ...reviewData, userId: user.id },
        })
      );
      setReviewData({ rating: 0, comment: '' });
    }
  };

  if (loading || !selectedProduct) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <img
            src={selectedProduct.images[0]}
            alt={selectedProduct.name}
            style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {selectedProduct.name}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            TTD {selectedProduct.price.toFixed(2)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={selectedProduct.rating} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({selectedProduct.reviews.length} reviews)
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            {selectedProduct.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <TextField
              type="number"
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ width: 100, mr: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleAddToCart}
              disabled={!user || selectedProduct.stock < 1}
            >
              Add to Cart
            </Button>
          </Box>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Specifications
              </Typography>
              <List>
                {Object.entries(selectedProduct.specifications).map(
                  ([key, value]) => (
                    <ListItem key={key}>
                      <ListItemText
                        primary={key}
                        secondary={value}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </ListItem>
                  )
                )}
              </List>
            </CardContent>
          </Card>

          {user && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Write a Review
              </Typography>
              <form onSubmit={handleReviewSubmit}>
                <Rating
                  value={reviewData.rating}
                  onChange={(e, newValue) =>
                    setReviewData({ ...reviewData, rating: newValue })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Your Review"
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!reviewData.rating || !reviewData.comment}
                >
                  Submit Review
                </Button>
              </form>
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" gutterBottom>
            Customer Reviews
          </Typography>
          {selectedProduct.reviews.map((review, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Rating value={review.rating} readOnly size="small" />
                <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                  {new Date(review.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">{review.comment}</Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
