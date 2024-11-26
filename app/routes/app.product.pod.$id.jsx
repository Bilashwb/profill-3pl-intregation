import { redirect, useLoaderData, useSubmit } from "@remix-run/react";
import { Button, Card, Select, Badge , Layout, Page, TextField, Text, InlineGrid, Tooltip, ButtonGroup } from "@shopify/polaris";
import { useState, useEffect } from 'react';
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { getProductById, UpdateProduct  } from "../utils/graphql/product";
import { availableLocationsData } from "../utils/apis/hit";
import PodConfig from "../components/products/pod/PodConfig";
import UpdatePodConfig from "../components/products/pod/UpdatePodConfig";

export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);
  const productId = params.id;
  const configs = await db.podConfigs.findMany({ where: { productId: productId } });

 

  try {
    const product = await getProductById(admin, params.id);
    return { product: product.product, configs };
    
  } catch (error) {
    console.error('Error fetching product:', error.message);
    return { product: null, configs: null };
  }
}

export default function ProductPage() {
  const { product, configs: initialConfigs } = useLoaderData();
  console.log(product);
  const submit = useSubmit();
  const apparelValue =
  product.metafields.edges.find(
    (mf) => mf.node.namespace === "profill" && mf.node.key === "apparel",
  )?.node.value || null;
  const [sku, setSku] = useState('');
  const [metafieldId, setMetafieldId] = useState(null);
  const [configs, setConfigs] = useState(initialConfigs);
  const [remainingLocations, setRemainingLocations] = useState([]);

  useEffect(() => {
    const fetchAvailableLocations = async () => {
      const locationsData = await availableLocationsData(sku);
      const locationIdsInA2 = new Set(initialConfigs.map(item => parseInt(item.locationId)));
      const remaining = locationsData.data.filter(item => !locationIdsInA2.has(item.locationId));
      setRemainingLocations(remaining);
    };

    if (sku) {
      fetchAvailableLocations();
    }
  }, [sku, configs,submit,initialConfigs]);

  useEffect(() => {
    if (product && product.variants.edges.length > 0) {
      const hitskuMetafield = product.metafields.edges.find(metafield => metafield.node.key === 'hitsku');
      if (hitskuMetafield) {
        setSku(hitskuMetafield.node.value);
        setMetafieldId(hitskuMetafield.node.id);
      }
    }
  }, [product]);

  const handleSkuChange = (value) => {
    setSku(value);
  };

  const handleUpdateSku = async () => {
    const formData = new FormData();
    formData.append('actionType', 'updateSku');
    formData.append('sku', sku);
    formData.append('productId', product.id);
    formData.append('metafieldId', metafieldId);
    let res = await availableLocationsData(sku);

    if (res.status == "success") {
      submit(formData, { method: 'post' });
      shopify.toast.show("Product Number Updated");
    } else {
      shopify.toast.show("Invalid Product Number");
    }
  };

  const handleDeleteConfig = async (configId) => {
    const formData = new FormData();
    formData.append('actionType', 'deleteConfig');
    formData.append('configId', configId);
    submit(formData, { method: 'post' });
  };

  const handleEditConfig = (config) => {
   const formData = new FormData();
   formData.append('actionType', 'updateConfig');
   formData.append('id', config.id);
   formData.append('description', config.description);
   formData.append('decoration', config.decoration);
   formData.append('colors', config.colors);
   submit(formData, { method: 'post' });
  };



  const handleAddConfig = (data) => {
    const formData = new FormData();
    formData.append('actionType', 'addConfig');
    formData.append('productId', product.id.substr(22));
    formData.append('location', data.locationLabel );
    formData.append('locationId', data.location);
    formData.append('colors', data.colorList.toString());
    formData.append('decoration', data.decorationLabel);
    formData.append('description', data.description);
    submit(formData, { method: 'post' });
  };


  return (
    <Page title={"Edit "+product.title} backAction={{url:'/app/products'}}>
      <Layout>
        <Layout.Section variant="oneHalf">

          <Card >
            <Text variant="headingLg">{product?.title}  {
              apparelValue? <Badge size="small" tone="success">Apparel</Badge>:<></>
             }</Text> 
             <div style={{marginTop:'2%',marginBottom:'2%'}}>
             <InlineGrid columns={2} gap={"300"}>
              <Text variant="bodyMd" fontWeight="bold">
                Product Type: <Badge tone="info">{product.productType.toUpperCase()}</Badge>
              </Text>
              <Text variant="bodyMd" fontWeight="bold" >
                Status: <Badge tone="attention">{product.status}</Badge>
              </Text>
              </InlineGrid>
             </div>
              
             
              
              <Text>
              <div>
                <InlineGrid columns={2} gap={"200"}>
                {product.featuredImage && (
                    <img src={product.featuredImage.originalSrc} alt={product.title} width="50%" />
                  )}
                  <Text>
                    {product.description}
                  </Text>
                </InlineGrid>
                 
                </div>
              </Text>
              
              
             
            </Card>

        </Layout.Section>
        <Layout.Section variant="oneHalf">
          <Card>
          <Card>
                  
                <div>
                  <TextField
                    label="Hit Product Number"
                    value={sku}
                    onChange={handleSkuChange}
                    autoComplete="off"
                    helpText={""}
                    connectedRight={<Button variant="primary" onClick={handleUpdateSku} primary>Update SKU</Button>}
                  />
                  <Text variant="" tone="critical" fontWeight="bold">Update Hit Product Number You Lose All Configuration Data</Text>
                </div>
                  </Card>
          </Card>
        </Layout.Section>

        {initialConfigs.length > 0 && (
          <Layout.Section>
            {initialConfigs.map((i)=>{
              return <UpdatePodConfig  data={i}  handleDeleteConfig={handleDeleteConfig}
              handleEditConfig={handleEditConfig} product_id={sku}
              
              />
            })}
            
          </Layout.Section>
        )}

        {remainingLocations.length > 0 && (
          <Layout.Section>
            <PodConfig fun={handleAddConfig}  locations={remainingLocations} product_id={sku}/>
          </Layout.Section>
        )}


{initialConfigs.length > 0 &&
      <Layout.Section>
        <div style={{marginBottom:'2%'}}>
        <Button url={`/app/artfile/${product.id.substr(22)}`} variant="primary">Next</Button>
        </div>
        </Layout.Section>
      }


      </Layout>
    </Page>
  );
}

