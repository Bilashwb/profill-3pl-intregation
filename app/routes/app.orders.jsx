import React, { useState, useEffect,useCallback  } from "react";
import {Page,Button,Text,Card,Layout, Tabs} from "@shopify/polaris";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";

import { authenticate } from "../shopify.server";
import { getOrders } from "../utils/graphql/orders";
import OrdersTable from "../components/orders/OrdersTable";
import SendOrders from "../components/orders/SendOrders";


export async function loader({ params, request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    let orders=await getOrders(admin);
    if(orders.status=="success"){
      return {
        status:"success",
        orders:orders.orders,
        pageInfo:orders.pageInfo
      }
    }
    else {
      return {
        status:"error",
        error:orders.error
      }
    }
   
  } catch (error) {
    return {
      status:"error",
      error
    };
  }
}

export async function action({ request, params }) {
    const data = { ...Object.fromEntries(await request.formData())};
    return null;
}

export default function products() {
  const loaderData = useLoaderData();
  const actionData=useActionData();
  const submit=useSubmit();
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(0);
  const [notsendorders, setnotsendorders] = useState([]);
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'Not-Ready-Orders',
      content: 'Not Ready Orders ',
      accessibilityLabel: 'Not Ready Orders ',
      panelID: 'Not-Ready-Orders',
    },
    {
      id: 'Order-Sent-to-Profill',
      content: 'Order Sent to Profill',
      panelID: 'Order-Sent-to-Profill',
    },
  ];


useEffect(() => {
const orders=loaderData.orders;

   const filterOrders = (orders) => {
    return orders.map(order => {
      const filteredLineItems = order.node.lineItems.nodes.filter(item => {
        return item.product.productType === 'pps' || item.product.productType === 'pod';
      });
      if (filteredLineItems.length > 0) {
        return {
          ...order,
          node: {
            ...order.node,
            lineItems: {
              nodes: filteredLineItems
            }
          }
        };
      }
      return null; 
    }).filter(order => order !== null); 
  };
  

  const filteredOrders = filterOrders(orders);
  setnotsendorders(filteredOrders)
}, [])

  return (
    <Page backAction={{url:''}} title="Orders" fullWidth >
        <Layout sectioned>
            <Layout.Section>
              <Card>
             <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
     
          <div style={{marginTop:'2%'}}>
          {
          selected==0?<OrdersTable orders={notsendorders}/>:<><SendOrders orders={[]}/></>
        }
          </div>
     
    </Tabs>
                </Card>
            </Layout.Section>
        </Layout>
    </Page>
  )
}
