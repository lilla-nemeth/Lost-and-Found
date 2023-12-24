/* Success Messages */
const IS = `is`;
const ARE = `are`;
const SUCCESSFULLY = `succesfully`;
const UPDATED = `updated`;
const DELETED = `deleted`;
const CREATED = `created`;

/* Pet Success Messages */
const SUCCESS_MSG_UPDATED_PET = `Your post ${IS} ${SUCCESSFULLY} ${UPDATED}`;
const SUCCESS_MSG_DELETED_PET = `Your post ${IS} ${SUCCESSFULLY} ${DELETED}`;
const SUCCESS_MSG_DELETED_PETS = `Your posts ${ARE} ${SUCCESSFULLY} ${DELETED}`;

/* User Success Messages */
const SUCCESS_MSG_CREATED_USER = `Your account ${IS} ${SUCCESSFULLY} ${CREATED}`;
const SUCCESS_MSG_UPDATED_USER = `Your profile ${IS} ${SUCCESSFULLY} ${UPDATED}`;

const SUCCESS_MSG_DELETED_USER_AND_PETS = `Your account and your posts ${ARE} ${SUCCESSFULLY} ${DELETED}`;

/* Error Messages */
const FAILED_TO = `Failed to`;
const FETCH = `fetch`;
const UPDATE = `update`;
const DELETE = `delete`;
const ADD = `add`;
const ALREADY = `already`;
const EXISTS = `exists`;
const PLEASE_TRY_ANOTHER_ONE = `Please try another one.`;

/* Pet Error Messages */
const ERROR_MSG_FETCH_USER_PETS = `${FAILED_TO} ${FETCH} your pets.`;
const ERROR_MSG_FETCH_ALL_PETS = `${FAILED_TO} ${FETCH} all pets.`;
const ERROR_MSG_FETCH_PETS = `${FAILED_TO} ${FETCH} pets.`;
const ERROR_MSG_FETCH_TOTAL_PETS = `${FAILED_TO} ${FETCH} the number of pets.`;
const ERROR_MSG_FETCH_PET = `${FAILED_TO} ${FETCH} pet.`;
const ERROR_MSG_UPDATE_PET = `${FAILED_TO} ${UPDATE} your post.`;
const ERROR_MSG_DELETE_PET = `${FAILED_TO} ${DELETE} your post.`;
const ERROR_MSG_DELETE_PETS = `${FAILED_TO} ${DELETE} your posts.`;
const ERROR_MSG_CREATE_PET = `${FAILED_TO} ${ADD} new pet.`

/* User Error Messages */
const ERROR_MSG_FETCH_USERNAME = `${FAILED_TO} ${FETCH} username.`;
const ERROR_MSG_FETCH_USER = `${FAILED_TO} ${FETCH} user.`;
const ERROR_MSG_UPDATE_USER = `${FAILED_TO} ${UPDATE} your profile.`;
const ERROR_MSG_DELETE_USER = `${FAILED_TO} ${DELETE} your account.`;
const ERROR_MSG_USED_EMAIL = `Email address ${ALREADY} ${EXISTS}. ${PLEASE_TRY_ANOTHER_ONE}`;
const ERROR_MSG_USED_PHONE = `Phone number ${ALREADY} ${EXISTS}. ${PLEASE_TRY_ANOTHER_ONE}`;
const ERROR_MSG_INCORRECT_PASSWORD = `Your password ${IS} incorrect`;
const ERROR_MSG_NOT_FOUND_USER = `User not found.`;

module.exports = {
    ERROR_MSG_FETCH_USER_PETS,
    ERROR_MSG_FETCH_ALL_PETS,
    ERROR_MSG_FETCH_PETS,
    ERROR_MSG_FETCH_TOTAL_PETS,
    ERROR_MSG_FETCH_PET,
    ERROR_MSG_UPDATE_PET,
    ERROR_MSG_FETCH_USERNAME,
    ERROR_MSG_FETCH_USER,
    ERROR_MSG_UPDATE_USER,
    ERROR_MSG_DELETE_PET,
    ERROR_MSG_DELETE_PETS,
    ERROR_MSG_CREATE_PET,
    ERROR_MSG_DELETE_USER,
    ERROR_MSG_USED_EMAIL,
    ERROR_MSG_USED_PHONE,
    ERROR_MSG_INCORRECT_PASSWORD,
    ERROR_MSG_NOT_FOUND_USER,
    SUCCESS_MSG_CREATED_USER,
    SUCCESS_MSG_UPDATED_PET,
    SUCCESS_MSG_UPDATED_USER,
    SUCCESS_MSG_DELETED_PET,
    SUCCESS_MSG_DELETED_PETS,
    SUCCESS_MSG_DELETED_USER_AND_PETS
}