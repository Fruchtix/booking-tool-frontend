import { createContext, useContext } from 'react';
import Studio from '../interfaces/Studio';
import Tattooer from '../interfaces/Tattooer';

type StudioContext = {
  studioData: Studio;
  selectedTattooer: Tattooer;
  setSelectedTattooer: Function;
};

const studioContextDefaultValues: StudioContext = {
  studioData: { studioID: '', studioUrl: '', tattooer: [] },
  selectedTattooer: { tattooerID: '', email: '', name: '' },
  setSelectedTattooer: () => {},
};

const StudioContext = createContext<StudioContext>(studioContextDefaultValues);

export function useStudio() {
  return useContext(StudioContext);
}

export default StudioContext;
