import type { Block } from 'payload'

export const AgendaBlock: Block = {
  slug: 'agendaBlock',
  interfaceName: 'AgendaBlock',
  labels: {
    singular: 'Agenda Block',
    plural: 'Agenda Blocks',
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
      name: 'events',
      type: 'array',
      label: 'Events',
      admin: {
        description:
          'Add events and drag to reorder. Events are displayed in the order shown here.',
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'Icon',
          admin: {
            description:
              'Font Awesome class string, e.g. "fa-solid fa-calendar" or "fa-solid fa-music". Browse at fontawesome.com/icons.',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'date',
          type: 'text',
          label: 'Date / Schedule',
          required: true,
          admin: {
            description:
              'Can be a specific date (02-06-2026), recurring text (Every Monday), or any other schedule description.',
          },
        },
      ],
    },
  ],
}
