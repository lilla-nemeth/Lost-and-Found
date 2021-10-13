import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppStateContext = createContext();

export default function AppStateContextProvider(props) {
    const [pets, setPets] = useState([]);
    const [user, setUser] = useState([]);
    const [username, setUsername] = useState('');

    // we get string and we need to convert it to number before saving into the state:
    const [total, setTotal] = useState(0);

    // the default skip: 
    const [offset, setOffset] = useState(0);
    const [loader, setLoader] = useState(true);

    // error messages
    const [errorMsg, setErrorMsg] = useState('');

    let DEBUG = true;

    let limit = 6;

    useEffect(() => {
        fetchPets({
            limit,
            offset,
            successCallback: res => {
                setPets(res.data);
                setLoader(false);
                getAllPets({
                    successCallback: res => {
                        setTotal(Number(res.data));
                    }
                })
            },
            errorCallback: err => setErrorMsg(err.data.msg)
        })
    },[offset]);

    console.log('getAllPets - setTotal',total)


    let numberOfPages = total / limit;  

    function numberIncreases() {
        let numberArr = []

        for (let i = 0; i < numberOfPages; i++) {
            numberArr.push(i);
        }
        return numberArr;
    }




    // named input when we have many arguments
    // cannot mess up the order (in object {})
    function registerUser({email, username, phone, pw, successCallback, successTimeout, errorCallback, errorTimeout}) {
        
        let options = {
            method: 'post',
            url: 'http://localhost:3003/register',
            // mode: 'cors',
            // headers: {
            //     'Content-Type': 'application/json',
            // },
            data: {
                email,
                username,
                phone,
                pw,
            },
        };

        axios(options)
        .then(
            res => {if (successCallback) successCallback(res.data.msg, successTimeout())}
        )
        .catch(
            err => {if (errorCallback) errorCallback(err.response.data.msg, errorTimeout())}
        )
    }

    function loginUser({setToken, email, pw, errorCallback, errorTimeout}) {

        let options = {
            method: 'post',
            url: 'http://localhost:3003/login',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                email,
                pw
            }
        };
        
        // if (DEBUG) console.log(token);
        axios(options)
        .then(
            res => {        
                let tokenRes = res.data;

                localStorage.setItem('token', tokenRes);
                setToken(tokenRes);
            }
        )
        .catch(
            err => {if (            
                err && 
                err.response && 
                err.response.data && 
                err.response.data.msg && 
                errorCallback
                ) errorCallback(err.response.data.msg, errorTimeout())}
        )
    }

    function getUsername({token, errorCallback, errorTimeout}) {

        let options = {
            method: 'get',
            url: 'http://localhost:3003/username',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        };
        axios(options)
        .then(
            res => {console.log('user data', res); setUsername(res.data)}
        )
        .catch(
            err => {if (
            err && 
            err.response && 
            err.response.data && 
            err.response.data.msg && 
            errorCallback
            ) errorCallback(err.response.data.msg, errorTimeout())}
        );
    }

    // function getUser() {
    //     let options = {
    //         method: 'get',
    //     }
    // }


    function reportPet({
        // TODO: other location data enable when mapbox is implemented
        token,
        img,
        petstatus,
        petlocation,
        species, 
        petsize, 
        breed, 
        sex, 
        color, 
        age, 
        uniquefeature, 
        postdescription,
        successCallback,
        successTimeout,
        errorCallback,
        errorTimeout
    }) {

        const data = new FormData();
    
        data.append('file', img);
        data.append('petstatus', petstatus);
        data.append('petlocation', petlocation);
        data.append('species', species);
        data.append('petsize', petsize);
        data.append('breed', breed);
        data.append('sex', sex);
        data.append('color', color);
        data.append('age', age);
        data.append('uniquefeature', uniquefeature);
        data.append('postdescription', postdescription);

        let options = {
            method: 'post',
            url: 'http://localhost:3003/reportpet',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            data: data
        };
        axios(options)
        .then(
            res => {
                if (DEBUG) console.log(res)
               if (successCallback) successCallback(res.data.msg, successTimeout())
        }
        )
        .catch(
            err => {if (errorCallback) errorCallback(
                err &&
                err.response &&
                err.response.data &&
                err.response.data.msg, 
                errorTimeout())
            }
        );
    }
    
    function fetchPets({limit, offset, successCallback, errorCallback}) {
        let options = {
            method: 'get',
            url: `http://localhost:3003/pets/${limit}/${offset}`,
            mode: 'cors',        
            headers: {
                'Content-Type': 'application/json'
            }
        };
        axios(options)
        .then(res => {
            if (successCallback) successCallback(res)
        })
        .catch(err => {
            if (errorCallback) errorCallback(err)
        })
    }
    
    function getAllPets({successCallback, errorCallback}) {
        let options = {
            method: 'get',
            url: 'http://localhost:3003/pets/total',
            mode: 'cors',        
            headers: {
                'Content-Type': 'application/json'
            }
        };
        axios(options)
        .then(res => {
            if (successCallback) successCallback(res)
        })
        .catch(err => {
            if (errorCallback) errorCallback(err)
        })
    }

    // function getOnePet({id, successCallback, errorCallback}) {
    //     let options = {
    //         method: 'get',
    //         url: `http://localhost:3003/pets/${id}`,
    //         mode: 'cors',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     };
    //     axios(options)
    //     .then(res => {if (successCallback) successCallback(res)})
    //     .catch(err => console.log('api err', err))
    // }

    return (
        <AppStateContext.Provider value={{registerUser, loginUser, getUsername, user, reportPet, fetchPets, getAllPets, pets, numberIncreases, setOffset, limit, loader}}>
            { props.children }
        </AppStateContext.Provider>
    )
}