import { GetServerSideProps, NextPage } from 'next';

interface Props {
  message: string;
}

const Dashboard: NextPage<Props> = props => {
  const { message } = props;

  return <div>Dashboard {message}</div>;
};

export const getServerSideProps: GetServerSideProps = async context => {
  console.log('context: ');
  console.log(context);

  // TODO: Look into API Routes to block traffic that is not logged in

  // Next
  // Get Infos for the dashboard here - all the data from DB (calender dates)
  return {
    props: {
      message: 'hi',
    },
  };
};

export default Dashboard;
