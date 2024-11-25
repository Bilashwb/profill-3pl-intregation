import React, { useState, useEffect } from "react";
import {Page,Button,Text,Card,Layout, InlineError} from "@shopify/polaris";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";

import { authenticate } from "../shopify.server";
import { getPrevProducts, getProducts ,getNextProducts} from "../utils/graphql/product";
import ProductTable from "../components/products/ProductTable";


export async function loader({ params, request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    let res=await getProducts(admin);
    return res;
  } catch (error) {
    return {
      status:"error",
      error
    };
  }
}

export async function action({ request, params }) {
  const { admin, session } = await authenticate.admin(request);
    const data = { ...Object.fromEntries(await request.formData())};
    if(data.type=="nextPage"){
      const dt=  await  getNextProducts(admin,data.cursor);
      return dt;
    }
    else if(data.type=="prevPage"){
      const dt=  await  getPrevProducts(admin,data.cursor);
      return dt;
    }
    return null;
}

export default function products() {
  const loaderData = useLoaderData();
  const actionData=useActionData();
  const submit=useSubmit();
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState();

useEffect(() => {
  console.log(loaderData)
    if(loaderData.status=="success"){
      setProducts(loaderData.products);
      setPageInfo(loaderData.pageInfo);
    }
}, [])


useEffect(() => {
if(actionData?.status=="success"){
  console.log("Use Acy",actionData)
      setProducts(actionData.products);
      setPageInfo(actionData.pageInfo);
}
}, [actionData])

if(loaderData.status=="error"){
  return (
    <Page backAction={{url:'/app/products'}} title="Internal Server Error " fullWidth >
        <Layout sectioned>
            <Layout.Section>
               <InlineError message={loaderData.error}></InlineError>
            </Layout.Section>
        </Layout>
    </Page>
  )
}
  return (
    <Page backAction={{url:'/app/products'}} title="Store Product List" fullWidth >
        <Layout sectioned>
            <Layout.Section>
                <Card>
                <ProductTable products={products} pageInfo={pageInfo} fun={submit}/>
                </Card>
            </Layout.Section>
        </Layout>
    </Page>
  )
}
