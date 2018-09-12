// @flow

import { logPromise } from 'helpers/promise';

/** Sends a request to the payment API (or support workers, yolo) and converts
 *  the response into a JSON object */
function fetchJson(endpoint: string, settings: Object): Promise<Object> {
  return fetch(endpoint, settings).then(resp => resp.json());
}

export {
  fetchJson
};
