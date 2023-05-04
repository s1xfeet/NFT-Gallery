import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import { Network, Alchemy } from "alchemy-sdk";
import { useEffect } from 'react';
import { NFTCard } from './components/NFTCard';



const inter = Inter({ subsets: ['latin'] })




export default function Home() {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState("");
  const [fetchForCollection, setFetchForCollection] = useState(false);


  
  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");
  
    const settings = {
      apiKey: process.env.API_KEY,
      network: Network.ETH_MAINNET,
    };
  
    const alchemy = new Alchemy(settings);
  
    // Get all NFTs owned by 'wallet'
    const allNfts = await alchemy.nft.getNftsForOwner(wallet);
  
    if (!collection.length) {
      nfts = allNfts;
    } else {
      // query into nft object to get only the nfts from the collection
      nfts = {
        ownedNfts: allNfts.ownedNfts.filter(
          (nft) => nft.contract.address.toLowerCase() === collection.toLowerCase()
        ),
      };
      console.log(collection);
    }
  
    if (nfts) {
      console.log("nfts: ", nfts);
      setNFTs(nfts.ownedNfts);
    }
  };
  

  const fetchNFTsForCollection = async () => {
    if(collection.length){
      const settings = {
        apiKey: process.env.API_KEY,
        network: Network.ETH_MAINNET,
      };
      const alchemy = new Alchemy(settings);
      const nftCollection = await alchemy.nft.getNftsForContract(collection);

      if(nftCollection){
        console.log("NFTs in collection: ", nftCollection);
        setNFTs(nftCollection.nfts);
      }
    }

  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          disabled={fetchForCollection}
          type="text"
          placeholder="Add your wallet address"
          onChange={(e) => {setWalletAddress(e.target.value)}}
        ></input>
        <input
          type="text"
          placeholder="Add the collection address"
          onChange={(e) => {setCollectionAddress(e.target.value)}}
        ></input>
        <label className="text-gray-600 ">
          <input
            onChange={(e) => {
              setFetchForCollection(e.target.checked);
            }}
            type="checkbox"
            className="mr-2"
          ></input>
          Fetch for collection
        </label>
        <button
          className="disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
          onClick={() => {
            if (fetchForCollection) {
              fetchNFTsForCollection();
            } else fetchNFTs();
          }}
        >
          Let's go!
        </button>
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {NFTs.length &&
          NFTs.map((nft) => {
            return <NFTCard nft={nft}></NFTCard>;
          })}
      </div>
    </div>
  );
}