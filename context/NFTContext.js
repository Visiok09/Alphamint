import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import Web3 from 'web3';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';
const fs = require('fs');
import * as zksync from 'zksync-web3';
import { Wallet, Provider } from 'zksync-web3';


import { MarketAddress, MarketAddressABI, ZK_TEST_ABI } from './constants';

import LZ from './LZnft.json';
import config from './config.json';
import NFTABI from './nftMarket.json';
import inherit from './inherit.json';

import { storeUserPoint } from '../graphql/storeUser';

import rnft from './rnft.json';

// import { NEXT_PUBLIC_PROJECT_ID, NEXT_PUBLIC_SECRECT_KEY } from '../secret';
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_SECRECT_KEY;

const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString(
  'base64'
)}`;

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [network, setNetwork] = useState(false);
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  const [marketContract, setMarketContract] = useState([]);
  const [currentChainId, setCurrentChain] = useState(null);
  //const ABIMARKET = MarketAddressABI;

  const ABIMARKET = NFTABI;

  const [saleCancelled, setSaleCancelled] = useState([]);
  const [creatingNft, setCreatingNft] = useState(false);

  const [signature, setSignature] = useState(null);

  const nftsPerPage = 15;

  const [nftCurrency, setNftCurrency] = useState('ETH');
  //const nftCurrency = 'ETH';
  const CONF = config;

  const INHERIT = inherit.abi;

  const REV = rnft;

  const [userP, setUserP] = useState(0);

  const [walletConnected, setWalletConnected] = useState(false);

  //CONNECT WALLET

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.log('Please install MetaMask for using our NFT platform!');
      return;
    }
    // INITIATE CONNECTION METAMASK
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    if (provider) {
      console.log('META');
      setIsMetaMaskInstalled(true);
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length) {
      try {
        //const account = ethers.utils.getAddress(accounts[0]);
        //setCurrentAccount(account);
        setCurrentAccount(accounts[0]);
        await checkNetwork();
        setWalletConnected(true);
        //console.log('ACCOUNT', accounts[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('No accounts found.');
    }
    if (!window.ethereum) {
      console.log('Please install MetaMask for using our NFT platform!');
      return;
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', async () => {
        await checkNetwork();
      });

      window.ethereum.on('accountsChanged', () => {
        if (walletConnected) {
          window.location.reload();
        }
      });
    }
  }, [walletConnected, currentAccount, currentChainId]);

  // useEffect(() => {
  //   connectWallet();
  // }, []);

  // useEffect(async () => {

  // }, []);

  //set provider
  // console.log(currentChainId, nftCurrency);

  const targetChainId = [
    743111
  ];
  // console.log(currentChainId);
  // const targetChainId = [420, 421613];
  const defaultChainId = 743111;
  //CHECK NETWORK
  const checkNetwork = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const { chainId } = await provider.getNetwork();

    if (targetChainId.includes(chainId)) {
      setCurrentChain(chainId);

      setNetwork(true);
      return chainId;
    } else {
      console.log('error from checkNetwork');
      const web3 = new Web3();
      if (window.ethereum.networkVersion !== defaultChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3.utils.toHex(defaultChainId) }],
          });
        } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainName: 'Hemi Sepolia',
                  chainId: web3.utils.toHex(defaultChainId),
                  nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
                  rpcUrls: ['https://testnet.rpc.hemi.network/rpc'],
                },
              ],
            });
          }
        }
      }
    }
  };

  // useEffect(() => {
  //   checkNetwork();
  // }, [currentChainId, currentAccount]);

  // console.log(currentChainId);
  // useEffect(() => {
  //   if (currentChainId === 3636) {
  //     setNftCurrency('BTC');
  //   } else if (currentChainId === 355113) {
  //     setNftCurrency('BFT');
  //   } else {
  //     setNftCurrency('ETH');
  //   }
  // }, [currentChainId]);

  // useEffect(() => {
  //   if (currentChainId === 324) {
  //     alert(
  //       'Hi, zkSync Era is still in the developed stage. It may take some time for display NFTs. Thank you for understanding'
  //     );
  //   }
  // }, [currentChainId]);
  // const [provider, setProvider] = useState(null);
  // const handleProvider = async(currentChainId) => {
  //    const PROVIDER = new ethers.providers.JsonRpcProvider(
  //      `${CONF[currentChainId]["market"]["rpc"]}`)
  //    setProvider(PROVIDER);
  //    return provider;
  // }
  //FETCH INHERIT
  const fetchRNFTs = async (currentPage) => {
    setIsLoadingNFT(false);
    console.log(currentPage, ' Fetch RNFTS');
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    //const provider = new ethers.providers.Web3Provider(connection);

    // const provider = new ethers.providers.JsonRpcProvider(
    //   `${CONF[currentChainId]["market"]["rpc"]}`
    //  );
    let provider; // Declare the provider variable here

    if (currentChainId === 324) {
      provider = new Provider('https://mainnet.era.zksync.io');
    } else {
      provider = new ethers.providers.Web3Provider(connection);
    }

    // const signer = provider.getSigner();
    // console.log(`chain id from fetcNfts ${currentChainId}`)

    const MARKETADDR = CONF[currentChainId]?.['market']?.['address'];
    const REVERSEADDR = REV[currentChainId]?.['market']?.['address'];

    const contractReverse = new ethers.Contract(REVERSEADDR, INHERIT, provider);
    const contract = new ethers.Contract(MARKETADDR, ABIMARKET, provider);

    //const data = await contract.fetchMarketItems();
    const data = await contractReverse.fetchItemsFromMarketContractToReverseIt(
      currentPage
    );
    console.log(data);
    const items = await Promise.all(
      data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const {
          data: { image, name, description },
        } = await axios.get(tokenURI);
        const price = ethers.utils.formatUnits(
          unformattedPrice.toString(),
          'ether'
        );

        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          name,
          image,
          description,
          tokenURI,
        };
      })
    );

    const sortedItems = items.sort((a, b) => b.tokenId - a.tokenId);
    // const startIndex = (currentPage - 1) * nftsPerPage;
    // const endIndex = startIndex + nftsPerPage;
    // const itemsToShow = sortedItems.slice(startIndex, endIndex);
    setIsLoadingNFT(false);
    return sortedItems;
  };

  const fetchNFTs = async (currentPage) => {
    // setIsLoadingNFT(false);
    //console.log(currentPage, 'From Fetch Nfts');
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    //const provider = new ethers.providers.Web3Provider(connection);

    // const provider = new ethers.providers.JsonRpcProvider(
    //   `${CONF[currentChainId]["market"]["rpc"]}`
    //  );
    let provider; // Declare the provider variable here

    if (currentChainId === 324) {
      provider = new Provider('https://mainnet.era.zksync.io');
    } else {
      provider = new ethers.providers.Web3Provider(connection);
    }

    // const signer = provider.getSigner();
    // console.log(`chain id from fetcNfts ${currentChainId}`)

    const MARKETADDR = CONF[currentChainId]?.['market']?.['address'];
    //const REVERSEADDR = REV[currentChainId]?.['market']?.['address'];

    //const contractReverse = new ethers.Contract(REVERSEADDR, INHERIT, provider);
    const contract = new ethers.Contract(MARKETADDR, ABIMARKET, provider);

    const data = await contract.fetchMarketItems();
    // const data = await contractReverse.fetchItemsFromMarketContractToReverseIt(
    //   currentPage
    // );
    //console.log(data);
    const items = await Promise.all(
      data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const {
          data: { image, name, description },
        } = await axios.get(tokenURI);
        const price = ethers.utils.formatUnits(
          unformattedPrice.toString(),
          'ether'
        );

        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          name,
          image,
          description,
          tokenURI,
        };
      })
    );

    const sortedItems = items.sort((a, b) => b.tokenId - a.tokenId);
    const startIndex = (currentPage - 1) * nftsPerPage;
    const endIndex = startIndex + nftsPerPage;
    const itemsToShow = sortedItems.slice(startIndex, endIndex);
    setIsLoadingNFT(false);
    return itemsToShow;
  };

  //FETCH NFTS
  // const fetchNFTs = async (currentPage) => {
  //   setIsLoadingNFT(false);
  //   // console.log(currentPage);
  //   const web3Modal = new Web3Modal();
  //   const connection = await web3Modal.connect();
  //   //const provider = new ethers.providers.Web3Provider(connection);

  //   // const provider = new ethers.providers.JsonRpcProvider(
  //   //   `${CONF[currentChainId]["market"]["rpc"]}`
  //   //  );
  //   let provider; // Declare the provider variable here

  //   if (currentChainId === 324) {
  //     provider = new Provider('https://mainnet.era.zksync.io');
  //   } else {
  //     provider = new ethers.providers.Web3Provider(connection);
  //   }

  //   // const signer = provider.getSigner();
  //   // console.log(`chain id from fetcNfts ${currentChainId}`)

  //   const MARKETADDR = CONF[currentChainId]?.['market']?.['address'];

  //    const contract = new ethers.Contract(MARKETADDR, ABIMARKET, provider);
  //   // const contract = new ethers.Contract(MARKETADDR, ABIMARKET, provider);

  //   // console.log(contract.address);
  //   // const contract = await fetchContract(provider);
  //   // const itemsPerPage = 2;
  //   //const data = await contract.fetchMarketItems(currentPage);
  //   const data = await contract.fetchMarketItems();
  //   const items = await Promise.all(
  //     data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
  //       const tokenURI = await contract.tokenURI(tokenId);
  //       const {
  //         data: { image, name, description },
  //       } = await axios.get(tokenURI);
  //       const price = ethers.utils.formatUnits(
  //         unformattedPrice.toString(),
  //         'ether'
  //       );

  //       return {
  //         price,
  //         tokenId: tokenId.toNumber(),
  //         seller,
  //         owner,
  //         name,
  //         image,
  //         description,
  //         tokenURI,
  //       };
  //     })
  //   );

  //   const sortedItems = items.sort((a, b) => b.tokenId - a.tokenId);
  //   const startIndex = (currentPage - 1) * nftsPerPage;
  //   const endIndex = startIndex + nftsPerPage;
  //   const itemsToShow = sortedItems.slice(startIndex, endIndex);
  //   setIsLoadingNFT(false);
  //   return itemsToShow;

  //   // const sortedItems = items.sort((a, b) => b.tokenId - a.tokenId);
  //   // const startIndex = 0;
  //   // const endIndex = Math.min(sortedItems.length, nftsPerPage);
  //   // const itemsToShow = sortedItems.slice(startIndex, endIndex);
  //   // setIsLoadingNFT(false);
  //   // return itemsToShow;
  // };

  //fetch mynfts
  const fetchMyNfts = async (currentPage) => {
    setIsLoadingNFT(false);

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    // const rpcUrl = CONF[currentChainId]["market"]["rpc"];
    // const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    // const provider = new ethers.providers.JsonRpcProvider(
    //   `${CONF[currentChainId]["market"]["rpc"]}`
    //  );

    const signer = provider.getSigner();

    // const contract = await fetchContract(signer);

    const MARKETADDR = CONF[currentChainId]?.['market']?.['address'];
    const contract = new ethers.Contract(MARKETADDR, ABIMARKET, signer);
    const data = await contract.fetchMyNFTs();
    const items = await Promise.all(
      data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const {
          data: { image, name, description },
        } = await axios.get(tokenURI);
        const price = ethers.utils.formatUnits(
          unformattedPrice.toString(),
          'ether'
        );

        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          name,
          image,
          description,
          tokenURI,
        };
      })
    );

    const sortedItems = items.sort((a, b) => b.tokenId - a.tokenId);

    const startIndex = (currentPage - 1) * nftsPerPage;
    const endIndex = startIndex + nftsPerPage;
    const itemsToShow = sortedItems.slice(startIndex, endIndex);

    setIsLoadingNFT(false);
    return itemsToShow;
  };

  //FETCH MYORLISTEDNFTS
  const fetchMyNFTsOrListedNFTs = async (currentPage) => {
    setIsLoadingNFT(false);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    // console.log(`chainId from fetchMyNFTsOrListedNFTs ${currentChainId}`)
    // const contract = await fetchContract(signer);

    // const provider = new ethers.providers.JsonRpcProvider(
    //   `${CONF[currentChainId]["market"]["rpc"]}`
    //  );

    const MARKETADDR = CONF[currentChainId]?.['market']?.['address'];

    const contract = new ethers.Contract(MARKETADDR, ABIMARKET, signer);

    const data = await contract.fetchItemsListed();

    const items = await Promise.all(
      data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const {
          data: { image, name, description },
        } = await axios.get(tokenURI);
        const price = ethers.utils.formatUnits(
          unformattedPrice.toString(),
          'ether'
        );

        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          name,
          image,
          description,
          tokenURI,
        };
      })
    );

    const sortedItems = items.sort((a, b) => b.tokenId - a.tokenId);

    const startIndex = (currentPage - 1) * nftsPerPage;
    const endIndex = startIndex + nftsPerPage;
    const itemsToShow = sortedItems.slice(startIndex, endIndex);

    setIsLoadingNFT(false);
    return itemsToShow;
  };
  //FETCH TOPSELLER
  const fetchTopSeller = async (_seller, currentPage) => {
    setIsLoadingNFT(false);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = await fetchContract(signer);

    const data = await contract.fetchSellerNFTs(_seller);

    const items = await Promise.all(
      data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const {
          data: { image, name, description },
        } = await axios.get(tokenURI);
        const price = ethers.utils.formatUnits(
          unformattedPrice.toString(),
          'ether'
        );

        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          name,
          image,
          description,
          tokenURI,
        };
      })
    );
    const sortedItems = items.sort((a, b) => b.tokenId - a.tokenId);

    const startIndex = (currentPage - 1) * nftsPerPage;
    const endIndex = startIndex + nftsPerPage;
    const itemsToShow = sortedItems.slice(startIndex, endIndex);

    setIsLoadingNFT(false);
    return itemsToShow;
  };

  //FETCH CONTRACT
  const fetchContract = async (signerOrProvider) => {
    if (currentChainId) {
      const MARKETADDR = CONF[currentChainId]?.market.address;

      const contractInstance = new ethers.Contract(
        MARKETADDR,
        ABIMARKET,
        signerOrProvider
      );

      setMarketContract(contractInstance);

      return contractInstance;
    } else {
      console.log('error form fetchcontract');
    }
  };
  //UPLOAD TO IPFS
  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });

      const url = `https://nft-market-online.infura-ipfs.io/ipfs/${added.path}`;

      return url;
    } catch (error) {
      console.log('Error uploading file to IPFS.');
      console.log(error);
    }
  };
  //CREATE NFT
  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;

    const data = JSON.stringify({ name, description, image: fileUrl });

    try {
      const added = await client.add(data);

      const url = `https://nft-market-online.infura-ipfs.io/ipfs/${added.path}`;

      await createSale(url, price);

      router.push('/');
    } catch (error) {
      console.log('Error uploading file to IPFS.');
      console.log(error);
    }
  };
  //CREATE SALE
  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    // const contract = await fetchContract(signer);
    const MARKETADDR = CONF[currentChainId]?.market.address;

    const contract = new ethers.Contract(MARKETADDR, ABIMARKET, signer);
    // console.log(`addr from createSale ${contract.address}`);
    // const listingPrice = await contract.getListingPrice();
    const listingPriceInEther = 0.0001;
    const listingPriceInWei = ethers.utils.parseEther(
      listingPriceInEther.toString()
    );

    const transaction = !isReselling
      ? await contract.createToken(url, price, {
          value: listingPriceInWei.toString(),
        })
      : await contract.resellToken(id, price, {
          value: listingPriceInWei.toString(),
        });
    // if (currentChainId !== 167008) {
    //   try {
    //     const updatedPoints = userP + 3;
    //     console.log('UpdatedPoints', updatedPoints);
    //     // Update points in the database
    //     await storeUserPoint(currentAccount, updatedPoints);

    //     // Update user points state in the frontend
    //     setUserP(updatedPoints);
    //   } catch (error) {
    //     console.error(
    //       'Error updating user points after creating token:',
    //       error.message
    //     );
    //   }
    // }

    setIsLoadingNFT(true);
    await transaction.wait();
  };
  //Cancel SALE
  const cancelSale = async (tokenId) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      // const MARKETADDR = CONF[currentChainId]?.market.address;
      // const contract = new ethers.Contract(MARKETADDR, ABIMARKET, signer);
      const contract = await fetchContract(signer);

      const transaction = await contract.cancelListing(tokenId);

      setIsLoadingNFT(true);
      await transaction.wait();
    } catch (error) {
      console.log(error);
    }
  };
  //HandleCancellation
  const handleCancellation = async (tokenId, currentPage) => {
    await cancelSale(tokenId);

    const updatedNFTs = await fetchMyNFTsOrListedNFTs(
      'fetchItemsListed',
      currentPage
    );
    const filteredNFTs = updatedNFTs.filter((item) => item.tokenId !== tokenId);

    //   const startIndex = (currentPage - 1) * nftsPerPage;
    //  const endIndex = startIndex + nftsPerPage;
    //  const itemsToShow = filteredNFTs.slice(startIndex, endIndex);

    setSaleCancelled(filteredNFTs);
    // setDisplayedNFTs(itemsToShow);
    setIsLoadingNFT(false);
  };
  const buyNFT = async (nft) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    try {
      setIsLoadingNFT(true);

      const contract = await fetchContract(signer);

      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
      const listingPriceInEther = await contract.getListingPrice();
      const totalAmountWei = price.add(listingPriceInEther);

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: totalAmountWei,
      });

      await transaction.wait();

      if (currentChainId !== 167008) {
        // Update user points in the database
        console.log('1kkk');
        const updatedPoints = userP + 5;
        console.log('UpdatedPoints', updatedPoints);
        await storeUserPoint(currentAccount, updatedPoints);

        // Update user points state in the frontend
        setUserP(updatedPoints);
      }

      setIsLoadingNFT(false);
    } catch (error) {
      console.error('Error during NFT purchase:', error.message);
      setIsLoadingNFT(false);
      // Handle error, show an alert, etc.
    }
  };

  // const buyNFT = async (nft) => {
  //   const web3Modal = new Web3Modal();
  //   const connection = await web3Modal.connect();
  //   const provider = new ethers.providers.Web3Provider(connection);
  //   const signer = provider.getSigner();

  //   const contract = await fetchContract(signer);

  //   const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
  //   const listingPriceInEther = await contract.getListingPrice();
  //   const totalAmountWei = price.add(listingPriceInEther);

  //   const transaction = await contract.createMarketSale(nft.tokenId, {
  //     value: totalAmountWei,
  //   });

  //   setIsLoadingNFT(true);
  //   await transaction.wait();
  //   try {
  //     const updatedPoints = userP + 5;
  //     console.log('UpdatedPoints', updatedPoints);
  //     // Update points in the database
  //     await storeUserPoint(currentAccount, updatedPoints);

  //     // Update user points state in the frontend
  //     setUserP(updatedPoints);
  //   } catch (error) {
  //     console.error(
  //       'Error updating user points after creating token:',
  //       error.message
  //     );
  //   }
  //   setIsLoadingNFT(false);

  // };

  const value = {
    checkNetwork,
    nftCurrency,
    currentChainId,
    fetchMyNfts,
    fetchTopSeller,
    connectWallet,
    currentChainId,
    marketContract,
    handleCancellation,
    currentAccount,
    uploadToIPFS,
    createNFT,
    fetchNFTs,
    fetchMyNFTsOrListedNFTs,
    buyNFT,
    createSale,
    cancelSale,
    setIsLoadingNFT,
    network,
    isMetaMaskInstalled,
    nftsPerPage,
    userP,
    setUserP,
    fetchRNFTs,
    walletConnected,
    setWalletConnected,
    setCurrentAccount,
    setNetwork,
  };
  //value={{ nftCurrency,currentChainId, fetchMyNfts, fetchTopSeller,  connectWallet, currentChainId, marketContract, handleCancellation, currentAccount, uploadToIPFS, createNFT, fetchNFTs, fetchMyNFTsOrListedNFTs, buyNFT, createSale, cancelSale,  setIsLoadingNFT, network, isMetaMaskInstalled }}
  return <NFTContext.Provider value={value}>{children}</NFTContext.Provider>;
};
