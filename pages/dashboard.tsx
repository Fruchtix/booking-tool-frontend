import { GetServerSideProps, NextPage } from 'next';
import Layout from '../components/Layout/Layout';

interface Props {
  message: string;
}

const Dashboard: NextPage<Props> = props => {
  const { message } = props;

  return (
    <Layout>
      <div>Dashboard {message}</div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  // TODO: Look into API Routes to block traffic that is not logged in

  return {
    props: {
      message: 'hi',
    },
  };
};

export default Dashboard;
