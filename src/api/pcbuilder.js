import express from 'express';
import { Op } from 'sequelize';
import Component from '../models/Component.js';
import PCBuild from '../models/PCBuild.js';
import { authenticateToken } from '../middleware/auth.js';
import RecommendationEngine from '../services/RecommendationEngine.js';

const router = express.Router();

// Get all components by type
router.get('/components/:type', async (req, res) => {
  try {
    const components = await Component.findAll({
      where: {
        type: req.params.type,
        stock: {
          [Op.gt]: 0
        }
      }
    });
    res.json(components);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check compatibility between components
router.post('/check-compatibility', async (req, res) => {
  try {
    const { components } = req.body;
    const issues = [];

    // CPU and Motherboard compatibility
    if (components.cpu && components.motherboard) {
      if (components.cpu.socket !== components.motherboard.socket) {
        issues.push('CPU socket is not compatible with motherboard');
      }
    }

    // Memory compatibility
    if (components.motherboard && components.memory) {
      const totalMemory = components.memory.reduce((sum, mem) => sum + mem.capacity, 0);
      if (totalMemory > components.motherboard.maxMemory) {
        issues.push('Total memory exceeds motherboard maximum capacity');
      }
      if (components.memory.some(mem => mem.type !== components.motherboard.memoryType)) {
        issues.push('Memory type not compatible with motherboard');
      }
    }

    // Power supply compatibility
    if (components.psu) {
      const totalWattage = Object.values(components)
        .flat()
        .reduce((sum, component) => sum + (component?.wattage || 0), 0);
      
      if (totalWattage > components.psu.wattage) {
        issues.push('Power supply wattage may be insufficient');
      }
    }

    res.json({ issues });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save PC build
router.post('/builds', authenticateToken, async (req, res) => {
  try {
    const { name, components, totalPrice, totalWattage } = req.body;
    const build = await PCBuild.create({
      userId: req.user.id,
      name,
      components,
      totalPrice,
      totalWattage,
      status: 'saved'
    });
    res.json(build);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's saved builds
router.get('/builds', authenticateToken, async (req, res) => {
  try {
    const builds = await PCBuild.findAll({
      where: {
        userId: req.user.id
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(builds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific build
router.get('/builds/:id', authenticateToken, async (req, res) => {
  try {
    const build = await PCBuild.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (!build) {
      return res.status(404).json({ error: 'Build not found' });
    }
    res.json(build);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update build
router.put('/builds/:id', authenticateToken, async (req, res) => {
  try {
    const { name, components, totalPrice, totalWattage, status } = req.body;
    const build = await PCBuild.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!build) {
      return res.status(404).json({ error: 'Build not found' });
    }

    await build.update({
      name,
      components,
      totalPrice,
      totalWattage,
      status
    });

    res.json(build);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete build
router.delete('/builds/:id', authenticateToken, async (req, res) => {
  try {
    const build = await PCBuild.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!build) {
      return res.status(404).json({ error: 'Build not found' });
    }

    await build.destroy();
    res.json({ message: 'Build deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get build recommendation
router.post('/recommend', async (req, res) => {
  try {
    const recommendation = await RecommendationEngine.getRecommendedBuild(req.body);
    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
