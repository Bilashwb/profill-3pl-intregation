import { Card,IndexTable,Text } from '@shopify/polaris'
import PodVariant from './PodVariant'

export default function PodAddTable({data,configData,productId,addVariant}) {
  return (
    <Card title="" sectioned>
      <Text variant='bodyLg' alignment='center' fontWeight='bold'>Variants Reamining Configuration</Text>
    <IndexTable
      selectable={false}
      itemCount={data?.length || 0}
      headings={[
        { title: "SKU" },
        { title: "Color" },
        { title: "Size" },
        { title: "Weight" },
        { title: "Hit SKU" },
        { title: "Hit SKU Color" },
        { title: "Hit SKU Size" },
        { title: "POD Price" },
        { title: "UPC Code" },
        { title: "HTS Code" },
        { title: "Art Work" },
      ]}
    >
      {data?.map(({ node }, index) => (
        <PodVariant
          key={index}
          variant={node}
          addVariant={addVariant}
          configData={configData}
          productId={productId}
        />
      ))}
    </IndexTable>
  </Card>
  )
}
