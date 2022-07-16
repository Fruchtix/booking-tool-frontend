import style from './BookingRequests.module.css';
import React, { useEffect, useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import axios from 'axios';
import Booking from '../../interfaces/Booking';

interface Props {
  bookings: Booking[];
  tattooerID: string;
}

const BookingRequests = ({ bookings, tattooerID }: Props) => {
  const { selectedTattooer } = useStudio();
  const [bookingData, setBookingData] = useState(bookings);
  const [currentTattooerID, setCurrentTattooerID] = useState(tattooerID);

  useEffect(() => {
    const getBookingData = async () => {
      await axios
        .get('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/bookings/by-tattooer/get', {
          params: {
            tattooerID: selectedTattooer.tattooerID,
            status: 'open',
          },
        })
        .then(response => {
          setBookingData(response.data);
        })
        .catch(error => {
          console.log(error.response.data);
        });
    };

    if (selectedTattooer?.tattooerID && selectedTattooer?.tattooerID !== currentTattooerID) {
      getBookingData();
      setCurrentTattooerID(selectedTattooer.tattooerID);
    }
  }, [selectedTattooer, currentTattooerID]);

  return (
    <>
      {bookingData.map(booking => (
        <div key={booking.bookingID}>
          <div>{JSON.stringify(booking)}</div>
          <hr />
        </div>
      ))}
    </>
  );
};

export default BookingRequests;
