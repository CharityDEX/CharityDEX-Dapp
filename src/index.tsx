import React from 'react';
import ReactDOM from 'react-dom/client';

import { RainbowKitProvider, getDefaultWallets, lightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiConfig, chain, configureChains, createClient } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import { App } from './App';
import './index.css';
import './polyfills';

const root = document.getElementById('walletConnectBlock');

if (root != null) {
  const { chains, provider } = configureChains(
    [chain.mainnet],
    [
      jsonRpcProvider({
        rpc: () => ({ http: 'https://rpc.ankr.com/eth' }),
      }),
      jsonRpcProvider({
        rpc: () => ({ http: 'https://rpc.flashbots.net' }),
      }),
      jsonRpcProvider({
        rpc: () => ({ http: 'https://eth-mainnet.public.blastapi.io' }),
      }),
    ],
  );

  const { connectors } = getDefaultWallets({
    appName: 'Charity',
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={lightTheme({ accentColor: '#ff795d' })}>
          <App />
        </RainbowKitProvider>
      </WagmiConfig>
    </React.StrictMode>,
  );
}
