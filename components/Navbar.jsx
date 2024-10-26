import React, { useState, useEffect, useContext, useRef } from 'react';
import { BsBoxArrowRight } from 'react-icons/bs';
import { BsPower } from 'react-icons/bs';

import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import web3 from 'web3';
import { AiOutlineStar } from 'react-icons/ai';
import { NFTContext } from '../context/NFTContext';

import images from '../assets';
import Button from './Button';
import config from '../context/config.json';
import arr from '../assets/arrow.png';
import ChainId from './ChainId/ChainId';
import Points from './Points';
import BlockPoints from './BlockPoints';
import Modal from './Modal';
import ModalPoints from './ModalPoints';

const MenuItems = ({ isMobile, active, setActive }) => {
  const generateLink = (i) => {
    switch (i) {
      case 0:
        return '/';
      case 1:
        return '/listed-nfts';
      case 2:
        return '/my-nfts';

      default:
        break;
    }
  };

  return (
    <ul
      className={`list-none flexCenter flex-row ${
        isMobile && 'flex-col h-full'
      }`}
    >
      {['Explore NFTs', 'Listed NFTs', 'My NFTs'].map((item, i) => (
        <li
          key={i}
          onClick={() => {
            setActive(item);

            if (isMobile) {
              // eslint-disable-next-line no-undef
              // setIsOpen(false);
              console.log(`is mobile ${isMobile}`);
            }
          }}
          className={
            isMobile
              ? `flex flex-row items-center font-poppins font-semibold mx-3 text-4xl mb-8 ${
                  active === item
                    ? 'dark:text-white text-nft-black-1'
                    : 'dark:text-nft-gray-3 text-nft-gray-2 '
                }

          `
              : `flex flex-row items-center font-poppins font-semibold text-base dark:hover:text-white hover:text-nft-dark mx-3 ${
                  active === item
                    ? 'dark:text-white text-nft-black-1'
                    : 'dark:text-nft-gray-3 text-nft-gray-2 '
                }
          `
          }
        >
          <Link href={generateLink(i)}>{item}</Link>
        </li>
      ))}
    </ul>
  );
};

// eslint-disable-next-line no-shadow
const ButtonGroup = ({
  setActive,
  router,
  isMobile,
  setIsOpen,
  handleOpenModal,
}) => {
  const {
    checkNetwork,
    connectWallet,
    currentAccount,
    network,
    isMetaMaskInstalled,
  } = useContext(NFTContext);

  return (
    <div className="button-group">
      {isMetaMaskInstalled && currentAccount && network ? (
        <Button
          btnName="Create"
          classStyles={
            isMobile ? 'mx-2 rounded-xl text-2xl' : 'mx-2 rounded-xl'
          }
          handleClick={() => {
            setActive('');
            if (isMobile) {
              setIsOpen(false);
            }
            router.push('/create-nft');
          }}
        />
      ) : (
        <Button
          btnName="Connect"
          classStyles={
            isMobile ? 'mx-2 rounded-xl text-2xl' : 'mx-2 rounded-xl'
          }
          handleClick={handleOpenModal}
        />
      )}
    </div>
  );
};

//   return isMetaMaskInstalled ? (
//     network ? (
//       <Button
//         btnName="Create"
//         classStyles={isMobile ? 'mx-2 rounded-xl text-2xl' : 'mx-2 rounded-xl'}
//         handleClick={() => {
//           setActive('');
//           if (isMobile) {
//             setIsOpen(false);
//           }
//           router.push('/create-nft');
//         }}
//       />
//     ) : (
//       <Button
//         btnName="Switch to Scroll"
//         classStyles={isMobile ? 'mx-2 rounded-xl text-2xl' : 'mx-2 rounded-xl'}
//         handleClick={() => {
//           window.location.reload();

//           // setActive('');
//           // if (isMobile) {
//           //   setIsOpen(false);
//           // }
//         }}
//       />
//     )
//   ) : (
//     <Button
//       btnName="Connect"
//       classStyles={isMobile ? 'mx-2 rounded-xl text-2xl' : 'mx-2 rounded-xl'}
//       handleClick={connectWallet}
//     />
//   );
// };

