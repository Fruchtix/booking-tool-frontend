import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '../components/Layout/Layout';
import RequestControls from '../components/RequestControls/RequestControls';
import Studio from '../interfaces/Studio';
import { StudioProvider } from '../Provider/StudioProvider';

interface Props {
  studioData: Studio;
  bookings: any; // TODO
}

const Request: NextPage<Props> = props => {
  const { studioData, bookings } = props;

  // TODO: render bookings from selected artist
  // TODO: limit results and lazy load others
  console.log(bookings);

  return (
    <Layout>
      <StudioProvider studioData={studioData}>
        <RequestControls />

        <div>Request page</div>
      </StudioProvider>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  let studioData;
  let bookings;

  await axios.all([
    await axios
      .get('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/studio/by-id/get', {
        params: {
          studioID: session?.studioID,
        },
      })
      .then(response => {
        studioData = response.data;
      })
      .catch(error => {
        console.log(error.response.data);
      }),
    await axios
      .get('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/bookings/by-studio/get', {
        params: {
          studioID: session?.studioID,
          status: 'open',
        },
      })
      .then(response => {
        bookings = response.data;
      })
      .catch(error => {
        console.log(error.response.data);
      }),
  ]);

  return {
    props: {
      studioData: studioData,
      bookings: bookings,
    },
  };
};

export default Request;
