import React from 'react'
import styled from 'react-emotion'
import { groupBy, orderBy } from 'lodash'
import { InlineMarkdown } from './Markdown'

const categoryIndex = (name) =>
  ['instruments', 'addons'].indexOf(name) + 1 || Number.MAX_VALUE

export default function FeatureList({ features }) {
  const categories = orderBy(
    [...new Set(features.map((f) => f.category).filter((c) => c))],
    [categoryIndex, (c) => c],
    ['asc', 'asc']
  )
  const grouped = groupBy(features, 'category')
  return (
    <FeatureListContainer>
      <h2>Feature list</h2>
      <FeatureTable>
        <thead>
          <tr>
            <FeatureTH>Feature name</FeatureTH>
            <FeatureTH>Description</FeatureTH>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <React.Fragment key={cat}>
              <tr>
                <FeatureCategoryTD colSpan={2}>{cat}</FeatureCategoryTD>
              </tr>
              {grouped[cat].map((feature) => (
                <tr key={feature.name}>
                  <FeatureNameTD>
                    <strong>{feature.name}</strong>
                  </FeatureNameTD>
                  <FeatureDescriptionTD>
                    <InlineMarkdown text={feature.description} />
                  </FeatureDescriptionTD>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </FeatureTable>
    </FeatureListContainer>
  )
}

const FeatureListContainer = styled('div')`
  padding: 0 4vw 4vw;
  max-width: 960px;
  margin: 0 auto;
  > h2 {
    margin: 0 0 0.5em;
    color: #d7fc70;
  }
`

const FeatureTable = styled('table')`
  border-collapse: collapse;
  background: #252423;
  border: 2px solid #656463;
  box-shadow: 4px 4px 0 #090807;
`
const FeatureTH = styled('th')`
  border: 1px solid #656463;
  background: #656463;
  padding: 0.25em;
`
const FeatureTableCell = styled('td')`
  border: 1px solid #656463;
  padding: 0.4em;
`
const FeatureCategoryTD = styled(FeatureTableCell)`
  background: #454443;
  text-align: center;
`
const FeatureNameTD = styled(FeatureTableCell)`
  white-space: nowrap;
  vertical-align: top;
`
const FeatureDescriptionTD = styled(FeatureTableCell)`
  a {
    color: #ffb;
  }
`
