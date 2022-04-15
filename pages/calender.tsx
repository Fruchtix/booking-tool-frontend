import { GetServerSideProps, NextPage } from 'next';
import Layout from '../components/Layout/Layout';
import CustomCalender from '../components/Calendar/Calendar';
import Appointment from '../interfaces/Appointment';
import dayjs from 'dayjs';
import Timeslot from '../interfaces/Timeslot';
import { TimeslotProvider } from '../Provider/TimeslotProvider';
import { AppointmentProvider } from '../Provider/AppointmentProvider';

interface Props {
  appointments: Array<Appointment>;
  timeslots: Array<Timeslot>;
}

const Calender: NextPage<Props> = props => {
  const { appointments, timeslots } = props;

  return (
    <Layout>
      <TimeslotProvider timeslots={timeslots}>
        <AppointmentProvider appointments={appointments}>
          <CustomCalender />
        </AppointmentProvider>
      </TimeslotProvider>
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
      timeslots: [
        {
          id: '1',
          start: dayjs().hour(8).format(),
          end: dayjs().hour(10).format(),
          tattooerId: '1234',
        },
        {
          id: '2',
          start: dayjs().subtract(2, 'day').hour(7).format(),
          end: dayjs().subtract(2, 'day').hour(9).format(),
          tattooerId: '1234',
        },
      ],
    },
  };
};

export default Calender;
