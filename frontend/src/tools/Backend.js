import ConnectionError from "./ConnectionError";
import { isDevEnv } from "./helpers";

export default class Backend {
  static __call(method, params = {}, httpMethod = "GET", signal) {
    let url = `https://petitions.w82.vkforms.ru/api/${method}`;
    if (isDevEnv()) {
      url = `https://petitions.trofimov.dev/api/${method}`;
    }
    const requestParams = {
      method: httpMethod || "GET",
      cache: "no-cache",
      redirect: "error",
      headers: {
        "X-vk-sign": window.location.search
      },
      signal
    };

    if (
      params instanceof FormData &&
      ["PUT", "PATCH"].includes(httpMethod.toString().toUpperCase())
    ) {
      // fix that Laravel doesn't work with formData in PATCH / PUT
      requestParams.method = "POST";
      params.append("_method", httpMethod);
    }

    if (httpMethod.toString().toUpperCase() !== "GET") {
      if (!(params instanceof FormData)) {
        requestParams.headers["Content-Type"] = "application/json";
      }
      requestParams.body =
        params instanceof FormData ? params : JSON.stringify(params);
    } else {
      const paramsString = new URLSearchParams(params).toString();
      url += `?${paramsString}`;
    }

    return new Promise((resolve, reject) => {
      try {
        fetch(url, requestParams)
          .then(resolve)
          .catch(e => {
            if (e instanceof TypeError) {
              e.network = true;
              e.message = `${e.message} ${url}`;
            }
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  static request(method, params, httpMethod = "GET", retry = 5, signal = null) {
    return new Promise((resolve, reject) => {
      if (signal) {
        signal.addEventListener("abort", () => {
          reject();
        });
      }
      try {
        Backend.__call(method, params, httpMethod, signal)
          .then(r => {
            const contentType = r.headers.get("Content-Type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
              r.json().then(data => {
                if (data.response !== undefined) {
                  resolve(data.response);
                } else if (
                  data.error !== undefined &&
                  data.error &&
                  data.error.message !== undefined
                ) {
                  reject(data.error);
                } else {
                  reject(data);
                }
              });
            } else if (retry > 0) {
              setTimeout(() => {
                Backend.request(method, params, httpMethod, retry - 1, signal)
                  .then(resolve)
                  .catch(reject);
              }, Math.random() * 1000);
            } else {
              throw new ConnectionError(
                `${httpMethod} ${method} response ${r.status} Content-Type: ${contentType}`
              );
            }
          })
          .catch(e => {
            if (e && e.network && retry > 0) {
              setTimeout(() => {
                Backend.request(method, params, httpMethod, retry - 1, signal)
                  .then(resolve)
                  .catch(reject);
              }, Math.random() * 1000);
            } else {
              reject(e);
            }
          });
      } catch (e) {
        if (retry > 0) {
          setTimeout(() => {
            Backend.request(method, params, httpMethod, retry - 1)
              .then(resolve)
              .catch(reject);
          }, Math.random() * 1000);
        } else {
          reject(e);
        }
      }
    });
  }
}
