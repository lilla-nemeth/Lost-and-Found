import React, { useContext, useState } from 'react';
import DragnDropZone from './DragnDropZone';
import { ReactComponent as ArrowDown} from '../assets/icons/togglearrow.svg'
import LocationSearch from './LocationSearch';
import MapboxMap from './MapboxMap';
import RadioButton from './generic/RadioButton';
import PetReportOptionalData from './PetReportOptionalData';
import { ApiContext } from '../contexts/ApiContext';
import createHistory from 'history/createBrowserHistory';
import TextInput from './generic/TextInput';
import TextArea from './generic/TextArea';
// import DropZoneTest from './DropZoneTest';


const styles = {
    main: {
        fontFamily: '"Poppins", sans-serif',
        background: '#B0F0EB',
        overflow: 'hidden',
    },
    section: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },

} 

// const regionOptions = {
//     01: 'Lapland',
//     02: 'North Ostrobothnia',
//     03: 'Kainuu',
//     04: 'North Karelia',
//     05: 'Northern Savonia',
//     06: 'Southern Savonia',
//     07: 'South Karelia',
//     08: 'Central Finland',
//     // ... maybe this offer way too many options :/ - 
//     // only municipalities of North Ostrobothnia?
// }

// statusOptions -> reunited option comes later with post editing:

// const statusOptions = ['lost', 'found']
// const speciesOptions = ['dog', 'cat', 'other']
// const sizeOptions = ['small', 'medium', 'large'];
// const sexOptions = ['male', 'female', 'unknown'];
// const colorOptions = ['black', 'brown', 'grey', 'white'];
// const ageOptions = ['juvenile', 'adolescent', 'adult', 'senior', 'unknown'];


