
import {
  Tag,
  Combobox,
  Listbox,
  InlineStack,
  Select,
  TextField,
  Button,
  InlineGrid,
  Text,
  Badge,
  Card,
} from "@shopify/polaris";
import React, { useState, useCallback, useEffect } from "react";
import { PlusCircleIcon, SaveIcon, XIcon } from "@shopify/polaris-icons";
import { decorationColorsData } from "../../../utils/apis/hit";

export default function PodConfig(props) {
  const { locations, product_id,fun } = props;

  const [formData, setFormData] = useState({
    location: "",
    decoration: "",
    description: "",
    color: "",
    colorList: ["See Art"],
  });

  const [errors, setErrors] = useState({
    colorError: "",
  });

  const [mappedLocations, setMappedLocations] = useState([]);
  const [decorationOptions, setDecorationOptions] = useState([]);
  const [colorInputDisable, setColorInputDisable] = useState(false);

  useEffect(() => {
    const mappedLocations = locations.map(item => ({
      label: item.locationName,
      value: item.locationId.toString(),
    }));
    setMappedLocations(mappedLocations);
    setFormData(prevState => ({
      ...prevState,
      location: mappedLocations[0].value,
    }));

    const fetchDecorationColors = async (locationId) => {
      const res = await decorationColorsData({ locationId, productId: product_id });

      if (res.status === "success") {
        let temp = res.data.map(item => ({
          label: item.decorationName,
          value: item.decorationId.toString(),
        }));
        setDecorationOptions(temp);
        if (temp.length > 0) {
          setFormData(prevState => ({
            ...prevState,
            decoration: temp[0].value,
          }));
        }
      }
    };

    fetchDecorationColors(mappedLocations[0].value);
  }, [locations, product_id]);

  useEffect(() => {
    const fetchDecorationColors = async () => {
      const res = await decorationColorsData({ locationId: formData.location, productId: product_id });

      if (res.status === "success") {
        let temp = res.data.map(item => ({
          label: item.decorationName,
          value: item.decorationId.toString(),
        }));
        setDecorationOptions(temp);
        if (temp.length > 0) {
          setFormData(prevState => ({
            ...prevState,
            decoration: temp[0].value,
          }));
        }
      }
    };

    if (formData.location) {
      fetchDecorationColors();
    }
  }, [formData.location, product_id]);

  const handleChange = (field) => (value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const addColorToList = (newColor) => {
    setErrors(prevState => ({ ...prevState, colorError: "" }));
    if (formData.colorList.length === 3) setColorInputDisable(true);
    else setColorInputDisable(false);
    if (formData.colorList.length < 4 && !formData.colorList.includes(newColor)) {
      setFormData(prevState => ({
        ...prevState,
        colorList: [...prevState.colorList, newColor],
        color: "",
      }));
    }
  };

  const removeColorFromList = (colorToRemove) => {
    setColorInputDisable(false);
    setFormData(prevState => ({
      ...prevState,
      colorList: prevState.colorList.filter((color) => color !== colorToRemove),
    }));
  };

  const handleSaveData = () => {
    if (formData.colorList.length === 0) {
      setErrors(prevState => ({ ...prevState, colorError: "Please Add a Color" }));
    } else {
      const selectedLocation = mappedLocations.find(loc => loc.value === formData.location);
    const selectedDecoration = decorationOptions.find(dec => dec.value === formData.decoration);
    
    const locationLabel = selectedLocation ? selectedLocation.label : "";
    const decorationLabel = selectedDecoration ? selectedDecoration.label : "";
    fun({...formData,locationLabel,decorationLabel});
      setErrors(prevState => ({ ...prevState, colorError: "" }));
      setFormData(prevState => ({
        ...prevState,
        description: "",
        colorList: [],
        decoration: "",
      }));
    }
  };

  const handleResetData = () => {
    setFormData(prevState => ({
      ...prevState,
      description: "",
      colorList: [],
      color: "",
    }));
  };

  return (
    <div style={{ marginTop: "3%" }}>
      <Card>
        <Text alignment="center" variant="headingMd">
          Add New Configuration
        </Text>
        <InlineGrid gap={"400"} columns={3}>
          <Select
            label="Location"
            options={mappedLocations}
            onChange={handleChange("location")}
            value={formData.location}
          />

          <Select
            label="Decoration"
            options={decorationOptions}
            onChange={handleChange("decoration")}
            value={formData.decoration}
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={handleChange("description")}
            autoComplete="off"
          />
        </InlineGrid>

        <InlineGrid columns={3} gap={"400"}>
          <div style={{ marginTop: "5%" }}>
            <Combobox
              activator={
                <Combobox.TextField
                  disabled={colorInputDisable}
                  onChange={handleChange("color")}
                  label="Add Color"
                  labelHidden
                  value={formData.color}
                  placeholder="Color Name or Color Code"
                  autoComplete="off"
                  error={errors.colorError}
                />
              }
            >
              {formData.color.length > 0 ? (
                <div style={{ marginLeft: "2%" }}>
                  <Listbox onSelect={addColorToList}>
                    <Listbox.Option value={formData.color}>
                      <Badge icon={PlusCircleIcon}> {formData.color} </Badge>
                    </Listbox.Option>
                  </Listbox>
                </div>
              ) : (
                <></>
              )}
            </Combobox>
          </div>

          <div style={{ marginTop: "6%" }}>
            <InlineStack gap={"100"}>
              {formData.colorList.map((color, index) => (
                <div key={index}>
                  <Tag
                    style={{ backgroundColor: color }}
                    onRemove={() => removeColorFromList(color)}
                  >
                    {color}
                  </Tag>
                </div>
              ))}
            </InlineStack>
          </div>
          <div style={{ marginTop: "5%" }}>
            <InlineStack gap={"800"}>
              <Button
                icon={SaveIcon}
                variant="primary"
                tone="success"
                onClick={handleSaveData}
              >
                Save
              </Button>
              <Button
                icon={XIcon}
                variant="primary"
                tone="critical"
                onClick={handleResetData}
              >
                Clear
              </Button>
            </InlineStack>
          </div>
        </InlineGrid>
      </Card>
    </div>
  );
}
