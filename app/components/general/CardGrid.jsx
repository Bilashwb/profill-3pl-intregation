import { Card, Icon, InlineGrid, Text } from '@shopify/polaris'
import React from 'react'
import {
    DeliveryFilledIcon,PrintIcon,LocationIcon
  } from '@shopify/polaris-icons';

  let data=[
    {
        title:"Shipping",
        description:"We offer standard and Expedited shipping all with fast lead times",
        icon:DeliveryFilledIcon
    },
    {
        title:"Printing",
        description:"Upload your digital art, and we will take care of the rest and start fulfilling your store orders",
        icon:PrintIcon
    },
    {
        title:"Tracking",
        description:"This App will automatically upload tracking when fulfillment is done allowing a seamless user experience",
        icon:LocationIcon
    }
  ]
export default function CardGrid() {
  return (
   <div style={{marginBottom:'2%'}}>
     <InlineGrid columns={3}  gap={'200'} >
        
    {
        data.map((i,ind)=>{return(<Card key={ind}>
            <Icon source={i.icon}/>
             <Text variant='heading2xl' alignment='center' >{i.title} </Text>
             <div style={{marginTop:'2%'}}>
             <Text >{i.description}</Text>
             </div>
         </Card>)})
    }
    </InlineGrid>
   </div>
  )
}
