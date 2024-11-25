import { findMetafieldValue } from "../others/helper";

const baseURL="https://profillds.profillholdings.com:8443/profill-rest-api-dev/"

export const createOrder = async (p_customer, order,line_items) => {
    try {
        const { customer_id, credential } = p_customer;
        const { id, shippingAddress } = order;
        const { address1, address2, zip, city, province,country, countryCode } = shippingAddress;
        let temp=line_items.map((i)=>{
            
            return  {
                    "totalQuantity": i.quantity,
                    "price":0,
                    "sku": {
                        "profillProductNumber": i.variant.metafields.nodes.find(node => node.key === 'profill_sku')?.value
                    }
                }
           
        })
       // 
        const req_data = {
            id:(order.name).slice(1,),
            firstName: order.customer.firstName,
            lastName: order.customer.lastName,
            address1,
            address2,
            address3: "",
            postalCode: zip,
            city,
            state: province,
            country: countryCode,
            orderDetails: temp,
            profillCustomer: {
                retailProfillCustomerNumber: 0,
                ppsProfillCustomerNumber: customer_id
            },
            store: {
                warehouse: "aa",
                shipMethod: "ups",
                shipAccount: ""
            }
        }

        console.log(req_data)
        const header = new Headers();
        header.append("token", credential);
        header.append("Content-Type", "application/json");


        const requestOptions = {
            method: "POST",
            headers: header,
            body: JSON.stringify(req_data),
        };

        
        let resp = await fetch(`${baseURL}order/create`, requestOptions);
         resp = await resp.json();
         if(resp.received){
            return {
                status:"success",
                queueId:resp.queueId
            }
         }
        else{
            return {
                status:"failed",
                resp
            }
        }

    } catch (error) {
        console.log(error)
        return{
            status: "error",
            msg: "Internal Server Error",
            error
        }
    }
}

export const orderStatus=async(queueId)=>{
    try {
    const header = new Headers();
    header.append("internalToken", "g0575c6961f90f39c89as218h996rb5e");
    header.append("Content-Type", "application/json");
    const requestOptions = {
        method: "GET",
        headers: header
    }; 
    let response = await fetch(`${baseURL}order/status/${queueId}`, requestOptions);
    response = await response.json();
    if(response.profillOrderNumber){
        return {
            status:"success",
            profillOrderNumber:response.profillOrderNumber
        }
    }
    else{
        return {
            status: "failed",
            response
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

export const orderTracking=async(customer,profillOrderNumber)=>{
try {
    const { customer_id, credential } = customer;
    const header = new Headers();
    header.append("token", credential);

const requestOptions = {
  method: "GET",
  headers: header
};
let response = await fetch(`${baseURL}order/tracking/${profillOrderNumber}?c=${customer_id}`, requestOptions);
response = await response.json();
if(response.osnResponse.errorMessage){
    return {
        status: "failed",
        data:response.osnResponse.errorMessage.description
    }
}
else{
    const {complete,packageArray}=response.osnResponse.orderShipmentNotificationArray.orderShipmentNotification[0].salesOrderArray.salesOrder[0].shipmentLocationArray.shipmentLocation[0];
    return {
        status: "success",
        data:{
            complete,
            package:packageArray.package
        }
    
    
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