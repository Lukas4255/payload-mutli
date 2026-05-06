import type { CollectionConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: CollectionConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    // ── Column 1: main navigation ──────────────────────────────────
    {
      name: 'menuItems',
      type: 'array',
      label: 'Menu',
      fields: [link({ appearances: false })],
      maxRows: 10,
    },

    // ── Column 2: social media ─────────────────────────────────────
    {
      name: 'socialItems',
      type: 'array',
      label: 'Sociale media',
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Platform',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        link({ appearances: false }),
      ],
      maxRows: 8,
    },

    // ── Column 3: legal ────────────────────────────────────────────
    {
      name: 'legalItems',
      type: 'array',
      label: 'Juridisch',
      fields: [link({ appearances: false })],
      maxRows: 6,
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright tekst',
      admin: {
        description: 'Bijv. "© 2026 Rentree"',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
