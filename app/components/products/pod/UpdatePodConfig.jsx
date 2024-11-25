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
import React from "react";
import { useState,useEffect , useCallback } from "react";
import { PlusCircleIcon, AdjustIcon, XIcon } from "@shopify/polaris-icons";
import { decorationColorsData } from "../../../utils/apis/hit";







export default function UpdatePodConfig(props) {
  const { data,handleEditConfig,handleDeleteConfig,product_id } = props;
  const [decorationOptions, setDecorationOptions] = useState([]);
  const [location, setLocation] = useState(data.location);
  const [decoration, setDecoration] = useState(data.decoration);
  const [description, setDescription] = useState(data.description);
  const [color, setColor] = useState("");
  const [colorError, setcolorError] = useState("");
  const [colorList, setColorList] = useState(data.colors.split(","));
  const [colorInputDisable, setcolorInputDisable] = useState(false);
  const handleLocation = useCallback((value) => setLocation(value), []);
  const handleDecoration = useCallback((value) => setDecoration(value), []);
  const handledescription = useCallback((value) => setDescription(value), []);
  const handleColor = useCallback((value) => setColor(value), []);



  useEffect(() => {

    const fetchDecorationColors = async (locationId) => {
      const res = await decorationColorsData({ locationId, productId: product_id });
      if (res.status === "success") {
        let temp = res.data.map(item => ({
          label: item.decorationName,
          value: item.decorationId.toString(),
        }));
        setDecorationOptions(temp);
        if (temp.length > 0) {
          setDecoration(temp[0].value);
        }
      }
    };

    fetchDecorationColors(data.locationId);
  }, [product_id]);




  const addColorToList = (newColor) => {
    setcolorError("");
    if (colorList.length == 3) setcolorInputDisable(true);
    else setcolorInputDisable(false);
    if (colorList.length < 4 && !colorList.includes(newColor)) {
      setColorList([...colorList, newColor]);
      setColor("");
    }
  };

  const removeColorFromList = (colorToRemove) => {
    setcolorInputDisable(false);
    const newList = colorList.filter((color) => color !== colorToRemove);
    setColorList(newList);
  };

  const handleSaveData = () => {
    if (colorList.length == 0) setcolorError("Please Add a Color");
   
    else {
      const selectedDecoration = decorationOptions.find(dec => dec.value === decoration);
      const decorationLabel = selectedDecoration ? selectedDecoration.label : "";

      handleEditConfig({
        ...data,
        decoration:decorationLabel,
        description,
        location,
        colors:colorList.toString()
      });
    }
  };

  const handleResetData = () => {
    handleDeleteConfig(data.id);
  };

  return (
    <div style={{ marginTop: "3%" }}>
      <Card>
        <Text alignment="center" variant="headingMd">
          Update Configuration
        </Text>
        <InlineGrid gap={"400"} columns={3}>
          <TextField
          disabled
            label="Location"
            value={location}
          />

          <Select
            label="Decoration"
            options={decorationOptions}
            onChange={handleDecoration}
            value={decoration}
          />
          <TextField
            label="Description"
            value={description}
            onChange={handledescription}
            autoComplete="off"
          />
        </InlineGrid>

        <InlineGrid columns={3} gap={"400"}>
          <div style={{ marginTop: "5%" }}>
            <Combobox
              activator={
                <Combobox.TextField
                  disabled={colorInputDisable}
                  onChange={handleColor}
                  label="Add Color"
                  labelHidden
                  value={color}
                  placeholder="Color Name or Color Code"
                  autoComplete="off"
                  error={colorError}
                />
              }
            >
              {color.length > 0 ? (
                <div style={{ marginLeft: "2%" }}>
                  <Listbox onSelect={addColorToList}>
                    <Listbox.Option value={color}>
                      <Badge icon={PlusCircleIcon}> {color} </Badge>
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
              {colorList.map((color, index) => (
                <div key={Math.random()}>
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
                icon={AdjustIcon}
                variant="primary"
                onClick={handleSaveData}
              >
                Update
              </Button>
              <Button
                icon={XIcon}
                variant="primary"
                tone="critical"
                onClick={handleResetData}
              >
                Remove
              </Button>
            </InlineStack>
          </div>
        </InlineGrid>
      </Card>
    </div>
  );
}
