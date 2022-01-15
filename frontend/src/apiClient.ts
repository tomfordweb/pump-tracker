export class AppHttpError extends Error {
  code: number;
  data: any;

  constructor(message: string, code: number, data: any) {
    super(message);
    this.code = code;
    this.data = data;
    Object.setPrototypeOf(this, AppHttpError.prototype);
  }
}

function handleErrors(response: Response) {
  if (!response.ok) {
    return response.json().then((json) => {
      throw new AppHttpError(response.statusText, response.status, json.detail);
    });
  }
  return response;
}

export async function postFormDataToApi(
  url: string,
  payload: { [key: string]: any }
): Promise<Response> {
  return fetch(`/api/v1${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(payload),
  }).then(handleErrors);
}

export async function postJsonToApi(
  url: string,
  payload: { [key: string]: any }
): Promise<Response> {
  return fetch(`/api/v1${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then(handleErrors);
}
