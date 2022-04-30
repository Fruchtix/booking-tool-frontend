import style from './Artists.module.css';
import React, { ReactFragment, useEffect, useState } from 'react';
import Tattooer from '../../interfaces/Tattooer';
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const Artists = () => {
  const [tattooer, setTattooer] = useState<Tattooer[]>([
    {
      tattooerID: '',
      studioID: '',
      email: '',
      name: '',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    setTattooer([
      {
        tattooerID: uuidv4(),
        studioID: String(session?.studioID),
        email: 'todo',
        name: '',
      },
    ]);
  }, [session?.studioID]);

  const handleAdd = () => {
    setTattooer(current => [
      ...current,
      {
        tattooerID: uuidv4(),
        studioID: String(session?.studioID),
        email: 'todo',
        name: '',
      },
    ]);
  };

  const handleRemove = (tattooerID: string) => {
    setTattooer(current => current.filter(tattooer => tattooer.tattooerID !== tattooerID));
  };

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setError(false);
    setIsLoading(true);

    // TODO: delete old ones first
    // TODO: limit to 25
    // TODO: display success message or redirect

    axios
      .post('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/tattooer/add', tattooer)
      .then(() => {
        console.log('added');
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
              <div className={style['removeBtn']} onClick={e => handleRemove(tattooer.tattooerID)}>
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
