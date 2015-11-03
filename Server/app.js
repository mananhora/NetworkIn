/*
 * STUDY ROOMS
 * Developers: Manan Hora, Nina Bose
 * October 22nd, 2015
 */

/** TODO: UPDATE DESCRIPTION OF FILE
 */

// Code to import required pakages acquired from Philip Guo's
// University of Rochester CSC 210 Fall 2015 GitHub repository:
// https://github.com/pgbovine/csc210-fall-2015/blob/master/www/lectures-11-and-12/server.js
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.user(bodyParser.urlencoded({ extended: true}));
