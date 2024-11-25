import { findMetafieldValue, findSkuByVariantId, getWeightByVariantId } from "../others/helper";
import db from "../../db.server";
const baseURL = "https://profillds.profillholdings.com:8443/profill-rest-api-dev/"


export const createPodProduct=async(customer,configs,variants,product)=>{
    const hitsku=findMetafieldValue(product.metafields.edges,"hitsku");
    const apparel=findMetafieldValue(product.metafields.edges,"apparel");
try {
    let configurations=configs.map((c)=>{
        return {"locationName": c.location,
            "decorationName": c.decoration,
            "artWorkName":  c.artfileUrl.substring(c.artfileUrl.lastIndexOf('/') + 1),
            "productArtWorkUri": c.artfileUrl,
            "colors": [
                {color:c.colors}
            ]}
    });
const wholesaleSkus=variants.map((v)=>{
    return {
        "clientSku":findSkuByVariantId(product.variants.edges,v.variantId),
        "podVendorProductNumber": hitsku,
        "podCost": v.podPrice,
        "podPrice": v.podPrice,
        "color":v.hitcolor,
        "size": v.hitsize,
        "profillSku": null,
        "weight": getWeightByVariantId(product.variants.edges,v.variantId),
        "weightUom": "LB",
        "upcCode": v.upcCode,
        "hitSku": v.hitSku
    }
})

let data={
    "clientSku":product.id.slice(22),
    "minQtyToOrder": 5,
    "podVendorProductNumber": hitsku,
    "maxWaitTimeToOrder": "10",
    "prefix": customer.prefix,
    "profillSku": null,
    "design": product.title,
    "apparel":apparel,
    "configurations":configurations,
    "wholesaleSkus":wholesaleSkus
}

      const header = new Headers();
      header.append("token", customer.credential);
      header.append("Content-Type", "application/json");
const requestOptions = {
              method: "POST",
              headers: header,
              body: JSON.stringify(data)
            };
       let response = await fetch(`${baseURL}pod-product/createWholesaleProduct?c=${customer.customer_id}`, requestOptions);
       response = await response.json();
       return response;
} catch (error) {
return error
}
}
export const podStatus = async (customer,sku) => {
    //sku=productsku 
    try {
        const { customer_id, credential, prefix } = customer;
        const myHeaders = new Headers();
        myHeaders.append("token",credential);
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };
        let response = await fetch(`${baseURL}pod-product/${sku}?c=${customer_id}`, requestOptions);
        response = await response.json();

        if(response.approved){
            return {
                status:"success",
                data:"Inventory Created",
                response,
            }
        }
        else{
            return {
                status:"failed",
                msg:"Not Created",
                response
            }  
        }
    } catch (error) {
        return {
            status: "error",
            msg: "Internal Server Error",
            error
        }
    }
}