import { FC, useEffect, useState } from 'react';

import { SwapWidget } from '@ilmpc/charity-widget';
import { ConnectButton } from '@rainbow-me/rainbowkit';
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
          <SwapWidget
            disableBranding
            hideConnectionUI
            provider={(provider as any) ?? null}
            routerUrl='https://api.uniswap.org/v1/'
          />,
          swapWidgetDiv,
        )}
    </>
  );
};
