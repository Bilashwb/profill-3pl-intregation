import React, { useCallback, useState, useEffect } from "react";
import {
  Page,
  Button,
  Banner,
  Card,
  Layout,
  InlineStack,
  Checkbox,
  TextField,
} from "@shopify/polaris";
import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { getProductById, UpdateProduct } from "../utils/graphql/product";
import { authenticate } from "../shopify.server";
import { validateVariants } from "../utils/others/helper";
import { EditIcon, SettingsIcon, SendIcon } from "@shopify/polaris-icons";
import ProductVariants from "../components/products/ProductVariants";
import ProductCard from "../components/products/ProductCard";
import { availableLocationsData } from "../utils/apis/hit";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
export async function loader({ params, request }) {
  try {
    const { admin } = await authenticate.admin(request);
    let product = await getProductById(admin, params.id);
    return product;
  } catch (error) {
    return {
      status: "error",
      error,
      product: null,
    };
  }
}

export async function action({ request, params }) {
  const { admin } = await authenticate.admin(request);
  const data = { ...Object.fromEntries(await request.formData()) };
  const { type, apparel, hitsku } = data;
  console.log(data);

  if (type === "pod") {
    const inp = {
      id: `gid://shopify/Product/${params.id}`,
      productType: "POD",
      metafields: [
        {
          namespace: "profill",
          key: "apparel",
          value: apparel,
          type: "single_line_text_field",
        },
        {
          namespace: "profill",
          key: "hitsku",
          value: hitsku,
          type: "single_line_text_field",
        },
        {
          namespace: "profill",
          key: "product_type",
          value: "POD",
          type: "single_line_text_field",
        },
      ],
    };
    
    await UpdateProduct(admin, inp);
    return redirect("/app/product/pod/" + params.id);
  } else if (type === "pps") {
    const inp = {
      id: `gid://shopify/Product/${params.id}`,
      productType: "PPS",
      metafields: [
        {
          namespace: "profill",
          key: "apparel",
          value: apparel,
          type: "single_line_text_field",
        },
        {
          namespace: "profill",
          key: "product_type",
          value: "PPS",
          type: "single_line_text_field",
        },
      ],
    };
    await UpdateProduct(admin, inp);
    return redirect("/app/product/pps/" + params.id);
  }

  return null;
}

export default function productPage() {
  const { product } = useLoaderData();

  const actionData = useActionData();
  const submit = useSubmit();
  const [hitsku, setHitsku] = useState();
  const [hitskuerror, setHitSkuerror] = useState("");
  const [isApparel, setIsApparel] = useState(false);

  const validationErrors = validateVariants(product.variants.edges);

  const hasColorOption = product.variants.edges.some(({ node }) =>
    node.selectedOptions.some(
      (option) => option.name.toLowerCase() === "color",
    ),
  );
  const hasSizeOption = product.variants.edges.some(({ node }) =>
    node.selectedOptions.some((option) => option.name.toLowerCase() === "size"),
  );

  const handlePps = useCallback(() => {
    shopify.modal.show("pps-modal");
  });
  const handlePod = useCallback(() => {
    shopify.modal.show("pod-modal");
  });
  const handleSkuInput = useCallback(async () => {
    let res = await availableLocationsData(hitsku);
    if (res.status == "failed") {
      setHitSkuerror(res.msg);
    } else {
      setHitSkuerror();

      submit(
        { type: "pod", apparel: isApparel, hitsku: hitsku },
        { method: "post" },
      );
      shopify.modal.hide("pod-modal");
      setspine(true);
    }
  });

  useEffect(() => {
  
  }, []);

  if (!product) {
    return (
      <Page backAction={{ url: "/app/store_products" }}>
        <Layout>
          <Layout.Section>
            <Banner status="critical" title="Product not found" />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  return (
    <Page
      backAction={{ url: "/app/store_products" }}
      title={product?.title}
      fullWidth
    >
      <Layout sectioned>
        <Layout.Section>
          <Card>
            {validationErrors.length > 0 || !hasColorOption ? (
              <>
                {validationErrors.map((v, index) => (
                  <Banner key={index} tone="critical" title={v} />
                ))}
                {!hasColorOption && (
                  <Banner
                    tone="critical"
                    title="Product must have a color option to proceed."
                  />
                )}
                <div style={{ padding: "1%" }}>
                  <Button
                    url={`shopify:admin/products/${product.id.substr(22)}`}
                    target="_blank"
                    variant="plain"
                    icon={EditIcon}
                    external
                  >
                    Edit product
                  </Button>
                </div>
              </>
            ) : (
              <>
                <ProductCard product={product} />
                <div style={{ marginTop: "2%" }}>
                  <ProductVariants variants={product.variants.edges} />
                </div>
                <div style={{ marginTop: "2%" }}>
                  <Card title="Customization Options">
                    <InlineStack align="center" gap={"400"}>
                      <Checkbox
                        label="It's an Apparel Product"
                        checked={isApparel}
                        onChange={setIsApparel}
                      />
                      {hasColorOption && hasSizeOption && (
                        <>
                          <Button
                            onClick={handlePod}
                            variant="primary"
                            icon={SettingsIcon}
                          >
                            Configure
                          </Button>
                          <Button
                            onClick={handlePps}
                            variant="primary"
                            icon={SendIcon}
                          >
                            Send to Profill
                          </Button>
                        </>
                      )}
                      {hasColorOption && !hasSizeOption && (
                        <Button
                          onClick={handlePps}
                          variant="primary"
                          icon={SendIcon}
                        >
                          Send to Profill
                        </Button>
                      )}
                    </InlineStack>
                  </Card>
                </div>
              </>
            )}
          </Card>
        </Layout.Section>
      </Layout>
      <Modal id="pod-modal">
        <div style={{ padding: "2%" }}>
          <div style={{ paddingBottom: "2%" }}>
            <Checkbox
              label="It's an Apparel Product"
              checked={isApparel}
              onChange={setIsApparel}
            />
          </div>

          <TextField
            label="Enter HIT product number"
            value={hitsku}
            onChange={setHitsku}
            placeholder="Hit Product Number"
            error={hitskuerror}
          />
        </div>

        <TitleBar title="Configure Pod Product">
          <button variant="primary" onClick={handleSkuInput}>
            Next
          </button>
          <button
            onClick={() => {
              setHitsku("");
              setHitSkuerror("");
              shopify.modal.hide("pod-modal");
            }}
          >
            Cancel
          </button>
        </TitleBar>
      </Modal>
      <Modal id="pps-modal">
        <div
          style={{
            padding: "2%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h5 style={{ fontWeight: "bold" }}>{product.title}</h5>
          {isApparel ? (
            <p style={{ color: "green" }}>It's an Apparel Product</p>
          ) : (
            <></>
          )}
        </div>

        <TitleBar title="Confirm To Send Pps Product">
          <button
            variant="primary"
            onClick={() => {
              shopify.modal.hide("pps-modal");
              submit({ type: "pps", apparel: isApparel }, { method: "post" });
            }}
          >
            Yes
          </button>
          <button onClick={() => shopify.modal.hide("pps-modal")}>
            Cancel
          </button>
        </TitleBar>
      </Modal>
    </Page>
  );
}
