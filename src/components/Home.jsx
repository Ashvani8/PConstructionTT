import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box, Stack, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { Link } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: '#fff',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(8, 4),
  marginBottom: theme.spacing(6),
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: '50%',
    background: 'url("/hero-pattern.svg") repeat',
    opacity: 0.1,
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)'
  }
}));

const featuredProducts = [
  {
    id: 1,
    name: 'ROG Zephyrus G14',
    description: 'AMD Ryzen 9 | RTX 4090 | 32GB RAM',
    price: 'TTD 12,999',
    image: 'https://via.placeholder.com/300x200',
    badge: 'New Arrival'
  },
  {
    id: 2,
    name: 'Razer Basilisk V3',
    description: 'Pro Gaming Mouse | 26K DPI | RGB',
    price: 'TTD 599',
    image: 'https://via.placeholder.com/300x200',
    badge: 'Best Seller'
  },
  {
    id: 3,
    name: 'Ducky One 3',
    description: 'Mechanical Keyboard | Hot-swap | RGB',
    price: 'TTD 999',
    image: 'https://via.placeholder.com/300x200',
    badge: 'Top Rated'
  },
];

const features = [
  {
    icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
    title: 'Free Delivery',
    description: 'Free shipping on orders over TTD 500'
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
    title: '24/7 Support',
    description: 'Round-the-clock technical assistance'
  },
  {
    icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
    title: 'Secure Shopping',
    description: 'SSL secured checkout process'
  }
];

const Home = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 4 }}>
      <Container maxWidth="lg">
        <HeroSection>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Your Tech Hub in Trinidad & Tobago
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Discover the latest in technology with competitive prices and expert support
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/categories"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100'
                    }
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ borderColor: 'white', color: 'white' }}
                  component={Link}
                  to="/about"
                >
                  Learn More
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Add hero image or animation here */}
            </Grid>
          </Grid>
        </HeroSection>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" sx={{ mb: 4 }}>
          Featured Products
        </Typography>

        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <FeatureCard>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  {product.badge && (
                    <Chip
                      label={product.badge}
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: 'rgba(37, 99, 235, 0.9)'
                      }}
                    />
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ mb: 2 }}>
                    {product.price}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 8,
            mb: 4,
            p: 6,
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Ready to Upgrade Your Tech?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join thousands of satisfied customers across Trinidad and Tobago
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/register"
          >
            Create Account
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
