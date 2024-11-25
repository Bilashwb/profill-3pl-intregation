import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, InlineError, Layout, Page, Spinner, Text } from "@shopify/polaris";
import LineItemTable from "../components/orders/LineItemTable";
import {SendIcon} from '@shopify/polaris-icons';
import { findMetafieldValue } from "../utils/others/helper";
import { getCustomerByShop } from "../utils/models/customer";
import { createOrder } from "../utils/apis/order";

export async function loader({ request, params }) {
  try {
    // Authenticate and retrieve session and admin access
    const { admin, session } = await authenticate.admin(request);
      const {shop}=session
    const response = await admin.graphql(`
      query GetOrderById($id: ID!) 
       {
        order(id: $id) {
          name
          shippingAddress {
            address2
            city
            country
            countryCodeV2
            address1
            formatted
            zip
          }
          billingAddress {
            address2
            city
            country
            countryCodeV2
            address1
            formatted
            zip
          }
          customAttributes {
            key
            value
          }
             metafields(first:5,namespace:"profill"){
                nodes{
                  key
                  value
                }
              }
          id
          sourceName
          note
          createdAt
          displayFulfillmentStatus
          fullyPaid
          displayFinancialStatus
          totalPriceSet {
            shopMoney {
              amount
            }
          }
          fulfillmentsCount {
            count
          }
          fulfillments {
            trackingInfo(first: 1) {
              url
              company
              number
            }
          }
          currentSubtotalLineItemsQuantity
          customer {
            email
            displayName
          }
          lineItems(first: 250) {
            nodes {
              quantity
              id
              originalUnitPriceSet{presentmentMoney{amount}}
              title
            variantTitle
              name
              variant{
              id
              metafields(first:5,namespace:"profill"){
                nodes{
                  key
                  value
                }
              }
              }
              sku
              originalUnitPriceSet {
                presentmentMoney {
                  amount
                }
              }
              product {
                productType
                metafields(first:5,keys: "type") {
                  nodes {
                    value
                  }
                }
              }
            }
          }
        }}
      
    `, 
    { variables: { "id": `gid://shopify/Order/${params.id}` } },
);

    const result = await response.json();
    let customer=await getCustomerByShop(shop);
    customer=customer.data;
    return {
      status: "success",
      data: result.data,
      customer
    };
  } catch (error) {
    console.error(error); // Log the error for debugging
    return {
      status: "error",
      error: error.message || "An error occurred while fetching data",
    };
  }
}

export default function OrderDetailsPage() {
  const { status, data, error,customer } = useLoaderData();
const [lineItems, setlineItems] = useState([])
let queue_id= findMetafieldValue(data.order.metafields.nodes,"queue_id");

  useEffect(() => {
    const filteredLineItems = data.order.lineItems.nodes.filter(item => 
      item.variant.metafields.nodes.some(mf => mf.key === "profill_sku")
  );
  setlineItems(filteredLineItems)

  }, [status]);


  const sendOrder=useCallback(async()=>{
  let res=  await createOrder(customer,data.order,lineItems);
  if(res.status=='failed'){
    console.log(res);
    shopify.toast.show("Some Itms Not Ready For Order"    )
  }
else{
  console.log(res);
}


  })
  if (status === "error") {
    return (
      <Page title="Server Error" backAction={{ url: "/app/products" }} fullWidth>
        <Layout>
          <Layout.Section>
            <Card>
              <InlineError message={error} />
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }


  return (
    <Page title={`${data.order.name} Order Details `} backAction={{ url: "/app/orders" }} 
    fullWidth  
   >
      <Layout>
      {data && data.order ? (
             
             
            <>
             <Layout.Section key={"order_info"} variant="oneThird">
<Card>
<div>
                <h2>{data.order.name}</h2>
                <p><strong>Payment Status:</strong> {data.order.displayFinancialStatus}</p>
                <p><strong>Total Price:</strong> {data.order.totalPriceSet.shopMoney.amount} {data.order.totalPriceSet.shopMoney.currencyCode}</p>
                

                <Text fontWeight="bold" variant="bodyMd">Shipping Address</Text>
                <address>{data.order.shippingAddress.formatted}</address>
  
             
              </div>
</Card>
             </Layout.Section>
             <Layout.Section key="add_info" variant="oneThird">
                <Card>
                <Text fontWeight="bold" variant="bodyMd" alignment="center">Customer Details</Text>
                <p><strong>Name:</strong> {data.order.customer.displayName}</p>
                <p><strong>Email:</strong> {data.order.customer.email}</p>
                <Text fontWeight="bold" variant="bodyMd">Billing Address</Text>
                <address>{data.order.billingAddress.formatted}</address>
                </Card>
             </Layout.Section>
             <Layout.Section key={"profill_info"} variant="oneThird">
                <Card>
                <Text alignment="center" fontWeight="bold">Profill Order Details</Text>
                    <Text>Profill Queue ID : </Text>
                    <Text>Order Number : </Text>
                    <Text>Order Origin : {data.order.sourceName}</Text>
                </Card>
             </Layout.Section>
             <Layout.Section variant="fullWidth">
                <Card>
                <div style={{marginTop:'1%',marginBottom:'2%'}}>
                <Text alignment="center" variant="headingMd">Profill Line Items</Text>
                </div>
                <LineItemTable lineItems={lineItems}/>

                </Card>
             </Layout.Section>
             
            </>
            
            ) : (
                <Layout.Section >
                <Card>
                <Text>No order data found</Text>
                </Card>
              </Layout.Section>
              
            )}

    <Layout.Section>
    {
      lineItems.length>0 && !queue_id && <Button onClick={sendOrder} icon={SendIcon} variant="primary" >Send Order To Profill</Button>
    }
    </Layout.Section>
      </Layout>
    </Page>
  );
}
