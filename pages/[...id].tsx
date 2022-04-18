import { GetServerSideProps, NextPage } from 'next';

// TODO: look into dynamic routes

// TODO: get studio settings from DB
//      => write aws lambda to get the studio data
//      => call aws lambda inside getServerSideProps
// TODO: on signup define studio url (they need to enter studio name) => save to DB
// TODO: create GSD for studio table to query by url link (name)

// TODO: redirect to error page if user not found
// TODO: build basic form
// TODO: handle form submit
//      => write aws lambda to save request in request table & send confirmation mail to user
//      => call lambda on submit

// TODO: to think about: does the user need an account? for the chat

interface Props {
  message: string;
}

const BookingPage: NextPage<Props> = props => {
  const { message } = props;

  return <div>BookingPage {message}</div>;
};

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      message: 'hi',
    },
  };
};

export default BookingPage;
