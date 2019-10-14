/**
 * few analysis of alerts in db
 */
const MongoClient = require('mongodb').MongoClient;

(async() => {
  const URL = 'mongodb://localhost:27017';

  const client = await MongoClient.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });

  const collection = client.db('maxplorateur').collection('alerts');

  const pendingAlerts = await collection.find({
    status: 'pending',
    fromTime: {
      $gt: new Date(),
    },
  }).count();

  const alertsPerUser = await collection.aggregate([
    {
      $match: {
        status: 'pending',
        fromTime: {
          $gt: new Date()
        },
      },
    },
    {
      $group: {
        _id: '$tgvmaxNumber',
        pendingAlerts: {
          $sum: 1
        },
      },
    },
  ]).toArray();

  const lastTriggeredAlert = await collection.find({
    status: 'triggered',
  }).sort({ triggeredAt: -1 }).toArray();

  console.log(`pending alerts : ${pendingAlerts}`);

  console.log('alerts per user');
  console.log(alertsPerUser);

  console.log(`last triggered alert : ${lastTriggeredAlert[0].triggeredAt}`);

  client.close();
})();