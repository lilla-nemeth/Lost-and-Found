import React, { useContext } from 'react';
import { createBrowserHistory } from 'history';
import { AppStateContext } from '../../contexts/AppStateContext';
import Loader from '../generic/Loader';
import PetPage from './PetPage';
import PetList from './PetList';
import PetListWithFilters from './unused/PetListWithFilters';
import PetListWithSearch from './unused/PetListWithSearch';

let history = createBrowserHistory();

const PetHome = () => {
    const { loader } = useContext(AppStateContext);

    history.replace('/lostandfound');

    if (loader) {
        return (
            <Loader />
        );
    }

    return (  
        <main className='petMain'>
            <section>
                <PetList />
                <PetPage />
            </section>
        </main>
    );
}
 
export default PetHome;
