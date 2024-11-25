

import {
    IndexTable,
    LegacyCard,
    Text,
    Badge,
  } from '@shopify/polaris';
  import React from 'react';
  
  export default function LineItemTable({lineItems}) {

    const resourceName = {
      singular: 'item',
      plural: 'items',
    };
  

  
    const rowMarkup = lineItems.map(
      (
        {id, title, variantTitle, sku, quantity, originalUnitPriceSet, variant ,product       },
        index,
      ) => (
        <IndexTable.Row
          id={id}
          key={id}
          position={index}
        >
          <IndexTable.Cell>
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {title}
            </Text>
           <Text> {variantTitle}</Text>
          </IndexTable.Cell>
          <IndexTable.Cell><Text tone='success'><Badge tone='success'>{product.productType.toUpperCase()}</Badge></Text></IndexTable.Cell>
          <IndexTable.Cell>{sku}</IndexTable.Cell>
          <IndexTable.Cell>{
            variant?.metafields.nodes.find(node => node.key === "profill_sku")?.value || "N/A"
            }</IndexTable.Cell>
          <IndexTable.Cell>
            <Text >
            {quantity}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>{originalUnitPriceSet.presentmentMoney.amount}</IndexTable.Cell>
          <IndexTable.Cell>{ originalUnitPriceSet.presentmentMoney.amount * quantity}</IndexTable.Cell>
        </IndexTable.Row>
      ),
    );
  
    return (
      <LegacyCard>
        <IndexTable
          resourceName={resourceName}
          itemCount={lineItems.length}
         selectable={false}
          headings={[
            {title: 'Product'},
            {title: 'Product Type'},
            {title: 'SKU'},
            {title: 'Profill SKU'},
            {title: 'Quantity',},
            {title: 'Price'},
            {title: 'Total'},
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>
    );
  }