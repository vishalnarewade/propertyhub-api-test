const uploadPropertyImages = async (req, res) => {
  const files = req.files || [];
  if (!files.length) {
    return res.status(400).json({ message: 'Please upload at least one image' });
  }

  const imagePaths = files.map((file) => `/uploads/${file.filename}`);
  return res.status(201).json({ images: imagePaths });
};

module.exports = { uploadPropertyImages };
