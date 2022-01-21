const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

signupUser = function (req, res, next) {

    User.find({ email: req.body.email }).
        then(result => {
            if (result.length < 1) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(404).json({
                            massage: err
                        });
                    } else {
                        const user = new User({
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            password: hash,
                            email: req.body.email
                        });
                        user.save().
                            then(result => {
                                res.status(200).json({
                                    massage: 'user created'
                                });
                            }).
                            catch(err => {
                                res.status(404).json({
                                    massage: err
                                });
                            });
                    }
                });
            } else {
                res.status(404).json({
                    massage: 'email exist'
                });
            }
        }).
        catch(err => {
            res.status(404).json({
                massage: err
            });
        });
}

signinUser = function (req, res, next) {
    User.find({ email: req.body.email }).
        then(user => {
            if (user.length >= 1) {
                bcrypt.compare(req.body.password, user[0].password).
                    then(result => {
                        if (result) {
                            const token = jwt.sign({
                                userid: user[0]._id,
                                email: user[0].email
                            }, 'secret', {
                                expiresIn: '1h'
                            });
                            res.status(200).json({
                                massage: "success signin",
                                token: token
                            });
                        } else {
                            res.status(404).json({
                                massage: "failed signin"
                            });
                        }
                    }).
                    catch(err => {
                        res.status(404).json({
                            massage: err
                        });
                    });
            } else {
                res.status(404).json({
                    massage: 'wrong email'
                });
            }
        }).
        catch(err => {
            res.status(404).json({
                massage: err
            });
        });
}

updateUser = function (req, res, next) {
    bcrypt.hash(req.body.password, 10).
        then(hash => {
            const user = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: hash,
                email: req.body.email
            }
            User.updateOne({ _id: req.params.id }, { $set: user }).
                then(result => {
                    res.status(200).json({
                        massage: 'user updated'
                    });
                }).
                catch(err => {
                    res.status(404).json({
                        massage: 'failed updete'
                    });
                });
        }).
        catch(err => {
            res.status(404).json({
                massage: err
            });
        });
}

deleteUser = function (req, res, next) {
    User.deleteOne({ _id: req.params.id }).
        then(result => {
            res.status(200).json({
                massage: 'user deleted'
            });
        }).
        catch(err => {
            res.status(404).json({
                massage: err
            });
        });
}

module.exports = {
    signupUser: signupUser,
    signinUser: signinUser,
    updateUser: updateUser,
    deleteUser: deleteUser
}





