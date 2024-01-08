
const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController('api::view.view', ({strapi}) => ({

    async seen(ctx) {
        const entityId = ctx.params.id;
     
        try {
          let views = await strapi.entityService.findOne('api::view.view', entityId)
          views = await strapi.entityService.update('api::view.view', entityId, { 
            data: {    
                seen_datetime : new Date(),
            },
        }),
          ctx.body = {};
        } catch (err) {
          ctx.body = err;
        }
      },
        }));
        
    
