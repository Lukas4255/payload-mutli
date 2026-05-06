import type { Block } from 'payload'

import { link } from '@/fields/link'

export const VacanciesBlock: Block = {
  slug: 'vacanciesBlock',
  interfaceName: 'VacanciesBlock',
  labels: {
    singular: 'Vacancies Block',
    plural: 'Vacancies Blocks',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      admin: {
        description: 'Small label above the heading, e.g. "Wij zoeken mensen"',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Number of vacancies to show',
      defaultValue: 3,
      admin: {
        step: 1,
      },
    },
    link({
      appearances: false,
      overrides: {
        name: 'viewAllLink',
        label: 'View All Link',
        admin: {
          description: 'Button shown below the cards, e.g. "Bekijk alle vacatures"',
        },
      },
    }),
  ],
}
