import { useContext, useState } from 'react';
import StudioContext from '../context/StudioContext';
import Studio from '../interfaces/Studio';
import Tattooer from '../interfaces/Tattooer';

type Props = {
  studioData: Studio;
  children: React.ReactNode;
};

export const StudioProvider = ({ studioData, children }: Props) => {
  const [selectedTattooer, setSelectedTattooerInteral] = useState(
    (JSON.parse(String(localStorage.getItem('selectedTattooer'))) as Tattooer) ?? studioData?.tattooer[0]
  );

  const setSelectedTattooer = (tattooer: Tattooer) => {
    setSelectedTattooerInteral(tattooer);
    localStorage.setItem('selectedTattooer', JSON.stringify(tattooer));
  };

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
