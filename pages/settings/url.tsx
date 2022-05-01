import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import CreateBookingUrl from '../../components/CreateBookingUrl/CreateBookingUrl';
import Layout from '../../components/Layout/Layout';
import Studio from '../../interfaces/Studio';

interface Props {
  studioData: Studio;
}

const Url: NextPage<Props> = props => {
  const { studioData } = props;

  return (
    <Layout>
      <h1>Getting started</h1>
      <h2>Please fill this shit out</h2>

      <CreateBookingUrl currentUrl={studioData?.studioUrl} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

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

  return {
    props: {
      studioData: studioData,
    },
  };
};

export default Url;
