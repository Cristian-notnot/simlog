const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/inventaris', require('./inventarisRoutes'));
router.use('/master', require('./masterDataRoutes'));
router.use('/upload', require('./uploadRoutes'));
router.use('/public/piket', require('./publicPiketRoutes'));
router.use('/operasional', require('./operasionalRoutes'));
router.use(require('./materialRoutes'));
router.use(require('./homepageRoutes'));

router.use('/admin/alumni', require('./alumniRoutes'));
router.use('/admin/pengurus', require('./pengurusRoutes'));


module.exports = router;
