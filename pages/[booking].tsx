import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { useState } from 'react';
import Tattooer from '../interfaces/Tattooer';

interface Props {
  url: string;
  studioData: any;
}

const BookingPage: NextPage<Props> = props => {
  const { url, studioData } = props;

  const [selectedArtist, setSelectedArtist] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setIsLoading(true);

    if (selectedArtist === '') {
      setError(true);
      setIsLoading(false);
      return;
    }

    const bookingDetails = {
      studioID: studioData[0].studioID,
      userName: userName,
      tattooerID: selectedArtist,
    };

    axios
      .post('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/bookings/add', bookingDetails)
      .then(() => {
        Router.push('/bookings/check-your-mail');
      })
      .catch(err => {
        console.log(err.response.data);
        setIsLoading(false);
        setError(true);
      });
  };

  return (
    <div>
      <h1>BookingPage for {url}</h1>
      <h2>Fill this out and maybe you are lucky to spend way to much money on useless ink</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="artist">Artist:</label>
          <select name="artist" id="artist" value={selectedArtist} onChange={e => setSelectedArtist(e.target.value)}>
            <option value="">Please select</option>
            {studioData[0].tattooer?.map((artist: Tattooer) => (
              <option value={artist.tattooerID} key={artist.tattooerID}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="userName">Name:</label>
          <input
            type="text"
            name="userName"
            id="userName"
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      {isLoading && <div>Loading...</div>}
      {error && <div>An error occured...</div>}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { booking } = context.query;

  const studioData = await axios
    .get('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/studio/by-url/get', {
      params: {
        studioUrl: booking,
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });

  if (studioData.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      url: booking,
      studioData,
    },
  };
};

export default BookingPage;
