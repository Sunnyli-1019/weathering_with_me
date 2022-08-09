// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
/* ============================
Imports
===============================*/
// Import modules
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
let jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const bcrypt = require("bcryptjs");
// Import models
const User = require("../Models/User");
// Import config
const config = require("../Config/config");

/* ============================
Configuration
===============================*/
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Swagger tag definition
/**
 * @swagger
 * tags:
 *  name: Authentication
 */

/* ============================
Routes
===============================*/

/**
 * @swagger
 * auth/register:
 *  post:
 *    description: Sign up a user to the application and return a token
 *    tags: [Authentication] 
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
 *        description: Authentication successful
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                auth: 
 *                  type: boolean
 *                token:
 *                  type: string
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzY4N2UwMGJhMmQzZjYxNWQ3OTc3MCIsImlhdCI6MTY1MTkzNTIwMSwiZXhwIjoxNjUyMDIxNjAxfQ.HjZ67z5bYuqL3rO1URkC40X8RsvxN_Uf9Cl0xEPqv4Y
 *                role:
 *                  type: string
 *                  example: admin
 *                username:
 *                  type: string
 *                  example: "Bruce"
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
router.post("/register", (req, res) => {
  // Check if username already exist in the db
  if (!(req.body.username && req.body.password))
    res.status(500).json({message: "Internal server error"});

  const targetUsername = req.body.username;
  const targetPassword = req.body.password;
  if (!(4 <= targetUsername.length && targetUsername.length <= 20 && 4 <= targetPassword.length && targetPassword.length <= 20))
    res.status(500).json({message: "Internal server error"});

  User.findOne({ username: targetUsername }, (err, user) => {
    if (err) res.status(500).json({message: "Error on the server"});
    if (user) res.status(404).json({message: "Username already exists"});
  });

  const hashedPassword = bcrypt.hashSync(targetPassword, 8);
  const isAdmin = req.body.isAdmin == "true" ? true : false;

  User.create(
    {
      username: targetUsername,
      password: hashedPassword,
      isAdmin: isAdmin,
    },
    (err, user) => {
      if (err) res.status(404).json();
      const token = jwt.sign({ id: user._id }, config.privateKey, {
        expiresIn: "24h",
      });
      res.status(200).json({
        auth: true,
        token: token,
        role: isAdmin ? "admin" : "user",
        username: user.username,
      });
    }
  );
});

/**
 * @swagger
 * auth/login:
 *  post:
 *    description: Log a user into the application and return a token
 *    tags: [Authentication] 
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
 *        description: Login successful
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                auth: 
 *                  type: boolean
 *                token:
 *                  type: string
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzY4N2UwMGJhMmQzZjYxNWQ3OTc3MCIsImlhdCI6MTY1MTkzNTIwMSwiZXhwIjoxNjUyMDIxNjAxfQ.HjZ67z5bYuqL3rO1URkC40X8RsvxN_Uf9Cl0xEPqv4Y
 *                role:
 *                  type: string
 *                  example: admin
 *                username:
 *                  type: string
 *                  example: "Bruce"
 *      401:
 *        description: Incorrect password
 *        content:
 *          application/json:
 *            schema:
 *              object:
 *              properties:
 *                auth: 
 *                  type: boolean
 *                  example: false
 *                token:
 *                  type: "null"
 *                message:
 *                  type: string
 *                  example: "Incorrect password"
 *      404:
 *        description: User not found
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
router.post("/login", (req, res) => {
  /*if (!(req.body.username && req.body.password)) {
    res.status(500).send("Internal server error");
  }*/
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) res.status(500).json({message: "Error on the server"});
    if (!user) res.status(404).json({message: "User not found"});

    else {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) res.status(401).json({ 
        auth: false, 
        token: null,
        message: "Incorrect password"
       });
  
      const token = jwt.sign({ id: user._id }, config.privateKey, {
        expiresIn: "24h",
      });
      res.status(200).json({
        auth: true,
        token: token,
        role: user.isAdmin ? "admin" : "user",
        username: user.username,
      });
    }
  });
});

module.exports = router;