const checkActive = (active, setActive, router) => {
  switch (router.pathname) {
    case '/':
      if (active !== 'Explore NFTs') setActive('Explore NFTs');
      break;
    case '/listed-nfts':
      if (active !== 'Listed NFTs') setActive('Listed NFTs');
      break;
    case '/my-nfts':
      if (active !== 'My NFTs') setActive('My NFTs');
      break;
    case '/bridge':
      if (active !== 'Bridge') setActive('Bridge');
      break;
    case '/create-nft':
      setActive('');
      break;

    default:
      setActive('');
  }
};

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [active, setActive] = useState('Explore NFTs');
  // eslint-disable-next-line no-shadow
  const [isOpen, setIsOpen] = useState(false);
  const {
    currentChainId,
    userP,
    connectWallet,
    currentAccount,
    network,
    walletConnected,
    setWalletConnected,
    setCurrentAccount,
    setNetwork,
  } = useContext(NFTContext);
  const [networkNotify, setNetworkNotify] = useState(false);

  const [selectedChainName, setSelectedChainName] = useState('Networks');
  const selectorRef = useRef(null);

  const [pointsMenu, setPointsMenu] = useState(false);

  const handlePointsMenu = () => {
    setPointsMenu(!pointsMenu);
  };

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleConnect = async () => {
    await connectWallet();
    setOpenModal(false);
  };

  const [reloadPage, setReloadPage] = useState(false);

  const handleDisconect = async () => {
    setWalletConnected(false);
    setCurrentAccount('');
    setNetwork(false);
    if (window.ethereum && window.ethereum.disconnect) {
      await window.ethereum.disconnect();
    }
    //console.log('Disconect');
  };

  useEffect(() => {
    const storedChainName = localStorage.getItem('selectedChainName');
    if (storedChainName) {
      setSelectedChainName(storedChainName);
    }
  }, []);

  // useEffect(() => {
  //   switch (currentChainId) {
  //     case 96384675468:
  //       setSelectedChainName('Nitrogen');
  //       break;
  //     case 324:
  //       setSelectedChainName('zkSync Era');
  //       break;
  //     case 59144:
  //       setSelectedChainName('Linea');
  //       break;
  //     case 10:
  //       setSelectedChainName('Optimism');
  //       break;
  //     case 42161:
  //       setSelectedChainName('Arbitrum One');
  //       break;
  //     case 42170:
  //       setSelectedChainName('Arbitrum Nova');
  //       break;
  //     case 8453:
  //       setSelectedChainName('Base');
  //       break;
  //     case 167007:
  //       setSelectedChainName('Taiko Jolnir');
  //       break;
  //     case 5000:
  //       setSelectedChainName('Mantle');
  //       break;
  //     case 534352:
  //       setSelectedChainName('Scroll');
  //       break;
  //     case 1101:
  //       setSelectedChainName('Polygon zkEVM');
  //       break;
  //     // Add more cases as needed for other chain IDs
  //     default:
  //       // Handle the default case if none of the conditions match
  //       break;
  //   }
  // }, [currentChainId]);

  // useEffect(() => {

  //   if (currentChainId === 324) {
  //     setSelectedChainName('zkSync Era');
  //   }
  //   if (currentChainId === 59144) {
  //     setSelectedChainName('Linea');
  //   }
  //   if (currentChainId === 10) {
  //     setSelectedChainName('Optimism');
  //   }
  // });

  const onChangeChain = (chainName) => {
    setSelectedChainName(chainName);
    localStorage.setItem('selectedChainName', chainName);
  };

  const openNetwork = () => {
    setNetworkNotify(!networkNotify);
  };

  const hideNetwork = () => {
    setNetworkNotify(false);
  };

  const handleDocumentClick = (event) => {
    // Check if the click event occurred outside the selector component
    if (selectorRef.current && !selectorRef.current.contains(event.target)) {
      setNetworkNotify(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  // useEffect(() => {
  //   // REFRESH EVERY TIME WHEN CHANGE CHAIN OR WALLET
  //   if (window.ethereum) {
  //     window.ethereum.on('chainChanged', () => {
  //       window.location.reload();
  //     });
  //     window.ethereum.on('accountsChanged', () => {
  //       window.location.reload();
  //     });
  //   }
  // }, []);

  useEffect(() => {
    setTheme('dark');
  }, []);

  useEffect(() => {
    checkActive(active, setActive, router);
  }, [router.pathname]);

  // const networkHandler = async (e) => {
  //   await window.ethereum.request({
  //     method: 'wallet_switchEthereumChain',
  //     params: [{ chainId: e.target.value }],
  //   });
  // };

  return (
    <nav
      className="flexBetween w-full fixed z-10 p-4 flex-row border-b
dark:bg-nft-dark
bg-white
dark:border-nft-black-1
border-nft-gray-1"
    >
      <div className="flex flex-1 flex-row justify-start">
        <Link href="/">
          <div
            className="flexCenter md:hidden cursor-pointer"
            onClick={() => setActive('')}
          >
            <Image
              src={images.log}
              objectFit="contain"
              width={35}
              height={35}
              alt="logo"
            />
            <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-1">
              Alphamint
            </p>
          </div>
        </Link>
        <Link href="/">
          <div className="hidden md:flex" onClick={() => setIsOpen(false)}>
            <Image
              src={images.log}
              objectFit="contain"
              width={32}
              height={32}
              alt="logo"
            />
          </div>
        </Link>
      </div>
      {/* {currentChainId !== 167008 && (
        <Points onClick={() => handlePointsMenu()} />
      )} */}
      {/* <Points onClick={() => handlePointsMenu()} /> */}
      {pointsMenu && (
        <ModalPoints
          header="Alphafarm is Live!"
          body={
            <div className=" p-4 flex-col text-center h-full ">
              <p className="font-poppins dark:text-white text-nft-black-1 text-2xl ">
                <span className="font-semibold text-success-color">
                  <span className="text-white"> My points </span>{' '}
                  <span className="text-white">is</span>{' '}
                  <span style={{ color: 'gold' }}>{userP}</span>
                </span>
              </p>
              <p className="font-poppins dark:text-white text-nft-black-1 font-normal text text-sm minlg:text-xl mt-2">
                <span className="text-green-500">Ways to Earn ? </span> <br />
                <span className=" text-xl ">
                  1. Create NFT:{' '}
                  <span className="font-semibold">
                    <span className="text-amber-300">3 pts</span> for each NFT
                    you create on the platform.
                  </span>
                  <br />
                  2. List on Marketplace:{' '}
                  <span className="font-semibold ">
                    <span className="text-amber-300">3 pts</span> for each NFT
                    you list on the marketplace.
                  </span>{' '}
                  <br />
                  3. Buy on Marketplace:{' '}
                  <span className="font-semibold">
                    <span className="text-amber-300">5 pts</span> for each
                    successful NFT purchase.
                  </span>
                  <br />
                  4. Bridge NFT:{' '}
                  <span className="font-semibold ">
                    Stay tuned for details on earning pts for bridging NFTs.
                  </span>
                </span>
              </p>
            </div>
          }
          handleClose={() => setPointsMenu(false)}
        />
      )}
      <div className="flex flex-initial flex-row justify-end">
        <div className="flex items-center mr-2">
          <input
            type="checkbox"
            className="checkbox"
            id="checkbox"
            onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
          <label
            htmlFor="checkbox"
            className="flexBetween w-8 h-4 dark:bg-white bg-black rounded-2xl p-1 relative label cursor-pointer"
          >
            <i className="fas fa-sun" style={{ color: 'white' }} />
            <i className="fas fa-moon" style={{ color: 'black' }} />
            <div className="w-3 h-3 absolute dark:bg-black bg-white rounded-full ball" />
          </label>
        </div>

        <div className="md:hidden flex">
          <MenuItems active={active} setActive={setActive} />
          <div className="ml-4">
            <ButtonGroup
              setActive={setActive}
              router={router}
              handleOpenModal={handleOpenModal}
            />
          </div>
        </div>
      </div>
      {openModal && (
        <ModalPoints
          header="Connect Wallet"
          body={
            <>
              <div className="connectModal" onClick={handleConnect}>
                <Image
                  src={images.metamask}
                  alt="meta"
                  width={35}
                  height={35}
                />{' '}
                <span style={{ fontSize: '30px', marginLeft: '20px' }}>
                  MetaMask
                </span>
              </div>
              <div className="connectModal" onClick={handleConnect}>
                <Image src={images.walet} alt="wallet" width={35} height={35} />{' '}
                <span style={{ fontSize: '30px', marginLeft: '20px' }}>
                  WalletConnect
                </span>
              </div>
            </>
          }
          // footer={
          //   // <div className="flexCenter flex-col">
          //   //   <Button
          //   //     btnName="Check your NFTs"
          //   //     classStyles="sm:mb-5 rounded-xl sm:mr-0"
          //   //     handleClick={() => router.push('/my-nfts')}
          //   //   />
          //   // </div>
          // }
          handleClose={() => setOpenModal(false)}
        />
      )}
      <div className="hidden md:flex ml-2">
        {isOpen ? (
          <Image
            src={images.cross}
            objectFit="contain"
            width={20}
            height={20}
            alt="close"
            onClick={() => setIsOpen(false)}
            className={theme === 'light' ? 'filter invert' : ''}
          />
        ) : (
          <Image
            src={images.menu}
            objectFit="contain"
            width={25}
            height={25}
            alt="menu"
            onClick={() => setIsOpen(true)}
            className={theme === 'light' ? 'filter invert' : ''}
          />
        )}
        {isOpen && (
          <div className="fixed inset-0 top-65 dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col">
            <div className="flex-1 p-4 ">
              <MenuItems
                active={active}
                setActive={setActive}
                isMobile
                setIsOpen={setIsOpen}
              />
            </div>
            <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray-1 flex justify-center">
              <ButtonGroup
                setActive={setActive}
                router={router}
                isMobile
                setIsOpen={setIsOpen}
                handleClick={handleOpenModal}
              />
            </div>

            {/* <BsBoxArrowRight /> */}
          </div>
        )}
      </div>

      <div className="selector" ref={selectorRef}>
        <div id="selectField" onMouseEnter={() => openNetwork()}>
          {selectedChainName}
        </div>
      </div>
      {networkNotify && (
        <ChainId
          onMouseLeave={() => hideNetwork()}
          onChangeChain={onChangeChain}
        />
      )}
      {walletConnected && (
        <div
          onClick={handleDisconect}
          style={{ marginLeft: '5px', cursor: 'pointer' }}
        >
          <BsPower style={{ fontSize: '25px', color: 'red' }} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
