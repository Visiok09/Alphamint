import { useState, useEffect, useContext } from 'react';

import { NFTContext } from '../context/NFTContext';
import { Loader, NFTCard, Banner } from '../components';
import Image from 'next/image';
import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';
const ListedNFTs = () => {
  const { fetchMyNFTsOrListedNFTs, saleCancelled, currentChainId, currentAccount} = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadMore ,setLoadMore] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);

const loadMoreNFTs = async () => {
  setLoadMore(true);
  const newPage = currentPage + 1;

  const newNfts = await fetchMyNFTsOrListedNFTs(newPage); // Fetch the next page of NFTs
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
  
  //   const newNfts = await fetchMyNFTsOrListedNFTs(newPage);
  //   if (newNfts.length > 0) {
  //     setNfts((prevNfts) => [...prevNfts, ...newNfts,]); 
  //     setCurrentPage(newPage);
  //   }
  //   setLoadMore(false);
  // };
  useEffect(async () => {
    if(currentChainId){
      const initialNfts =  await  fetchMyNFTsOrListedNFTs(currentPage)
      setNfts(initialNfts);
      setIsLoading(false); 
    }
    
      }, [saleCancelled, currentChainId, currentAccount]);

  // useEffect(async () => {
  // if(currentChainId){
  //   fetchMyNFTsOrListedNFTs('fetchItemsListed', currentPage)
  //   .then((items) => {
  //     setNfts(items);
  //     setIsLoading(false);
  //     console.log('from ListedNFTs')
  //   });
  // }
   
  // }, [saleCancelled, currentChainId, currentAccount]);



  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!isLoading && nfts.length === 0) {
    return (
      <div className="flexCenter sm:p-4 p-16 min-h-screen">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold">No NFTs Listed for Sale</h1>
      </div>
    );
  }

  return (
    <div className="w-full flex justyfy-start items-center flex-col min-h-screen">
            <div className="w-full flexCenter flex-col">
              <Banner
                name="Your listed NFTs"
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
      
              
                <div className="sm:px-4 p-12 w-full flexCenter flex-col">
                <div className="flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8">
              {/* <SearchBar
                activeSelect={activeSelect}
                setActiveSelect={setActiveSelect}
                handleSearch={onHandleSearch}
                clearSearch={onClearSearch}
              /> */}
            </div>
                  <div className="mt-3 w-full flex flex-wrap">
                    {nfts.map((nft,index) => (
                      <NFTCard
                        key={nft.tokenId}
                        nft={nft}
                        index={index}
                        onProfilePage
                      />
                    ))}
                    
                  </div>
                  {loadMore && (
              <Loader/>
             )}
                </div>

                {hasMoreItems && (
        <button className="buutonLoader" onClick={loadMoreNFTs}>Load More</button>
              )}
                {/* <button className="buutonLoader" onClick={loadMoreNFTs}>Load More</button> */}
            
          </div>
  );
};

export default ListedNFTs;
