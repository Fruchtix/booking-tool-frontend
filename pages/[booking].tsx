import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import BookingForm from '../components/BookingForm/BookingForm';
import Studio from '../interfaces/Studio';

interface Props {
  url: string;
  studioData: Studio[];
}

const BookingPage: NextPage<Props> = props => {
  const { url, studioData } = props;

  return (
    <div>
      <h1>BookingPage for Studio {url}</h1>

      <BookingForm studioData={studioData[0]} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { booking } = context.query;

  const studioData = await axios
    .get('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/studio/by-url/get', {
      params: {
        studioUrl: booking,
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });

  if (studioData.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      url: booking,
      studioData,
    },
  };
};

export default BookingPage;
