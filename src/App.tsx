import { FC, Suspense, lazy, useEffect, useState } from 'react';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createPortal } from 'react-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAccount, useNetwork } from 'wagmi';

import { useHydrateBuySFT } from './hooks/hydrateBuySFT';
import { useRenderTokensAmount } from './hooks/renderTokensAmount';

const donationFormDiv = document.getElementById('donationForm');
const swapWidgetDiv = document.getElementById('swapWidget');

const DonationForm = lazy(() => import('./DonationForm'));
const SwapWidget = lazy(() => import('@ilmpc/charity-widget').then((module) => ({ default: module.SwapWidget })));

export const App: FC = () => {
  useRenderTokensAmount();
  useHydrateBuySFT();

  const { chain } = useNetwork();

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
        chainStatus={chain?.unsupported ? 'icon' : 'none'}
        showBalance
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
      />
      <ToastContainer position='bottom-left' toastStyle={{ borderRadius: '1rem' }} />
      <Suspense>
        {donationFormDiv != null && createPortal(<DonationForm />, donationFormDiv)}
        {swapWidgetDiv != null &&
          createPortal(
            <SwapWidget
              disableBranding
              hideConnectionUI
              provider={(provider as any) ?? null}
              theme={{
                accent: '#ff795d',
                fontFamily: 'Hanson, Arial, sans-serif',
                borderRadius: 1,
              }}
            />,
            swapWidgetDiv,
          )}
      </Suspense>
    </>
  );
};
