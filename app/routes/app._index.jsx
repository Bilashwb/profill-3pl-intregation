import { useState, useEffect } from "react";
import { Page, Card, Layout } from "@shopify/polaris";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";

import { authenticate } from "../shopify.server";
import { createCustomer, getCustomerByShop } from "../utils/models/customer";

import GeneralInfo from "../components/general/GeneralInfo";
import LoginForm from "../components/login/LoginForm";
export async function loader({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    const { shop } = session;
    let customer = await getCustomerByShop(shop);
    if (customer.status == "notfound") {
      return { customer: null };
    } else return { customer: customer.data };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

export default function App() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const [customer, setCustomer] = useState();
  
  useEffect(() => {
    if (actionData?.status == "sucess") {
      setCustomer(actionData.data);
    } else {
      setCustomer(loaderData.customer);
    }
  }, [actionData]);

  return (
    <Page
      title={customer ? "General Information" : "Login Profill Account"}
      fullWidth
    >
      <Layout sectioned>
        <Layout.Section>
          {customer ? (
            <Card>
              <GeneralInfo />
            </Card>
          ) : (
            <Card>
              <LoginForm addCustomer={submit} />
            </Card>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export async function action({ request }) {
  const formData = Object.fromEntries(await request.formData());
  const { customer_id, credential, prefix, shop } = formData;
  if (!customer_id || !credential) {
    return { error: "Customer ID and Password are required." };
  } else {
    let customer = await createCustomer({
      customer_id: parseInt(customer_id),
      credential,
      prefix,
      shop,
      environment: 0,
    });
    return customer;
  }
}
