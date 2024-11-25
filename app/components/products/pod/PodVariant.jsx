import React, { useState, useEffect } from "react";
import { IndexTable, TextField, Select, Text, Link, DropZone, Button, Tooltip, InlineError } from "@shopify/polaris";
import { productData } from "../../../utils/apis/hit";
import { PlusIcon } from '@shopify/polaris-icons';

export default function PodVariant({ variant, addVariant, configData, productId }) {

  const color = variant.selectedOptions.find(option => option.name.toLowerCase() === "color")?.value || "";
  const size = variant.selectedOptions.find(option => option.name.toLowerCase() === "size")?.value || "";
  const getPriceByLabel = (label) =>
    configData.find((item) => item.label === label)?.price.toString() || "Label not found";
  const [dis, setdis] = useState(true)
  const [inputs, setInputs] = useState({
    id: variant.id,
    upcCode: variant.upcCode || 0,
    htsCode: variant.htsCode || 0,
    hitSku: variant.hitSku || "",
    artfileUrl: variant.artfileUrl || "",
    artfile: variant.artfile || "",
    color: color,
    size: size,
    price: '',
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
        setdis(false)
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
    const variantInput = {
      id: variant.id,
      upcCode: variant.upcCode || 0,
      htsCode: variant.htsCode || 0,
      hitSku: variant.hitSku || "",
      artfileUrl: variant.artfileUrl || "",
      artfile: variant.artfile || "",
      color: color,
      size: size,
      price: 0,
      weight: `${variant.inventoryItem.measurement.weight.value} ${variant.inventoryItem.measurement.weight.unit}` || 0,
      hitsize: variant.hitsize || "",
      hitcolor: variant.hitcolor || "",
    }
    setInputs(variantInput);
    addVariant(inputs);
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
    <IndexTable.Row>
      <IndexTable.Cell>{variant.sku}</IndexTable.Cell>
      <IndexTable.Cell>{inputs.color}</IndexTable.Cell>
      <IndexTable.Cell>{inputs.size}</IndexTable.Cell>
      <IndexTable.Cell>{inputs.weight}</IndexTable.Cell>

      <IndexTable.Cell>
        <Select
        error={error}
          requiredIndicator
          options={configData}
          value={inputs.hitSku}
          onChange={handleInputChange("hitSku")}
        />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text>{inputs.hitcolor}</Text>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <Text>{inputs.hitsize}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text>{inputs.price}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <TextField
          requiredIndicator
          value={inputs.upcCode}
          onChange={handleInputChange("upcCode")}
          autoComplete="off"
        />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <TextField
          value={inputs.htsCode}
          onChange={handleInputChange("htsCode")}
          autoComplete="off"
        />
      </IndexTable.Cell>

      <IndexTable.Cell>
        <div style={{ width: 40, height: 40 }}>
          <DropZone onDrop={handleFileUpload}>
            <DropZone.FileUpload />
          </DropZone>
          {
            inputs.artfileUrl &&
            <Link url={inputs.artfileUrl} target="_blank">View</Link>
          }
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
       
        <Tooltip content="Save">
          <Button disabled={dis}  onClick={savePodVariant} primary icon={PlusIcon}></Button>
        </Tooltip>
      </IndexTable.Cell>
    </IndexTable.Row>
  );
}
