import React, { useState, useCallback ,useEffect } from "react";
import {Page,Button,Text,Card,Layout,Tabs,Banner} from "@shopify/polaris";
import {  useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { PlusIcon} from '@shopify/polaris-icons';
import { getProductsByType } from "../utils/graphql/product";
import PodProductTable from "../components/products/pod/PodProductTable";
import PpsProductTable from "../components/products/pps/PpsProductTable";
export async function loader({ params, request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    let pps=await getProductsByType(admin,"pps");
    let pod=await getProductsByType(admin,"pod");
    if(pod.status=="error" || pps.status=="error"){
      return {
      status:"error",
      error:"Failde To Load The data"
      }
    }
    else{
      return {
        status:"success",
        pod:pod.products,
        podPageInfo:pod.pageInfo,
        pps:pps.products,
        ppsPageInfo:pps.pageInfo
      }
    }
   
  } catch (error) {
    return {
      status:"error",
      error
    };
  }
}



export default function products() {
  const loaderData = useLoaderData();
  const [ppsProducts, setppsProducts] = useState([]);
  const [podProducts, setpodProducts] = useState([]);
  const [podPageInfo, setpodPageInfo] = useState();
  const [ppsPageInfo, setppsPageInfo] = useState();
  const [data, setData] = useState();
  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );
  const tabs = [
    {
      id: 'tab-1',
      content: 'PPS Products',
      accessibilityLabel: 'All customers',
      panelID: 'panel-1',
    },
    {
      id: 'tab-2',
      content: 'POD Products',
      panelID: 'panel-2',
    }
  ];


useEffect(() => {
 if(loaderData.status=="success"){
  setppsProducts(loaderData.pps);
  setpodProducts(loaderData.pod);
  setpodPageInfo(loaderData.podPageInfo);
  setppsPageInfo(loaderData.ppsPageInfo);
 }
}, [])
if(loaderData.status=="error"){
  return (
    <Page backAction={{ url: "/app/store_products" }}>
      <Layout>
        <Layout.Section>
          <Banner status="critical" title={loaderData.error} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
  return (
    <Page backAction={{url:'/app'}} title="Products" fullWidth  primaryAction={{icon:PlusIcon,content:"Add Product",url:'/app/store_products'}}>
         <Layout>
         <Layout.Section>
          <Card>
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
     
          <div style={{marginTop:'2%',paddingLeft:'2%'}}>
          {selected==0?<PpsProductTable products={ppsProducts} pageInfo={ ppsPageInfo}/>:<PodProductTable products={podProducts} pageInfo={podPageInfo}/>}
          </div>
  
         </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
