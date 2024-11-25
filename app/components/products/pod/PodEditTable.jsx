import React, { useState } from 'react'
import { Card,IndexTable,Button,Text  } from "@shopify/polaris";
import EditPodVariant from './EditPodVariant';


export default function PodEditTable({data,dbVariants,configData,submitProfill,productId,variantUpdate,variantDelete}) {
 const [dis, setdis] = useState(false)
  return (
    <Card >
      <Text variant='bodyLg' alignment='center' fontWeight='bold'>Configured Variants</Text>
    <IndexTable
      selectable={false}
      itemCount={data?.length || 0}
      headings={[
        { title: "SKU" },
        { title: "Color" },
        { title: "Size" },
        { title: "HIT SKU" },
        { title: "HIT Color" },
        { title: "HIT Size" },
        { title: "POD Price" },
        { title: "Weight" },
        { title: "UPC Code" },
        { title: "HTS Code" },
        { title: "Artfile" },
        { title: "Actions" },
      ]}
    >
       {data?.map(({ node }, index) => {
        const variantLvariant = dbVariants.find(
          (lvariant) => lvariant.variantId === node.id,
        );
        return (
          <EditPodVariant variantLvariant={variantLvariant}  variant={node} variantUpdate={variantUpdate} variantDelete={variantDelete}  productId={productId} configData={configData}   />
         
        );
      })}
    </IndexTable>
    <div style={{marginTop:'3%'}}>
      <Button variant="primary" disabled={dis} loading={dis} onClick={()=>{
        setdis(true);
        submitProfill(dbVariants)}}>Send To Profill ({data.length}) </Button>
     
    </div>
  </Card>
  )
}
