import { Button, Card, List, Text } from "@shopify/polaris";
import {
  PlusIcon
} from '@shopify/polaris-icons';
export default function Information() {
  return (
    <Card>
        <Text>Profill Solutions 3PL Integration app connect your woocomerce store to Profill’s store, configure the products you’d like to sell. When an end user customers will shop and purchase from your online store. The order will come to Profill for print and fulfill.</Text>
        <div style={{marginTop:'2%',marginBottom:'2%'}}>
        <Text fontWeight="bold" variant="bodyLg">Key Features:</Text>
        <List>
            <List.Item>Adds a back end menu “Profill Solutions 3PL Integration” to add POD or PPS products, lists products track incoming shipments.</List.Item>
            <List.Item>The admin can create Print on Demand ( POD ) Products, by mapping a Hit Product to a store product variant, selecting available color and size and artwork location, and uploading respective Artwork file(s).</List.Item>
            <List.Item>Admin can also create Pick Pack Ship ( PPS ) Products.</List.Item>
            <List.Item>Enables a back end menu to list Profill Products</List.Item>
            <List.Item>The admin can see a list of Products ( PPS / POD) created.</List.Item>
            <List.Item>Create a back end menu to track Order and shipments. This menu lists incoming order tracking numbers generated when an order is fulfilled at Profill end.</List.Item>
            <List.Item>The admin can select a POD / PPS product to view its details</List.Item>
            <List.Item>Auto updates print on demand products status on store end depending on the Artwork approval</List.Item>
            <List.Item>Sync Print on Demand products status on store end based on any change on Profill store</List.Item>
            <List.Item>Generates an new Store Configuration backend menu to add values for configuration and Cron Schedule.</List.Item>
        </List>
        </div>
        <div style={{marginTop:'2%'}}>
            <Button icon={PlusIcon} url="/app/store_products" variant="primary">Add New Product </Button>
        </div>
    </Card>
  )
}