const PetReport = () => {
    const [pet, setPet] = useState([]);
    const [status, setStatus] = useState('');
    // const [region, setRegion] = useState(''); 
    // const [municipality, setMunicipality] = useState('');
    // const [zip, setZip] = useState('');
    // const [district, setDistrict] = useState('');
    // const [street, setStreet] = useState('');
    
    // 1 input for all location data:
    const [location, setLocation] = useState('');
    const [species, setSpecies] = useState('');
    const [description, setDescription] = useState('');

    // Show/hide additional data:
    const [optionalInputs, setOptionalInputs] = useState({
        display: 'hideInputs',
    });

    // Optional Data:
    const [size, setSize] = useState('');
    const [breed, setBreed] = useState('');
    const [sex, setSex] = useState('');
    const [color, setColor] = useState('');
    const [age, setAge] = useState('');
    const [uniquefeature, setUniquefeature] = useState('');


    // success/error messages
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // for checkbox:
    const [isChecked, setIsChecked] = useState(false);

    // radio useState input will be the response data (from ApiContext) - 
    // -> remove the hard coded 'lost' string, change to pet array with objects

    const [isRequired, setIsRequired] = useState(false);

    const { reportPet } = useContext(ApiContext);

    let DEBUG = true;



    function handleSubmit(event) {
        event.preventDefault();

        reportPet({
            addstatus: status,
            region: location,
            municipality: location,
            zip: location,
            district: location,
            street: location,
            species,
            size,
            breed,
            sex,
            color,
            age,
            uniquefeature,
            postdescription: description,
            successReportCallback: res => {
                {setPet(res); console.log(res)}
            },
            // successMsgCallback: res => {
            //     setSuccessMsg(res)
            // },
            errorCallback: err => console.log(err),
            // errorTimeout: () => (setTimeout(() => {
                //     setErrorMsg('');
                // }, 5000))
            
            })
            if (DEBUG) console.log('PET ARR', pet);
        }


    createHistory().replace('/reportpet');

    function showOptionalInputs() {
        if (optionalInputs.display === 'hideInputs') {
            setOptionalInputs({
                display: 'showInputs'
            }) 
        } else {
            setOptionalInputs({
                display: 'hideInputs'
            })
        }
    }

    // place for the function where I call the report api fron ApiContext

    {/* map() the pet data from ApiContext for RadioButton & checkbox data */}
    {/* isChecked={true} - isChecked value will be a hooks with boolean value */}
    {/* 1. test with hard coded data - strings */}
    {/* change the hard coded: radio === lost    to object (from ApiContext) */}

    return (  
        <main style={styles.main}>
            <section style={styles.section}>
            <div className='formBox'>
                    <h2 className='formHeadline'>Report Pet</h2>
                    <form 
                        method='POST' 
                        onSubmit={handleSubmit}
                    >
                        <div className='message'>
                            <p className='errorMessage'>{errorMsg}</p>
                            <p className='successMessage'>{successMsg}</p>
                        </div>
                        <div className='filterBox'>
                            <h2 className='categoryHeadline'>Status</h2>
                            <ul className='radioList'>
                                <RadioButton 
                                    id={'lost'} 
                                    name={'status'} 
                                    value={'lost'} 
                                    checked={status === 'lost'} 
                                    onChange={event => {setStatus(event.target.value)}} 
                                    labelFor={'lost'} 
                                    labelName={'Lost'}
                                    // required={!isRequired}  
                                />
                                <RadioButton 
                                    id={'found'} 
                                    name={'status'} 
                                    value={'found'} 
                                    checked={status === 'found'} 
                                    onChange={event => {setStatus(event.target.value)}} 
                                    labelFor={'found'} 
                                    labelName={'Found'}
                                    // required={!isRequired}  
                                />
                            </ul>
                        </div>
                           <DragnDropZone />
                           {/* <DropZoneTest /> */}
                        <div className='filterBox'> 
                            <h2 className='categoryHeadline'>Species</h2>
                            <ul className='radioList'>
                                <RadioButton 
                                    id={'dog'} 
                                    name={'species'} 
                                    value={'dog'} 
                                    checked={species === 'dog'} 
                                    onChange={event => {setSpecies(event.target.value)}} 
                                    labelFor={'dog'} 
                                    labelName={'Dog'} 
                                    // required={!isRequired}
                                />
                                <RadioButton 
                                    id={'cat'} 
                                    name={'species'} 
                                    value={'cat'} 
                                    checked={species === 'cat'} 
                                    onChange={event => {setSpecies(event.target.value)}} 
                                    labelFor={'cat'} 
                                    labelName={'Cat'} 
                                    // required={!isRequired}
                                />
                                <RadioButton 
                                    id={'otherSpecies'} 
                                    name={'species'} 
                                    value={'otherSpecies'} 
                                    checked={species === 'otherSpecies'} 
                                    onChange={event => {setSpecies(event.target.value)}} 
                                    labelFor={'otherSpecies'} 
                                    labelName={'Other'}
                                    // required={!isRequired} 
                                />
                            </ul>
                        </div>  
                        {/* change later the 'Region' headline to 'Location' 
                        if I'll use Mapbox API and convert the input into a search bar */}
                        {/* combine these parameters into 1 searchbar OR 
                        separate them to several input fields: municipality, zip, district, street */}
                        <TextInput 
                            headlineName={'Location'}
                            id={'location'}
                            name={'location'}
                            value={location}
                            placeholder={'Location'}
                            onChange={event => setLocation(event.target.value)}
                            // required={!isRequired}
                        />
                        
                        {/* <LocationSearch /> */}

{/* FIX THAT: remove the map refreshing whenever input event is active */}
                        {/* <MapboxMap /> */}

                        <TextArea 
                            headlineName={'Description'}
                            id={'description'} 
                            name={description} 
                            value={description} 
                            placeholder={'Description'} 
                            rows={'6'}
                            cols={'10'}
                            onChange={event => setDescription(event.target.value)} 
                            // required={!isRequired}
                        />
                        <button className='optionalButton' onClick={() => showOptionalInputs()}>
                                Optional Data
                            <div className='arrowDown'>
                                <ArrowDown style={{height: '16px'}}/>
                            </div>
                        </button>
                        <PetReportOptionalData 
                            size={size} 
                            setSize={setSize} 
                            breed={breed} 
                            setBreed={setBreed} 
                            sex={sex} 
                            setSex={setSex} 
                            color={color} 
                            setColor={setColor} 
                            age={age} 
                            setAge={setAge} 
                            uniquefeature={uniquefeature} 
                            setUniquefeature={setUniquefeature} 
                            // isRequired={isRequired} 
                            isChecked={isChecked} 
                            setIsChecked={setIsChecked} 
                            optionalInputs={optionalInputs} 
                            style={{zIndex: 1}}
                        />
                        <div>
                            <button className='formButton'>Report</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}
 
export default PetReport;

