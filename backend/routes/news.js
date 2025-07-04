const express = require('express');
const { body, validationResult, query } = require('express-validator');
const News = require('../models/News');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  query('category').optional().isIn(['announcement', 'partnership', 'funding', 'technology', 'award', 'general']).withMessage('Invalid category'),
  query('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
  query('search').optional().isLength({ min: 1 }).withMessage('Search term cannot be empty')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (!req.user || req.user.role === 'viewer') {
      query.status = 'published';
    } else if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.featured) {
      query.featured = req.query.featured === 'true';
    }

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const news = await News.find(query)
      .populate('author', 'username firstName lastName')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await News.countDocuments(query);

    res.json({
      success: true,
      data: {
        news,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching news'
    });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    if (!req.user || req.user.role === 'viewer') {
      query.status = 'published';
    }

    const news = await News.findOne(query)
      .populate('author', 'username firstName lastName');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    await News.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: {
        news
      }
    });
  } catch (error) {
    console.error('Get news by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching news article'
    });
  }
});

router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    let query = { slug: req.params.slug };
    
    if (!req.user || req.user.role === 'viewer') {
      query.status = 'published';
    }

    const news = await News.findOne(query)
      .populate('author', 'username firstName lastName');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    await News.findByIdAndUpdate(news._id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: {
        news
      }
    });
  } catch (error) {
    console.error('Get news by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching news article'
    });
  }
});

router.post('/', protect, authorize('admin', 'editor'), [
  body('title')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('excerpt')
    .isLength({ min: 10, max: 500 })
    .withMessage('Excerpt must be between 10 and 500 characters'),
  body('content')
    .optional()
    .isLength({ max: 10000 })
    .withMessage('Content cannot exceed 10000 characters'),
  body('icon')
    .optional()
    .isLength({ max: 5 })
    .withMessage('Icon must be 5 characters or less'),
  body('category')
    .optional()
    .isIn(['announcement', 'partnership', 'funding', 'technology', 'award', 'general'])
    .withMessage('Invalid category'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const newsData = {
      ...req.body,
      author: req.user.id
    };

    // Check for duplicate title before creating
    const existingNews = await News.findOne({ title: newsData.title });
    if (existingNews) {
      console.log(`Duplicate title attempt: "${newsData.title}" by user ${req.user.id}`);
      return res.status(409).json({
        success: false,
        message: 'An article with this title already exists. Please choose a different title.',
        field: 'title'
      });
    }

    const news = await News.create(newsData);
    await news.populate('author', 'username firstName lastName');

    console.log(`New article created: "${news.title}" by ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      data: {
        news
      }
    });
  } catch (error) {
    console.error('Create news error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      console.log(`MongoDB duplicate key error on field: ${field}`);
      return res.status(409).json({
        success: false,
        message: `An article with this ${field} already exists. Please choose a different ${field}.`,
        field: field
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating news article'
    });
  }
});

router.put('/:id', protect, authorize('admin', 'editor'), [
  body('title')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('excerpt')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Excerpt must be between 10 and 500 characters'),
  body('content')
    .optional()
    .isLength({ max: 10000 })
    .withMessage('Content cannot exceed 10000 characters'),
  body('icon')
    .optional()
    .isLength({ max: 5 })
    .withMessage('Icon must be 5 characters or less'),
  body('category')
    .optional()
    .isIn(['announcement', 'partnership', 'funding', 'technology', 'award', 'general'])
    .withMessage('Invalid category'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    if (req.user.role === 'editor' && news.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this article'
      });
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username firstName lastName');

    res.json({
      success: true,
      message: 'News article updated successfully',
      data: {
        news: updatedNews
      }
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating news article'
    });
  }
});

router.delete('/:id', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    if (req.user.role === 'editor' && news.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this article'
      });
    }

    await News.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'News article deleted successfully'
    });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting news article'
    });
  }
});

router.post('/:id/like', optionalAuth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    await News.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });

    res.json({
      success: true,
      message: 'News article liked successfully'
    });
  } catch (error) {
    console.error('Like news error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while liking news article'
    });
  }
});

module.exports = router;