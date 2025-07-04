const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Contact = require('../models/Contact');
const { protect, authorize } = require('../middleware/auth');
const { sendContactNotification } = require('../utils/emailService');

const router = express.Router();

router.post('/', [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('company')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Company name cannot exceed 200 characters')
    .trim(),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('interest')
    .isIn(['investment', 'partnership', 'office', 'technology', 'other'])
    .withMessage('Please select a valid interest'),
  body('message')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
    .trim()
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

    const contactData = {
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      priority: req.body.interest === 'investment' ? 'high' : 'medium'
    };

    const contact = await Contact.create(contactData);

    const emailResult = await sendContactNotification(contactData);
    
    if (emailResult.adminEmailSent && emailResult.customerEmailSent) {
      contact.emailSent = true;
      contact.emailSentAt = new Date();
      await contact.save();
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your interest! We will contact you soon.',
      data: {
        contact: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          interest: contact.interest,
          status: contact.status,
          createdAt: contact.createdAt
        },
        emailSent: emailResult.adminEmailSent && emailResult.customerEmailSent
      }
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing your request. Please try again.'
    });
  }
});

router.get('/', protect, authorize('admin', 'editor'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['new', 'in_progress', 'responded', 'closed']).withMessage('Invalid status'),
  query('interest').optional().isIn(['investment', 'partnership', 'office', 'technology', 'other']).withMessage('Invalid interest'),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  query('assignedTo').optional().isMongoId().withMessage('Invalid assigned user ID')
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.interest) {
      query.interest = req.query.interest;
    }

    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    const contacts = await Contact.find(query)
      .populate('assignedTo', 'username firstName lastName')
      .populate('notes.author', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    const stats = await Contact.aggregate([
      {
        $group: {
          _id: null,
          totalContacts: { $sum: 1 },
          newContacts: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
          inProgressContacts: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] } , 1, 0] } },
          respondedContacts: { $sum: { $cond: [{ $eq: ['$status', 'responded'] }, 1, 0] } },
          closedContacts: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
          investmentInquiries: { $sum: { $cond: [{ $eq: ['$interest', 'investment'] }, 1, 0] } },
          partnershipInquiries: { $sum: { $cond: [{ $eq: ['$interest', 'partnership'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        stats: stats[0] || {}
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contacts'
    });
  }
});

router.get('/:id', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'username firstName lastName')
      .populate('notes.author', 'username firstName lastName');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: {
        contact
      }
    });
  } catch (error) {
    console.error('Get contact by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contact'
    });
  }
});

router.put('/:id', protect, authorize('admin', 'editor'), [
  body('status')
    .optional()
    .isIn(['new', 'in_progress', 'responded', 'closed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority'),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid assigned user ID'),
  body('followUpDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid follow-up date'),
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

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'username firstName lastName')
      .populate('notes.author', 'username firstName lastName');

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: {
        contact: updatedContact
      }
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating contact'
    });
  }
});

router.post('/:id/notes', protect, authorize('admin', 'editor'), [
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Note content must be between 1 and 1000 characters')
    .trim()
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

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const note = {
      content: req.body.content,
      author: req.user.id,
      createdAt: new Date()
    };

    contact.notes.push(note);
    await contact.save();

    await contact.populate('notes.author', 'username firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: {
        note: contact.notes[contact.notes.length - 1]
      }
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding note'
    });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting contact'
    });
  }
});

module.exports = router;