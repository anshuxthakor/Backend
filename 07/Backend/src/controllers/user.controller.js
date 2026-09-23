const createController = (req, res) => {
  console.log(req.body);
  console.log(req.files);
  res.status(200).json({
    message: "Files uploaded successfully"
  });
};

module.exports = {
  createController,
};
