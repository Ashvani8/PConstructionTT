import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Button,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Build as BuildIcon,
  Computer as ComputerIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  Email as EmailIcon,
  CheckCircle as CheckIcon,
  Timeline as TimelineIcon,
  People as PeopleIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';

const About = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <BuildIcon fontSize="large" />,
      title: 'Custom PC Builder',
      description: 'Advanced PC building tool with real-time compatibility checking and performance estimates.',
    },
    {
      icon: <SpeedIcon fontSize="large" />,
      title: 'Performance Analytics',
      description: 'Detailed performance metrics and benchmarks for your custom build.',
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: 'Verified Components',
      description: 'All components are verified for quality and compatibility.',
    },
    {
      icon: <PeopleIcon fontSize="large" />,
      title: 'Community Driven',
      description: 'Share builds, get feedback, and learn from the community.',
    },
  ];

  const teamMembers = [
    {
      name: 'Michael Rollock',
      role: 'Founder & CEO',
      image: '',
      bio: ' custom PC building and tech entrepreneurship',
      social: {
        linkedin: 'https://linkedin.com/in/alexchen',
        twitter: 'https://twitter.com/alexchen',
        github: 'https://github.com/alexchen',
      },
    },
    {
      name: 'Gabriel Rollock',
      role: 'Head of Engineering',
      image: '/team/sarah.jpg',
      bio: 'Former lead engineer at major tech companies',
      social: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        twitter: 'https://twitter.com/sarahjohnson',
        github: 'https://github.com/sarahjohnson',
      },
    },
    // Add more team members as needed
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Community Growth',
      description: 'Reached 100,000+ active users and 50,000+ completed builds.',
    },
    {
      year: '2025',
      title: 'Innovation Award',
      description: 'Recognized as the leading PC building platform.',
    },
  ];

  const renderHero = () => (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
        borderRadius: 2,
        textAlign: 'center',
        mb: 6,
      }}
    >
      <Container maxWidth="md">
        <Typography
          component="h1"
          variant="h2"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          About PConstruction
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Building the future of custom PC creation, one build at a time.
          We're passionate about making custom PC building accessible to everyone.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 4 }}
          startIcon={<BuildIcon />}
        >
          Start Building
        </Button>
      </Container>
    </Box>
  );

  const renderMission = () => (
    <Paper sx={{ p: 4, mb: 6 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom color="primary">
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            At PConstructionTT, we believe everyone deserves a custom PC that perfectly matches their needs.
            We're here to make the process of building a custom PC as simple and enjoyable as possible.
          </Typography>
          <List>
            {[
              'Simplify custom PC building',
              'Ensure component compatibility',
              'Provide expert guidance',
              'Foster a supportive community',
            ].map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="/images/mission.jpg"
            alt="Our Mission"
            sx={{
              width: '100%',
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const renderFeatures = () => (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        What Sets Us Apart
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderTeam = () => (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Meet Our Team
      </Typography>
      <Grid container spacing={4}>
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Avatar
                    src={member.image}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {member.bio}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {Object.entries(member.social).map(([platform, url]) => (
                      <IconButton
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {platform === 'linkedin' ? <LinkedInIcon /> :
                         platform === 'twitter' ? <TwitterIcon /> :
                         platform === 'github' ? <GitHubIcon /> : <EmailIcon />}
                      </IconButton>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderMilestones = () => (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Our Journey
      </Typography>
      <Grid container spacing={4}>
        {milestones.map((milestone, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h3" color="primary" gutterBottom>
                  {milestone.year}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {milestone.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {milestone.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderStats = () => (
    <Box
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderRadius: 2,
        textAlign: 'center',
        mb: 6,
      }}
    >
      <Grid container spacing={4}>
        {[
          { number: '100K+', label: 'Active Users' },
          { number: '50K+', label: 'Completed Builds' },
          { number: '99%', label: 'Satisfaction Rate' },
          { number: '24/7', label: 'Expert Support' },
        ].map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Typography variant="h3" color="primary" gutterBottom>
              {stat.number}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {stat.label}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderContact = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom color="primary">
        Get In Touch
      </Typography>
      <Typography variant="body1" paragraph>
        Have questions? We'd love to hear from you.
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<EmailIcon />}
        href="mailto:contact@tttech.com"
      >
        Contact Us
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      {renderHero()}
      {renderMission()}
      {renderFeatures()}
      {renderStats()}
      {renderTeam()}
      {renderMilestones()}
      {renderContact()}
    </Container>
  );
};

export default About;
