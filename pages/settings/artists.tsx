import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Artists from '../../components/Artists/Artists';
import Studio from '../../interfaces/Studio';
import Layout from '../../components/Layout/Layout';

interface Props {
  studioData: Studio;
}

const DefineArtists: NextPage<Props> = props => {
  const { studioData } = props;

  return (
    <Layout>
      <h1>Please add all your artists:</h1>

      <Artists studioData={studioData} />
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

export default DefineArtists;
