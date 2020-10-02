"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return await queryInterface.addColumn("resonators", "interval", { type: Sequelize.INTEGER });
    },

    down: async (queryInterface, Sequelize) => {
        return await queryInterface.removeColumn("resonators", "interval");
    },
};
