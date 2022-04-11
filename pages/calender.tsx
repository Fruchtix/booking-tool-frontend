import { GetServerSideProps, NextPage } from 'next';
import Layout from '../components/Layout/Layout';

interface Props {
  message: string;
}

const Calender: NextPage<Props> = props => {
  const { message } = props;

  return (
    <Layout>
      <div>Calender {message}</div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  console.log('context: ');
  console.log(context);

  // TODO: 0. Build Calender
  // search for next / react librarys or build it from scratch

  return {
    props: {
      message: 'hi',
    },
  };
};

export default Calender;
