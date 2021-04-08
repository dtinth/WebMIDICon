import React, { useContext } from 'react'
import AppConfigurationContext from './AppConfigurationContext'
import { InlineMarkdown } from './Markdown'

export function AppConfigurationEditor() {
  const context = useContext(AppConfigurationContext)
  if (!context) {
    throw new Error('No context')
  }

  const { schema } = context
  return (
    <div>
      {schema.sections.map((section, index) => {
        return (
          <section key={index}>
            <h2>{section.title}</h2>
            {Object.entries(section.properties).map(([name, descriptor]) => {
              return (
                <div>
                  <h3>{name}</h3>
                  {!!descriptor.markdownDescription && (
                    <p>
                      <InlineMarkdown text={descriptor.markdownDescription} />
                    </p>
                  )}
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}
