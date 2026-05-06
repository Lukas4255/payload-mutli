import type { Block } from 'payload'

import { link } from '@/fields/link'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Text',
    },
    link({
      appearances: ['default', 'outline', 'secondary'],
      overrides: {
        name: 'link',
        label: 'Button',
      },
    }),
  ],
}
