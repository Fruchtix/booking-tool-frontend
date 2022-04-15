import { GetServerSideProps, NextPage } from 'next';
import Layout from '../components/Layout/Layout';
import CustomCalender from '../components/Calendar/Calendar';
import Appointment from '../interfaces/Appointment';
import dayjs from 'dayjs';

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
  return {
    props: {
      appointments: [
        {
          id: '1',
          start: dayjs().hour(10).format(),
          end: dayjs().hour(12).format(),
          tattooerId: '1234',
          heading: 'Tattoo Amelie - großer Tieger',
          describtion: 'lorem ipsum description - images will also be displayed here',
        },
        {
          id: '2',
          start: dayjs().hour(15).format(),
          end: dayjs().hour(19).format(),
          tattooerId: '1234',
          heading: 'Tattoo Jan - kleiner Waal',
          describtion: 'lorem ipsum description - images will also be displayed here',
        },
        {
          id: '3',
          start: dayjs().subtract(2, 'day').hour(15).format(),
          end: dayjs().subtract(2, 'day').hour(19).format(),
          tattooerId: '1234',
          heading: 'Tattoo Kerstin - kleiner Affe',
          describtion: 'lorem ipsum description - images will also be displayed here',
        },
      ],
    },
  };
};

export default Calender;
