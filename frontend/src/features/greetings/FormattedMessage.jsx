import { Fragment } from 'react'
import {
  parseInlineFormatting,
  parseMessageBlocks
} from './messageFormatting.js'

const headingElements = {
  1: 'h2',
  2: 'h3',
  3: 'h4'
}

const headingClassNames = {
  1: 'text-2xl font-semibold leading-snug sm:text-3xl',
  2: 'text-xl font-semibold leading-snug sm:text-2xl',
  3: 'text-lg font-semibold leading-snug sm:text-xl'
}

const renderInlineFormatting = (value, keyPrefix) => {
  return parseInlineFormatting(value).map((token, index) => {
    const key = `${keyPrefix}-${index}`

    if (token.type === 'strong') {
      return <strong key={key}>{token.value}</strong>
    }

    if (token.type === 'emphasis') {
      return <em key={key}>{token.value}</em>
    }

    return <Fragment key={key}>{token.value}</Fragment>
  })
}

const renderLines = (lines, keyPrefix) => {
  return lines.map((line, index) => (
    <Fragment key={`${keyPrefix}-${index}`}>
      {renderInlineFormatting(line, `${keyPrefix}-${index}`)}
      {index < lines.length - 1 && <br />}
    </Fragment>
  ))
}

function FormattedMessage({ message }) {
  const blocks = parseMessageBlocks(message)

  return (
    <div className="surprise-message space-y-6 text-lg leading-9 sm:text-xl sm:leading-10">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`

        if (block.type === 'heading') {
          const Heading = headingElements[block.level]

          return (
            <Heading
              className={headingClassNames[block.level]}
              key={key}
            >
              {renderInlineFormatting(block.value, key)}
            </Heading>
          )
        }

        return (
          <p key={key}>
            {renderLines(block.lines, key)}
          </p>
        )
      })}
    </div>
  )
}

export default FormattedMessage
