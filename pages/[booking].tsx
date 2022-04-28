import { GetServerSideProps, NextPage } from 'next';

// TODO: use credentials for login not email
// TODO: on signup define studio url (they need to enter studio name) => save to DB
// TODO: implement dynamoDB stream to trigger register studio after new item has been added in next auth

// TODO: create GSD for studio table to query by url link (name)

// TODO: get studio settings from DB
//      => write aws lambda to get the studio data
//      => call aws lambda inside getServerSideProps

// TODO: redirect to error page if user not found
// TODO: build basic form
// TODO: handle form submit
//      => write aws lambda to save request in request table & send confirmation mail to user
//      => call lambda on submit

// TODO: to think about: does the user need an account? for the chat
// TODO: does the user need to verify the email?

interface Props {
  url: string;
}

const BookingPage: NextPage<Props> = props => {
  const { url } = props;

  return <div>BookingPage {url}</div>;
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { booking } = context.query;

  return {
    props: {
      url: booking,
    },
  };
};

export default BookingPage;
