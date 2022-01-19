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

export function generateJwtHeaders(token: string | null) {
  if (!token) {
    throw new Error("Empty token provided");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function deleteFromApi(
  url: string,
  headers: Record<string, string> = {}
) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "DELETE",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  }).then(handleErrors);
}

export async function getFromApi(
  url: string,
  headers: Record<string, string> = {}
) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  }).then(handleErrors);
}

export async function postFormDataToApi(
  url: string,
  payload: Record<string, any>,
  headers: Record<string, string> = {}
): Promise<Response> {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(payload),
  }).then(handleErrors);
}

export async function postJsonToApi(
  url: string,
  payload: Record<string, any> = {},
  headers: Record<string, string> = {}
): Promise<Response> {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then(handleErrors);
}
