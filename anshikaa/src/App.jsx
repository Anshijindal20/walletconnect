
import React, { useState, useEffect } from 'react';
import { createAppKit } from '@reown/appkit';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { bitcoin, bitcoinTestnet } from '@reown/appkit/networks';
import CodeContainer from './components/CodeContainer';
import { Sun } from 'lucide-react';

// Project configuration
const projectId = import.meta.env.VITE_PROJECT_ID || 'f2a3f3bc5f10c9dcd7bf3dc0427516c0';

const App = () => {
  // State management
  const [modal, setModal] = useState(null);
  const [accountState, setAccountState] = useState({});
  const [networkState, setNetworkState] = useState({});
  const [appKitState, setAppKitState] = useState({});
  const [themeState, setThemeState] = useState({ themeMode: 'light', themeVariables: {} });
  const [events, setEvents] = useState([]);
  const [walletInfo, setWalletInfo] = useState({});
  const [bip122Provider, setBip122Provider] = useState(null);

  // Initialize AppKit on component mount
  useEffect(() => {
    const bitcoinAdapter = new BitcoinAdapter();
    const appKitModal = createAppKit({
      adapters: [bitcoinAdapter],
      networks: [bitcoin, bitcoinTestnet],
      projectId,
      themeMode: 'light',
      features: {
        analytics: true
      },
      metadata: {
        name: 'AppKit React Example',
        description: 'AppKit React Example',
        url: 'https://reown.com/appkit',
        icons: ['https://avatars.githubusercontent.com/u/179229932?s=200&v=4']
      }
    });

    setModal(appKitModal);

    // Set up subscriptions
    appKitModal.subscribeAccount(setAccountState);
    appKitModal.subscribeNetwork(setNetworkState);
    appKitModal.subscribeState(setAppKitState);
    appKitModal.subscribeTheme((state) => {
      setThemeState(state);
      updateTheme(state.themeMode);
    });
    appKitModal.subscribeEvents(setEvents);
    appKitModal.subscribeWalletInfo(setWalletInfo);
    appKitModal.subscribeProviders((state) => setBip122Provider(state['bip122']));

    return () => {
      // Cleanup subscriptions if needed
    };
  }, []);

  // Theme management
  const updateTheme = (mode) => {
    document.documentElement.setAttribute('data-theme', mode);
    document.body.className = mode;
  };

  // Button handlers
  const handleThemeToggle = () => {
    const newTheme = themeState.themeMode === 'dark' ? 'light' : 'dark';
    modal.setThemeMode(newTheme);
    setThemeState((prev) => ({ ...prev, themeMode: newTheme }));
    updateTheme(newTheme);
  };

  const handleSwitchNetwork = () => {
    modal.switchNetwork(bitcoin);
  };

  const handleSignMessage = async () => {
    if (!accountState.address) {
      await modal.open();
      return;
    }
    if (bip122Provider && accountState.address) {
      try {
        await bip122Provider.signMessage({
          address: accountState.address,
          message: 'Hello from AppKit'
        });
      } catch (error) {
        console.error('Error signing message:', error);
      }
    }
  };

  return (
    <div className="page-container">
      <div className="logo-container">
        <img 
          src={themeState.themeMode === 'dark' ? '/reown-logo-white.png' : '/reown-logo.png'} 
          alt="Reown" 
          width="150" 
        />
        <img src="/appkit-logo.png" alt="AppKit" width="150" />
      </div>

      <h1 className="page-title">React Bitcoin Example</h1>

      <div className="appkit-buttons-container">
        <appkit-button></appkit-button>
        <appkit-network-button></appkit-network-button>
      </div>

      <div className="action-button-list">
        <button onClick={() => modal?.open()}>Open</button>
        <button onClick={() => modal?.disconnect()}>Disconnect</button>
        <button onClick={handleSwitchNetwork}>Switch to Bitcoin</button>
        <button onClick={handleSignMessage}>Sign Message</button>
        <button onClick={handleThemeToggle}>
          <Sun size={16} />
        </button>
      </div>

      <div className="code-container-wrapper">
        <CodeContainer title="useAppKitAccount()" content={accountState} />
        <CodeContainer title="useAppKitNetwork()" content={networkState} />
        <CodeContainer title="useAppKitTheme()" content={themeState} />
        <CodeContainer title="useAppKitState()" content={appKitState} />
        <CodeContainer title="useAppKitEvents()" content={events} />
        <CodeContainer title="useWalletInfo()" content={walletInfo} />
      </div>

      <footer className="footer">
        <div className="footer-links">
          <a href="https://reown.com" target="_blank" rel="noreferrer">Reown</a>
          •
          <a href="https://docs.reown.com" target="_blank" rel="noreferrer">Docs</a>
          •
          <a href="https://github.com/reown-com/appkit" target="_blank" rel="noreferrer">GitHub</a>
          •
          <a href="https://cloud.reown.com" target="_blank" rel="noreferrer">Cloud</a>
        </div>
        <p className="warning">This project ID only works on localhost. Go to Cloud to get your own.</p>
      </footer>
    </div>
  );
};

export default App;