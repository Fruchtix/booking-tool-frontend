import { GetServerSideProps, NextPage } from 'next';
import Layout from '../components/Layout/Layout';
import CustomCalendar from '../components/Calendar/Calendar';
import Appointment from '../interfaces/Appointment';
import dayjs from 'dayjs';
import Timeslot from '../interfaces/Timeslot';
import { TimeslotProvider } from '../Provider/TimeslotProvider';
import { StudioProvider } from '../Provider/StudioProvider';
import { AppointmentProvider } from '../Provider/AppointmentProvider';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import Studio from '../interfaces/Studio';

interface Props {
  appointments: Array<Appointment>;
  timeslots: Array<Timeslot>;
  timeslotRangeStart: string;
  timeslotRangeEnd: string;
  studioData: Studio;
}

const Calendar: NextPage<Props> = props => {
  const { appointments, timeslots, timeslotRangeStart, timeslotRangeEnd, studioData } = props;

  return (
    <Layout>
      <StudioProvider studioData={studioData}>
        <TimeslotProvider
          fetchedTimeslots={timeslots}
          timeslotRangeStart={timeslotRangeStart}
          timeslotRangeEnd={timeslotRangeEnd}
        >
          <AppointmentProvider appointments={appointments}>
            <CustomCalendar />
          </AppointmentProvider>
        </TimeslotProvider>
      </StudioProvider>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  const todayMinusOneMonth = dayjs().subtract(1, 'month').format();
  const todayPlusOneMonth = dayjs().add(1, 'month').format();
  let studioData;
  let timeslots;

  await axios
    .all([
      axios
        .get('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/studio/by-id/get', {
          params: {
            studioID: session?.studioID,
          },
        })
        .then(response => {
          return response.data;
        })
        .catch(error => {
          console.log(error.response.data);
        }),
      axios
        .get('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/timeslots/get', {
          params: {
            studioID: session?.studioID,
            rangeStartDate: todayMinusOneMonth,
            rangeEndDate: todayPlusOneMonth,
          },
        })
        .then(response => {
          return response.data;
        })
        .catch(error => {
          console.log(error.response.data);
        }),
    ])
    .then(
      axios.spread((...responses) => {
        studioData = responses[0];
        timeslots = responses[1];
      })
    )
    .catch(errors => {
      console.log('error');
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
      timeslotRangeStart: todayMinusOneMonth,
      timeslotRangeEnd: todayPlusOneMonth,
      studioData: studioData,
    },
  };
};

export default Calendar;
