const baseURL = "https://profillds.profillholdings.com:8443/profill-rest-api-dev/"

export const createPpsProduct = async (customer, product) => {
    try {
        const { customer_id, credential, prefix } = customer;
        const { apparel, sku, title, color, size, upcCode, htsCode, weight, product_id, variant_id } = product;
        const header = new Headers();
        header.append("token", credential);
        header.append("Content-Type", "application/json");
        const req_data = JSON.stringify({
            internalID: customer_id,
            sku,
            displayName: title,
            color,
            size: size ? size : "OSF",
            skuType: "test",
            profillProductLine: "CUSTOMER DEFAULT",
            upcCode, htsCode, averageCost: 0, shopifyParentId: 0, shopifyVariantId: variant_id.substr(30), shopifyInventoryItemId: 0,
            profillExternalId: null, warehouse: "p3", profillSkuType: apparel ? "APCG" : "HGCG", profillProductLine: "", weight,
            weightUom: "lb", externalProductId: product_id.substr(22)
        });

        const payload = {
            method: "POST",
            headers: header,
            body: req_data,
        };
        let response = await fetch(`${baseURL}product?c=${customer.customer_id}`, payload);
        response = await response.json();
        if (response.errors.length) {
            return {
                status: "failed",
                msg: response.errors[0]
            }
        }
        else {
            return {
                status: "success",
                data: response.operationId
            }
        }
    }
    catch (error) {
        return {
            status: "failed",
            msg: "Internal Server Error",
            error
        }
    }

}

export const ppsStatus = async (customer, sku) => {
    try {
        const { customer_id, credential, prefix } = customer;
        const headers = new Headers();
        headers.append("token", credential);

        const payload = {
            method: "GET",
            headers: headers
        };
        let response = await fetch(`${baseURL}product/${sku}?c=${customer_id}`, payload);
        response = await response.json();
        if (response.errors.length) {
            return {
                status: "failed",
                msg: response.errors[0]
            }
        }
        else {
            return {
                status: "success",
                data: response.profillSku
            }
        }
    } catch (error) {
        return {
            status: "failed",
            msg: "Internal Server Error",
            error
        }
    }
}

export const getPpsInventory = async (customer, sku) => {
    try {
        const { customer_id, credential } = customer;
        const header = new Headers();
        header.append("token", credential);
        header.append("Content-Type", "application/json");
        const requestOptions = {
            method: "GET",
            headers: header
        };

        let response = await fetch(`${baseURL}inventory/${sku}?c=${parseInt(customer_id)}`, requestOptions);
        response = await response.json();
        if (response.reply.errorMessage) {
            return {
                status: "failed",
                msg: response.reply.errorMessage
            }
        }
        else {
            return {
                status: "success",
                data: {
                    id: response.reply.productVariationInventoryArray.productVariationInventory[0].partID,
                    quantity: response.reply.productVariationInventoryArray.productVariationInventory[0].quantityAvailable
                }

            };
        }

    } catch (error) {
        return {
            status: "failed",
            error
        }
    }
}

