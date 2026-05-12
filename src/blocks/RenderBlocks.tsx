import { cn } from 'src/utilities/cn'
import React, { Fragment } from 'react'

import type { Page, Tenant } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { VacanciesBlockComponent } from '@/blocks/VacanciesBlock/Component'
import { USPBlockComponent } from '@/blocks/USPBlock/Component'
import { AgendaBlockComponent } from '@/blocks/AgendaBlock/Component'
import { ImageTextBlockComponent } from '@/blocks/ImageTextBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  vacanciesBlock: VacanciesBlockComponent,
  uspBlock: USPBlockComponent,
  agendaBlock: AgendaBlockComponent,
  imageTextBlock: ImageTextBlockComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  tenant?: Tenant
}> = (props) => {
  const { blocks, tenant } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    const typeCount: Record<string, number> = {}

    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]
            const typeIndex = typeCount[blockType] ?? 0
            typeCount[blockType] = typeIndex + 1

            if (Block) {
              return (
                <div id={`block-${blockType}-${typeIndex}`} className="my-16" key={index}>
                  {/* @ts-expect-error */}
                  <Block {...block} tenant={tenant} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
