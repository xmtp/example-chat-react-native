'use strict';

// Random values must be imported first for security.
import 'react-native-get-random-values';
import '@ethersproject/shims';

import 'text-encoding';
import 'base-64';
import 'react-native-fetch-api';
import 'react-native-url-polyfill/auto';
import 'web-streams-polyfill';
import '@azure/core-asynciterator-polyfill';
import { polyfill as polyfillBase64 } from 'react-native-polyfill-globals/src/base64';
import { polyfill as polyfillFetch } from 'react-native-polyfill-globals/src/fetch';
import { polyfill as polyfillEncoding } from 'react-native-polyfill-globals/src/encoding';
import { polyfill as polyfillReadableStream } from 'react-native-polyfill-globals/src/readable-stream';
import { polyfill as polyfillURL } from 'react-native-polyfill-globals/src/url';

polyfillEncoding();
polyfillReadableStream();
polyfillURL();
polyfillBase64();
polyfillFetch();


// Necessary for @peculiar/webcrypto.
if (!global.Buffer) {
  global.Buffer = require('safe-buffer').Buffer;
}
import {Crypto as WebCrypto} from '@peculiar/webcrypto';
if (!global.crypto.subtle) {
  // Only polyfill SubtleCrypto as we prefer `react-native-get-random-values` for getRandomValues.
  const webCrypto = new WebCrypto();
  global.crypto.subtle = webCrypto.subtle;
}
