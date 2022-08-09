// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
/* ============================
Imports
===============================*/
// Import modules
const express = require("express");
const User = require("../Models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
// Import helpers
const verifyToken = require("../Helpers/verifyToken");
const checkIfAdmin = require("../Helpers/checkIfAdmin");

/* ============================
Configure app
===============================*/
router.use(verifyToken);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
// Swagger components definition
/**
 * @swagger
 * components:
 *   schemas:
 *    User:
 *      type: object
 *      properties:  
 *        username:
 *          type: string
 *        password:
 *          type: string
 *        isAdmin:
 *          type: boolean
 */

// Swagger tag definition
/**
 * @swagger
 * tags:
 *  name: User
 */

/* ============================
Routes
===============================*/
/**
 * @swagger
 * /user:
 *  get:
 *    description: Get a list of all users, For Admin
 *    tags: [User]
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Array containing all user objects, password is still in hashed form for security reason
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 *      404:
 *        description: No user found
 *      500:
 *        description: Error on the server
 */
router.get("/", checkIfAdmin, (req, res) => {
  User.find({}, "-_id username password isAdmin", (err, users) => {
    if(err) res.status(500).json({message: "Error on the server"});
    if(!users.length) res.status(404).json({message: "No user found"});
    res.status(200).json(users);
  })
});

/**
 * @swagger
 * /user:
 *  post:
 *    description: Add a user to the database, For Admin
 *    tags: [User]
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *              isAdmin:
 *                type: string
 *    responses:
 *      200: 
 *        description: User created successfully. Returns the newly created user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: User with given username already exist
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      500:
 *        description: Failed to access database or failed to create user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 */
router.post("/", checkIfAdmin, (req, res) => {
  if (!(req.body.username && req.body.password))
    res.status(500).json({message: "Internal server error"});
  const targetUsername = req.body.username;
  const targetPassword = req.body.password;
  if (!(4 <= targetUsername.length && targetUsername.length <= 20 && 4 <= targetPassword.length && targetPassword.length <= 20))
    res.status(500).json({message: "Internal server error"});
  // Check if already in database
  User.findOne({username: targetUsername}, (err, userFind) => {
    if(err) res.status(500).json({message: "Error on the server"}); 
    if(userFind) res.status(404).json({message: "User with given username already exist"});
  });
  // Add user
  let hashedPassword = bcrypt.hashSync(targetPassword, 8);
  let isAdmin = req.body.isAdmin=="true" ? true : false;
  User.create(
    {
      username: targetUsername,
      password: hashedPassword,
      isAdmin: isAdmin,
    },
    (err, user) => {
      if (err) res.status(500).json({message: "Failed to create user"});
      User.findOne({username: targetUsername}, "-_id username password isAdmin", (err2, user2) => {
        if(err2) res.status(500).json({message: "Error on the server"}); 
        if(user2) res.status(200).json(user2);
      });
    }
  );
});

/**
 * @swagger
 * /user/{username}:
 *  get:
 *    description: Get info of one specific user
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: username
 *        required: true
 *        schema:
 *          type: string
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200: 
 *        description: Returned user successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: No user with given username exists in the database
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      500:
 *        description: Error on the server
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 */ 
router.get("/:username", checkIfAdmin, (req, res) => {
  User.findOne({username: req.params.username}, "-_id username password isAdmin", (err, user) => {
    if(err) res.status(500).json({message: "Error on the server"});
    if(!user) res.status(404).json({message: "No user with given username exists in the database"});
    if(user) res.status(200).json(user);
  })
});

/**
 * @swagger
 * /user/{username}:
 *  put:
 *    description: Update info of specific user
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: username
 *        required: true
 *        schema:
 *          type: string
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200: 
 *        description: User updated successully. Updated user returned 
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: No user with given username exists in the database or username already exists
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      500:
 *        description: Error on the server
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 */ 
router.put("/:username", checkIfAdmin, (req, res) => {
  let oldUsername = req.params.username;
  let newUsername = req.params.username;
  let changePwFlag = false;
  let changeUsernameFlag = false;
  let newpassword = "default";
  if (req.body.username) {
    changeUsernameFlag = true;
    newUsername = req.body.username;
    if (newUsername.length > 20 || 4 > newUsername.length)
      res.status(500).json({message: "Error on the server"}); 
  }
  if (req.body.password) {
    changePwFlag = true;
    newpassword = req.body.password;
    if (newpassword.length > 20 || 4 > newpassword.length)
      res.status(500).json({message: "Error on the server"}); 
  }

  // Check if new name already exist
  User.findOne({username: newUsername}, (err, user) => {
    if(err) res.status(500).json({message: "Error on the server"}); 
    if(user) res.status(404).json({message: "Username already exists"});
  });
  // Check if already in database
  User.findOne({username: oldUsername}, (err, user) => {
    if(err) res.status(500).json("Error on the server"); 
    if(user) {
      let hashedPassword = bcrypt.hashSync(newpassword, 8);
      if (changeUsernameFlag)
        user.username = newUsername;
      if (changePwFlag)
        user.password = hashedPassword;
      user.save((err2, doc) => {
        if(err2) res.status(500).json({message: "Error on the server"});
        User.findOne({username: newUsername}, "-_id username password", (err3, user3) => {
          if(err3) res.status(500).json({message: "Error on the server"}); 
          if(!user3) res.status(404).json({message: "No user with given username exists"});
          res.status(200).json(user3); 
        });
      });
    }
    else {
      res.status(404).json({message: "Error on the server"});
    }


  });
});

/**
 * @swagger
 * /user/{username}:
 *  delete:
 *    description: For admin to ban/delete a specific user
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: username
 *        required: true
 *        schema:
 *          type: string
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200: 
 *        description: User deleted successully or no user with given username found.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      500:
 *        description: Error on the server
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 */ 
router.delete("/:username", checkIfAdmin, (req, res) => {
  let targetUsername = req.params.username;
  User.remove({username: targetUsername}, (err, user) => {
    if (err) res.status(500).json({message: "Error on the server"}); 
    if (user) res.status(200).json({message: "Successful removal"});
    else res.status(200).json({message: "No user with given username exist"}); 
  });
});

module.exports = router;