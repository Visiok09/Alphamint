import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { NFTContext } from '../context/NFTContext';
import { Loader, Button, Modal } from '../components';
import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';

const PaymentBodyCmp = ({ nft, nftCurrency }) => (
  <div className="flex flex-col">
    <div className="flexBetween ">
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
        Item
      </p>
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
        Subtotal
      </p>
    </div>
    <div className="flexBetweenStart my-5">
      <div className="flex-1 flexStartCenter">
        <div className="relative w-28 h-28">
          <Image src={nft.image} layout="fill" objectFit="cover" />
        </div>
      </div>
      <div className="ml-20">
        <p className="font-poppins dark:text-white text-nft-black-1 font-normal text text-sm minlg:text-xl">
          {nft.price} <span className="font-semibold">{nftCurrency}</span>
        </p>
      </div>
    </div>
    <div className="flexBetween mt-5">
      <p className="font-poppins dark:text-white text-nft-black-1 font-normal text text-base minlg:text-xl">
        Seller:
      </p>
      <p className="font-poppins dark:text-white text-nft-black-1 font-normal text text-sm minlg:text-xl">
        {shortenAddress(nft.seller)}
      </p>
    </div>
    <div className="flexBetween mt-10">
      <p className="font-poppins dark:text-white text-nft-black-1 font-normal text text-base minlg:text-xl">
      Service fee:
      </p>
      <p className="font-poppins dark:text-white text-nft-black-1 font-normal text text-sm minlg:text-xl">
        0.0001 <span className="font-semibold">{nftCurrency}</span>
      </p>
    </div>
    <div className="flexBetween mt-10">
      <p className="font-poppins dark:text-white text-nft-black-1 font-normal text text-base minlg:text-xl">
        Total:
      </p>
      <p className="font-poppins dark:text-white text-nft-black-1 font-normal text text-sm minlg:text-xl">
        {(parseFloat(nft.price) + 0.0001).toFixed(5)}{' '}
        <span className="font-semibold">{nftCurrency}</span>
      </p>
    </div>
  </div>
);
const NFTDetails = () => {
  const {
    isLoadingNFT,
    currentAccount,
    nftCurrency,
    buyNFT,
    handleCancellation,
  } = useContext(NFTContext);
  const [isLoading, setIsLoading] = useState(true);
  const [nft, setNft] = useState({
    image: '',
    tokenId: '',
    name: '',
    owner: '',
    price: '',
    seller: '',
  });
  const router = useRouter();
  const [paymentModal, setPaymentModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [buyingModal, setBuyingModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  // const loadMoreNFTs = async () => {
  //   const newPage = currentPage + 1;

  //   const newNfts = await fetchMyNFTsOrListedNFTs('fetchItemsListed', currentPage);
  //   if(newNfts.length > 0){
  //     setNfts((prevNfts) => [...prevNfts, ...newNfts]);
  //     setCurrentPage(newPage);
  //   }

  // };

  useEffect(() => {
    if (!router.isReady) return;

    setNft(router.query);
    setIsLoading(false);
  }, [router.isReady]);

  const checkout = async () => {
    try {
      setBuyingModal(true);
      await buyNFT(nft);
      setBuyingModal(false);
      setPaymentModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    await handleCancellation(nft.tokenId, currentPage);
    setIsCancelling(false);
    router.push('/my-nfts');
  };

  if (isLoading) return <Loader />;

  return (
    <div className="relative flex justify-center md:flex-col min-h-screen">
      <div className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1">
        <div className="relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-557">
          <Image
            src={nft.image}
            objectFit="cover"
            className="rounded-xl shadow-lg"
            layout="fill"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center sm:px-4 p-12 sm:pb-4">
        <div className="flex flex-row sm:flex-col">
          <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">
            {nft.name}
          </h2>
        </div>

        <div className="mt-10">
          <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal">
            Creator
          </p>
          <div className="flex flex-row items-center mt-3">
            <div className="relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
              <Image
                src={images.creator3}
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-semibold">
              {shortenAddress(nft.seller)}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col">
          <div className="w-full border-b dark:border-nft-black-1 border-nft-gray-1 flex flex-row">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base minlg:text-base font-medium mb-2">
              Details
            </p>
          </div>
          <div className="mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal">
              {nft.description}
            </p>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col mt-10">
          {currentAccount === nft.seller.toLowerCase() ? (
            <>
              <Button
                btnName="Cancel listing"
                classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                handleClick={() => {
                  handleCancel(nft.tokenId);
                }}
              />
            </>
          ) : currentAccount === nft.owner.toLowerCase() ? (
            <Button
              btnName="List on Marketplace"
              classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
              handleClick={() =>
                router.push(
                  `/resell-nft?tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}`
                )
              }
            />
          ) : (
            <Button
              btnName={`Buy for ${nft.price} ${nftCurrency}`}
              classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
              handleClick={() => setPaymentModal(true)}
            />
          )}
        </div>
      </div>

      {paymentModal && (
        <Modal
          header="Check Out"
          body={<PaymentBodyCmp nft={nft} nftCurrency={nftCurrency} />}
          footer={
            <div className="flex flex-row sm:flex-col">
              <Button
                btnName="Buy NFT"
                classStyles="mr-5 sm:mb-5 rounded-xl sm:mr-0"
                handleClick={checkout}
              />
              <Button
                btnName="Cancel"
                classStyles="mr-5 sm:mr-0 rounded-xl"
                handleClick={() => setPaymentModal(false)}
              />
            </div>
          }
          handleClose={() => setPaymentModal(false)}
        />
      )}

      {buyingModal && (
        <Modal
          header="Buying NFT ..."
          body={
            <div className="flexCenter flex-col text-center">
              <div className="relative w-52 h-52">
                <Loader />
              </div>
            </div>
          }
          handleClose={() => {
            setPaymentModal(false), setBuyingModal(false);
          }}
        />
      )}

      {isCancelling && (
        <Modal
          header="Cancel Listing ..."
          body={
            <div className="flexCenter flex-col text-center">
              <div className="relative w-52 h-52">
                <Loader />
              </div>
            </div>
          }
          handleClose={() => setIsCancelling(false)}
        />
      )}

      {successModal && (
        <Modal
          header="Payment Successful"
          body={
            <div
              className="flexCenter flex-col text-center"
              onClick={() => setSuccessModal(false)}
            >
              <div className="relative w-52 h-52">
                <Image src={nft.image} objectFit="cover" layout="fill" />
              </div>
              <p className="font-poppins dark:text-white text-nft-black-1 font-normal text text-sm minlg:text-xl mt-10">
                You successfully purchased
                <span className="font-semibold text-success-color">
                  {' '}
                  {nft.name}
                  <span className="text-white"> from</span>
                  <span className="font-semibold text-success-color">
                    {' '}
                    {shortenAddress(nft.seller)}
                  </span>
                </span>
              </p>
            </div>
          }
          footer={
            <div className="flexCenter flex-col">
              <Button
                btnName="Check your NFTs"
                classStyles="sm:mb-5 rounded-xl sm:mr-0"
                handleClick={() => router.push('/my-nfts')}
              />
            </div>
          }
          handleClose={() => setPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default NFTDetails;
