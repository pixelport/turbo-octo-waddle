
export default {
  type: 'object',
  properties: {
    title: { type: 'string' },
    text: { type: 'string' },
  },
  required: ['title'],
} as const
