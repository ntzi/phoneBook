var sails = require('sails');

try {
  var local = require('../config/local')
} catch {
  console.log('local.js not found. Only required for local executions.')
}
const { custom } = require('../config/custom');


// Before running any tests...
before(function (done) {

  // Increase the Mocha timeout so that Sails has enough time to lift, even if you have a bunch of assets.
  this.timeout(5000);

  sails.lift({
    // Your Sails app's configuration files will be loaded automatically,
    // but you can also specify any other special overrides here for testing purposes.

    // For example, we might want to skip the Grunt hook,
    // and disable all logs except errors and warnings:
    // hooks: { grunt: false },
    // log: { level: 'warn' },
    datastores: {
      default: {
        adapter: 'sails-mongo',
        url: custom.mongodbDatabaseMock.consumerKey || local.custom.mongodbDatabaseMock.consumerKey
      }
    }

  }, async function (err) {
    if (err) { return done(err); }

    // here you can load fixtures, etc.
    // (for example, you might want to create some records in the database)
    // console.log(await _mockRecords())
    await _createMockRecords()
    await _createMockUser()

    return done();
  });
});

// After all tests have finished...
after(async function () {

  // here you can clear fixtures, etc.
  // (e.g. you might want to destroy the records you created above)

  await _deleteMockRecords()
  await _deleteMockUser()

  sails.lower()

});

_createMockUser = async () => {
  const newUserRecord = {
    "email": "user@example.com",
    "password": "password",
    "confirmPassword": "password",
    "name": "user"
  }

  await User.findOrCreate({ email: newUserRecord.email }, newUserRecord)
}

_createMockRecords = async () => {
  var values = await _mockRecords()
  await Promise.all(values.map(value => Contact.findOrCreate({ name: value.name }, value)))
}

_deleteMockRecords = async () => {
  await Contact.destroy({})
  await Archive.destroy({})
}

_deleteMockUser = async () => {
  await User.destroy({})
}

_mockRecords = () => {
  return [
    {
      "name": "Nikos1",
      "email": "nikos@example.com1",
      "address": "myAddress1",
      "phone": {
        "home": 73406891262,
      }
    },
    {
      "name": "Nikos2",
      "email": "nikos@example.com2",
      "address": "myAddress2",
      "phone": {
        "home": 73406891262,
      }
    },
    {
      "name": "Nikos3",
      "email": "nikos@example.com3",
      "address": "myAddress3",
      "phone": {
        "home": 73406891262,
      }
    },
    {
      "name": "Nikos4",
      "email": "nikos@example.com4",
      "address": "myAddress4",
      "phone": {
        "home": 73406891262,
      }
    },
    {
      "name": "Nikos5",
      "email": "nikos@example.com5",
      "address": "myAddress5",
      "phone": {
        "home": 73406891262,
      }
    },
    {
      "name": "Nikos6",
      "email": "nikos@example.com6",
      "address": "myAddress6",
      "phone": {
        "home": 73406891262,
      }
    },


  ]
}