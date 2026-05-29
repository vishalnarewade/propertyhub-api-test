const Property = require('../models/Property');

const getProperties = async (req, res) => {
  const {
    search = '',
    bhk,
    minPrice,
    maxPrice,
    propertyType,
    page = 1,
    limit = 8
  } = req.query;

  const query = {};
  if (search) query.location = { $regex: search, $options: 'i' };
  if (bhk) query.bhk = Number(bhk);
  if (propertyType) query.propertyType = propertyType;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Property.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Property.countDocuments(query)
  ]);

  res.json({
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
};

const getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.id).populate('createdBy', 'name email role');
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json(property);
};

const createProperty = async (req, res) => {
  const property = await Property.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(property);
};

const updateProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  if (property.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You can edit only your listings' });
  }

  Object.assign(property, req.body);
  await property.save();
  res.json(property);
};

const deleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  if (property.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You can delete only your listings' });
  }

  await property.deleteOne();
  res.json({ message: 'Property deleted successfully' });
};

const getMyListings = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const query = { createdBy: req.user._id };
  const [items, total] = await Promise.all([
    Property.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNumber),
    Property.countDocuments(query)
  ]);

  res.json({
    items,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
      hasMore: skip + items.length < total
    }
  });
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyListings
};
