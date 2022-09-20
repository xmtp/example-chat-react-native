'use strict';

// Random values must be imported first for security.
import 'react-native-get-random-values';
import '@ethersproject/shims';

import 'text-encoding';
import 'web-streams-polyfill';
import '@azure/core-asynciterator-polyfill';

import AsyncStorage from '@react-native-async-storage/async-storage';
if (!global.localStorage) {
  global.localStorage = AsyncStorage;
}

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
