import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineStar } from 'react-icons/ai';

import { useQuery } from '@apollo/client';
import { getUserPoint } from '../graphql/getUserPoints';
import { NFTContext } from '../context/NFTContext';

const Points = ({ onClick }) => {
  const { currentAccount, userP, setUserP } = useContext(NFTContext);

  useEffect(() => {
    const handleUserPoints = async () => {
      //console.log('Master', currentAccount);
      try {
        const points = await getUserPoint(
          '0x2bd8b4a962af9aa594f3746791cbc0ab0ccff104'
        );

        console.log('User points loaded:', points);
        setUserP(points);
      } catch (error) {
        console.log('Error loading user points:', error);
      }
    };
    handleUserPoints();
  }, [currentAccount]);

  // useEffect(() => {
  //   console.log('Updated userPoints:', userPoints);
  // }, [userP]);

  // const handleUserPoints = async () => {
  //   console.log(account);
  //   try {
  //     const points = await loadUserPoints(account, dispatch);
  //     console.log('User points loaded:', points);
  //   } catch (error) {
  //     console.log('Error loading user points:', error);
  //   }
  // };

  ///
  // useEffect(() => {
  //   const fetchUserPoints = async () => {
  //     try {
  //       const response = await loadUserPoints(account, dispatch);
  //       setUserP(response);
  //     } catch (error) {
  //       console.log('Error loading user points:', error);
  //     }
  //   };

  //   if (account) {
  //     fetchUserPoints();
  //   }
  // }, [account, dispatch]);

  //Manual fetch
  // const handleUserPoints = async () => {
  //   console.log(account);
  //   try {
  //     const points = await loadUserPoints(account, dispatch);
  //     console.log('User points loaded:', points);
  //   } catch (error) {
  //     console.log('Error loading user points:', error);
  //   }
  // };
  return (
    //<div className="points-block" onClick={handleUserPoints}>
    <div className="points-block" onClick={onClick}>
      <AiOutlineStar style={{ fontSize: 20 }} />
      <span className="">{userP}</span>
    </div>
  );
};

export default Points;
