import type { Block } from 'payload'

export const USPBlock: Block = {
  slug: 'uspBlock',
  interfaceName: 'USPBlock',
  labels: {
    singular: 'USP Block',
    plural: 'USP Blocks',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      admin: {
        description: 'Small label above the heading',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Intro Text',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Photo Gallery',
      minRows: 1,
      maxRows: 5,
      admin: {
        description:
          'Add up to 5 photos. First photo appears large on the left; the rest fill a 2×2 grid on the right.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      label: 'USP Columns',
      maxRows: 3,
      admin: {
        description: 'Add up to 3 USP columns. Each column becomes a card with a list of features.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Column Title',
        },
        {
          name: 'items',
          type: 'array',
          label: 'USP Items',
          fields: [
            {
              name: 'icon',
              type: 'text',
              label: 'Icon',
              admin: {
                description:
                  'Enter a Font Awesome class string, e.g. "fa-solid fa-house" or "fa-brands fa-instagram". Browse icons at fontawesome.com/icons.',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
            },
          ],
        },
      ],
    },
  ],
}
