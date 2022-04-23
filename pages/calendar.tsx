import { GetServerSideProps, NextPage } from 'next';
import Layout from '../components/Layout/Layout';
import CustomCalendar from '../components/Calendar/Calendar';
import Appointment from '../interfaces/Appointment';
import dayjs from 'dayjs';
import Timeslot from '../interfaces/Timeslot';
import { TimeslotProvider } from '../Provider/TimeslotProvider';
import { AppointmentProvider } from '../Provider/AppointmentProvider';
import axios from 'axios';

interface Props {
  appointments: Array<Appointment>;
  timeslots: Array<Timeslot>;
}

const Calendar: NextPage<Props> = props => {
  const { appointments, timeslots } = props;

  return (
    <Layout>
      <TimeslotProvider fetchedTimeslots={timeslots}>
        <AppointmentProvider appointments={appointments}>
          <CustomCalendar />
        </AppointmentProvider>
      </TimeslotProvider>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const timeslots = await axios
    .get('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/timeslots/get', {
      params: { studioID: 'todo' },
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error.response.data);
    });

  return {
    props: {
      appointments: [
        {
          id: '1',
          start: dayjs().hour(10).format(),
          end: dayjs().hour(12).format(),
          tattooerID: '1234',
          studioID: '1234',
          heading: 'Tattoo Amelie - großer Tieger',
          describtion: 'lorem ipsum description - images will also be displayed here',
        },
        {
          id: '2',
          start: dayjs().hour(15).format(),
          end: dayjs().hour(19).format(),
          tattooerID: '1234',
          studioID: '1234',
          heading: 'Tattoo Jan - kleiner Waal',
          describtion: 'lorem ipsum description - images will also be displayed here',
        },
        {
          id: '3',
          start: dayjs().subtract(2, 'day').hour(15).format(),
          end: dayjs().subtract(2, 'day').hour(19).format(),
          tattooerID: '1234',
          studioID: '1234',
          heading: 'Tattoo Kerstin - kleiner Affe',
          describtion: 'lorem ipsum description - images will also be displayed here',
        },
      ],
      timeslots: timeslots || [],
    },
  };
};

export default Calendar;
