import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'

export const Vacancies: CollectionConfig<'vacancies'> = {
  slug: 'vacancies',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    excerpt: true,
    vacancyType: true,
    publishedAt: true,
    tenant: true,
  },
  admin: {
    defaultColumns: ['title', 'tenant', 'publishedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Job Title',
    },
    {
      name: 'vacancyType',
      type: 'text',
      label: 'Type',
      admin: {
        position: 'sidebar',
        description: 'Shown as a pill on the card, e.g. "Vrijwilliger" or "Betaald"',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt',
      admin: {
        description: 'Short preview text shown on the vacancy card (1–2 sentences)',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              name: 'description',
              type: 'richText',
              label: false,
              required: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },
          ],
        },
        {
          label: 'Application',
          fields: [
            {
              name: 'applyUrl',
              type: 'text',
              label: 'Application URL',
              admin: {
                description: 'External link to apply, e.g. https://forms.example.com/apply',
              },
            },
            {
              name: 'applyEmail',
              type: 'email',
              label: 'Application Email',
              admin: {
                description: 'Alternative to URL — applicants can email this address directly',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published At',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    ...slugField('title'),
  ],
  versions: {
    drafts: {
      autosave: { interval: 100 },
    },
    maxPerDoc: 50,
  },
}
