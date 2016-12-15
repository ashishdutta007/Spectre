var elasticops = require('./elasticOperations.js');

//elasticops.getClusterHealth();

//elasticops.createIndex({ index: 'mail' });

/*elasticops.addDocs2Index({
    index: 'mail',
    type: 'snippets',
    id: '1',
    body: {
        id: '1588fd9b7fd867fb',
        snippet: 'Profile Details provided by you (Update Profile) Experience: 0 Years 0 Months Preferred City: Anywhere Key Skills: Machine Learning,Algorithm,C Programming,C++ Programming Hi Ashish, Following is the'
    }
});*/


elasticops.countDocsinIndex('mail', 'snippets');

//elasticops.deleteDocs('mail', 'snnipets', '1');
