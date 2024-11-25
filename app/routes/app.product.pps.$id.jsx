import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  Page,
  IndexTable,
  Text,
  TextField,
  InlineGrid,
  Tooltip,
  Layout,
  Badge,
  Grid,
} from "@shopify/polaris";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { getProductById, UpdateproductVariants } from "../utils/graphql/product";
import { authenticate } from "../shopify.server";
import ProductCard from "../components/products/ProductCard";
import PpsRemainVariants from "../components/products/pps/PpsRemainVariants";
import PpsAddedVariants from "../components/products/pps/PpsAddedVariants";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { getCustomerByShop } from "../utils/models/customer";
import { createPpsProduct, ppsStatus } from "../utils/apis/pps";
import { divideVariants, findMetafieldValue } from "../utils/others/helper";

export async function loader({ params, request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    const { shop } = session;
    let product = await getProductById(admin, params.id);
    let customer = await getCustomerByShop(shop);
    return { product, customer };
  } catch (error) {
    return {
      status: "error",
      error,
      product: null,
    };
  }
}

export async function action({ request, params }) {
  const { admin, session } = await authenticate.admin(request);
  const {varintsId,profill_sku,upcCode,htsCode,apparel} = { ...Object.fromEntries(await request.formData()) };
  let pid= `gid://shopify/Product/${params.id}`;
  let variants= [
    {
      id: varintsId,
      metafields: [
        {
          namespace: "profill",
          key: "upc_code",
          value: upcCode,
          type: "single_line_text_field",
        },
        {
          namespace: "profill",
          key: "hts_code",
          value: htsCode,
          type: "single_line_text_field",
        },
        {
          namespace: "profill",
          key: "profill_sku",
          value: profill_sku,
          type: "single_line_text_field",
        },
        {
          namespace: "profill",
          key: "apparel",
          value: apparel,
          type: "single_line_text_field",
        },
        {
          namespace: "profill",
          key: "status",
          value: "COMPLETED",
          type: "single_line_text_field",
        },
      ],
      inventoryItem: {tracked: true}
    },
  ]  
   let res= await UpdateproductVariants(admin,pid,variants)
  return res;
}

export default function ppsProduct() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [addedVariants, setaddedVariants] = useState([]);
  const [remainingVariants, setRemainingVariants] = useState([]);
  const [product, setproduct] = useState();
  const [customer, setCustomer] = useState();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [upcCode, setUpcCode] = useState(0);
  const [htsCode, setHtsCode] = useState(0);
  const [upcCodeError, setUpcCodeError] = useState("");
  const [htsCodeError, setHtsCodeError] = useState("");

  const submit = useSubmit();

  const handleSave = async () => {
    if (upcCode == null) {
      setUpcCodeError("UPC Code is required");
    } else {
      setUpcCodeError("");
    }

    if (htsCode ===null) {
      setHtsCodeError("HTS Code is required");
    } else {
      setHtsCodeError("");
    }


let apparelValue=findMetafieldValue(product.metafields.edges)
    const temp = {
      apparel: apparelValue == "true",
      sku: selectedVariant.sku,
      title: product.title,
      upcCode: upcCode,
      htsCode: htsCode,
      weight: selectedVariant.inventoryItem.measurement.weight.value,
      product_id: product.id,
      variant_id: selectedVariant.id,
      inventoryItem_id: selectedVariant.inventoryItem.id,
      color:
        selectedVariant.selectedOptions.find(
          (option) => option.name.toLowerCase() === "color",
        )?.value || null,
      size:
        selectedVariant.selectedOptions.find(
          (option) => option.name.toLowerCase() === "size",
        )?.value || "OSF",
    };

    let res = await createPpsProduct(customer, temp);
  
    res = await ppsStatus(customer, selectedVariant.sku);
    if(res.status=='success'){
      submit({ varintsId:selectedVariant.id,profill_sku:res.data,upcCode,htsCode,apparel: apparelValue == "true" }, { method: "post" });
    }
     
    shopify.modal.hide("pps-modal");
    setSelectedVariant(null);
    setUpcCode(0);
    setHtsCode(0);
    setUpcCodeError("");
  };

  const handleCancel = () => {
    shopify.modal.hide("pps-modal");
    setSelectedVariant(null);
    setUpcCode(0);
    setHtsCode(0);
    setHtsCodeError("");
    setUpcCodeError("");
  };

  const handleAddPps = useCallback((variant) => {
    setSelectedVariant(variant);
    shopify.modal.show("pps-modal");
  }, []);

useEffect(() => {
if(actionData?.status=="success"){
  setproduct(actionData.product)
}
}, [actionData])



  useEffect(() => {
   
   let {withMetafields,withoutMetafields}= divideVariants(loaderData.product.product.variants.edges);
    setproduct(loaderData.product.product);
    setCustomer(loaderData.customer.data);

    setaddedVariants(withMetafields);
    setRemainingVariants(withoutMetafields);
  }, [product]);

  return (
    <Page
      backAction={{ url: "/app/products" }}
      title={product?.title}
      fullWidth
    >
      {product && (
        <Layout sectioned>
          <Layout.Section>
            <Card>
              <ProductCard product={product} />
            </Card>
          </Layout.Section>
          {remainingVariants.length > 0 && (
            <Layout.Section>
              <PpsRemainVariants
                variants={remainingVariants}
                handleAddPps={handleAddPps}

              />
            </Layout.Section>
          )}
          {addedVariants.length > 0 && (
            <Layout.Section>
              <PpsAddedVariants variants={addedVariants}  />
            </Layout.Section>
          )}
        </Layout>
      )}

      <Modal id="pps-modal">
        <div style={{ padding: "2%" }}>
          <InlineGrid columns={2} gap={"200"}>
            <TextField
              label="UPC Code"
              value={upcCode}
              onChange={(value) => setUpcCode(value)}
              error={upcCodeError}
              requiredIndicator
            />
            <TextField
              label="HTS Code"
              value={htsCode}
              onChange={(value) => setHtsCode(value)}
              error={htsCodeError}
              requiredIndicator
            />
          </InlineGrid>
          {selectedVariant && (
            <>
              <div
                style={{
                  padding: "2%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Text>
                  <b>SKU: {selectedVariant.sku}</b>
                </Text>
                <Text>
                  <b>
                    {" "}
                    Weight:{" "}
                    {
                      selectedVariant.inventoryItem.measurement.weight.value
                    }{" "}
                    {selectedVariant.inventoryItem.measurement.weight.unit}{" "}
                  </b>
                </Text>
                <Text>
                  <b>Price: {selectedVariant.price}</b>
                </Text>
              </div>
              <div
                style={{
                  padding: "2%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                {selectedVariant.selectedOptions.map((option) => (
                  <Text key={Math.random()}>
                    <b>{option.name}:</b> {option.value}
                  </Text>
                ))}
              </div>
            </>
          )}
        </div>

        <TitleBar title={`Send Variant as PPS Product `}>
          <button onClick={handleSave} variant="primary">
            Save
          </button>
          <button onClick={handleCancel}>Cancel</button>
        </TitleBar>
      </Modal>
    </Page>
  );
}
