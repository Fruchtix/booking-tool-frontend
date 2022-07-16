import axios from 'axios';
import * as cookie from 'cookie';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import BookingRequests from '../components/BookingRequests/BookingRequests';
import Layout from '../components/Layout/Layout';
import RequestControls from '../components/RequestControls/RequestControls';
import Booking from '../interfaces/Booking';
import Studio from '../interfaces/Studio';
import { StudioProvider } from '../Provider/StudioProvider';

interface Props {
  studioData: Studio;
  bookings: Booking[];
  currentTattooerID: string;
}

const Request: NextPage<Props> = props => {
  const { studioData, bookings, currentTattooerID } = props;

  // TODO: limit results and lazy load others

  return (
    <Layout>
      <StudioProvider studioData={studioData}>
        <RequestControls />
        <h1>Request page</h1>

        <BookingRequests bookings={bookings} tattooerID={currentTattooerID} />
      </StudioProvider>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  const parsedCookies = cookie.parse(context.req.headers.cookie || '');
  const selectedTatooer = parsedCookies?.selectedTattooer ? JSON.parse(parsedCookies.selectedTattooer) : null;

  const studioData = await axios
    .get('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/studio/by-id/get', {
      params: {
        studioID: session?.studioID,
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error.response.data);
    });

  const currentTattooerID = selectedTatooer?.tattooerID || studioData.tattooer[0].tattooerID;

  const bookings = await axios
    .get('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/bookings/by-tattooer/get', {
      params: {
        tattooerID: currentTattooerID,
        status: 'open',
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error.response.data);
    });

  return {
    props: {
      studioData: studioData,
      bookings: bookings,
      currentTattooerID: currentTattooerID,
    },
  };
};

export default Request;
