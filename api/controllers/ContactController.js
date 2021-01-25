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

  list: async ( req, res ) => {
    /* Get all contacts from the database.
    Return contacts sorted by key (name, address, createdAt, etc) and in order (asc, desc).
    Eg GET request: http://localhost:1337/api/v1/contact/list?key=name&order=asc
    
    */
    
    const query = req.query
    var key = query.key
    var order = query.order

    if ( !key ) {
      key = 'name'
    }
    if ( !order ) {
      order = 'asc'
    }


    req = req.allParams()
    var contacts = await Contact.find();

    if (!contacts) {
      sails.log.info(`Could not fetch contacts.`)
      return res.ok({
        success: false,
        message: `Could not fetch contacts.`,
        data: {}
      })
    }

    contacts = await _sort( contacts, key, order )
    contacts = await _pagination ( contacts, query )

    sails.log.info(`All contacts fetched from database.`)
    return res.ok({
      success: true,
      message: `All contacts fetched from database.`,
      data: contacts
    })
  },

};

_sort = ( data, key, order ) => {
  // Sort data by key in ascending or descending order.

  if ( typeof(data[0][key]) == 'string' ) {
    if ( order == 'asc' ){
      data.sort((a, b) => a[key].localeCompare(b[key]))
    } else {
      data.sort((a, b) => b[key].localeCompare(a[key]))
    }
  } else {
    if ( order == 'asc' ){
      data.sort((a, b) => a[key] - b[key]);
    } else {
      data.sort((a, b) => b[key] - a[key]);
    }
  }  
  return data
}

_pagination = ( data, query ) => {
  // Create pagination for data.
  // A link for the next and previous page will be added to response.
  // When the response doesn't contain a link to the next page of results, you know that you've reached the end. 
  /* Eg: 
    "_links": {
      "prev": "/api/v1/contact/list?key=createdAt&order=asc&limit=3&start=3",
      "next": "/api/v1/contact/list?key=createdAt&order=asc&limit=3&start=9"
    },
    ...
  */

  var limit = parseInt(query.limit)
  var start = parseInt(query.start)
  var links = {}
  
  if ( !limit ) {
    limit = 10
  }
  if ( !start ) {
    start = 0 
  }
  
  if ( (start - limit) >= 0 ) {
    const prev = `/api/v1/contact/list?key=${query.key}&order=${query.order}&limit=${limit}&start=${start - limit}`
    links['prev'] = prev
  }

  if ( (start + limit) < data.length ) {
    const next = `/api/v1/contact/list?key=${query.key}&order=${query.order}&limit=${limit}&start=${start + limit}`
    links['next'] = next
  }

  data = data.slice( start, start + limit )
  result = {
    '_links': links,
    'limit': limit,
    'contacts': data
  }

  return result
}