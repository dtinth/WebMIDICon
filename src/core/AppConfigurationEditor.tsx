import React, { ReactNode, useContext } from 'react'
import { tw } from 'twind'
import { ConfigurationProperty, getConfiguration } from '../configuration'
import AppConfigurationContext, {
  useAppConfigurationContext,
} from './AppConfigurationContext'
import { InlineMarkdown } from './Markdown'

export function AppConfigurationEditor() {
  const context = useContext(AppConfigurationContext)
  if (!context) {
    throw new Error('No context')
  }

  const { schema } = context
  return (
    <div className={tw`p-4`}>
      <h2 className={tw`text-3xl p-2 text-#8b8685 font-bold`}>
        WebMIDICon configuration
      </h2>
      {schema.sections.map((section, index) => {
        return (
          <section key={index} className={tw`mb-8`}>
            <h2 className={tw`text-2xl pt-2 px-2 text-#d7fc70`}>
              {section.title}
            </h2>
            {Object.entries(section.properties).map(([name, descriptor]) => {
              return (
                <div className={tw`p-2 leading-normal`}>
                  <h3 className={tw`font-bold`}>
                    <ConfigurationPropertyTitle propertyName={name} />
                  </h3>
                  <ConfigurationPropertyEditor
                    propertyName={name}
                    propertyDescriptor={descriptor}
                    description={
                      descriptor.markdownDescription ? (
                        <div className={tw`opacity-75`}>
                          <InlineMarkdown
                            text={descriptor.markdownDescription}
                          />
                        </div>
                      ) : null
                    }
                  />
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}

function ConfigurationPropertyTitle({
  propertyName,
}: {
  propertyName: string
}) {
  return (
    <span>
      {propertyName
        .split('.')
        .slice(1)
        .map((title, index, array) => {
          const last = index === array.length - 1
          return (
            <span key={index} className={last ? tw`text-white` : ''}>
              {title
                .replace(/([A-Z])/g, ' $1')
                .replace(/\w/, (a) => a.toUpperCase())}
              {last ? '' : ': '}
            </span>
          )
        })}
    </span>
  )
}

function ConfigurationPropertyEditor(props: {
  propertyName: string
  propertyDescriptor: ConfigurationProperty
  description: ReactNode
}) {
  const { schema, storage } = useAppConfigurationContext()
  const value = getConfiguration(schema, storage, props.propertyName)
  if (props.propertyDescriptor.type === 'boolean') {
    return (
      <div className={tw`flex`}>
        <input type="checkbox" className={tw`mr-2`} />
        {props.description}
      </div>
    )
  }
  if (props.propertyDescriptor.type === 'string') {
    return (
      <>
        {props.description}
        <p>
          <input
            type="text"
            className={tw`p-1 bg-#090807 border border-#656463`}
            value={String(value)}
          />
        </p>
      </>
    )
  }
  return <>{props.description}</>
}
