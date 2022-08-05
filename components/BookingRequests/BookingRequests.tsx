import style from './BookingRequests.module.css';
import React, { useEffect, useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import axios from 'axios';
import Booking from '../../interfaces/Booking';
import RequestControls from '../RequestControls/RequestControls';

interface Props {
  bookings: Booking[];
  tattooerID: string;
}

const BookingRequests = ({ bookings, tattooerID }: Props) => {
  const { selectedTattooer } = useStudio();
  const [bookingData, setBookingData] = useState(bookings);
  const [currentTattooerID, setCurrentTattooerID] = useState(tattooerID);
  const [selectedBooking, setSelectedBooking] = useState<Booking>();
  const [currentInputText, setCurrentInputText] = useState('');

  useEffect(() => {
    setCurrentInputText('');
  }, [selectedBooking, selectedTattooer, currentTattooerID]);

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

    setSelectedBooking(undefined);
  }, [selectedTattooer, currentTattooerID]);

  return (
    <div className={style.container}>
      <div className={style.bookings}>
        <RequestControls />

        <div className={style.bookingList}>
          {bookingData.map(booking => (
            <div
              className={`${style.chat} ${selectedBooking?.bookingID === booking.bookingID ? style.activeChat : ''}`}
              key={booking.bookingID}
              onClick={() => setSelectedBooking(booking)}
            >
              <div>{booking.userName}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedBooking ? (
        <div className={style.chatSection}>
          <div>Chat of {selectedBooking?.email}</div>
          <div className={style.messageContainer}></div>

          <div>Accept Decline</div>

          <div className={style.inputSection}>
            <div>☺</div>
            <input
              type="text"
              name="message"
              id="message"
              placeholder="Message..."
              value={currentInputText}
              onChange={e => setCurrentInputText(e.target.value)}
            />
            <div>{currentInputText === '' ? 'Image' : 'Send'}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BookingRequests;
