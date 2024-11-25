import { useEffect,useState,useCallback } from "react";
import { Card, Layout, Page, Text, InlineError,Tabs, Spinner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import CornConfig from "../components/settings/CornConfig";
import LoginConfig from "../components/settings/LoginConfig";
import { getCustomerByShop, updateCustomer } from "../utils/models/customer";

export async function loader({ params, request }) {
  const { admin, session } = await authenticate.admin(request);
  const {shop}=session;
  let customer = await getCustomerByShop(shop);
  return customer;
}

export async function action({ request, params }) {
    const data = { ...Object.fromEntries(await request.formData())};
    let res= await updateCustomer(data);
    return res;
}

export default function settings() {
  const loaderData = useLoaderData();
  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback((selectedTabIndex) => setSelected(selectedTabIndex), [],);
  const tabs = [
    {
      id: 'tab-1',
      content: 'Configuration',
      accessibilityLabel: 'Configuration',
      panelID: 'content-1',

    },
    {
      id: 'tab-2',
      content: 'Cron Schedule',
      panelID: 'content-2',
    }
  ];


  const actionData=useActionData();
  const submit=useSubmit();
  const [customer, setCustomer] = useState();

      useEffect(() => {

  if(loaderData.status=="sucess"){
    setCustomer(loaderData.data)
  }
    
}, [])


useEffect(() => {
  console.log("actionData",actionData)
if(actionData?.status=="sucess"){
  setCustomer(actionData.data);
  shopify.toast.show("Data Updated")
}
else if(actionData?.status=="error"){
  shopify.toast.show("Try Again Later")
}
}, [actionData])


  return (
    <Page
    backAction={{url:'/app'}}
      title="Settings"
      fullWidth
    >
      <Layout>
       {
        customer ?  <Layout.Section>
        <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
       <div style={{padding:'2%'}}>
         {
            selected==0?<LoginConfig customer={customer} submit={submit}/>:<CornConfig/>
          }
       </div>
       </Tabs>
        </Card>
      </Layout.Section>:<>
      <Spinner size="large"/>
      </>
       }
      </Layout>
    </Page>
  )
}
