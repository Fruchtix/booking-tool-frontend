import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import style from './CreateBookingUrl.module.css';
import Router from 'next/router';

interface Props {
  currentUrl: string;
}

const CreateBookingUrl = ({ currentUrl }: Props) => {
  const [studioUrl, setStudioUrl] = useState(currentUrl ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async () => {
    setIsLoading(true);
    setIsError(false);

    const alreadyExists = await checkIfUrlIsAlreadyTaken();

    if (alreadyExists.length && alreadyExists[0].studioID !== session?.studioID) {
      setIsLoading(false);
      setIsError(true);
      return;
    }

    const studioData = {
      studioID: session?.studioID,
      studioUrl: studioUrl,
    };

    axios
      .post('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/studio/update', studioData)
      .then(() => {
        // Router.replace('/dashboard');
        console.log('done');
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
        setIsError(true);
      });
  };

  const checkIfUrlIsAlreadyTaken = async () => {
    return await axios
      .get('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/studio/by-url/get', {
        params: {
          studioUrl: studioUrl,
        },
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  };

  if (isLoading) {
    return <div>loading....</div>;
  }

  return (
    <>
      <div className={style['container']}>
        <p className={style['url']}>https://www.tattoo-booking.com/</p>
        <input
          type="text"
          name="studioName"
          id="studioName"
          value={studioUrl}
          required
          onFocus={() => setIsError(false)}
          onChange={e => setStudioUrl(e.target.value)}
        />
      </div>
      <input type="button" value="submit" onClick={handleSubmit} disabled={studioUrl === ''} />
      {isError && <div>Error: Url already taken...</div>}
    </>
  );
};

export default CreateBookingUrl;
