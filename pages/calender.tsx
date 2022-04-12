import { GetServerSideProps, NextPage } from 'next';
import Layout from '../components/Layout/Layout';
import CustomCalender from '../components/Calendar/Calendar';

interface Props {
  message: string;
}

const Calender: NextPage<Props> = props => {
  const { message } = props;

  console.log(message);

  return (
    <Layout>
      <CustomCalender />
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
