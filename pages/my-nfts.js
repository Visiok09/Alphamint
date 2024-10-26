import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';

import { NFTContext } from '../context/NFTContext';
import { Loader, NFTCard, Banner, SearchBar } from '../components';
import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';

const MyNFTs = () => {
  const { fetchMyNFTsOrListedNFTs, currentAccount, currentChainId, fetchMyNfts } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSelect, setActiveSelect] = useState('Recently Added');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadMore ,setLoadMore] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const loadMoreNFTs = async () => {
    setLoadMore(true);
    const newPage = currentPage + 1;
  
    const newNfts = await fetchMyNfts(newPage); // Fetch the next page of NFTs
    if (newNfts.length > 0) {
      setNfts((prevNfts) => [...prevNfts, ...newNfts]); // Append newNfts to the existing ones
      setCurrentPage(newPage);
    
    } else {
      setHasMoreItems(false)
      // Handle the case where there are no more NFTs to load (e.g., hide the "Load More" button)
    }
    setLoadMore(false);
  };
  

  // const loadMoreNFTs = async () => {
  //   setLoadMore(true);
  //   const newPage = currentPage + 1;
  
  //   const newNfts = await fetchMyNfts(newPage);
  //   if (newNfts.length > 0) {
  //     setNfts((prevNfts) => [...prevNfts, ...newNfts,]); 
  //     setCurrentPage(newPage);
  //   }
  //   setLoadMore(false);
  // };


  useEffect(async () => {
    if (currentAccount) {
      const initialNfts = await fetchMyNfts(currentPage); 
      setNfts(initialNfts);
      // setNftsCopy(initialNfts);
      setIsLoading(false);
    }
  }, [currentChainId, currentAccount]);
  // useEffect(() => {
  //   let isMounted = true;
  
  //   const fetchNFTs = async () => {
  //     setIsLoading(true)
  //     try {
  //       if (currentChainId && currentAccount) {
  //         const initialNfts = await fetchMyNfts(currentChainId, currentPage); 
  //         if (isMounted) {
  //           setNfts(initialNfts);
  //           setNftsCopy(initialNfts);
  //           setIsLoading(false);
  //         }
  //       }
  //     } catch (error) {
  //      console.log(error)
  //     }
  //   };
  
  //   fetchNFTs();
  
  //   return () => {
  //     isMounted = false; // Cancel ongoing fetch operations
  //   };
  // }, [currentChainId, currentAccount]);
  


  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelect) {
      case 'Price (low to high)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price (high to low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case 'Recently added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(nfts);
        break;
    }
  }, [activeSelect]);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  const onHandleSearch = (value) => {
    const filteredNfts = nfts.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));

    if (filteredNfts.length) {
      setNfts(filteredNfts);
    } else {
      setNfts(nftsCopy);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };
  
  return (
    <div className="w-full flex justyfy-start items-center flex-col min-h-screen">
      <div className="w-full flexCenter flex-col">
        <Banner
          name="Your NFTs"
          childStyles="text-center mb-4"
          parentStyles="h-80 justify-center"
        />
        <div className="flecCenter flex-col -mt-20 z-0">
          <div className="flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 bg-nft-black-2 rounded-full">
            <Image
              src={images.creator9}
              className="rounded-full object-cover"
              objectFit="cover"
            />
          </div>
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">{shortenAddress(currentAccount)}</p>
        </div>
      </div>

      {!isLoading && !nfts.length && !nftsCopy.length ? (
        <div className="flexCenter sm:p-4 p-16">
          <h1 className="font-poppins dark:text-white text-nft-black-1 font-extrabold text-3xl mt-6">No NFTs Owned</h1>
        </div>
      )
        : (
          <div className="sm:px-4 p-12 w-full flexCenter flex-col">
            <div className="flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8">
              <SearchBar
                activeSelect={activeSelect}
                setActiveSelect={setActiveSelect}
                handleSearch={onHandleSearch}
                clearSearch={onClearSearch}
              />
            </div>
            <div className="mt-4 w-full flex flex-wrap">
              {nfts.map((nft) => (
                <NFTCard
                  key={nft.tokenId}
                  nft={nft}
                  onProfilePage
                />
              ))}
            </div>
            {loadMore && (
              <Loader/>
             )}
                 {hasMoreItems && (
        <button className="buutonLoader" onClick={loadMoreNFTs}>Load More</button>
              )}
            {/* <button className="buutonLoader" onClick={loadMoreNFTs}>Load More</button> */}
          </div>
        )}

    </div>
  );
};

export default MyNFTs;