export async function action({ request,params }) {



  const formData = await request.formData();


  const actionType = formData.get("actionType");
  const configId = formData.get("configId");
  const sku = formData.get("sku");
  const productId = formData.get("productId");
  const metafieldId = formData.get("metafieldId");

  if (actionType === 'updateSku') {
    const { admin } = await authenticate.admin(request);
   let r= await db.podConfigs.deleteMany({ where: { productId: params.id } });
  
    await UpdateProduct(admin, {
      id: "gid://shopify/Product/"+params.id,
      metafields: [
        {
          namespace: "profill",
          key: "hitsku",
          value: sku,
          type: "single_line_text_field",
        }
      ]
    });
  } 
  else if (actionType === 'addConfig') {
    const productId=formData.get("productId");
    const location=formData.get("location");
    const locationId=formData.get("locationId");
    const colors=formData.get("colors");
    const decoration=formData.get("decoration");
    const description=formData.get("description");


  await db.podConfigs.create({data:{productId,colors,decoration,description,location,locationId}});
  }
  
  else if (actionType === 'deleteConfig') {
    await db.podConfigs.delete({ where: { id: parseInt(configId) } });
  }

  else if (actionType === 'updateConfig') {
    const id=formData.get("id");
    const description=formData.get("description");
    const decoration=formData.get("decoration");
    const colors=formData.get("colors");

    await db.podConfigs.update({
      where: { id: parseInt(id) },
      data: {
        colors: colors,
        description: description,
        decoration: decoration, 
      }
    });
  }

 return null
}
