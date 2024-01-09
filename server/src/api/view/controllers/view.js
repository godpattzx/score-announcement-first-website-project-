
const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController('api::view.view', ({strapi}) => ({

    async seen(ctx) {
        const entityId = ctx.params.id;
        const user = ctx.state.user.username;
     
        try {
          let views = await strapi.entityService.findOne('api::view.view', entityId)
          views = await strapi.entityService.update('api::view.view', entityId, { 
            data: {    
                seen_datetime : new Date(),
            },
        }),
          ctx.body = `seen_datetime UPDATE Student : ${user}`;
        } catch (err) {
          ctx.body = err;
        }
      },
      async ack(ctx) {
        const entityId = ctx.params.id;
        const user = ctx.state.user.username;
     
        try {
          let views = await strapi.entityService.findOne('api::view.view', entityId)
          views = await strapi.entityService.update('api::view.view', entityId, { 
            data: {    
                ack_datetime : new Date(),
                ack : true
            },
        }),
          ctx.body = `acknowledge UPDATE Student : ${user}`;
        } catch (err) {
          ctx.body = err;
        }
      },
        }));
        
    
