import { GetServerSideProps, NextPage } from 'next';
import Layout from '../components/Layout/Layout';

// TODO: get bookings with status untouched from aws call
// TODO: implement aws lambda getRequest (passing studioID/tattooerID)

interface Props {
  message: string;
}

const Request: NextPage<Props> = props => {
  const { message } = props;

  return (
    <Layout>
      <div>Request {message}</div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      message: 'hi',
    },
  };
};

export default Request;
