import React from 'react';
import { useStudio } from '../../context/StudioContext';
import style from './Requestcontrols.module.css';

interface Props {}

const Requestcontrols = ({}: Props) => {
  const { studioData, selectedTattooer, setSelectedTattooer } = useStudio();

  const handleTattooerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedArtist = studioData.tattooer[e.target.selectedIndex];

    setSelectedTattooer(newSelectedArtist);
  };

  return (
    <div className={style['control-bar']}>
      <select onChange={handleTattooerChange} value={selectedTattooer.tattooerID} name="tattooer" id="tattooer">
        {studioData?.tattooer?.map(tattooer => (
          <option key={tattooer.tattooerID} value={tattooer.tattooerID}>
            {tattooer.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Requestcontrols;
