"use client";

import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { ReactNode } from 'react';
import { base } from 'wagmi/chains'; // Nếu cần chỉ định chain (Base mainnet)

export function MiniKitProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <MiniKitProvider
      // Nếu bạn có CDP API Key (từ Coinbase Developer Platform), thêm apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      // chain={base} // Optional: chỉ định chain Base
    >
      {children}
    </MiniKitProvider>
  );
}