# XMTP React Native Example

This is an example of how to import the [xmtp-js](https://github.com/xmtp/xmtp-js) library into a React Native app.

## Warning
This should only be used experimentally while we remove our dependency on [PeculiarVentures/webcrypto](https://github.com/PeculiarVentures/webcrypto) (a SubtleCrypto polyfill) since it includes the following warning.
>At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

## Getting started

1. Follow the [React Native guide](https://reactnative.dev/docs/environment-setup) to set up CLI environment
1. Clone this repo and `cd example_chat_rn`
1. Edit the blockchain account address in `App.tsx` to point to the address you'd like to send a message to
1. `npx react-native start`
1. `npx react-native run-ios` or `npx react-native run-android`
1. Press the `Send a gm` button once the app is running
1. A message will arrive in the account provided in Step 3

## Blockers for production

1. Remove the `SubtleCrypto` dependency or add a Node crypto workaround as proposed in [a proof of concept PR](https://github.com/xmtp/xmtp-js/pull/157). This will allow us to remove the [PeculiarVentures/webcrypto](https://github.com/PeculiarVentures/webcrypto) polyfill noted in the above warning.
1. Add authentication instead of using a random wallet address.
1. Nice to have: Remove unnecessary local storage dependency from `xmtp-js` to remove the polyfill in `App.tsx`.

## Requirements

- The JavaScript engine used must include `BigInt` as it is required in the XMTP SDK's use of [paulmillr/noble-secp256k1](https://github.com/paulmillr/noble-secp256k1).
  - `BigInt` is included in:
    - Hermes v0.70 for both iOS and Android (used in this example)
    - JavaScriptCore for iOS starting with iOS 14
    - [V8](https://github.com/Kudo/react-native-v8) for Android

## Polyfills

- @azure/core-asynciterator-polyfill (necessary for Hermes only)
- @ethersproject/shims
- crypto-browserify
- stream-browserify
- events
- process
- react-native-get-random-values
- text-encoding
- web-streams-polyfill
- @peculiar/webcrypto (necessary for SubtleCrypto but need to remove)
- @react-native-async-storage/async-storage (necessary for LocalStorage but trying to remove)
