// routes/RankRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { submitOrUpdateRank } = require("../controllers/rankController");

const Rank = require('../models/Rank');
const Criterion = require('../models/Criterion');

const validScores = ["4", "3", "2", "1", "0", "NA"];

router.post("/rank", submitOrUpdateRank);
// GET /api/ranks/criteria - Get all criteria for evaluation form

router.get('/criteria', async (req, res) => {
  try {
    const criteria = await Criterion.find({}).sort({ CId: 1 });
    
    // Sort by numeric value of CId to ensure C1, C2, ... C10, C11 order
    const sortedCriteria = criteria.sort((a, b) => {
      const numA = parseInt(a.CId.replace('C', ''));
      const numB = parseInt(b.CId.replace('C', ''));
      return numA - numB;
    });
    
    console.log(`✅ Fetched ${sortedCriteria.length} criteria`);
    res.json(sortedCriteria);
  } catch (error) {
    console.error('❌ Error fetching criteria:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// POST /api/ranks - Create a new rank/rating
// router.post('/', async (req, res) => {
//   try {
//     const { Super_ID, UserId, Criterions } = req.body;

//     // Validate required fields
//     if (!Super_ID || !UserId) {
//       return res.status(400).json({ 
//         message: 'Super_ID and UserId are required' 
//       });
//     }

//     if (!Array.isArray(Criterions) || Criterions.length === 0) {
//       return res.status(400).json({ 
//         message: 'Criterions must be a non-empty array' 
//       });
//     }

//     // Validate each criterion
//     for (const criterion of Criterions) {
//       if (!criterion.name || !criterion.score) {
//         return res.status(400).json({ 
//           message: 'Each criterion must have name and score' 
//         });
//       }
//       if (!validScores.includes(criterion.score)) {
//         return res.status(400).json({ 
//           message: `Invalid score: ${criterion.score}. Valid scores are: ${validScores.join(', ')}` 
//         });
//       }
//     }

//     // Check if rank already exists for this user and translation
//     const existingRank = await Rank.findOne({ Super_ID, UserId });
//     if (existingRank) {
//       return res.status(409).json({ 
//         message: 'A rank already exists for this user and translation combination. Use PUT to update.' 
//       });
//     }

//     // Create new rank
//     const rank = new Rank({
//       Super_ID,
//       UserId,
//       Criterions
//     });

//     const savedRank = await rank.save();
    
//     // Populate references and return
//     const populatedRank = await Rank.findById(savedRank._id)
//       .populate('Super_ID')
//       .populate('UserId');

//     res.status(201).json({
//       message: 'Rank created successfully',
//       rank: populatedRank
//     });
//   } catch (error) {
//     // Handle unique constraint violation
//     if (error.code === 11000) {
//       return res.status(409).json({ 
//         message: 'A rank already exists for this user and translation combination' 
//       });
//     }
    
//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ 
//         message: error.message 
//       });
//     }

//     console.error('❌ Error creating rank:', error);
//     res.status(500).json({ 
//       message: 'Server error', 
//       error: error.message 
//     });
//   }
// });

// GET /api/ranks - Get ranks with optional query filters
router.get('/', async (req, res) => {
  try {
    const { Super_ID, UserId } = req.query;
    const query = {};

    // Build query with optional filters
    if (Super_ID) {
      query.Super_ID = Super_ID;
    }
    if (UserId) {
      query.UserId = UserId;
    }

    const ranks = await Rank.find(query)
      .populate('Super_ID')
      .populate('UserId')
      .sort({ createdAt: -1 }); // Most recent first

    res.json(ranks);
  } catch (error) {
    console.error('❌ Error fetching ranks:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// GET /api/ranks/:id - Get a specific rank by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: 'Invalid rank ID format' 
      });
    }

    const rank = await Rank.findById(id)
      .populate('Super_ID')
      .populate('UserId');

    if (!rank) {
      return res.status(404).json({ 
        message: 'Rank not found' 
      });
    }

    res.json(rank);
  } catch (error) {
    console.error('❌ Error fetching rank:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// PUT /api/ranks/:id - Update an existing rank
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Criterions } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: 'Invalid rank ID format' 
      });
    }

    // Check if rank exists
    const existingRank = await Rank.findById(id);
    if (!existingRank) {
      return res.status(404).json({ 
        message: 'Rank not found' 
      });
    }

    // Validate Criterions if provided
    if (Criterions !== undefined) {
      if (!Array.isArray(Criterions) || Criterions.length === 0) {
        return res.status(400).json({ 
          message: 'Criterions must be a non-empty array' 
        });
      }

      // Validate each criterion
      for (const criterion of Criterions) {
        if (!criterion.name || !criterion.score) {
          return res.status(400).json({ 
            message: 'Each criterion must have name and score' 
          });
        }
        if (!validScores.includes(criterion.score)) {
          return res.status(400).json({ 
            message: `Invalid score: ${criterion.score}. Valid scores are: ${validScores.join(', ')}` 
          });
        }
      }
    }

    // Update rank
    const updatedRank = await Rank.findByIdAndUpdate(
      id,
      { Criterions: Criterions || existingRank.Criterions },
      { new: true, runValidators: true }
    )
      .populate('Super_ID')
      .populate('UserId');

    res.json({
      message: 'Rank updated successfully',
      rank: updatedRank
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: error.message 
      });
    }

    console.error('❌ Error updating rank:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// DELETE /api/ranks/:id - Delete a rank
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: 'Invalid rank ID format' 
      });
    }

    const deletedRank = await Rank.findByIdAndDelete(id);

    if (!deletedRank) {
      return res.status(404).json({ 
        message: 'Rank not found' 
      });
    }

    res.json({ 
      message: 'Rank deleted successfully',
      id: deletedRank._id 
    });
  } catch (error) {
    console.error('❌ Error deleting rank:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// GET /api/ranks/translation/:translationId - Get all ranks for a specific translation
router.get('/translation/:translationId', async (req, res) => {
  try {
    const { translationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(translationId)) {
      return res.status(400).json({ 
        message: 'Invalid translation ID format' 
      });
    }

    const ranks = await Rank.find({ Super_ID: translationId })
      .populate('UserId', 'name email') // Only populate necessary user fields
      .sort({ createdAt: -1 });

    res.json(ranks);
  } catch (error) {
    console.error('❌ Error fetching translation ranks:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// GET /api/ranks/user/:userId - Get all ranks by a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        message: 'Invalid user ID format' 
      });
    }

    const ranks = await Rank.find({ UserId: userId })
      .populate('Super_ID')
      .sort({ createdAt: -1 });

    res.json(ranks);
  } catch (error) {
    console.error('❌ Error fetching user ranks:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// GET /api/ranks/statistics/:translationId - Get ranking statistics for a translation
router.get('/statistics/:translationId', async (req, res) => {
  try {
    const { translationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(translationId)) {
      return res.status(400).json({ 
        message: 'Invalid translation ID format' 
      });
    }

    const ranks = await Rank.find({ Super_ID: translationId });

    if (ranks.length === 0) {
      return res.json({
        totalRanks: 0,
        averageScore: 0,
        criteriaAverages: {}
      });
    }

    // Calculate statistics
    const criteriaScores = {};
    let totalScore = 0;
    let totalCount = 0;

    ranks.forEach(rank => {
      rank.Criterions.forEach(criterion => {
        if (criterion.score !== 'NA') {
          const score = parseInt(criterion.score);
          
          if (!criteriaScores[criterion.name]) {
            criteriaScores[criterion.name] = {
              total: 0,
              count: 0,
              scores: []
            };
          }
          
          criteriaScores[criterion.name].total += score;
          criteriaScores[criterion.name].count += 1;
          criteriaScores[criterion.name].scores.push(score);
          
          totalScore += score;
          totalCount += 1;
        }
      });
    });

    // Calculate averages
    const criteriaAverages = {};
    Object.keys(criteriaScores).forEach(name => {
      const data = criteriaScores[name];
      criteriaAverages[name] = {
        average: (data.total / data.count).toFixed(2),
        count: data.count,
        min: Math.min(...data.scores),
        max: Math.max(...data.scores)
      };
    });

    res.json({
      totalRanks: ranks.length,
      averageScore: totalCount > 0 ? (totalScore / totalCount).toFixed(2) : 0,
      criteriaAverages
    });
  } catch (error) {
    console.error('❌ Error calculating statistics:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;