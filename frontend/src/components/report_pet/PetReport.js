import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { AppStateContext } from '../../contexts/AppStateContext';
import { handleError, clearError } from '../HelperFunctions.js';
import { isFieldRequired } from '../HelperFunctions.js';
import PetReportOptionalData from './PetReportOptionalData';
import { ReactComponent as ArrowDown } from '../../assets/icons/togglearrow.svg';
import ImageUpload from './ImageUpload';
import MapboxMap from './MapboxMap.js';

// generic components:
import Loader from '../generic/Loader';
import LoaderButton from '../generic/LoaderButton';
import RadioButton from '../generic/RadioButton';
import TextInput from '../generic/TextInput';
import TextArea from '../generic/TextArea';

const PetReport = () => {
  const { token } = useContext(AuthContext);
  const {
    reportPet,
    getUserPets,
    setUserPets,
    getAllPets,
    setAllPets,
    fetchPets,
    limit,
    offset,
    setPets,
    getNumberOfPets,
    setTotal,
    loader,
    setLoader,
  } = useContext(AppStateContext);

  const [status, setStatus] = useState('');
  const [preview, setPreview] = useState(null);
  const [files, setFiles] = useState([]);
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [query, setQuery] = useState('');
  const [species, setSpecies] = useState('');
  const [description, setDescription] = useState('');
  const [optionalInputs, setOptionalInputs] = useState({
    display: 'hideInputs',
  });
  const [size, setSize] = useState('');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState('');
  const [colors, setColors] = useState([]);
  const [age, setAge] = useState('');
  const [uniquefeature, setUniquefeature] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successButtonMsg, setSuccessButtonMsg] = useState('');
  const [uploadingButton, setUploadingButton] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  let DEBUG = false;

  const disabled = !status || !query || !lng || !lat|| !species || !description || !preview || loading;
  const required = true;

  function handleSubmit(event) {
    event.preventDefault();

    if (!disabled) {
      setLoading(true);
      reportPet({
        token,
        img: files,
        petstatus: status,
        petlocation: query,
        longitude: lng,
        latitude: lat,
        species,
        petsize: size,
        breed,
        sex,
        color: colors,
        age,
        uniquefeature,
        postdescription: description,
        successCallback: (res) => {
          setLoading(false);
          setUploadingButton(true);
          setSuccessButtonMsg('Uploading...');
          fetchPets({
            limit,
            offset,
            successCallback: (res) => {
              setPets(res.data);
              setLoader(false);
              getNumberOfPets({
                successCallback: (res) => {
                  setTotal(Number(res.data));
                },
              });
            },
          });
          getAllPets({
            successCallback: (res) => {
              setAllPets(res.data);
            },
          });
          getUserPets({
            token,
            successCallback: (res) => {
              setUserPets(res.data);
            },
          });
          setErrorMsg('');
          setSize('');
          setStatus('');
          setSpecies('');
          setBreed('');
          setSex('');
          setColors('');
          setAge('');
          setUniquefeature('');
          setQuery('');
          setLng('');
          setLat('');
          setDescription('');
          setPreview('');
        },
        successTimeout: () => {
          setTimeout(() => {
            setSuccessButtonMsg('Done!');
            setSuccessMsg('Pet successfully uploaded');
          }, 1500);
          setTimeout(() => {
            setSuccessMsg('');
            setSuccessButtonMsg('Report Pet');
            navigate('/lostandfound');
          }, 3000);
        },
        errorCallback: (err) => {
          setLoading(false);
          clearError();
          handleError(err, setErrorMsg);
        },
      });
    }
  }

  function showOptionalInputs() {
    if (optionalInputs.display === 'hideInputs') {
      setOptionalInputs({
        display: 'showInputs',
      });
    } else {
      setOptionalInputs({
        display: 'hideInputs',
      });
    }
  }

  const errorSuccessMessage = (
    <div className='messagePetReport'>
      <p className='errorMessage'>{errorMsg}</p>
      <p className='successMessage'>{successMsg}</p>
    </div>
  );

  if (loader) {
    return <Loader />;
  }

  return (
    <main className='petMain'>
      <section className='formSection'>
        <div className='formBox'>
          <h2 className='formHeadline'>Report Pet</h2>
          <form
            method='POST'
            onSubmit={handleSubmit}
            encType='multipart/form-data'
          >
            <div className='filterBox'>
              <h2 className='categoryHeadline'>
                Status {isFieldRequired(required)}
              </h2>
              <ul className='radioList'>
                <RadioButton
                  id={'lost'}
                  name={'status'}
                  value={'lost'}
                  checked={status === 'lost'}
                  onChange={(event) => setStatus(event.target.value)}
                  htmlFor={'lost'}
                  labelName={'Lost'}
                />
                <RadioButton
                  id={'found'}
                  name={'status'}
                  value={'found'}
                  checked={status === 'found'}
                  onChange={(event) => setStatus(event.target.value)}
                  htmlFor={'found'}
                  labelName={'Found'}
                />
              </ul>
            </div>
            <ImageUpload
              setFiles={setFiles}
              preview={preview}
              setPreview={setPreview}
            />
            <div className='filterBox'>
              <h2 className='categoryHeadline'>
                Species {isFieldRequired(required)}
              </h2>
              <ul className='radioList'>
                <RadioButton
                  id={'dog'}
                  name={'species'}
                  value={'dog'}
                  checked={species === 'dog'}
                  onChange={(event) => setSpecies(event.target.value)}
                  htmlFor={'dog'}
                  labelName={'Dog'}
                />
                <RadioButton
                  id={'cat'}
                  name={'species'}
                  value={'cat'}
                  checked={species === 'cat'}
                  onChange={(event) => setSpecies(event.target.value)}
                  htmlFor={'cat'}
                  labelName={'Cat'}
                />
                <TextInput
                  id={'otherSpecies'}
                  name={'species'}
                  type={'text'}
                  value={species === 'dog' || species === 'cat' ? '' : species}
                  placeholder={'Other'}
                  onChange={(event) => setSpecies(event.target.value)}
                />
              </ul>
              <h2 className='categoryHeadline'>
                Location {isFieldRequired(required)}
              </h2>
              <MapboxMap 
                query={query} 
                setQuery={setQuery} 
                lng={lng}
                lat={lat}
                setLng={setLng} 
                setLat={setLat} />
              <TextArea
                headlineName={`Description ${isFieldRequired(required)}`}
                id={'description'}
                name={description}
                value={description}
                placeholder={'Description'}
                rows={'6'}
                cols={'10'}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div
              className='optionalButton'
              onClick={() => showOptionalInputs()}
            >
              Optional Data
              <div
                className={
                  optionalInputs.display === 'hideInputs'
                    ? 'arrowDown'
                    : 'arrowUp'
                }
              >
                <ArrowDown style={{ height: '16px' }} />
              </div>
            </div>
            {optionalInputs.display === 'hideInputs' ? errorSuccessMessage : ''}
            <PetReportOptionalData
              size={size}
              setSize={setSize}
              breed={breed}
              setBreed={setBreed}
              sex={sex}
              setSex={setSex}
              colors={colors}
              setColors={setColors}
              age={age}
              setAge={setAge}
              uniquefeature={uniquefeature}
              setUniquefeature={setUniquefeature}
              optionalInputs={optionalInputs}
              style={{ zIndex: 1 }}
            />
            {optionalInputs.display === 'showInputs' ? errorSuccessMessage : ''}
            {!uploadingButton ? (
              <button
                className={
                  disabled ? 'deletePetButtonInactive' : 'deletePetButton'
                }
                disabled={disabled}
              >
                <>
                  <div className='deletePetButtonText'>Report Pet</div>
                </>
              </button>
            ) : (
              <button
                className={
                  disabled ? 'deletePetButtonInactive' : 'deletePetButton'
                }
                disabled={disabled}
              >
                {successButtonMsg === 'Uploading...' ? (
                  <>
                    <LoaderButton />
                    <div className='deletePetButtonText'>
                      {successButtonMsg}
                    </div>
                  </>
                ) : (
                  <>
                    <div className='deletePetButtonText'>
                      {successButtonMsg}
                    </div>
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </section>
    </main>
  );
};

export default PetReport;
