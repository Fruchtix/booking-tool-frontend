import { NextPage } from 'next';
import Artists from '../../components/Artists/Artists';

const DefineArtists: NextPage = () => {
  return (
    <div>
      <h1>Please add all your artists:</h1>

      <Artists />
    </div>
  );
};

export default DefineArtists;
