const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');

// Initializing Firestore and GCS
const serviceAccountKey = require('./serverlessproject-391916-ffba238aaacf.json'); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});
const db = admin.firestore();
const storage = new Storage({
  credentials: serviceAccountKey,
});


exports.handler = async (event, context) => {
  try {
    const collectionName = 'userScore';
    const collectionRef = db.collection(collectionName);

    // https://firebase.google.com/docs/firestore/query-data/get-data
    // Reference: Get data with Cloud Firestore
    // Retrieve documents from userScore collection
    const querySnapshot = await collectionRef.get();
    const documents = querySnapshot.docs.map(doc => doc.data());

    // Extracting headers
    const fieldHeaders = Object.keys(documents[0]);

    // Converting documents to CSV format
    const csvData = [fieldHeaders.join(',')];
    documents.forEach(item => {
      const values = fieldHeaders.map(header => item[header]);
      csvData.push(values.join(','));
    });

    // Upload CSV data to my bucket in cloud storage
    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#file
    // Reference: Upload file
    const bucket = storage.bucket('smbucket99');
    const file = bucket.file('data.csv');

    await file.save(csvData.join('\n'), {
      contentType: 'text/csv',
    });

    return {
      statusCode: 200,
      body: 'CSV export and upload to GCS successful',
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: 'An error occurred during CSV export and GCS upload',
    };
  }
};
