"use strict";

module.exports = {
  "*/1 * * * *": {
    task: async () => {
      const draftSubjectPublic = await strapi.api.subject.services.subject.find({
        status: 'draft',
        publish_at: { $lt: new Date() },
      });

      draftSubjectPublic.forEach(async subject => {
        await strapi.api.subject.services.subject.update(
          { id: subject.id },
          { publish_at: 'published' }
        );
      });
    },
    options: {
      tz: 'Asia/Bangkok',
    },
  },
};
