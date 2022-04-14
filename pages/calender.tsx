import { GetServerSideProps, NextPage } from 'next';
import Layout from '../components/Layout/Layout';
import CustomCalender from '../components/Calendar/Calendar';
import Appointment from '../interfaces/Appointment';

interface Props {
  appointments: Array<Appointment>;
}

const Calender: NextPage<Props> = props => {
  const { appointments } = props;

  return (
    <Layout>
      <CustomCalender appointments={appointments} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  console.log('context: ');
  console.log(context);

  return {
    props: {
      appointments: [{ id: '1' }, { id: '2' }],
    },
  };
};

export default Calender;
