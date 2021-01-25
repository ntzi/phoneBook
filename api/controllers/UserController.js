const bcrypt = require('bcrypt');

module.exports = {
  register: async function (req, res) {
    /* Register an user user.
    Eg POST request: http://localhost:1337/user/register
        
    Body (JSON):
      {
          "email": "user@example.com",
          "password": "password",
          "confirmPassword": "password",
          "name": "user"
      }
    */

    var request = req.allParams();

    if (request.password !== request.confirmPassword) return res.badRequest("Password not the same");

    const newUserRecord = {
      email: request.email,
      password: request.password,
      name: request.name
    }


    User.findOrCreate({ email: request.email }, newUserRecord)
      .exec(async (err, newOrFoundUserRecord, wasCreated) => {
        if (err) { return res.serverError(err); }

        if (wasCreated) {
          sails.log.info(`New user created. Email: ${request.email}`);
          return res.ok({
            success: true,
            message: `New user created. Email: ${request.email}`,
            data: {
              token: jwToken.issue({ id: newOrFoundUserRecord.id })
            }
          })
        }
        else {
          sails.log.info(`Failed to create user with email: ${request.email}. Email already in use.`);
          return res.ok({
            success: false,
            message: `Failed to create user with email: ${request.email}. Email already in use.`,
            data: {}
          })
        }
      });
  },

  login: async function (req, res) {
    /* Login as an user user.
    Eg POST request: http://localhost:1337/user/login
    
    Body (JSON): 
      {
          "email": "user@example.com",
          "password": "password"
      }
    */

    var request = req.allParams();
    if (!request.email || !request.password) {
      sails.log.info(`User failed to login. Both email and password are required.`)
      return res.ok({
        success: false,
        message: `User failed to login. Both email and password are required.`,
        data: {}
      })
    }

    var user = await User.findOne({ email: request.email });
    if (!user) {
      sails.log.info(`User failed to login. Wrong email. Email: ${request.email}`)
      return res.ok({
        success: false,
        message: `User failed to login. Wrong password or email`,
        data: {}
      })
    }

    let password = request.password
    let encryptedPassword = user.password
    let passwordVerified = await bcrypt.compare(password, encryptedPassword)
    if (!passwordVerified) {
      sails.log.info(`User failed to login. Wrong password. Email: ${request.email}`)
      return res.ok({
        success: false,
        message: `User failed to login. Wrong password or email`,
        data: {}
      })
    }

    sails.log.info(`User logged in successfully. Email: ${request.email}`)
    return res.ok({
      success: true,
      message: `User logged in successfully. Email: ${request.email}`,
      data: {
        token: jwToken.issue({ id: user.id })
      }
    })
  }

};
