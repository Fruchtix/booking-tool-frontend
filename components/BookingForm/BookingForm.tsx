import style from './BookingForm.module.css';
import React, { useState } from 'react';
import axios from 'axios';
import Studio from '../../interfaces/Studio';
import Tattooer from '../../interfaces/Tattooer';
import Router from 'next/router';

interface Props {
  studioData: Studio;
}

enum ErrorMessages {
  Email = 'Fehler: Deine Emails stimmen nicht überein.',
  Age = 'Fehler: Tut mir leid, du musst leider mindestens 18 sein.',
  FileSize = 'Fehler: Deine hochgeladenen Bilder dürfen leider maximal 10 MB groß sein.',
  Connection = 'Fehler: Something went wrong sending your data.',
  RequiredFieldsMissing = 'Fehler: a required field is missing.',
}

const BookingForm = ({ studioData }: Props) => {
  const [error, setError] = useState<ErrorMessages | boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [userName, setUserName] = useState('');
  const [userSurname, setUserSurname] = useState('');
  const [email, setEmail] = useState('');
  const [confirmedEmail, setConfirmedEmail] = useState('');
  const [age, setAge] = useState<number | string>('');
  const [tattooDescription, setTattooDescription] = useState('');
  const [tattooPosition, setTattooPosition] = useState('');
  const [tattooSize, setTattooSize] = useState('');
  const [upLoadedFiles, setUpLoadedFiles] = useState(null);
  const [alreadyCustomer, setAlreadyCustomer] = useState<boolean>();
  const [instaName, setInstaName] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setIsLoading(true);

    if (selectedArtist === '') {
      setError(ErrorMessages.RequiredFieldsMissing);
      setIsLoading(false);
      return;
    }

    if (email !== confirmedEmail) {
      setError(ErrorMessages.Email);
      setIsLoading(false);
      return;
    }

    if (age < 18) {
      setError(ErrorMessages.Age);
      setIsLoading(false);
      return;
    }

    const bookingDetails = {
      studioID: studioData.studioID,
      tattooerID: selectedArtist,
      userName,
      userSurname,
      email,
      age,
      tattooDescription,
      tattooPosition,
      tattooSize,
      alreadyCustomer,
      instaName,
    };

    axios
      .post('https://dgumvqieoi.execute-api.eu-central-1.amazonaws.com/dev/bookings/add', bookingDetails)
      .then(() => {
        Router.push('/bookings/check-your-mail');
      })
      .catch(err => {
        console.log(err.response.data);
        setIsLoading(false);
        setError(ErrorMessages.Connection);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Artist */}
        <div>
          <label htmlFor="artist">Artist:</label>
          <select name="artist" id="artist" value={selectedArtist} onChange={e => setSelectedArtist(e.target.value)}>
            <option value="">Please select</option>
            {studioData.tattooer?.map((artist: Tattooer) => (
              <option value={artist.tattooerID} key={artist.tattooerID}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>

        {/* Basic Information section */}
        <div>
          <h3>Basic Information</h3>
          <p>Trage deinen Namen, dein Alter und deine E-Mail ein.</p>

          <div>
            <input
              value={userName}
              onChange={e => setUserName(e.target.value)}
              type="text"
              name="name"
              id="name"
              placeholder="Vorname"
              required
            />
            <input
              value={userSurname}
              onChange={e => setUserSurname(e.target.value)}
              type="text"
              name="surname"
              id="surname"
              placeholder="Nachname"
              required
            />
          </div>
          <div className="md:flex">
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => (error === ErrorMessages.Email ? setError(false) : null)}
              className={`${error === ErrorMessages.Email && ''}`}
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
            />
            <input
              value={confirmedEmail}
              className={`${error === ErrorMessages.Email && ''}`}
              onFocus={() => (error === ErrorMessages.Email ? setError(false) : null)}
              onChange={e => setConfirmedEmail(e.target.value)}
              type="email"
              name="confirmEmail"
              id="confirmEmail"
              placeholder="Email bestätigen"
              required
            />
          </div>
          <div className="md:flex">
            <input
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              className={`md:mr-4 ${error === ErrorMessages.Age && ''}`}
              onFocus={() => (error === ErrorMessages.Age ? setError(false) : null)}
              type="number"
              name="age"
              id="age"
              placeholder="Alter"
              required
            />
            <input
              value={instaName}
              onChange={e => setInstaName(e.target.value)}
              type="text"
              name="insta-name"
              id="insta-name"
              placeholder="Instagram Name (optional)"
            />
          </div>
        </div>

        {/* Tattoo descripiton section */}
        <div>
          <h3>Wie soll dein Tattoo aussehen?</h3>
          <p>Beschreibe deine Tattoo Idee</p>

          <textarea
            id="tattoo-description"
            name="tattoo-description"
            rows={8}
            value={tattooDescription}
            onChange={e => setTattooDescription(e.target.value)}
            placeholder="Du kannst mir hier gerne ausführlich dein Traummotiv schildern..."
            required
          />
        </div>

        {/* Tattoo position section */}
        <div>
          <h3>Wo willst du dein Tatto haben?</h3>

          <input
            value={tattooPosition}
            onChange={e => setTattooPosition(e.target.value)}
            type="text"
            name="tattoo-position"
            id="tattoo-position"
            placeholder="Schulter, Rippe, Unterarm etc."
            required
          />
        </div>

        {/* Tattoo size section */}
        <div>
          <h3>Wie groß soll dein Tattoo ungefähr sein?</h3>

          <input
            value={tattooSize}
            onChange={e => setTattooSize(e.target.value)}
            type="text"
            name="tattoo-size"
            id="tattoo-size"
            placeholder="10x10cm, 20x5cm..."
            required
          />
        </div>

        {/* TODO: Tattoo reference section */}
        {/* <div className="bg-gray-light mt-4 p-4 rounded-lg">
          <h3 className="font-semibold">Lade Referenzbilder hoch</h3>
          <p className="text-gray">Füge bitte mindestens ein Referenzbild hinzu.</p>

          <input
            onChange={e => setUpLoadedFiles(e.target.files)}
            type="file"
            name="tattoo-reference"
            id="tattoo-reference"
            multiple
            className="px-0"
            required
          />
        </div> */}

        {/* already tattooed section */}
        <div className="bg-gray-light mt-4 p-4 rounded-lg">
          <h3 className="font-semibold">Bist du schonmal bei mir gewesen?</h3>

          <div className="flex mt-2 items-center">
            <label className="mr-4">
              <input
                onChange={() => setAlreadyCustomer(true)}
                type="radio"
                name="already-customer"
                id="already-customer"
                className="w-auto mr-2"
                required
              />
              Ja
            </label>
            <label className="ml-4">
              <input
                onChange={() => setAlreadyCustomer(false)}
                type="radio"
                name="already-customer"
                id="already-customer"
                className="w-auto mr-2"
              />
              Nein
            </label>
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>

      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
    </>
  );
};

export default BookingForm;
