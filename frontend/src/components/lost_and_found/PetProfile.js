import React, { useContext } from 'react';
import { createBrowserHistory } from 'history';
import { useParams } from 'react-router';
import { AppStateContext } from '../../contexts/AppStateContext';
import Loader from '../generic/Loader';
import { Link } from 'react-router-dom';
import PetProfileCard from '../generic/PetProfileCard';
import { AuthContext } from '../../contexts/AuthContext';

let history = createBrowserHistory();

const PetProfile = () => {
    const { id } = useParams();
    const { pets, users, loader } = useContext(AppStateContext);
    const { token } = useContext(AuthContext);

    let DEBUG = false;

    if (DEBUG) console.log('pets array PetProfile', pets);
    if (DEBUG) console.log('users from PetProfile', users);


    function getPetAndUserData(id, petArr, userArr) {
        if (token && userArr.length > 0) {
            for (let i = 0; i < petArr.length; i++) {
                for (let j = 0; j < userArr.length; j++) {
                    if (id == petArr[i].id) {
                        if (petArr[i].userid == userArr[j].id) {
                            return <PetProfileCard pet={petArr[i]} user={userArr[j]} />;
                        }
                    }
                }
            }
        } else {
            for (let i = 0; i < petArr.length; i++) {
                if (id == petArr[i].id) {
                    return <PetProfileCard pet={petArr[i]} />;
                }
            }
        }
    }

    if (DEBUG) console.log(getPetAndUserData(id, pets, users));

    history.replace(`/petprofile/${id}`);

    if (DEBUG) console.log('typeof id', typeof id)
    if (DEBUG) console.log('id', id)

    if (loader) {
        return (
            <Loader />
        );
    }

    return (  
        <>
        <main className='petMain'>
            <section>
                {getPetAndUserData(id, pets, users)}
                <div className='backButtonContainer'>
                    <div className='backButtonBox'>
                        <Link to={'/lostandfound'}>
                            <button className='backButton'>Back to the Pet List</button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
        </>
    );
}
 
export default PetProfile;