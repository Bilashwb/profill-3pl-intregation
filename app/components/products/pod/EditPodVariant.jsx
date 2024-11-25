import React, { useState, useEffect } from "react";
import { IndexTable, ButtonGroup ,TextField, Select, Text, Link, DropZone, Button, Tooltip, InlineError } from "@shopify/polaris";
import { productData } from "../../../utils/apis/hit";
import { PlusIcon } from '@shopify/polaris-icons';
import { DeleteIcon, EditIcon, SaveIcon, SettingsIcon } from "@shopify/polaris-icons";
export default function EditPodVariant({ variant, deleteFun, configData, productId,variantLvariant,variantUpdate,variantDelete }) {

  const color = variant.selectedOptions.find(option => option.name.toLowerCase() === "color")?.value || "";
  const size = variant.selectedOptions.find(option => option.name.toLowerCase() === "size")?.value || "";
  const getPriceByLabel = (label) =>
    configData.find((item) => item.label === label)?.price.toString() || "Label not found";

  const [inputs, setInputs] = useState({
    id: variant.id,
    upcCode: variant.upcCode || 0,
    htsCode: variant.htsCode || 0,
    hitSku: variant.hitSku || "",
    artfileUrl: variant.artfileUrl || "",
    artfile: variant.artfile || "",
    color: color,
    size: size,
    price: variant.price || "",
    weight: `${variant.inventoryItem.measurement.weight.value} ${variant.inventoryItem.measurement.weight.unit}` || 0,
    hitsize: variant.hitsize || "",
    hitcolor: variant.hitcolor || "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (field) => async (value) => {
    if (field === "hitSku") {
      let t = await productData({ productId, partId: value });
      if(t.msg)
      shopify.toast.show(t.msg);

      if (t.status === "success") {
        setInputs((prevInputs) => ({
          ...prevInputs,
          [field]: value,
          hitsize: t.data.labelSize,
          hitcolor: t.data.colorName,
          price: getPriceByLabel(value),
        }));
      }
    } else {
      setInputs((prevInputs) => ({
        ...prevInputs,
        [field]: value,
      }));
    }
  };

  const handleFileUpload = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const fileUrl = URL.createObjectURL(file);
      setInputs((prevInputs) => ({
        ...prevInputs,
        artfile: file,
        artfileUrl: fileUrl,
      }));
    }
  };

  const savePodVariant = () => {
    if (!inputs.hitSku) {
      setError("Hit SKU is required.");
      return;
    }
    
    setError("");
    setInputs({
      id: variant.id,
      upcCode: variant.upcCode || 0,
      htsCode: variant.htsCode || 0,
      hitSku: variant.hitSku || "",
      artfileUrl: variant.artfileUrl || "",
      artfile: variant.artfile || "",
      color: color,
      size: size,
      price: variant.price || "",
      weight: `${variant.inventoryItem.measurement.weight.value} ${variant.inventoryItem.measurement.weight.unit}` || 0,
      hitsize: variant.hitsize || "",
      hitcolor: variant.hitcolor || "",
    })
    fun(inputs); 
  };

  useEffect(() => {
    const fetchProductData = async () => {
      if (variant.hitSku) {
        let t = await productData({ productId, partId: variant.hitSku });
        if (t.status === "success") {
          setInputs((prevInputs) => ({
            ...prevInputs,
            hitsize: t.data.labelSize,
            hitcolor: t.data.colorName,
            price: getPriceByLabel(variant.hitSku),
          }));
        }
      }
    };
    fetchProductData();
  }, [variant.hitSku, productId, configData]);

  return (
    <IndexTable.Row id={variant.id} key={variant.id} >
              <IndexTable.Cell>{variant.sku}</IndexTable.Cell>
              <IndexTable.Cell>
                {color}
              </IndexTable.Cell>
              <IndexTable.Cell>
                {size}
              </IndexTable.Cell>
              <IndexTable.Cell>
                {variantLvariant?.hitSku || "N/A"}
              </IndexTable.Cell>
              <IndexTable.Cell>
                {variantLvariant?.hitcolor || "N/A"}
              </IndexTable.Cell>
              <IndexTable.Cell>
                {variantLvariant?.hitsize || "N/A"}
              </IndexTable.Cell>
              <IndexTable.Cell>
                {variantLvariant?.podPrice || "N/A"}
              </IndexTable.Cell>
              <IndexTable.Cell>
                {variant.inventoryItem.measurement.weight.value}{" "}
                {variant.inventoryItem.measurement.weight.unit}
              </IndexTable.Cell>

              <IndexTable.Cell>
                {variantLvariant?.upcCode || "N/A"}
              </IndexTable.Cell>
              <IndexTable.Cell>
                {variantLvariant?.htsCode || "N/A"}
              </IndexTable.Cell>
              <IndexTable.Cell>
                {variantLvariant?.artfileUrl ? (
                  <Button
                    url={variantLvariant.artfileUrl}
                    target="_blank"
                    download
                    icon={SaveIcon}
                  >
                    Download
                  </Button>
                ) : (
                  "No file uploaded"
                )}
              </IndexTable.Cell>
              <IndexTable.Cell>
               <ButtonGroup gap="">
                {/* <Tooltip content="Edit"><Button icon={EditIcon} onClick={()=>{variantUpdate(variantLvariant)}}  ></Button></Tooltip> */}
                <Tooltip content="Delete"><Button onClick={()=>{variantDelete(variantLvariant.id)}} icon={DeleteIcon} tone="critical" ></Button></Tooltip>
               </ButtonGroup>
              </IndexTable.Cell>
            </IndexTable.Row>
  );
}
