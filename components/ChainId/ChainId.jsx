import React, { useState, useEffect } from 'react';
import img from '../../assets';
import Style from './ChainId.module.css';
import Image from 'next/image';

const ChainId = ({ onChangeChain, onMouseLeave }) => {
  const networkHandler = async (e, chainName) => {
    let rpcUrl;

    switch (e) {
      case '0xb56c7':
        rpcUrl = 'https://testnet.rpc.hemi.network/rpc';
        break;
      // case '0x28c60':
      //   rpcUrl = 'https://rpc.katla.taiko.xyz';
      //   break;
      // case '0xa4ba':
      //   rpcUrl = 'https://nova.arbitrum.io/rpc';
      //   break;
      // case '0x44d':
      //   rpcUrl = 'https://zkevm-rpc.com';
      //   break;
      // case '0x144':
      //   rpcUrl = 'https://mainnet.era.zksync.io';
      //   break;
      // case '0xa':
      //   rpcUrl = 'https://mainnet.optimism.io';
      //   break;
      // case '0xe708':
      //   rpcUrl = 'https://mainnet.infura.io/v3/';
      //   break;
      // case '0x2105':
      //   rpcUrl = 'https://base.llamarpc.com';
      //   break;
      // case '0x82750':
      //   rpcUrl = 'https://rpc.scroll.io';
      //   break;
      // // Add more cases for other chainIds and set their respective RPC URLs.

      default:
        // Handle the case for unknown chainIds, or set a default RPC URL.
        rpcUrl = 'https://testnet.rpc.hemi.network/rpc';
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: e }],
      });
      onChangeChain(chainName);
      //window.location.reload();
    } catch (error) {
      if (error.code === 4902) {
        const isAdded = await addNetwork(chainName, e, rpcUrl);
        if (isAdded) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: e }],
          });
          onChangeChain(chainName);
        } else {
          // Handle the case where the user decided not to add the network or encountered an error during network addition.
        }
      } else {
        // Handle other errors that may occur during chain switch.
        // You can display an error message or take appropriate action.
      }
    }
  };

  const addNetwork = async (chainName, chainId, rpcUrl) => {
    try {
      return await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId,
            chainName,
            rpcUrls: [rpcUrl],
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18,
            },
          },
        ],
      });
    } catch (error) {
      // Handle any errors that may occur during network addition.
      // You can display an error message or take appropriate action.
      return false;
    }
  };

  return (
    <div onMouseLeave={onMouseLeave} className={Style.networkStyle}>
      <ul>
      <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xb56c7', 'Hemi Sepolia')}
        >
          <Image src={img.hemi} alt="hemi" width={35} height={35} />
          <b>Hemi Sepolia</b>
        </li>
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x56b29', 'Bitfinity TestNet')}
        >
          <Image src={img.bitfinity} alt="bitfinity" width={35} height={35} />
          <b>Bitfinity TestNet</b>
        </li> */}
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x2e2e', 'Artela TestNet')}
        >
          <Image src={img.artela} alt="nitro" width={35} height={35} />
          <b>Artela TestNet</b>
        </li> */}
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x1670f96e8c', 'Nitrogen')}
        >
          <Image src={img.nitrogen} alt="nitro" width={35} height={35} />
          <b>Nitrogen</b>
        </li> */}
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xe34', 'Botanix Testnet')}
        >
          <Image src={img.botanix} alt="botanix" width={35} height={35} />
          <b>Botanix Testnet</b>
        </li> */}
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xa4ba', 'Arbitrum Nova')}
        >
          <Image src={img.nova} alt="nova" width={35} height={35} />
          <b>Arbitrum Nova</b>
        </li>
        <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xa4b1', 'Arbitrum One')}
        >
          <Image src={img.arbione} alt="arbitrum" width={35} height={35} />
          <b>Arbitrum One</b>
        </li>
        <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x44d', 'Polygon zkEVM')}
        >
          <Image src={img.poly} alt="zkevm" width={35} height={35} />
          <b>Polygon zkEVM</b>
        </li>
        <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x144', 'zkSync Era')}
        >
          <Image src={img.zksera} alt="era" width={35} height={35} />
          <b>zkSync Era</b>
        </li> */}
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xa', 'Optimism')}
        >
          <Image src={img.optimism} alt="optimism" width={35} height={35} />
          <b>Optimism</b>
        </li>
        <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xe708', 'Linea')}
        >
          <Image src={img.linea} alt="linea" width={35} height={35} />
          <b>Linea</b>
        </li> */}
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xa4ba', 'Nova')}
        >
          <Image src={img.nova} alt="nova" width={35} height={35} />
          Nova
        </li> */}
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x2105', 'Base')}
        >
          <Image src={img.base} alt="base" width={35} height={35} />
          <b>Base</b>
        </li> */}
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x1388', 'Mantle')}
        >
          <Image src={img.mantle} alt="mantle" width={35} height={35} />
          <b>Mantle</b>
        </li> */}
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x82750', 'Scroll')}
        >
          <Image src={img.scroll} alt="scroll" width={35} height={35} />
          <b>Scroll</b>
        </li> */}
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x28c60', 'Taiko Katla')}
        >
          <Image src={img.taiko} alt="taiko" width={35} height={35} />
          <b>Taiko Katla</b>
        </li> */}
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x868b', 'Mode')}
        >
          <Image src={img.mode} alt="mode" width={35} height={35} />
          <b>Mode</b>
        </li> */}

        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x89', 'Polygon')}
        >
          <Image src={img.p} width={30} height={30} />
          <p>Polygon</p>
        </li> */}
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x13881', 'Mumbai')}
        >
          <Image src={img.poly} width={30} height={30} />
          <b>Mumbai</b>
        </li>
        <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xaa36a7', 'Sepolia')}
        >
          <Image src={img.ethereum} width={30} height={30} />
          <b>Sepolia</b>
        </li> */}
      </ul>
    </div>
  );
};

export default ChainId;
