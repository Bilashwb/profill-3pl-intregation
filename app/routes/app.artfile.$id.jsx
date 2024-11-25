import React, { useState, useEffect } from "react";
import {
  Page,
  Button,
  Text,
  IndexTable,
  Card,
  Spinner,
  Layout,
} from "@shopify/polaris";
import db from "../db.server";

import { configurationAndPricingData } from "../utils/apis/hit";
import { authenticate } from "../shopify.server";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";

import PodConfigTable from "../components/products/pod/PodConfigTable";
import PodCompleteTable from "../components/products/pod/PodCompleteTable";
import PodEditTable from "../components/products/pod/PodEditTable";
import PodAddTable from "../components/products/pod/PodAddTable";
import {
  getProductById,
  UpdateproductVariants,
} from "../utils/graphql/product";
import { getPodConfigs } from "../utils/models/podConfigs";
import { getPodVariantByProductId } from "../utils/models/podVariants";
import { getCustomerByShop } from "../utils/models/customer";
import { createPodProduct } from "../utils/apis/pod";
export async function loader({ params, request }) {
  try {
    const { admin } = await authenticate.admin(request);
    const productId = params.id;
    const configs = await db.podConfigs.findMany({
      where: { productId: productId },
    });
    const dbVariants = await db.podVariants.findMany({
      where: { productId: productId },
    });

    const product = await getProductById(admin, params.id);
    return { product: product.product, configs, dbVariants };
  } catch (error) {
    console.error("Error fetching product:", error.message);
    return { product: null, configs: null, dbVariants: null };
  }
}

export default function ParentComponent() {
  const loaderData = useLoaderData();
  const actionData = useActionData();

  const submit = useSubmit();

  const [product, setproduct] = useState(null);

  const [hitSKu, sethitSKu] = useState("");
  const [options, setOptions] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [dbVariants, setdbVariants] = useState([]);
  const [cofigsComplete, setcofigsComplete] = useState(false);
  const [completeVariants, setcompleteVariants] = useState([]);
  const [addedVariants, setaddedVariants] = useState([]);
  const [remainingVariants, setRemainingVariants] = useState([]);

  const updateConfig = async (data) => {
    let fileName = "";
    let fileUrl = "";
    if (data.file) {
      const formData = new FormData();
      formData.append("artfile", data.file.file);
      let res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      res = await res.json();
      fileName = res.fileName;
      fileUrl = res.fileUrl;
      let fd = new FormData();
      fd.append("artfile", fileName);
      fd.append("artfileUrl", fileUrl);
      fd.append("id", data.id);
      fd.append("reqtype", "config");
      submit(fd, { method: "POST" });
    }
  };

  const submitProfill = () => {
    const formData = new FormData();
    formData.append("reqtype", "sendProfill");
    submit(formData, { method: "post" });
  };


  const variantDelete = (data) => {
    const formData = new FormData();
    formData.append("reqtype", "vdelete");
    formData.append("id", data);
    submit(formData, { method: "post" });
  };

  const addVariant = async (data) => {
    console.log(data);
    const fd = new FormData();
    let fileName = "";
    let fileUrl = "";
    if (data.artfile) {
      const formData = new FormData();
      formData.append("artfile", data.artfile);
      let res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      res = await res.json();
      fileName = res.fileName;
      fileUrl = res.fileUrl;
    }

    fd.append("reqtype", "vadd");
    fd.append("upcCode", data.upcCode);
    fd.append("htsCode", data.htsCode);
    fd.append("hitSku", data.hitSku);
    fd.append("artfile", fileName);
    fd.append("artfileUrl", fileUrl);
    fd.append("hitsize", data.hitsize);
    fd.append("hitcolor", data.hitcolor);
    fd.append("variantId", data.id);
    fd.append("podPrice", data.price);

    submit(fd, { method: "POST" });
  };

  useEffect(() => {
    let variants = loaderData.product.variants.edges;
    setproduct(loaderData.product);
    const addedVariantIds = loaderData.dbVariants.map((item) => item.variantId);
    const hasProfillSku = (variant) => {
      return variant.node.metafields.edges.some(
        (metafield) => metafield.node.key === "profill_sku",
      );
    };
    let completeData = [];
    let notInAddedVariants = [];
    let inAddedVariants = [];

    variants.forEach((variant) => {
      const variantId = variant.node.id;
      if (hasProfillSku(variant)) {
        completeData.push(variant);
      } else {
        if (addedVariantIds.includes(variantId)) {
          inAddedVariants.push(variant);
        } else {
          notInAddedVariants.push(variant);
        }
      }
    });

    setcofigsComplete(
      loaderData.configs.every(
        (item) => item.artfileUrl && item.artfileUrl.trim() !== "",
      ),
    );
    const hitskuMetafield = loaderData.product.metafields.edges.find(
      (metafield) => metafield.node.key === "hitsku",
    );
    sethitSKu(hitskuMetafield);

    if (hitskuMetafield) {
      sethitSKu(hitskuMetafield.node.value);
      configurationAndPricingData(hitskuMetafield.node.value).then((result) => {
        if (result.status === "success") {
          const b = result.data.map((item) => ({
            label: item.partId,
            value: item.partId,
            price: item.price,
          }));
          b.unshift({ label: "Select HIT SKU", value: "" });

          setOptions(b);
        }
      });
    }

    setRemainingVariants(notInAddedVariants);
    setcompleteVariants(completeData);
    setaddedVariants(inAddedVariants);
    setConfigs(loaderData.configs);
  }, [configs, product]);

  useEffect(() => {
    console.log("Action Data Use Effext");
    if (actionData && actionData.status == "success") {
      console.log("Action Data Use Effext", actionData.product.variants.edges, actionData?.dbVariants, 'tdeyashi');
      shopify.toast.show(actionData?.msg)
      setproduct(actionData.product);
      setConfigs(actionData.configs);
      console.log("Action Data Use Effext", actionData);
      let variants = actionData.product.variants.edges;
      const addedVariantIds = actionData?.dbVariants.map(
        (item) => item.variantId,
      );
      let completeData = [];
      let notInAddedVariants = [];
      let inAddedVariants = [];
      const hasProfillSku = (variant) => {
        return variant.node.metafields.edges.some(
          (metafield) => metafield.node.key === "profill_sku",
        );
      };
      variants.forEach((variant) => {
        const variantId = variant.node.id;
        if (hasProfillSku(variant)) {
          completeData.push(variant);
        } else {
          if (addedVariantIds.includes(variantId)) {
            inAddedVariants.push(variant);
          } else {
            notInAddedVariants.push(variant);
          }
        }
      });

      setRemainingVariants(notInAddedVariants);
      setcompleteVariants(completeData);
      console.log(inAddedVariants, addedVariantIds)
      setaddedVariants(inAddedVariants);
    } else {
      shopify.toast.show(actionData?.msg);
    }
  }, [actionData, product]);

  return (
    <Page
      title={product?.title}
      backAction={{
        url: "/app/product/pod/" + loaderData.product.id.slice(22),
      }}
    >
      <Layout>
        <Layout.Section variant="fullWidth">
          <PodConfigTable configs={configs} updateConfig={updateConfig} />
        </Layout.Section>
        {cofigsComplete && (
          <>
            {completeVariants.length > 0 && (
              <Layout.Section variant="fullWidth">
                <PodCompleteTable
                  data={completeVariants}
                  dbVariants={loaderData.dbVariants}
                />
              </Layout.Section>
            )}
            {addedVariants.length > 0 && (
              <Layout.Section variant="fullWidth">
                <PodEditTable
                  data={addedVariants}
                  dbVariants={loaderData.dbVariants}
                  submitProfill={submitProfill}
                  variantDelete={variantDelete}
                  configData={options}
                  productId={hitSKu}
                />
              </Layout.Section>
            )}

            {remainingVariants.length > 0 && (
              <Layout.Section variant="fullWidth">
                <PodAddTable
                  data={remainingVariants}
                  configData={options}
                  productId={hitSKu}
                  addVariant={addVariant}
                />
              </Layout.Section>
            )}
          </>
        )}
      </Layout>
    </Page>
  );
}

