# XMTP React Native Example

![Status](https://img.shields.io/badge/Project_Status-Developer_Preview-red)

![x-red-sm](https://user-images.githubusercontent.com/510695/163488403-1fb37e86-c673-4b48-954e-8460ae4d4b05.png)

**Example React Native application demonstrating core concepts and capabilities of the XMTP client SDK**

This application is in developer preview and is a bare-bones example of integrating the [XMTP Client SDK](https://github.com/xmtp/xmtp-js) into a React Native app.

This example is using the [Hermes](https://reactnative.dev/docs/hermes) JavaScript engine, the [XMTP Client SDK](https://github.com/xmtp/xmtp-js), and [polyfills](#polyfills) to backport modern JavaScript APIs to the React Native environment.

The application is maintained by [XMTP Labs](https://xmtplabs.com/) and distributed under MIT License for learning about and developing applications built with [XMTP](https://xmtp.com), a messaging protocol and decentralized communication network for blockchain wallets. The application has not undergone a formal security audit.

## Getting Started

1. Follow the [React Native guide](https://reactnative.dev/docs/environment-setup) to set up CLI environment
1. Set the `RECIPIENT_ADDRESS` in [Home.tsx](https://github.com/xmtp/example-chat-react-native/blob/main/components/Home.tsx) to an address already authenticated with XMTP. If you have not yet authenticated with XMTP, [sign in](https://xmtp.vercel.app/) on the [dev network](https://github.com/xmtp/xmtp-js#xmtp-production-and-dev-network-environments).
1. Run `npx pod-install` to install iOS dependencies
1. Run `npx react-native start` to start Metro
1. Run `npx react-native run-ios` or `npx react-native run-android` to run the application

## Requirements

The XMTP Client SDK relies on `BigInt` and requires a React Native JavaScript environment that supports `BigInts` including:
  - Hermes v0.70+ for both iOS and Android (used in this example)
  - JavaScriptCore for iOS (iOS 14+)
  - [V8](https://github.com/Kudo/react-native-v8) for Android

## Functionality

### Wallet Connections

The example provides two ways to connect to blockchain accounts:

1. Authenticate on a physical Android or iOS device using [WalletConnect](https://www.npmjs.com/package/@walletconnect/react-native-dapp).
1. Generate a random account using [Ethers](https://docs.ethers.org/v5/cookbook/react-native/) for quick testing.

### Chat Conversations

The application uses the `xmtp-js` [Conversations](https://github.com/xmtp/xmtp-js#conversations) abstraction to create a new conversation and send a `gm` message from an authenticated account. On iOS devices, the application also listens for new messages that come in and shows an alert with the incoming message content.

## Up Next

1. Stream messages on Android. Currently, listening for new messages is only available for iOS. See [this PR](https://github.com/xmtp/example-chat-react-native/pull/8) for more context. In the meantime, we recommend polling new messages periodically on Android using the XMTP Client SDK's [Conversation#messages API](https://github.com/xmtp/xmtp-js/blob/6293eb9ac376b8be872c942b935b0ccf1ffedbce/src/conversations/Conversation.ts#L54).
1. Explore replacing the [PeculiarVentures/webcrypto](https://github.com/PeculiarVentures/webcrypto) [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) polyfill. The library comes with a [warning](https://github.com/PeculiarVentures/webcrypto#warning) that the solution should be considered suitable for research and experimentation. In the meantime, it is the most popular polyfill we could find with over [13,500 dependents](https://github.com/PeculiarVentures/webcrypto/network/dependents).

## Polyfills

- @azure/core-asynciterator-polyfill (necessary for Hermes only)
- @ethersproject/shims
- react-native-get-random-values
- react-native-polyfill-globals
- crypto-browserify
- stream-browserify
- readable-stream
- https-browserify
- events
- process
- text-encoding
- web-streams-polyfill
- @peculiar/webcrypto
- assert
- os
- url
- util
