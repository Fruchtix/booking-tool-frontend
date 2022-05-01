import style from './Artists.module.css';
import React, { useState } from 'react';
import Tattooer from '../../interfaces/Tattooer';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Studio from '../../interfaces/Studio';

interface Props {
  studioData: Studio;
}

const Artists = ({ studioData }: Props) => {
  const [tattooer, setTattooer] = useState<Tattooer[]>(
    studioData.tattooer ?? [
      {
        tattooerID: uuidv4(),
        email: 'todo',
        name: '',
      },
    ]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleAdd = () => {
    setTattooer(current => [
      ...current,
      {
        tattooerID: uuidv4(),
        email: 'todo',
        name: '',
      },
    ]);
  };

  const handleRemove = (tattooerID: string) => {
    // TODO: open confirm modal
    setTattooer(current => current.filter(tattooer => tattooer.tattooerID !== tattooerID));
  };

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setError(false);
    setIsLoading(true);

    axios
      .post('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/studio/update', {
        ...studioData,
        tattooer: tattooer,
      })
      .then(() => {
        console.log('done');
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
        setError(true);
      });
  };

  const handleArtistNameChange = (e: React.ChangeEvent<HTMLInputElement>, tattoerID: string) => {
    setTattooer(current =>
      current.map(tattooer => {
        if (tattooer.tattooerID === tattoerID) {
          return { ...tattooer, name: e.target.value };
        }

        return tattooer;
      })
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          {tattooer.map((tattooer, index) => (
            <div key={tattooer.tattooerID} className={style['row']}>
              <input
                type="text"
                name="artistName"
                id={tattooer.name}
                value={tattooer.name}
                required
                onChange={e => handleArtistNameChange(e, tattooer.tattooerID)}
                placeholder="Artist name"
              />
              <div className={style['removeBtn']} onClick={() => handleRemove(tattooer.tattooerID)}>
                x
              </div>
            </div>
          ))}

          <div onClick={handleAdd}>Add</div>
        </div>

        <button>save</button>
      </form>

      {isLoading && <div>laoding...</div>}
      {error && <div>error...</div>}
    </>
  );
};

export default Artists;