export async function action({ request, params }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    const { shop } = session;
    let msg=""
    const formData = await request.formData();
    const reqtype = formData.get("reqtype");

    if (reqtype == "vdelete") {
      const id = formData.get("id");
      await db.podVariants.delete({ where: { id: parseInt(id) } });
      msg="Data Deleted"
    } else if (reqtype == "vadd") {
      const upcCode = formData.get("upcCode");
      const htsCode = formData.get("htsCode");
      const hitSku = formData.get("hitSku");
      const artfileUrl = formData.get("artfileUrl");
      const hitsize = formData.get("hitsize");
      const hitcolor = formData.get("hitcolor");
      const variantId = formData.get("variantId");
      const podPrice = formData.get("podPrice");
      await db.podVariants.create({
        data: {
          productId: params.id,
          artfileUrl,
          hitcolor,
          hitSku,
          hitsize,
          htsCode,
          upcCode,
          variantId,
          podPrice: parseFloat(podPrice),
        },
      });
       msg="Data Added"
    } else if (reqtype == "config") {
      const id = formData.get("id");
      const artfileUrl = formData.get("artfileUrl")
        ? formData.get("artfileUrl")
        : "";
      await db.podConfigs.update({
        data: { artfileUrl },
        where: { id: parseInt(id) },
      });
       msg="Config Updated"
    } else if (reqtype == "sendProfill") {
      const productId = params.id;
      let product = await getProductById(admin, params.id);
      product = product.product;
      let configs = await getPodConfigs(productId);
      configs = configs.data;

      let customer = await getCustomerByShop(shop);
      customer = customer.data;

      let dbVariants = await getPodVariantByProductId(productId);
      dbVariants = dbVariants.data;

      //
      let res = await createPodProduct(customer, configs, dbVariants, product);
      if(res.errors.length>0){
        throw res.errors[0]
      }
      let variants_update = dbVariants.map((v, i) => {
        return {
          id: v.variantId,
          metafields: [
            {
              namespace: "profill",
              key: "profill_sku",
              value: res.wholesaleSkus[i],
              type: "single_line_text_field",
            },
          ],
        };
      });
      await UpdateproductVariants(admin, product.id, variants_update);
      msg="Sended to Profill"
    }

    let product = await getProductById(admin, params.id);
    product = product.product;
    let configs = await getPodConfigs(params.id);
    configs = configs.data;
    let dbVariants = await getPodVariantByProductId(params.id);
    dbVariants = dbVariants.data;
    console.log(dbVariants)
    let t = {
      status: "success",
      product,
      configs,
      dbVariants,
      msg
    };
    return t;
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      msg: error,
    };
  }
}
