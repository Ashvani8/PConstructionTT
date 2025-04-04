import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondary,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Computer as ComputerIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  Build as BuildIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

const UserProfile = ({ user }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const renderProfileHeader = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={user.avatar}
            sx={{ width: 120, height: 120, mr: 3 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" sx={{ mr: 2 }}>
                {user.name}
              </Typography>
              <Chip
                label={`Level ${user.level}`}
                color="primary"
                size="small"
              />
            </Box>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user.bio}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2">
                <strong>{user.builds}</strong> Builds
              </Typography>
              <Typography variant="body2">
                <strong>{user.followers}</strong> Followers
              </Typography>
              <Typography variant="body2">
                <strong>{user.following}</strong> Following
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditDialogOpen(true)}
          >
            Edit Profile
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip icon={<StarIcon />} label={`${user.reputation} Reputation`} />
          <Chip icon={<BuildIcon />} label={`${user.completedBuilds} Completed Builds`} />
          <Chip icon={<FavoriteIcon />} label={`${user.likes} Received Likes`} />
        </Box>
      </CardContent>
    </Card>
  );

  const renderBuildHistory = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Build History
        </Typography>
        <List>
          {user.builds.map((build) => (
            <ListItem
              key={build.id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 2,
              }}
            >
              <ListItemAvatar>
                <Avatar src={build.image} variant="rounded" />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ mr: 1 }}>
                      {build.name}
                    </Typography>
                    <Rating value={build.rating} size="small" readOnly />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Built on {build.date} • ${build.price}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip
                        label={build.purpose}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={`${build.likes} Likes`}
                        size="small"
                        icon={<FavoriteIcon />}
                      />
                    </Box>
                  </>
                }
              />
              <Box>
                <IconButton>
                  <ShareIcon />
                </IconButton>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderAchievements = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Achievements
        </Typography>
        <Grid container spacing={2}>
          {user.achievements.map((achievement) => (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: achievement.unlocked ? 'primary.main' : 'action.disabled',
                        mr: 2,
                      }}
                    >
                      {achievement.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {achievement.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                    </Box>
                  </Box>
                  {achievement.progress && (
                    <Box>
                      <LinearProgress
                        variant="determinate"
                        value={achievement.progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {achievement.progress}% Complete
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Profile Settings
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive updates about your builds and community activity"
            />
            <Switch />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Profile Visibility"
              secondary="Control who can see your profile and builds"
            />
            <Select value="public" size="small">
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="friends">Friends Only</MenuItem>
            </Select>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Build Privacy"
              secondary="Default privacy setting for new builds"
            />
            <Select value="public" size="small">
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
            </Select>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {renderProfileHeader()}

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab icon={<TimelineIcon />} label="Build History" />
        <Tab icon={<StarIcon />} label="Achievements" />
        <Tab icon={<SettingsIcon />} label="Settings" />
      </Tabs>

      {activeTab === 0 && renderBuildHistory()}
      {activeTab === 1 && renderAchievements()}
      {activeTab === 2 && renderSettings()}

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Display Name"
              defaultValue={user.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={4}
              defaultValue={user.bio}
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              sx={{ mb: 2 }}
            >
              Upload Avatar
              <input type="file" hidden accept="image/*" />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setEditDialogOpen(false)}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
