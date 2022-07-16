import { GetServerSideProps, NextPage } from 'next';
import Layout from '../components/Layout/Layout';

interface Props {
  message: string;
}

const Chats: NextPage<Props> = props => {
  const { message } = props;

  return (
    <Layout>
      <div>Chats {message}</div>
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

export default Chats;
