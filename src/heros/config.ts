import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      admin: {
        condition: () => false,
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: () => false,
      },
      relationTo: 'media',
      required: false,
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      minRows: 1,
      maxRows: 5,
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact' || type === 'mediumImpact',
        description: 'High Impact: up to 5 images (square, rotated). Medium Impact: exactly 3 images (left, center, right).',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow / Breadcrumb label',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact' || type === 'mediumImpact',
        description: 'High Impact: small label above heading. Medium Impact: current page label in the breadcrumb.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact' || type === 'mediumImpact',
      },
    },
    {
      name: 'introText',
      type: 'textarea',
      label: 'Intro Text',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact' || type === 'mediumImpact',
        description: 'High Impact: right-column paragraph. Medium Impact: centered paragraph below heading.',
      },
    },
    {
      name: 'socialProofText',
      type: 'text',
      label: 'Social Proof Text',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description: 'e.g. "750+ mensen per maand vinden hier hun plek"',
      },
    },
    {
      name: 'socialProofAvatars',
      type: 'array',
      label: 'Social Proof Avatars',
      maxRows: 5,
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description: 'Small circular avatar images shown next to the social proof text',
      },
      fields: [
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
  label: false,
}
