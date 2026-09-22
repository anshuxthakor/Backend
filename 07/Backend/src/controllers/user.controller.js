const createController = (req, res) => {
  console.log("Create Contoller")
  console.log(req.body)
  res.send("Create Controller")
};

module.exports = {
  createController
};