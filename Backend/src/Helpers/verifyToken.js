// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
const jwt = require("jsonwebtoken");
const config = require("../Config/config");

module.exports = (req, res, next) => {
    const token = req.headers["x-auth-token"];
    if(!token) {
        res.status(403).send({auth: false, message: "No token provided"});
    }

    jwt.verify(token, config.privateKey, (err, decoded) => {
        if(err) res.status(500).send({auth: false, message: "Failed to authenticate token"});
        req.userId = decoded.id;
        next();
    });
}
