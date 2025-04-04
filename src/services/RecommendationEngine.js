import Component from '../models/Component.js';
import BuildTemplate from '../models/BuildTemplate.js';
import { Op } from 'sequelize';

class RecommendationEngine {
  static async getRecommendedBuild(preferences) {
    const {
      budget,
      purpose,
      prioritizePerformance,
      preferredBrands = [],
      existingComponents = {},
    } = preferences;

    // Get suitable template based on purpose and budget
    const template = await BuildTemplate.findOne({
      where: {
        category: purpose,
        priceRange: this.getBudgetRange(budget),
      },
    });

    if (!template) {
      throw new Error('No suitable build template found');
    }

    const recommendations = {};
    let remainingBudget = budget;

    // Budget allocation percentages based on component importance
    const budgetAllocation = {
      cpu: 0.25,
      gpu: purpose === 'gaming' ? 0.35 : 0.2,
      motherboard: 0.15,
      memory: 0.1,
      storage: 0.1,
      psu: 0.08,
      case: 0.07,
      cooling: 0.05,
    };

    // Adjust allocations based on preferences
    if (prioritizePerformance) {
      budgetAllocation.cpu += 0.05;
      budgetAllocation.gpu += 0.05;
      budgetAllocation.cooling += 0.02;
      budgetAllocation.case -= 0.02;
      budgetAllocation.motherboard -= 0.05;
    }

    // Component selection order based on importance
    const componentOrder = ['cpu', 'gpu', 'motherboard', 'memory', 'storage', 'psu', 'case', 'cooling'];

    for (const componentType of componentOrder) {
      // Skip if component already exists
      if (existingComponents[componentType]) {
        recommendations[componentType] = existingComponents[componentType];
        remainingBudget -= existingComponents[componentType].price;
        continue;
      }

      const componentBudget = Math.floor(budget * budgetAllocation[componentType]);
      
      // Get recommended specs from template
      const recommendedSpecs = template.recommendedSpecs[componentType] || {};

      try {
        const component = await this.findBestComponent(
          componentType,
          componentBudget,
          recommendedSpecs,
          preferredBrands,
          recommendations // Pass current recommendations for compatibility check
        );

        if (component) {
          recommendations[componentType] = component;
          remainingBudget -= component.price;
        }
      } catch (error) {
        console.error(`Error finding ${componentType}:`, error);
      }
    }

    // Calculate expected performance metrics
    const performanceMetrics = await this.calculatePerformanceMetrics(recommendations, purpose);

    return {
      template,
      recommendations,
      performanceMetrics,
      totalPrice: budget - remainingBudget,
      remainingBudget,
    };
  }

  static async findBestComponent(type, budget, specs, preferredBrands, currentBuild) {
    const whereClause = {
      type,
      price: {
        [Op.lte]: budget,
      },
      stock: {
        [Op.gt]: 0,
      },
    };

    if (preferredBrands.length > 0) {
      whereClause.brand = {
        [Op.in]: preferredBrands,
      };
    }

    // Add spec-based filters
    if (specs) {
      Object.entries(specs).forEach(([key, value]) => {
        if (value.min !== undefined) {
          whereClause[key] = {
            ...whereClause[key],
            [Op.gte]: value.min,
          };
        }
        if (value.max !== undefined) {
          whereClause[key] = {
            ...whereClause[key],
            [Op.lte]: value.max,
          };
        }
      });
    }

    // Add compatibility filters
    if (currentBuild.cpu && type === 'motherboard') {
      whereClause.socket = currentBuild.cpu.socket;
    }
    if (currentBuild.motherboard && type === 'memory') {
      whereClause.memoryType = currentBuild.motherboard.memoryType;
    }

    const components = await Component.findAll({
      where: whereClause,
      order: [['price', 'DESC']], // Get the best component within budget
      limit: 1,
    });

    return components[0] || null;
  }

  static async calculatePerformanceMetrics(build, purpose) {
    const metrics = {
      gaming: {
        fps1080p: 0,
        fps1440p: 0,
        fps4k: 0,
      },
      workstation: {
        renderScore: 0,
        compilationScore: 0,
      },
      general: {
        bootTime: 0,
        multiTaskingScore: 0,
      },
    };

    // Calculate gaming performance
    if (build.cpu && build.gpu) {
      // These would be more sophisticated in a real implementation
      metrics.gaming.fps1080p = this.calculateGamingPerformance(build, '1080p');
      metrics.gaming.fps1440p = this.calculateGamingPerformance(build, '1440p');
      metrics.gaming.fps4k = this.calculateGamingPerformance(build, '4k');
    }

    // Calculate workstation performance
    if (build.cpu && build.memory) {
      metrics.workstation.renderScore = this.calculateWorkstationPerformance(build, 'render');
      metrics.workstation.compilationScore = this.calculateWorkstationPerformance(build, 'compilation');
    }

    // Calculate general performance
    if (build.cpu && build.storage) {
      metrics.general.bootTime = this.calculateBootTime(build);
      metrics.general.multiTaskingScore = this.calculateMultiTaskingScore(build);
    }

    return metrics[purpose] || metrics.general;
  }

  static calculateGamingPerformance(build, resolution) {
    const { cpu, gpu, memory } = build;
    let baseScore = 0;

    // CPU contribution
    if (cpu) {
      baseScore += (cpu.cores * cpu.threads * cpu.baseSpeed) / 10;
    }

    // GPU contribution
    if (gpu) {
      baseScore += (gpu.vram * 5) + (gpu.wattage / 10);
    }

    // Memory contribution
    if (memory) {
      const totalMemory = Array.isArray(memory) 
        ? memory.reduce((sum, mem) => sum + mem.capacity, 0)
        : memory.capacity;
      baseScore += totalMemory / 1024; // Convert to GB
    }

    // Resolution scaling
    switch (resolution) {
      case '4k':
        return Math.floor(baseScore * 0.4);
      case '1440p':
        return Math.floor(baseScore * 0.6);
      default: // 1080p
        return Math.floor(baseScore);
    }
  }

  static calculateWorkstationPerformance(build, type) {
    const { cpu, memory } = build;
    let score = 0;

    if (cpu) {
      score += (cpu.cores * cpu.threads * cpu.baseSpeed);
    }

    if (memory) {
      const totalMemory = Array.isArray(memory) 
        ? memory.reduce((sum, mem) => sum + mem.capacity, 0)
        : memory.capacity;
      score += totalMemory / 512; // Memory contribution
    }

    return Math.floor(type === 'render' ? score : score * 0.8);
  }

  static calculateBootTime(build) {
    const { storage } = build;
    if (!storage) return 20; // Default boot time in seconds

    // Estimate boot time based on storage type
    if (storage.storageType === 'NVMe') return 10;
    if (storage.storageType === 'SSD') return 15;
    return 25; // HDD
  }

  static calculateMultiTaskingScore(build) {
    const { cpu, memory } = build;
    let score = 50; // Base score

    if (cpu) {
      score += (cpu.cores * 5) + (cpu.threads * 2);
    }

    if (memory) {
      const totalMemory = Array.isArray(memory) 
        ? memory.reduce((sum, mem) => sum + mem.capacity, 0)
        : memory.capacity;
      score += totalMemory / 256; // Memory contribution
    }

    return Math.floor(score);
  }

  static getBudgetRange(budget) {
    if (budget <= 800) return 'budget';
    if (budget <= 1500) return 'mid-range';
    if (budget <= 2500) return 'high-end';
    return 'extreme';
  }
}

export default RecommendationEngine;
