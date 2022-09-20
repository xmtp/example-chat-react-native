# XMTP React Native Example

This is a work in progress to demonstrate importing [xmtp-js](https://github.com/xmtp/xmtp-js) into a React Native app. The example currently generates a random account and sends a message to a given address. Please reference [blockers for production](#blockers-for-production) for ongoing work and [getting started](#getting-started) to run the app.

## Warning
This code should only be **used experimentally** as we work to remove our dependency on [PeculiarVentures/webcrypto](https://github.com/PeculiarVentures/webcrypto) (a SubtleCrypto polyfill) as the library includes the following warning.
>At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

## Getting started

1. Follow the [React Native guide](https://reactnative.dev/docs/environment-setup) to set up CLI environment
1. Clone this repo and `cd example_chat_rn`
1. Edit the blockchain account address in [App.tsx](https://github.com/xmtp/example-chat-react-native/blob/main/App.tsx)'s `sendGm()` to point to the recipient's address
1. Run `npx react-native start` to start Metro
1. Run `npx react-native run-ios` or `npx react-native run-android` to run the app
1. Press the `Send a gm` button once the app is running
1. A message will arrive in the account provided in Step 3

## Blockers for production

1. Remove the `SubtleCrypto` dependency from `xmtp-js` or add a Node crypto workaround as proposed in [a proof of concept PR](https://github.com/xmtp/xmtp-js/pull/157). This will allow us to remove the [PeculiarVentures/webcrypto](https://github.com/PeculiarVentures/webcrypto) polyfill noted in the above [warning](#warning).
1. Add authentication to the app instead of generating a random private key for a sender account in `App.tsx`.
1. Nice to have: Remove unnecessary local storage dependency from `xmtp-js` to remove the polyfill in `App.tsx`.

## Requirements

- The JavaScript engine used in the React Native app must include `BigInt` support as it is required by `xmtp-js` use of [paulmillr/noble-secp256k1](https://github.com/paulmillr/noble-secp256k1).
  - `BigInt` is included in the following JS environments:
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
- @peculiar/webcrypto (necessary for `SubtleCrypto` but need to remove)
- @react-native-async-storage/async-storage (necessary for `global.localStorage`)
