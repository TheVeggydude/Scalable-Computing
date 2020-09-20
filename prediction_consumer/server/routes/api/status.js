const router = require("express").Router();
const KafkaService = require('../../services/kafkaController');

// Post to http://statusretriever:3005/api/status
router.post('/', async (req, res) => {
    const predictions = await KafkaService.getData();
    console.log(`IN STATUS: predictions: ${predictions}`);
    res.json({predictions}).status(201).send();
});

module.exports = router;
