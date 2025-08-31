import { CHAIN_IDS } from '../../../shared/constants/network';

const MAINNET_TOKENS = [
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    symbol: 'DAI',
    decimals: 18,
    image:
      'https://static.metafi.codefi.network/api/v1/tokenIcons/1/0x6b175474e89094c44da98b954eedeac495271d0f.png',
    isERC721: false,
    aggregators: [],
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    decimals: 6,
    image:
      'https://static.metafi.codefi.network/api/v1/tokenIcons/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
    isERC721: false,
    aggregators: [],
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    decimals: 6,
    image:
      'https://static.metafi.codefi.network/api/v1/tokenIcons/1/0xdAC17F958D2ee523a2206206994597C13D831ec7.png',
    isERC721: false,
    aggregators: [],
  },
  {
    address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    symbol: 'SNX',
    decimals: 18,
    image:
      'https://static.metafi.codefi.network/api/v1/tokenIcons/1/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F.png',
    isERC721: false,
    aggregators: [],
  },
  {
    address: '0x111111111117dC0aa78b770fA6A738034120C302',
    symbol: '1INCH',
    decimals: 18,
    image:
      'https://static.metafi.codefi.network/api/v1/tokenIcons/1/0x111111111117dC0aa78b770fA6A738034120C302.png',
    isERC721: false,
    aggregators: [],
  },
  {
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    symbol: 'MATIC',
    decimals: 18,
    image:
      'https://static.metafi.codefi.network/api/v1/tokenIcons/1/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0.png',
    isERC721: false,
    aggregators: [],
  },
  {
    address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    symbol: 'SHIB',
    decimals: 18,
    image:
      'https://static.metafi.codefi.network/api/v1/tokenIcons/1/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE.png',
    isERC721: false,
    aggregators: [],
  },
  {
    address: '0xFd09911130e6930Bf87F2B0554c44F400bD80D3e',
    symbol: 'ETHIX',
    decimals: 18,
    image:
      'https://static.metafi.codefi.network/api/v1/tokenIcons/1/0xFd09911130e6930Bf87F2B0554c44F400bD80D3e.png',
    isERC721: false,
    aggregators: [],
  },
];

export const FIXTURES_ERC20_TOKENS = {
  tokens: MAINNET_TOKENS,
  ignoredTokens: [],
  detectedTokens: [],
  allTokens: {
    [CHAIN_IDS.MAINNET]: {
      myAccount: MAINNET_TOKENS,
    },
    [CHAIN_IDS.OPTIMISM]: {
      myAccount: [
        {
          address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
          symbol: 'DAI',
          decimals: 18,
          image:
            'https://static.metafi.codefi.network/api/v1/tokenIcons/1/0x6b175474e89094c44da98b954eedeac495271d0f.png',
          isERC721: false,
          aggregators: [],
        },
      ],
    },
    [CHAIN_IDS.BASE]: {
      myAccount: [
        {
          address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
          symbol: 'USDC',
          decimals: 6,
        },
        {
          address: '0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452',
          symbol: 'wstETH',
          decimals: 18,
        },
        {
          address: '0x0555E30da8f98308EdB960aa94C0Db47230d2B9c',
          symbol: 'WBTC',
          decimals: 8,
        },
        {
          address: '0x04c0599ae5a44757c0af6f9ec3b93da8976c150a',
          symbol: 'weETH.base',
          decimals: 18,
        },
        {
          address: '0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34',
          symbol: 'USDe',
          decimals: 18,
        },
        {
          address: '0x4200000000000000000000000000000000000006',
          symbol: 'WETH',
          decimals: 18,
        },
        {
          address: '0x820c137fa70c8691f0e44dc420a5e53c168921dc',
          symbol: 'USDS',
          decimals: 18,
        },
        {
          address: '0x8d010bf9c26881788b4e6bf5fd1bdc358c8f90b8',
          symbol: 'DOT',
          decimals: 18,
        },
        {
          address: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
          symbol: 'cbBTC',
          decimals: 8,
        },
        {
          address: '0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2',
          symbol: 'sUSDe',
          decimals: 18,
        },
      ],
    },
  },
  allIgnoredTokens: {},
  allDetectedTokens: {},
};
