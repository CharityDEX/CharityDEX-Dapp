import { FC } from 'react';
import { createPortal } from 'react-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ConnectButton } from '@rainbow-me/rainbowkit';

import { DonationForm } from './DonationForm';
import { useHydrateBuySFT } from './hooks/hydrateBuySFT';
import { useRenderTokensAmount } from './hooks/renderTokensAmount';

const donationFormDiv = document.getElementById('donationForm');

export const App: FC = () => {
  useRenderTokensAmount();
  useHydrateBuySFT();
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
      <ToastContainer position='bottom-left' toastStyle={{ borderRadius: '1rem', zIndex: 1000 }} />
      {donationFormDiv != null && createPortal(<DonationForm />, donationFormDiv)}
    </>
  );
};
