import {testUrl} from './constData';


const login=async (customerId,password)=>{
    const header = new Headers();
    header.append('token', password);
      header.append('Content-Type', 'application/json');
      const requestOptions = {
        method: 'GET',
        headers: header,
      };
      let response = await fetch(
        `${testUrl}customer/validate?c=${customerId}`,
        requestOptions
      );
      response = await response.json();
      return response;
}

export {login}