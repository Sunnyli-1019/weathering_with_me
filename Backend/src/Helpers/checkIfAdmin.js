// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
const User = require("../Models/User")

module.exports = (req, res, next) => {
    User.findById(req.userId, "isAdmin -_id", (err, user) => {
        if(err) res.status(500).send("internal server error");
        if(!user) res.status(404).send("user not found");
        if(!user.isAdmin) res.status(403).send("access to the requested resource is forbidden");
        req.isAdmin = true;
        next();
    });
}