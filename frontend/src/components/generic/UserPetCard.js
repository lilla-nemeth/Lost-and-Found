import React, { useState } from 'react';
import { petDate, isInputEmpty } from '../HelperFunctions.js';

const UserPetCard = (props) => {
    const { pet, deleteUsersPet, allChecked, parentCallback } = props;
    const [checked, setChecked] = useState(false);

    let DEBUG = false;

    let disabled = !checked;

    if (DEBUG) console.log(pet);
    if (DEBUG) console.log('disabled', disabled);
    if (DEBUG) console.log('allChecked', allChecked);

    const buttonCardChecked = (
        <div>
            <button 
                className={disabled ? 'deletePetButtonInactive' : 'deletePetButton'}
                disabled={disabled}
                onClick={() => deleteUsersPet(pet.id)}
            >
                Delete Pet
            </button>
        </div>
    );

    const buttonAllChecked = (
        <div>
            <button className='deletePetButtonInvisible'>
                Delete Pet
            </button>
        </div>
    );

    return (
        <div className='userPetContainer'>
            <div className='userPet'>
                <div className='userPetInner'>
                    <div className='userPetPictureContainer'>
                        <img className='userPetPicture' alt='img' src={`data:image/jpg;base64,${pet.img}`} />
                    </div>
                    <div className='userPetTextBox'>
                        <table className='table'>
                            <tbody>
                                <tr>
                                    <td className='tableCell'>
                                        <div className='petStatus'>
                                            {pet.petstatus}
                                        </div>
                                    </td>
                                    <td className='tableCell'>
                                        <label className='checkboxContainer'>
                                            <input
                                              type='checkbox'
                                              checked={allChecked || (checked || parentCallback(checked))}
                                              onChange={() => {setChecked(!checked); parentCallback(!checked);}}
                                            />
                                            <span class='checkmark'></span>
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='tableCell'>
                                        <div className='petSpecies'>
                                            {pet.species}
                                        </div>
                                    </td>
                                    <td className='tableCell'>
                                    </td>
                                </tr>
                                <tr className='petMainInfo'>
                                    {isInputEmpty('ID', ('#' + pet.id), 'tableCell')}
                                </tr>
                                <tr className='petMainInfo'>
                                    {petDate(pet.petstatus, pet.since, pet.until, 'tableCell')}
                                </tr>
                                <tr className='petMainInfo'> 
                                    {isInputEmpty('Location', (pet.petlocation), 'tableCell')}
                                </tr>
                            </tbody>
                        </table>
                        { allChecked ? buttonAllChecked : buttonCardChecked }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPetCard;