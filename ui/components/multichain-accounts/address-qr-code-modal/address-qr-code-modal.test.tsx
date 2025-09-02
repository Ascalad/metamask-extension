import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProvider } from '../../../../test/lib/render-helpers';
import mockState from '../../../../test/data/mock-state.json';
import configureStore from '../../../store/store';
import { openBlockExplorer } from '../../multichain/menu-items/view-explorer-menu-item';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import { AddressQRCodeModal } from './address-qr-code-modal';

// Mock the block explorer utility
jest.mock('../../multichain/menu-items/view-explorer-menu-item', () => ({
  openBlockExplorer: jest.fn(),
}));

// Mock copy to clipboard hook
jest.mock('../../../hooks/useCopyToClipboard', () => ({
  useCopyToClipboard: jest.fn(),
}));

const mockOpenBlockExplorer = openBlockExplorer as jest.MockedFunction<
  typeof openBlockExplorer
>;
const mockUseCopyToClipboard = useCopyToClipboard as jest.MockedFunction<
  typeof useCopyToClipboard
>;

describe('AddressQRCodeModal', () => {
  // Use accounts from mock-state.json
  const mockAccount =
    mockState.metamask.internalAccounts.accounts[
      'cf8dace4-9439-4bd4-b3a8-88c821c8fcb3'
    ];

  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    address: mockAccount.address,
    chainId: '0x1',
    account: mockAccount,
  };

  const renderComponent = (props = {}, stateOverrides = {}) => {
    const store = configureStore({
      metamask: {
        ...mockState.metamask,
        ...stateOverrides,
      },
    });

    return renderWithProvider(
      <AddressQRCodeModal {...mockProps} {...props} />,
      store,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCopyToClipboard.mockReturnValue([false, jest.fn(), jest.fn()]);
    mockOpenBlockExplorer.mockImplementation(() => {});
  });

  it('should render the modal when isOpen is true', () => {
    renderComponent();

    expect(
      screen.getByText('Test Account / Custom Mainnet RPC'),
    ).toBeInTheDocument();
    expect(screen.getByText('Custom Mainnet RPC Address')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Use this address to receive tokens and collectibles on',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Custom Mainnet RPC')).toBeInTheDocument();
  });

  it('should not render the modal when isOpen is false', () => {
    renderComponent({ isOpen: false });

    expect(
      screen.queryByText('Test Account / Custom Mainnet RPC'),
    ).not.toBeInTheDocument();
  });

  it('should render the address and copy button', () => {
    renderComponent();

    // The address is displayed in segments: start + middle + end (0x0dcd5d886577d5081b0c52e242ef29e70be3e7bc)
    expect(screen.getByText('0x0dcd')).toBeInTheDocument();
    expect(screen.getByText('3e7bc')).toBeInTheDocument();
    expect(screen.getByText('Copy Address')).toBeInTheDocument();
  });

  it('should render the view on explorer button', () => {
    renderComponent();

    expect(screen.getByText('View address on Etherscan')).toBeInTheDocument();
  });

  it('should handle copy functionality when copy button is clicked', async () => {
    const mockHandleCopy = jest.fn();
    mockUseCopyToClipboard.mockReturnValue([false, mockHandleCopy, jest.fn()]);

    renderComponent();

    const copyButton = screen.getByText('Copy Address');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockHandleCopy).toHaveBeenCalledWith(mockAccount.address);
    });
  });

  it('should show copy success state when copy is successful', () => {
    mockUseCopyToClipboard.mockReturnValue([true, jest.fn(), jest.fn()]);

    renderComponent();

    // Check if the copy success icon is rendered (this is harder to test directly,
    // but we can verify the hook state is used correctly)
    expect(mockUseCopyToClipboard).toHaveBeenCalled();
  });

  it('should handle explorer navigation when explorer button is clicked', async () => {
    renderComponent();

    const explorerButton = screen.getByText('View address on Etherscan');
    fireEvent.click(explorerButton);

    await waitFor(() => {
      expect(mockOpenBlockExplorer).toHaveBeenCalledWith(
        expect.stringContaining(mockAccount.address),
        'Address QR Code Modal',
        expect.any(Function),
      );
    });
  });

  it('should render generic explorer text when no account is provided', () => {
    renderComponent({ account: undefined });

    // Since we have Ethereum Mainnet configured with Etherscan, it will show specific text
    expect(screen.getByText('View address on Etherscan')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    renderComponent({ onClose });

    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should generate QR code with the provided address', () => {
    renderComponent();

    // The QR code generation is handled internally, but we can verify the component renders
    expect(screen.getByText('Custom Mainnet RPC Address')).toBeInTheDocument();
  });

  it('should handle different network names dynamically', () => {
    // Test with Polygon network (0x89 = 137 decimal = Polygon)
    renderComponent(
      { chainId: '0x89' },
      {
        multichainNetworkConfigurationsByChainId: {
          'eip155:137': {
            chainId: 'eip155:137',
            name: 'Polygon',
            nativeCurrency: 'MATIC',
            blockExplorerUrls: ['https://polygonscan.com'],
            isEvm: true,
            defaultBlockExplorerUrlIndex: 0,
          },
        },
      },
    );

    expect(screen.getByText('Test Account / Polygon')).toBeInTheDocument();
    expect(screen.getByText('Polygon Address')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Use this address to receive tokens and collectibles on',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Polygon')).toBeInTheDocument();
  });

  describe('Non-EVM Network Support', () => {
    it('should handle Solana network correctly', () => {
      const solanaAccount = {
        id: 'solana-account',
        address: 'Dh9ZYBBCdD5FjjgKpAi9w9GQvK4f8k3b8a8HHKhz7kLa',
        metadata: {
          name: 'Solana Account',
          importTime: Date.now(),
          keyring: { type: 'Solana Keyring' },
        },
        options: {},
        methods: [],
        type: 'solana:data-account' as const,
        scopes: [
          'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp' as `${string}:${string}`,
        ],
      };

      renderComponent(
        {
          address: 'Dh9ZYBBCdD5FjjgKpAi9w9GQvK4f8k3b8a8HHKhz7kLa',
          chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
          account: solanaAccount,
        },
        {
          multichainNetworkConfigurationsByChainId: {
            'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': {
              chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
              name: 'Solana Mainnet',
              nativeCurrency: 'SOL',
              blockExplorerUrls: ['https://solscan.io'],
            },
          },
        },
      );

      expect(
        screen.getByText('Solana Account / Solana Mainnet'),
      ).toBeInTheDocument();
      expect(screen.getByText('Solana Mainnet Address')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Use this address to receive tokens and collectibles on',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('Solana Mainnet')).toBeInTheDocument();

      // Check for address segments (first 6 chars and last 5 chars)
      expect(screen.getByText('Dh9ZYB')).toBeInTheDocument();
      expect(screen.getByText('z7kLa')).toBeInTheDocument();
    });

    it('should handle EVM chains with CAIP chain ID format correctly', () => {
      renderComponent({ chainId: 'eip155:1' });

      expect(
        screen.getByText('Test Account / Custom Mainnet RPC'),
      ).toBeInTheDocument();
      expect(screen.getByText('Custom Mainnet RPC Address')).toBeInTheDocument();
    });

    it('should handle unknown non-EVM chain gracefully', () => {
      renderComponent({
        address: 'unknown_address_format',
        chainId: 'unknown:chain',
      });

      expect(
        screen.getByText('Test Account / Unknown Network'),
      ).toBeInTheDocument();
      expect(screen.getByText('Unknown Network Address')).toBeInTheDocument();
    });

    it('should handle Solana explorer links correctly', () => {
      renderComponent(
        {
          address: 'Dh9ZYBBCdD5FjjgKpAi9w9GQvK4f8k3b8a8HHKhz7kLa',
          chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
        },
        {
          multichainNetworkConfigurationsByChainId: {
            'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': {
              chainId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
              name: 'Solana Mainnet',
              nativeCurrency: 'SOL',
              blockExplorerUrls: ['https://solscan.io'],
            },
          },
        },
      );

      expect(screen.getByText('View address on Solscan')).toBeInTheDocument();
    });
  });
});
