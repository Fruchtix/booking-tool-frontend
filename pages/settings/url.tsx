import { NextPage } from 'next';
import CreateBookingUrl from '../../components/CreateBookingUrl/CreateBookingUrl';

const New: NextPage = () => {
  return (
    <div>
      <h1>Getting started</h1>
      <h2>Please fill this shit out</h2>

      <CreateBookingUrl />
    </div>
  );
};

export default New;
