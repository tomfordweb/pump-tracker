// const Client = {
//   get : (url: string) => { return url; },
//   post : async (url: string, payload: {[key: string]: any}) =>
//       await fetch(url, };

export async function postJsonToApi<Type>(
  url: string,
  payload: { [key: string]: any }
): Promise<Type> {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(payload),
  }).then((data) => data.json());
}
