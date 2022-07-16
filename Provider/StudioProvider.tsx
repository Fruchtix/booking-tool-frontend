import { useContext, useEffect, useState } from 'react';
import * as cookie from 'cookie';
import StudioContext from '../context/StudioContext';
import Studio from '../interfaces/Studio';
import Tattooer from '../interfaces/Tattooer';

type Props = {
  studioData: Studio;
  children: React.ReactNode;
};

export const StudioProvider = ({ studioData, children }: Props) => {
  const [selectedTattooer, setSelectedTattooerInteral] = useState<Tattooer>({
    tattooerID: '',
    email: '',
    name: '',
  });

  const setSelectedTattooer = (tattooer: Tattooer) => {
    setSelectedTattooerInteral(tattooer);
    document.cookie = `selectedTattooer=${JSON.stringify(tattooer)}; expires=Thu, 18 Dec 2100 12:00:00 UTC; path=/`;
  };

  useEffect(() => {
    const parsedCookies = cookie.parse(document.cookie);
    const selectedTatooer = parsedCookies?.selectedTattooer ? JSON.parse(parsedCookies.selectedTattooer) : null;

    setSelectedTattooerInteral((selectedTatooer as Tattooer) ?? studioData?.tattooer[0]);
  }, [studioData?.tattooer]);

  const value = {
    studioData,
    selectedTattooer: selectedTattooer,
    setSelectedTattooer,
  };

  return (
    <>
      <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
    </>
  );
};
