const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');

const createEnquiry = async (req, res) => {
  const { propertyId } = req.body;
  const property = await Property.findById(propertyId);
  if (!property) return res.status(404).json({ message: 'Property not found' });

  const enquiry = await Enquiry.create(req.body);
  res.status(201).json(enquiry);
};

const getAgentEnquiries = async (req, res) => {
  const { propertyId, page = 1, limit = 10 } = req.query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const agentProperties = await Property.find({ createdBy: req.user._id }).select('_id title');
  const propertyIds = agentProperties.map((property) => property._id.toString());

  if (!propertyIds.length) {
    return res.json({
      items: [],
      summary: {},
      pagination: { page: pageNumber, limit: limitNumber, total: 0, totalPages: 0, hasMore: false }
    });
  }

  if (propertyId && !propertyIds.includes(propertyId)) {
    return res.status(403).json({ message: 'Forbidden for this property' });
  }

  const query = {
    propertyId: propertyId ? propertyId : { $in: propertyIds }
  };

  const total = await Enquiry.countDocuments(query);
  const skip = (pageNumber - 1) * limitNumber;
  const enquiries = await Enquiry.find(query)
    .populate('propertyId', 'title location')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  const allEnquiriesForSummary = await Enquiry.find({ propertyId: { $in: propertyIds } })
    .populate('propertyId', 'title')
    .sort({ createdAt: -1 });

  const summary = allEnquiriesForSummary.reduce((acc, enquiry) => {
    const key = enquiry.propertyId?._id?.toString();
    if (!key) return acc;
    if (!acc[key]) acc[key] = { count: 0, latestMessage: '' };
    acc[key].count += 1;
    if (!acc[key].latestMessage) acc[key].latestMessage = enquiry.message;
    return acc;
  }, {});

  res.json({
    items: enquiries,
    summary,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
      hasMore: skip + enquiries.length < total
    }
  });
};

module.exports = { createEnquiry, getAgentEnquiries };
