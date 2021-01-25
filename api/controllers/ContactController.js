/**
 * ContactController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  add: async ( req, res ) => {
    /* Add a new contact.
    Eg POST request: http://localhost:1337/api/v1/contact/add
        
    Body (JSON):
      {
        "name": "Nikos",
        "email": "nikos@example.com",
        "address": "myAddress",
        "phone": {
          "home": 73406891262,
          "work": 90347601124,
          "mobile": 13904876134,
          "other": 13904756103
        }
      }
    */

    req = req.allParams();

    Contact.findOrCreate({ name: req.name }, req)
      .exec(async (err, record, wasCreated) => {
        if (err) { return res.serverError(err); }

        if (wasCreated) {
          sails.log.info(`New contact created. Name: ${req.name}.`);
          res.ok({
            success: true,
            message: `New contact created. Name: ${req.name}.`,
            data: req
          })
        } else {
          sails.log.info(`Contact already exists. Name: ${req.name}. To update an existed record use api/v1/contact/update.`);
          res.ok({
            success: false,
            message: `Contact already exists: ${req.name}.`,
            data: record
          })
        }
      })

  },

  delete: async ( req, res ) => {
    /* Delete a contact in database.
    Eg DELETE request: http://localhost:1337/api/v1/contact?name=Nikos
    
    */


    req = req.allParams();
    const contactRecordArchived = await Contact.archiveOne({ name: req.name });

    if (contactRecordArchived) {
      sails.log.info(`Contact deleted. Name: ${req.name}.`)
      return res.ok({
        success: true,
        message: `Contact deleted. Name: ${req.name}.`,
        data: {}
      })
    } else {
      sails.log.info(`Contact not found. Name: ${req.name}.`)
      return res.ok({
        success: false,
        message: `Contact not found. Name: ${req.name}.`,
        data: {}
      })
    }
  },

  update: async ( req, res ) => {
    /* Update a record in the database.
    Eg PUT request: http://localhost:1337/api/v1/contact?name=Nikos
        
    Body (JSON):
      {
        "name": "Nikos2",
        "email": "newEmail@example.com",
        "address": "newAddress",
        "phone": {
          "home": 73406891262,
          "work": 90347601124,
          "mobile": 13904876134,
          "other": 13904756103
        }
      }
    */

    const query = req.query
    req = req.allParams();

    var updatedMedia = await Contact.updateOne({ name: query.name }, req )
    if (!updatedMedia) {
      sails.log.info(`Contact not found. Name: ${query.name}.`)
      return res.ok({
        success: false,
        message: `Contact not found. Name: ${query.name}.`,
        data: {}
      })
    }

    sails.log.info(`Contact updated. Name: ${query.name}.`)
    return res.ok({
      success: true,
      message: `Contact updated. Name: ${query.name}.`,
      data: updatedMedia
    })


  },

  find: async ( req, res ) => {
    /* Find a contact record in the database.
    Eg GET request: http://localhost:1337/api/v1/contact?name=Nikos
    
    */

    req = req.allParams();
    const contact = await Contact.findOne({ name: req.name });

    if (!contact) {
      sails.log.info(`Contact not found. Name: ${req.name}.`)
      return res.ok({
        success: false,
        message: `Contact not found. Name: ${req.name}.`,
        data: {}
      })
    }

    sails.log.info(`Contact found. Name: ${req.name}.`)
    return res.ok({
      success: true,
      message: `Contact found. Name: ${req.name}.`,
      data: contact
    })
  },
}