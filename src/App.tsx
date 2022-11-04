import { FC, useEffect, useState } from 'react';
import React from 'react';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SwapWidget } from '@uniswap/widgets';
import { createPortal } from 'react-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAccount } from 'wagmi';

import { DonationForm } from './DonationForm';
import { useHydrateBuySFT } from './hooks/hydrateBuySFT';
import { useRenderTokensAmount } from './hooks/renderTokensAmount';

const donationFormDiv = document.getElementById('donationForm');
const swapWidgetDiv = document.getElementById('swapWidget');

export const App: FC = () => {
  useRenderTokensAmount();
  useHydrateBuySFT();
  const { connector, isConnected } = useAccount();
  const [provider, setProvider] = useState();
  useEffect(() => {
    if (connector) {
      connector?.getProvider().then(setProvider);
    }
    if (!isConnected) {
      setProvider(undefined);
    }
  }, [connector, isConnected]);

  return (
    <>
      <ConnectButton
        chainStatus='icon'
        showBalance
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
      />
      <ToastContainer position='bottom-left' toastStyle={{ borderRadius: '1rem' }} />
      {donationFormDiv != null && createPortal(<DonationForm />, donationFormDiv)}
      {swapWidgetDiv != null &&
        createPortal(
          <ErrorBoundary>
            <SwapWidget
              disableBranding
              hideConnectionUI
              provider={(provider as any) ?? null}
              routerUrl='https://api.uniswap.org/v1/'
            />
          </ErrorBoundary>,
          swapWidgetDiv,
        )}
    </>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return (this.props as any).children;
  }
}
