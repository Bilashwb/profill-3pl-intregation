import { Card,IndexTable,Button,Text, Badge  } from "@shopify/polaris";
import {
  EyeCheckMarkIcon
} from '@shopify/polaris-icons';
import { findMetafieldValue } from "../../../utils/others/helper";
export default function PodCompleteTable({data,dbVariants}) {
  return (
    <Card title="" sectioned>
      <Text>Variants with Configuration</Text>
    <IndexTable
      selectable={false}
      itemCount={data?.length || 0}
      headings={[
        { title: "SKU" },
        { title: "Color" },
        { title: "Size" },
        { title: "HIT SKU" },
        { title: "HIT Color" },
        { title: "HIT Size" },
        { title: "POD Price" },
        { title: "Weight" },
        { title: "UPC Code" },
        { title: "HTS Code" },
        { title: "Artfile" },
        { title: "Profill SKU" },
        { title: "Profill Status" },
      ]}
    >
       {data?.map(({ node }, index) => {
        const variantLvariant = dbVariants.find(
          (lvariant) => lvariant.variantId === node.id,
        );
        const color = node.selectedOptions.find(option => option.name.toLowerCase() === "color")?.value || "";
        const size = node.selectedOptions.find(option => option.name.toLowerCase() === "size")?.value || "";

        return (
          <IndexTable.Row>
      <IndexTable.Cell>  {node.sku}  </IndexTable.Cell>
      <IndexTable.Cell>  {color}  </IndexTable.Cell>
      <IndexTable.Cell>  {size}  </IndexTable.Cell>
      <IndexTable.Cell>  {variantLvariant.hitSku}  </IndexTable.Cell>
      <IndexTable.Cell>  {variantLvariant.hitcolor}  </IndexTable.Cell>
      <IndexTable.Cell>  {variantLvariant.hitsize}  </IndexTable.Cell>
      <IndexTable.Cell>  {variantLvariant.podPrice}  </IndexTable.Cell>
      <IndexTable.Cell>  {"Weight"}  </IndexTable.Cell>
      <IndexTable.Cell>  {variantLvariant.upcCode}  </IndexTable.Cell>
      <IndexTable.Cell>  {variantLvariant.htsCode}  </IndexTable.Cell>
      <IndexTable.Cell> {variantLvariant.artfileUrl?<Button url={variantLvariant.artfileUrl} target="_blank" icon={EyeCheckMarkIcon}></Button>:"N/A"} </IndexTable.Cell>
      <IndexTable.Cell>{findMetafieldValue(node.metafields.edges,"profill_sku")}</IndexTable.Cell>
      <IndexTable.Cell><Badge tone="success" >Completed</Badge></IndexTable.Cell>
          </IndexTable.Row>
        
         
        );
      })}
    </IndexTable>
  </Card>
  )
}
