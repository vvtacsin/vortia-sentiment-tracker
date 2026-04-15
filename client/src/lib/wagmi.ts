import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, optimism, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Vortia AI',
  projectId: 'vortia-ai-sentiment-tracker', // WalletConnect project ID - can be any string for demo
  chains: [mainnet, polygon, arbitrum, optimism, base],
  ssr: false,
});
