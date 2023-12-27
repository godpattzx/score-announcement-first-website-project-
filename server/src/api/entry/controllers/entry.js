'use strict';

/**
 * entry controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::entry.entry', ({ strapi }) => ({
    async find(ctx) {
        //only used by student
        return await super.find(ctx)
    },
})
);
