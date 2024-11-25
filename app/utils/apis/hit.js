const hitUrl = "https://api.hitpromo.net:8443/hit-rest-api-qa";
const header = new Headers();
header.append("token", "QnGQ3McbQAZEmOG0");
header.append("Content-Type", "application/json");

export const availableLocationsData = async (productId) => {
   
    try {
        
        const payload = JSON.stringify({
            "wsVersion": "1.0.0",
            "id": "1",
            "password": "Change1Start",
            "productId": productId,
            "localizationCountry": "US",
            "localizationLanguage": "English"
        });

        const request = {
            method: "POST",
            headers: header,
            body: payload,
        };

        let response = await fetch(`${hitUrl}/podConfig/availableLocationsData`, request);
        response = await response.json();
        if (response.isError) {
            return {
                status: "failed",
                msg: response.messages[0]
            }
        } else {
            return {
                status: "success",
                data: response.availableLocationsList
            }
//   return {
//                 status: "success",
//                 data: [
//                     {
//                         "locationId": 8,
//                         "locationName": "FRONT"
//                     },
//                     {
//                         "locationId": 9,
//                         "locationName": "BACK"
//                     },
//                     {
//                         "locationId": 10,
//                         "locationName": "TOP"
//                     }
//                 ]
//             }
           
        }
    } catch (error) {
        return {
            status: "failed",
            msg: "Internal Server Error",
            error
        }
    }
}
export const decorationColorsData = async({ locationId, productId }) => {
    try {
        const payload = JSON.stringify({
            "wsVersion": "1.0.0",
            "id": "1",
            "password": "Change1Start",
            "locationId": locationId,
            "productId": productId,
            "decorationId": "",
            "localizationCountry": "US",
            "localizationLanguage": "English"
        });

        const request = {
            method: "POST",
            headers: header,
            body: payload,
            redirect: "follow"
        };


     let response=await fetch(`${hitUrl}/podConfig/decorationColorsData`, request);
     response = await response.json();
     if (response.isError) {
        return {
            status: "failed",
            msg: response.messages[0]
        }
    }
    else{

        if(response.decorationColors.decorationMethodArray == null){
            return {
                status: "failed",
                msg: "Invalid Location",
                response
            }
        }
        else{
            return {
                status: "success",
                data: response.decorationColors.decorationMethodArray.decorationMethod
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
export const configurationAndPricingData = async(productId) => {
    try {
        const payload = JSON.stringify({
            "wsVersion": "1.0.0",
            "id": "1",
            "password": "Change1Start",
            "productId": productId,
            "partId": "",
            "currency": "USD",
            "fobId": "1",
            "priceType": "Customer",
            "localizationCountry": "US",
            "localizationLanguage": "En",
            "configurationType": "Configure"
        });
        const request = {
            method: "POST",
            headers: header,
            body: payload,
            redirect: "follow"
        };
        let response=await fetch(`${hitUrl}/podConfig/configurationAndPricingData`, request);
        response = await response.json();
        if (response.isError) {
            return {
                status: "failed",
                msg: response.messages[0]
            }
        }
        else{
            let arr = response.configuration.partArray.part.map(part => {
                return {
                    partId: part.partId,
                    price: part.partPriceArray.partPrice[0].price
                };
            });
            return {
                status: "success",
                data: arr
            }
        }

    } catch (error) {
        return {
            status: "failed",
            msg: "Internal Server Error"
        }
    }
}
export const productData =async ({ productId, partId }) => {
    try {
        const payload = JSON.stringify({
            "wsVersion": "1.0.0",
            "id": "1",
            "password": "Change1Start",
            "localizationCountry": "US",
            "localizationLanguage": "English",
            "productId": productId,
            "partId": partId
        });
        
        const request = {
            method: "POST",
            headers: header,
            body: payload,
            redirect: "follow"
        };
        let response=await fetch(`${hitUrl}/pod/productData`, request);
        response = await response.json();
        if (response.isError) {
            return {
                status: "failed",
                msg: response.messages[0]
            }
        }
        else{
            let arr = response.product.productPartArray.productPart.map(part => {
                return {
                    partId: part.partId,
                    colorName: part.colorArray.color[0].colorName,
                    labelSize: part.apparelSize.labelSize
                };
            });

            return {
                status: "success",
                data: arr[0],
                
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