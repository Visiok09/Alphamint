import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { NFTContext } from '../context/NFTContext';
import { Loader, NFTCard, Banner, SearchBar } from '../components';
import Image from 'next/image';
import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';
const SellerNFTs = () =>{
    const { fetchTopSeller, currentChainId, currentAccount, currentAddress} = useContext(NFTContext);
    const [nfts, setNfts] = useState([]);
    const [nftsCopy, setNftsCopy] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const address = router.query.address;
    const [activeSelect, setActiveSelect] = useState('Recently Added');
    const [currentPage, setCurrentPage] = useState(1);
    const [loadMore ,setLoadMore] = useState(false);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    
    const loadMoreNFTs = async () => {
      setLoadMore(true);
      const newPage = currentPage + 1;
    
      const newNfts = await fetchTopSeller(address, newPage); // Fetch the next page of NFTs
      if (newNfts.length > 0) {
        setNfts((prevNfts) => [...prevNfts, ...newNfts]); // Append newNfts to the existing ones
        setCurrentPage(newPage);
      
      } else {
        setHasMoreItems(false)
        // Handle the case where there are no more NFTs to load (e.g., hide the "Load More" button)
      }
      setLoadMore(false);
    };
    


//  const loadMoreNFTs = async () => {
//   setLoadMore(true);
//   const newPage = currentPage + 1;
//   console.log(currentPage)
//   const newNfts = await fetchTopSeller(address, newPage);
//   if(newNfts.length > 0){
//     setNfts((prevNfts) => [...prevNfts, ...newNfts]);
//     setCurrentPage(newPage);
//   }else{}
//   setLoadMore(false);
// };


    useEffect(async () => {
      const initialNfts =  await fetchTopSeller(address, currentPage)
      setNfts(initialNfts);
      setNftsCopy( initialNfts);
      setIsLoading(false);
        
        }, [currentChainId]);

  //    useEffect(() => {
  //         const sortedNfts = [...nfts];
      
  //         switch (activeSelect) {
  //           case 'Price (low to high)':
  //             setNfts(sortedNfts.sort((a, b) => a.price - b.price));
  //             break;
  //           case 'Price (high to low)':
  //             setNfts(sortedNfts.sort((a, b) => b.price - a.price));
  //             break;
  //           case 'Recently added':
  //             setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
  //             break;
  //           default:
  //             setNfts(nfts);
  //             break;
  //         }
  //       }, [activeSelect]);

  // const onHandleSearch = (value) => {
  //   const filteredNfts = nfts.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));

  //   if (filteredNfts.length) {
  //     setNfts(filteredNfts);
  //   } else {
  //     setNfts(nftsCopy);
  //   }
  // };
  // const onClearSearch = () => {
  //   if (nfts.length && nftsCopy.length) {
  //     setNfts(nftsCopy);
  //   }
  // };
  
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
                name='Top seller'
                src={images.tick}
                childStyles="text-center mb-4"
                parentStyles="h-80 justify-center"
               
              />
                  
              <div className="flecCenter flex-col -mt-20 z-0">
                <div className="flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 bg-nft-black-2 rounded-full">
                  <Image
                    src={images.creator3}
                    className="rounded-full object-cover"
                    objectFit="cover"

                  />
                  
                </div >
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">{shortenAddress(address)}</p>
              </div>
            </div>
         
              
                <div className="   sm:px-4 p-12 w-full flexCenter flex-col">
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
      
          </div>
           
        
            // <div className="flex justify-center sm:px-4 p-12 min-h-screen">
            //   <div className="w-full minmd:w-4/5">
            //     <div className="mt-4">
            //       <h2 className="font-poppins dark:text-white text-nft-black-1 text-2xl font-semibold mt-2 ml-4 sm:ml-2">NFTs for sale from {shortenAddress (address) }!</h2>
            //       <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            //         {nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft} />)}
            //       </div>
            //     </div>
            //   </div>
            // </div>
          
          );

}

export default SellerNFTs;
