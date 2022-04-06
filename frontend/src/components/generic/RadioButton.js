import React from 'react';

const RadioButton = (props) => {
  const { id, name, value, checked, onChange, htmlFor, labelName } = props;

  let DEBUG = false;

  return (
    <>
      <li className='radioButtonOption'>
        <input
          type='radio'
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
        />
        <label htmlFor={htmlFor}>{labelName}</label>
        <div className='radioCheck'>
          <div className='radioCheckInside'></div>
        </div>
      </li>
    </>
  );
};

export default RadioButton;
