import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
  Button,
} from '@shopify/polaris';
import React from 'react';

import {
  ViewIcon
} from '@shopify/polaris-icons';


export default function OrdersTable({orders}) {

  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };



  const rowMarkup = orders.map(
    (
      {node},
      index,
    ) => (
      <IndexTable.Row
        id={node.id}
        key={node.id}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {node.id.slice(20)}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{node.name}</IndexTable.Cell>
        <IndexTable.Cell>{node.sourceName}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text >
            {new Date(node.createdAt).toLocaleDateString('en-GB')}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{node.totalPriceSet.shopMoney.amount}</IndexTable.Cell>
        <IndexTable.Cell> <Badge progress="incomplete">{node.displayFulfillmentStatus}</Badge> </IndexTable.Cell>
        <IndexTable.Cell>
        <Badge progress="complete">{node.displayFinancialStatus}</Badge> </IndexTable.Cell>
        <IndexTable.Cell><Button icon={ViewIcon} url={'/app/order/'+node.id.slice(20)}></Button></IndexTable.Cell>
        
      </IndexTable.Row>
    ),
  );

  return (
    <LegacyCard>
      <IndexTable
        resourceName={resourceName}
        itemCount={orders.length}
        selectable={false}
        headings={[
          {title: 'Order Id'},
          {title: 'Order Number'},
          {title: 'Order Origin'},
          {title: 'Order Date'},
          {title: 'Total'},
          {title: 'Fulfillment Status'},
          {title: 'Payment status'},
          {title: 'Action'},
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </LegacyCard>
  );
}