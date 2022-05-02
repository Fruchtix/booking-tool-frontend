import { useContext, useState } from 'react';
import StudioContext from '../context/StudioContext';
import Studio from '../interfaces/Studio';

type Props = {
  studioData: Studio;
  children: React.ReactNode;
};

export const StudioProvider = ({ studioData, children }: Props) => {
  const [selectedTattooer, setSelectedTattooer] = useState(studioData?.tattooer[0]);

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
