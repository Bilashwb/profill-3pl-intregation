import {
    Card,
    Text,
    InlineGrid,
    Badge,
    Thumbnail,
 
  } from "@shopify/polaris";
export default function ProductCard({product}) {
  const apparelValue =
  product.metafields.edges.find(
    (mf) => mf.node.namespace === "profill" && mf.node.key === "apparel",
  )?.node.value || null;

  return (
    <InlineGrid columns={2} gap={"200"}>
    <Card>
      <Text variant="headingLg">
        {product?.title}{" "} {
              apparelValue? <Badge size="small" tone="success">Apparel</Badge>:<></>
             }
      </Text>
      <div style={{ marginTop: "2%", marginBottom: "2%" }}>
        <InlineGrid columns={2} gap={"300"}>
          <Text variant="bodyMd" fontWeight="bold">
            Product Type:{" "}
            <Badge tone="info">
              {product.productType.toUpperCase()}
            </Badge>
          </Text>
          <Text variant="bodyMd" fontWeight="bold">
            Status: <Badge tone="attention">{product.status}</Badge>
          </Text>
        </InlineGrid>
      </div>

      <Text>{product.description}</Text>
    </Card>
    <div>
      {product.featuredImage && (
        <Card>
          <Thumbnail 
          source={product?.featuredImage?.originalSrc}/>
        
        </Card>
      )}
    </div>
  </InlineGrid>
  )
}
