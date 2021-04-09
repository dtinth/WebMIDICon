import React from 'react'
import MarkdownIt from 'markdown-it'

const md = MarkdownIt()

const renderMarkdown = (markdown: string) => ({
  __html: md.renderInline(markdown),
})

export function InlineMarkdown({ text }: { text: string }) {
  return <span dangerouslySetInnerHTML={renderMarkdown(text)} />
}
