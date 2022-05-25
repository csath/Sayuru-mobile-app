import { TEST_ENDPOINT } from '../../../configs';
import { client, METHODS } from '../../shared/utilities/network-communication/rest-client';

export const getTestService = async () => {
  const headerConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const url = TEST_ENDPOINT;
  return await client.API(METHODS.GET, url, {}, headerConfig);
};
