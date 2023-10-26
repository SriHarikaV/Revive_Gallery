// AUTH
const registerAuth = require("./auth/register.js");
exports.register = registerAuth;

const loginAuth = require("./auth/login.js");
exports.login = loginAuth;

const getUser = require("./get-user.js");
exports.getUser = getUser;

// EDIT
const editUser = require("./edit/edit-user.js");
exports.editUser = editUser;

// OTHER
const deleteUser = require("./delete-user.js");
exports.deleteUser = deleteUser;
