"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const connection = require("../dbConnection").default;

const models = {};
const currentModuleName = path.basename(module.filename);

const isJavascriptFile = (filename) => path.extname(filename) === ".js";

const isCurrentModule = (filename) => filename === currentModuleName;

const isModelModule = (filename) =>
    filename.indexOf(".") !== 0 && isJavascriptFile(filename) && !isCurrentModule(filename);

const importModel = (filename) => require(path.join(__dirname, filename))(connection, Sequelize.DataTypes);

const registerModel = (model) => (models[model.name] = model);

const associateModel = (model) => model.associate && model.associate(models);

fs.readdirSync(__dirname).filter(isModelModule).map(importModel).map(registerModel).map(associateModel);

models.sequelize = connection;
models.Sequelize = Sequelize;

module.exports = models;
