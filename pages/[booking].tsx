import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { useState } from 'react';

interface Props {
  url: string;
  studioData: any;
}

const BookingPage: NextPage<Props> = props => {
  const { url, studioData } = props;

  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setIsLoading(true);

    //TODO: add tattooerID - make introduce select field inside form to select artist
    const bookingDetails = {
      studioID: studioData.studioID,
      userName: userName,
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

  if (!studioData) {
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
