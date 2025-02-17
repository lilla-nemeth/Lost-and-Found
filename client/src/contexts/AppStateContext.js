import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { handleError, clearError } from '../utils/HelperFunctions.js';

export const AppStateContext = createContext();

export default function AppStateContextProvider(props) {
    const { token } = useContext(AuthContext);

    const [pets, setPets] = useState([]);
    const [userPets, setUserPets] = useState([]);
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [loader, setLoader] = useState(true);
    // errorMsg is not used
    // eslint-disable-next-line
    const [errorMsg, setErrorMsg] = useState('');

    let limit = 6;

    useEffect(() => {
        if (token) {
            getUsername({
                token,
                errorCallback: (err) => {
                    clearError();
                    handleError(err, setErrorMsg);
                },
            });
            getUsers({
                token,
                successCallback: (res) => setUsers(res.data),
                errorCallback: (err) => {
                    clearError();
                    handleError(err, setErrorMsg);
                },
            });
            getUserPets({
                token,
                successCallback: (res) => {
                    setUserPets(res.data);
                    setLoader(false);
                },
                errorCallback: (err) => {
                    clearError();
                    handleError(err, setErrorMsg);
                },
            });
        }
    }, [token]);

    useEffect(() => {
        fetchPets({
            limit,
            offset,
            successCallback: (res) => {
                setPets(res.data.rows);
                setTotal(Number(res.data.count));
                setLoader(false);
            },
            errorCallback: (err) => {
                clearError();
                handleError(err, setErrorMsg);
            },
        });
    }, [limit, offset]);

    function signUpUser({
        email,
        username,
        phone,
        pw,
        successCallback,
        successTimeout,
        errorCallback,
    }) {
        const options = {
            method: 'post',
            url: '/signup',
            data: {
                email,
                username,
                phone,
                pw,
            },
        };
        axios(options)
            .then((res) => {
                if (successCallback)
                    successCallback(res.data.msg, successTimeout());
            })
            .catch((err) => {
                if (err && errorCallback) errorCallback(err);
            });
    }

    function loginUser({
        setToken,
        email,
        pw,
        successCallback,
        errorCallback,
    }) {
        const options = {
            method: 'post',
            url: '/login',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                email,
                pw,
            },
        };
        axios(options)
            .then((res) => {
                let tokenRes = res.data;

                localStorage.setItem('token', tokenRes);
                setToken(tokenRes);
                if (successCallback) {
                    successCallback();
                }
            })
            .catch((err) => {
                if (err && errorCallback) errorCallback(err);
            });
    }

    function getUsername({ token, errorCallback }) {
        const options = {
            method: 'get',
            url: '/username',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        };
        axios(options)
            .then((res) => setUsername(res.data))
            .catch((err) => {
                if (err && errorCallback) errorCallback(err);
            });
    }

    function reportPet({
        token,
        img,
        petstatus,
        petlocation,
        longitude,
        latitude,
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
    }) {
        const data = new FormData();

        data.append('file', img);
        data.append('petstatus', petstatus);
        data.append('petlocation', petlocation);
        data.append('longitude', longitude);
        data.append('latitude', latitude);
        data.append('species', species);
        data.append('petsize', petsize);
        data.append('breed', breed);
        data.append('sex', sex);
        data.append('color', color);
        data.append('age', age);
        data.append('uniquefeature', uniquefeature);
        data.append('postdescription', postdescription);

        const options = {
            method: 'post',
            url: '/reportpet',
            mode: 'cors',
            headers: {
                'x-auth-token': token,
            },
            data: data,
        };
        axios(options)
            .then((res) => {
                if (successCallback) successCallback(res, successTimeout());
            })
            .catch((err) => {
                if (err && errorCallback) errorCallback(err);
            });
    }

    function fetchPets({ limit, offset, successCallback, errorCallback }) {
        const options = {
            method: 'get',
            url: `/pets/${limit}/${offset}`,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        axios(options)
            .then((res) => {
                if (successCallback) successCallback(res);
            })
            .catch((err) => {
                if (err && errorCallback) errorCallback(err);
            });
    }

    function getUserPets({ token, successCallback, errorCallback }) {
        const options = {
            method: 'get',
            url: '/dashboard',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        };
        axios(options)
            .then((res) => {
                if (successCallback) successCallback(res);
            })
            .catch((err) => {
                if (err && errorCallback) errorCallback(err);
            });
    }

    function getUsers({ token, successCallback, errorCallback }) {
        const options = {
            method: 'get',
            url: '/petprofile/:id',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        };
        axios(options)
            .then((res) => {
                if (successCallback) successCallback(res);
            })
            .catch((err) => {
                if (err && errorCallback) errorCallback(err);
            });
    }

    function deleteOnePet({
        id,
        token,
        successCallback,
        successTimeout,
        errorCallback,
    }) {
        const options = {
            method: 'delete',
            url: `/dashboard/pet/${id}`,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        };
        axios(options)
            .then((res) => {
                if (successCallback)
                    successCallback(res.data.msg, successTimeout());
            })
            .catch((err) => {
                if (err && errorCallback) errorCallback(err);
            });
    }

    function deleteAllPets({
        token,
        successCallback,
        successTimeout,
        errorCallback,
    }) {
        const options = {
            method: 'delete',
            url: '/dashboard/pet',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        };
        axios(options)
            .then((res) => {
                if (successCallback)
                    successCallback(res.data.msg, successTimeout());
            })
            .catch((err) => {
                if (err && errorCallback) errorCallback(err);
            });
    }

    function fetchPlaces(query, setter, lng, lat) {
        const params = new URLSearchParams({
            fuzzyMatch: true,
            language: 'en',
            limit: 5,
            proximity: lng && lat ? `${lng}, ${lat}` : '0,0',
        });

        const options = {
            method: 'get',
            url: `/reportpet/${query}?${params}`,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        axios(options)
            .then((res) => {
                if (query) setter(res.data.features);
            })
            .catch((err) => console.log(err));
    }

    return (
        <AppStateContext.Provider
            value={{
                signUpUser,
                loginUser,
                getUsername,
                username,
                users,
                userPets,
                setUserPets,
                reportPet,
                fetchPets,
                pets,
                setPets,
                total,
                setTotal,
                offset,
                setOffset,
                limit,
                loader,
                deleteOnePet,
                deleteAllPets,
                getUserPets,
                fetchPlaces,
            }}
        >
            {props.children}
        </AppStateContext.Provider>
    );
}
