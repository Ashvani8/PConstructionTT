import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  RemoveRedEye as ViewIcon,
} from '@mui/icons-material';

const timeRanges = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '1m', label: 'Last Month' },
  { value: '3m', label: 'Last 3 Months' },
  { value: '6m', label: 'Last 6 Months' },
  { value: '1y', label: 'Last Year' },
];

const PriceHistory = ({ component }) => {
  const [timeRange, setTimeRange] = useState('1m');
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    lowestPrice: 0,
    highestPrice: 0,
    averagePrice: 0,
    priceChange: 0,
    priceChangePercentage: 0,
  });

  useEffect(() => {
    fetchPriceHistory();
  }, [timeRange, component.id]);

  const fetchPriceHistory = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      const response = await fetch(`/api/pcbuilder/price-history/${component.id}?range=${timeRange}`);
      const data = await response.json();
      
      // For demo purposes, generate some sample data
      const today = new Date();
      const data = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (29 - i));
        
        // Generate a price that fluctuates around the component's current price
        const basePrice = component.price;
        const randomFactor = 0.9 + (Math.random() * 0.2); // Random factor between 0.9 and 1.1
        const price = basePrice * randomFactor;
        
        return {
          date: date.toISOString().split('T')[0],
          price: Math.round(price * 100) / 100,
        };
      });

      setPriceData(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching price history:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const prices = data.map(item => item.price);
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const priceChange = prices[prices.length - 1] - prices[0];
    const priceChangePercentage = (priceChange / prices[0]) * 100;

    setStats({
      lowestPrice,
      highestPrice,
      averagePrice,
      priceChange,
      priceChangePercentage,
    });
  };

  const formatPrice = (price) => `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Price History
            <Tooltip title="Track price changes over time">
              <IconButton size="small" sx={{ ml: 1 }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              {timeRanges.map((range) => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Card variant="outlined" sx={{ flexGrow: 1 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Current Price
              </Typography>
              <Typography variant="h6">
                {formatPrice(component.price)}
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ flexGrow: 1 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Lowest Price
              </Typography>
              <Typography variant="h6">
                {formatPrice(stats.lowestPrice)}
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ flexGrow: 1 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Average Price
              </Typography>
              <Typography variant="h6">
                {formatPrice(stats.averagePrice)}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Price Change ({timeRanges.find(r => r.value === timeRange).label}):
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              ml: 1,
              color: stats.priceChange >= 0 ? 'success.main' : 'error.main',
            }}
          >
            {stats.priceChange >= 0 ? (
              <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
            ) : (
              <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
            )}
            <Typography
              variant="body2"
              color="inherit"
            >
              {formatPrice(Math.abs(stats.priceChange))} ({Math.abs(stats.priceChangePercentage).toFixed(1)}%)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              />
              <YAxis
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                formatter={(value) => formatPrice(value)}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <ReferenceLine
                y={component.price}
                stroke="#666"
                strokeDasharray="3 3"
                label={{ value: 'Current Price', position: 'right' }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2196f3"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PriceHistory;
