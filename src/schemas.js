module.exports = {
  getHealth: {
    description: 'Check health',
    summary: 'Check health',
    tags: ['health'],
    response: {
      200: {
        description: 'Ok',
        type: 'object',
        properties: {},
      },
      '5xx': {
        description: 'Server error',
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
  },
  getUrls: {
    description: 'Get list of short URLs',
    summary: 'Get list of short URLs',
    tags: ['url'],
    querystring: {
      type: 'object',
      properties: {
        offset: {
          type: 'integer',
          default: 0,
          minimum: 0,
          maximum: 50,
        },
      },
    },
    response: {
      200: {
        description: 'Ok',
        type: 'object',
        properties: {
          urls: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'shortUrl', 'targetUrl'],
              properties: {
                id: {
                  type: 'string',
                },
                shortUrl: {
                  type: 'string',
                },
                targetUrl: {
                  type: 'string',
                },
              },
            },
          },
        },
        examples: [
          {
            urls: [
              {
                id: 'o2fXhV',
                shortUrl: `https://example.com/o2fXhV`,
                targetUrl: 'https://www.example.com/support/disrupted-flights/latest-travel-updates/',
              },
            ],
          },
        ],
      },
      '4xx': {
        description: 'Client error',
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
      '5xx': {
        description: 'Server error',
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
  },
  postUrl: {
    description: 'Create a short URL',
    summary: 'Create a short URL',
    tags: ['url'],
    body: {
      type: 'object',
      required: ['targetUrl'],
      properties: {
        targetUrl: {
          type: 'string',
          format: 'uri',
          pattern: '^https?://',
        },
      },
      examples: [{ targetUrl: 'https://www.example.com/support/disrupted-flights/latest-travel-updates/' }],
    },
    response: {
      200: {
        description: 'Ok',
        type: 'object',
        required: ['id', 'shortUrl', 'targetUrl'],
        properties: {
          id: {
            type: 'string',
          },
          shortUrl: {
            type: 'string',
          },
          targetUrl: {
            type: 'string',
          },
        },
        examples: [
          {
            id: 'o2fXhV',
            shortUrl: `https://example.com/o2fXhV`,
            targetUrl: 'https://www.example.com/support/disrupted-flights/latest-travel-updates/',
          },
        ],
      },
      '4xx': {
        description: 'Client error',
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
      '5xx': {
        description: 'Server error',
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
  },
  getUrl: {
    description: 'Get short URL',
    summary: 'Get short URL',
    tags: ['url'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          pattern: `^[a-zA-Z0-9]{6}$`,
        },
      },
    },
    response: {
      200: {
        description: 'Ok',
        type: 'object',
        required: ['id', 'shortUrl', 'targetUrl'],
        properties: {
          id: {
            type: 'string',
          },
          shortUrl: {
            type: 'string',
          },
          targetUrl: {
            type: 'string',
          },
        },
        examples: [
          {
            id: 'o2fXhV',
            shortUrl: `https://example.com/o2fXhV`,
            targetUrl: 'https://www.example.com/support/disrupted-flights/latest-travel-updates/',
          },
        ],
      },
      '4xx': {
        description: 'Client error',
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
      '5xx': {
        description: 'Server error',
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
  },
  deleteUrl: {
    description: 'Delete short URL',
    summary: 'Delete short URL',
    tags: ['url'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          pattern: '^[a-zA-Z0-9]{6}$',
        },
      },
    },
    response: {
      200: {
        description: 'Ok',
        type: 'object',
        properties: {},
      },
      '4xx': {
        description: 'Client error',
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
      '5xx': {
        description: 'Server error',
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
  },
  redirectUrl: {
    description: 'Redirect short URL',
    summary: 'Redirect short URL',
    tags: ['url'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          pattern: `^[a-zA-Z0-9]{6}$`,
        },
      },
    },
    response: {
      301: {
        description: 'Redirect',
        type: 'object',
        headers: {
          Location: {
            type: 'string',
            description: 'Target URL',
          },
        },
      },
      '4xx': {
        description: 'Client error',
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
      '5xx': {
        description: 'Server error',
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
  },
}
