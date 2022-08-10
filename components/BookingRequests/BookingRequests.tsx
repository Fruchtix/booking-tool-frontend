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
  const [selectedBooking, setSelectedBooking] = useState<number>(-1);
  const [currentInputText, setCurrentInputText] = useState('');

  useEffect(() => {
    setCurrentInputText('');
  }, [selectedBooking, selectedTattooer, currentTattooerID]);

  useEffect(() => {
    console.log('change detected');

    console.log(bookingData);
  }, [bookingData]);

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

    setSelectedBooking(-1);
  }, [selectedTattooer, currentTattooerID]);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingWithNewMessage = {
      ...bookingData[selectedBooking],
      messages: [...(bookingData[selectedBooking].messages || []), { content: currentInputText, sender: 'artist' }],
    };

    const newBookingData = bookingData;
    newBookingData[selectedBooking] = bookingWithNewMessage;

    setBookingData(newBookingData);
    setCurrentInputText('');

    axios
      .post('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/bookings/update', bookingWithNewMessage)
      .catch(error => {
        console.log(error);
      });
  };

  const openImageSelect = () => {
    console.log('open image select');
  };

  return (
    <div className={style.container}>
      <div className={style.bookings}>
        <RequestControls />

        <div className={style.bookingList}>
          {bookingData.map((booking, index) => (
            <div
              className={`${style.chat} ${
                bookingData[selectedBooking]?.bookingID === booking.bookingID ? style.activeChat : ''
              }`}
              key={booking.bookingID}
              onClick={() => setSelectedBooking(index)}
            >
              <div>{booking.userName}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedBooking !== -1 ? (
        <div className={style.chatSection}>
          <div>Chat of {bookingData[selectedBooking]?.email}</div>
          <div className={style.messageContainer}>
            {bookingData[selectedBooking].messages?.map((message, index) => {
              return <div key={index}>{message.content}</div>;
            })}
          </div>

          <div>Accept Decline</div>

          <form className={style.inputSection} onSubmit={handleMessageSubmit}>
            <div>☺</div>
            <input
              type="text"
              name="message"
              id="message"
              placeholder="Message..."
              value={currentInputText}
              onChange={e => setCurrentInputText(e.target.value)}
            />
            <div onClick={currentInputText === '' ? openImageSelect : handleMessageSubmit}>
              {currentInputText === '' ? 'Image' : 'Send'}
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default BookingRequests;
