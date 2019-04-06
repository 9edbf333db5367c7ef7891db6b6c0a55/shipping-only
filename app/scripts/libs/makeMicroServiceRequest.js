import queryparams from 'query-params';

export default (method, resourceURL, { headers, pathVariables, params, body }, isJSON) => {
  if (pathVariables && Object.keys(pathVariables).length) {
    Object.keys(pathVariables).forEach((key) => {
      resourceURL = resourceURL.replace(`{${key}}`, pathVariables[key]);
    });
  }

  if (params && Object.keys(params).length) resourceURL += `?${queryparams.encode(params)}`;
  if (body && !(body instanceof FormData)) body = JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(method.toUpperCase(), resourceURL, true);

    if (headers && Object.keys(headers).length) {
      Object.keys(headers).forEach((key) => {
        request.setRequestHeader(key, headers[key]);
      });
    }

    request.onload = () => {
      const { status, statusText, responseText, readyState } = request;
      let response;

      try {
        response = isJSON && responseText !== '' ? JSON.parse(responseText) : responseText;
      } catch (e) {
        reject(e);
      }

      if (readyState === request.DONE && status >= 400) {
        reject({ status, statusText, response });
        return;
      }

      if (readyState === request.DONE && status >= 200 && status < 300) {
        resolve({ status, statusText, response });
        return;
      }

      reject({ status, statusText, response });
    };

    request.onerror = (error) => {
      // eslint-disable-next-line
      const { status, statusText, responseText } = request;
      const response = responseText !== '' ? JSON.parse(responseText) : {};
      reject({ status, statusText, response, error });
    };

    body ? request.send(body) : request.send();
  });
};
