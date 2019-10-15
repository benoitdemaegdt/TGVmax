/**
 * few analysis of alerts in db
 */
const MongoClient = require('mongodb').MongoClient;

(async() => {
  const URL = 'mongodb://localhost:27017';

  const client = await MongoClient.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });

  const collection = client.db('maxplorateur').collection('alerts');

  const pendingAlertsCount = await collection.find({
    status: 'pending',
    fromTime: {
      $gt: new Date(),
    },
  }).count();

  const pendingAlerts = await collection.find({
    status: 'pending',
    fromTime: {
      $gt: new Date(),
    },
  }).project({
    _id: 0,
    'origin.name': 1,
    'destination.name': 1,
  }).toArray();

  const pendingAlertsPerUser = await collection.aggregate([
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

  const alertsPerUser = await collection.aggregate([
    {
      $group: {
        _id: '$tgvmaxNumber',
        alerts: {
          $sum: 1
        },
      },
    },
  ]).toArray();

  const lastTriggeredAlert = await collection.find({
    status: 'triggered',
  }).sort({ triggeredAt: -1 }).toArray();

  console.log(`pending alerts : ${pendingAlertsCount}`);
  console.log(pendingAlerts);

  console.log('pending alerts per user');
  console.log(pendingAlertsPerUser);

  console.log('created alerts per user');
  console.log(alertsPerUser);

  console.log(`last triggered alert : ${lastTriggeredAlert[0].triggeredAt}`);

  client.close();
})();