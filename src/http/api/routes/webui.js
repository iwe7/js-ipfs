'use strict'

const resources = require('../../gateway/resources')

module.exports = (server) => {
  const gateway = server.select('API')

  gateway.route([
    {
      method: '*',
      path: '/ipfs/{cid*}',
      config: {
        pre: [
          { method: resources.gateway.checkCID, assign: 'args' }
        ],
        handler: resources.gateway.handler
      }
    },
    {
      method: '*',
      path: '/webui',
      handler: (request, reply) => {
        return reply().redirect().location('/ipfs/QmUnXcWZC5Ve21gUseouJsH5mLAyz5JPp8aHsg8qVUUK8e')
      }
    }
  ])
}
