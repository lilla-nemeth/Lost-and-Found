import React, { createContext } from 'react';
import axios from 'axios';

export const ApiContext = createContext();

export default function ApiContextProvider(props) {

    let DEBUG = true;

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

    function getUsername({token, setUser, errorCallback, errorTimeout}) {

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
            res => setUser(res.data)
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
    
    // function storeImage({petId, token, fileArr, callback, errorCallback}) {

    //     const formData = new FormData();
    //     if (DEBUG) console.log('file data', fileArr)

    //     formData.append('image', fileArr);

    //     if (DEBUG) console.log("form data from axios 1", formData)
    //     let options = {
    //         method: 'post',
    //         url: `http://localhost:3003/single/${petId}`,
    //         mode: 'cors',
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //             'x-auth-token': token
    //         },
    //         data: formData
    //     };
        
    //     axios(options)
    //     .then(res => console.log('storeSingleImage res from ApiContext', res))
    //     .catch(err => console.log('storeSingleImage err from ApiContext', err));
    // }

    // function storeImages({token, fileArr, successCallback, errorCallback}) {
    //     const formData = new FormData();
    //     if (DEBUG) console.log('file data', fileArr)

    //     // fileArr.forEach((file) => {
    //     //     formData.append("image", file);
    //     // })
    //     for(let i = 0; i < fileArr.length; i++) {
    //         formData.append(`image${i}`, fileArr[i]);
    //     }
    //     if (DEBUG) console.log("form data from axios", formData)
    //     let options = {
    //         method: 'post',
    //         url: 'http://localhost:3003/multiple',
    //         mode: 'cors',
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //             'x-auth-token': token
    //         },
    //         data: formData
            
    //     };
    //     axios(options)
    //     .then(res => {
    //         console.log('res', res)
    //         if(successCallback) {
    //             successCallback(res)
    //         }
    //     })
    //     .catch(err => console.log('err', err.message));
    // }


    function pagination({limit, offset, successCallback, errorCallback}) {
        let options = {
            method: 'get',
            url: `http://localhost:3003/pets/${limit}/${offset}`,
            mode: 'cors',        
            headers: {
                'Content-Type': 'application/json'
            }
        };
        axios(options)
        .then((res) => {
            if (successCallback) successCallback(res)
        })
        .catch((err) => {
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
        .then((res) => {
            if (successCallback) successCallback(res)
        })
        .catch((err) => {
            if (errorCallback) errorCallback(err)
        })
    }

    return (
        <ApiContext.Provider value={{registerUser, loginUser, getUsername, reportPet, pagination, getAllPets}}>
            { props.children }
        </ApiContext.Provider>
    )
}