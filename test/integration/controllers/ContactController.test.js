var supertest = require('supertest');
var assert = require('assert');

describe('ContactController.find', async function () {

  describe('/api/v1/contact', function () {
    it('should find a contact', async function () {
      const token = await _getToken()

      var name = 'Nikos1'
      var contact = await Contact.findOne({ name: name });
      const expectedResponse = {
        "success": true,
        "message": "Contact found. Name: Nikos1.",
        "data": {
          "createdAt": contact.createdAt,
          "updatedAt": contact.updatedAt,
          "id": contact.id,
          "name": contact.name,
          "email": contact.email,
          "address": contact.address,
          "phone": {
            "home": contact.phone.home,
          }
        }
      }

      await supertest(sails.hooks.http.app)
        .get(`/api/v1/contact?token=${token}&name=${name}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(expectedResponse)
    });
  });
});

describe('ContactController.list', async function () {
  describe('api/v1/contact/list', function () {
    it('should find all contacts by key = createdAt, sorted = asc, index = 2, start = 0', async function () {
      const token = await _getToken()
      var name1 = 'Nikos1'
      var name2 = 'Nikos2'
      var contact1 = await Contact.findOne({ name: name1 });
      var contact2 = await Contact.findOne({ name: name2 });
      const expectedResponse =
      {
        "success": true,
        "message": "All contacts fetched from database.",
        "data": {
          "_links": {
            "next": "/api/v1/contact/list?key=createdAt&order=asc&limit=2&start=2"
          },
          "limit": 2,
          "contacts": [
            {
              "createdAt": contact1.createdAt,
              "updatedAt": contact1.updatedAt,
              "id": contact1.id,
              "name": contact1.name,
              "email": contact1.email,
              "address": contact1.address,
              "phone": {
                "home": contact1.phone.home
              }
            },
            {
              "createdAt": contact2.createdAt,
              "updatedAt": contact2.updatedAt,
              "id": contact2.id,
              "name": contact2.name,
              "email": contact2.email,
              "address": contact2.address,
              "phone": {
                "home": contact2.phone.home
              }
            }
          ]
        }
      }

      await supertest(sails.hooks.http.app)
        .get(`/api/v1/contact/list?token=${token}&key=createdAt&order=asc&limit=2&start=0`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(expectedResponse)
    });

    it('should find all contacts by key = createdAt, sorted = asc, index = 2, start = 2', async function () {
      const token = await _getToken()
      var name1 = 'Nikos3'
      var name2 = 'Nikos4'
      var contact1 = await Contact.findOne({ name: name1 });
      var contact2 = await Contact.findOne({ name: name2 });
      const expectedResponse =
      {
        "success": true,
        "message": "All contacts fetched from database.",
        "data": {
          "_links": {
            "prev": "/api/v1/contact/list?key=createdAt&order=asc&limit=2&start=0",
            "next": "/api/v1/contact/list?key=createdAt&order=asc&limit=2&start=4"
          },
          "limit": 2,
          "contacts": [
            {
              "createdAt": contact1.createdAt,
              "updatedAt": contact1.updatedAt,
              "id": contact1.id,
              "name": contact1.name,
              "email": contact1.email,
              "address": contact1.address,
              "phone": {
                "home": contact1.phone.home
              }
            },
            {
              "createdAt": contact2.createdAt,
              "updatedAt": contact2.updatedAt,
              "id": contact2.id,
              "name": contact2.name,
              "email": contact2.email,
              "address": contact2.address,
              "phone": {
                "home": contact2.phone.home
              }
            }
          ]
        }
      }

      await supertest(sails.hooks.http.app)
        .get(`/api/v1/contact/list?token=${token}&key=createdAt&order=asc&limit=2&start=2`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(expectedResponse)
    });

    it('should find all contacts by key = createdAt, sorted = asc, index = 2, start = 4', async function () {
      const token = await _getToken()
      var name1 = 'Nikos5'
      var name2 = 'Nikos6'
      var contact1 = await Contact.findOne({ name: name1 });
      var contact2 = await Contact.findOne({ name: name2 });
      const expectedResponse =
      {
        "success": true,
        "message": "All contacts fetched from database.",
        "data": {
          "_links": {
            "prev": "/api/v1/contact/list?key=createdAt&order=asc&limit=2&start=2"
          },
          "limit": 2,
          "contacts": [
            {
              "createdAt": contact1.createdAt,
              "updatedAt": contact1.updatedAt,
              "id": contact1.id,
              "name": contact1.name,
              "email": contact1.email,
              "address": contact1.address,
              "phone": {
                "home": contact1.phone.home
              }
            },
            {
              "createdAt": contact2.createdAt,
              "updatedAt": contact2.updatedAt,
              "id": contact2.id,
              "name": contact2.name,
              "email": contact2.email,
              "address": contact2.address,
              "phone": {
                "home": contact2.phone.home
              }
            }
          ]
        }
      }

      await supertest(sails.hooks.http.app)
        .get(`/api/v1/contact/list?token=${token}&key=createdAt&order=asc&limit=2&start=4`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(expectedResponse)
    });

  });
});

describe('ContactController.add', async function () {
  describe('/api/v1/contact/add', function () {
    it('should add a contact', async function () {
      const token = await _getToken()
      const newContact = {
        "name": "Nikos7",
        "email": "nikos@example.com7",
        "address": "myAddress7",
        "phone": {
          "home": 73406891262
        }
      }

      await supertest(sails.hooks.http.app)
        .post(`/api/v1/contact/add?token=${token}`)
        .send(newContact)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res) => {
          assert.strictEqual(res.body.success, true)
          assert.strictEqual(res.body.message, `New contact created. Name: Nikos7.`)
        })

    });
  });
});

describe('ContactController.update', async function () {
  describe('/api/v1/contact/update', function () {
    it('should update a contact', async function () {
      const token = await _getToken()
      const name = 'Nikos1'
      const updateContact = {
        "name": "Nikos1New",
        "email": "nikos@example.com1New",
        "address": "myAddress1New",
        "phone": {
          "home": 73406891262
        }
      }

      await supertest(sails.hooks.http.app)
        .put(`/api/v1/contact?token=${token}&name=${name}`)
        .send(updateContact)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res) => {
          assert.strictEqual(res.body.success, true)
          assert.strictEqual(res.body.message, `Contact updated. Name: Nikos1.`)
        })
    });
  });
});

describe('ContactController.delete', async function () {
  describe('/api/v1/contact/delete', function () {
    it('should delete a contact', async function () {
      const token = await _getToken()
      const name = 'Nikos2'
      const expectedResponse = {
        "success": true,
        "message": `Contact deleted. Name: ${name}.`,
        "data": {}
      }

      await supertest(sails.hooks.http.app)
        .delete(`/api/v1/contact?token=${token}&name=${name}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(expectedResponse)
    });
  });
});

_getToken = async () => {
  const user = await User.findOne({ email: "user@example.com" });
  return jwToken.issue({ id: user.id })
}
