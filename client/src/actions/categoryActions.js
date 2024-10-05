import axios from 'axios';
import {
    FETCH_CATEGORIES_REQUEST,
    FETCH_CATEGORIES_SUCCESS,
    FETCH_CATEGORIES_FAILURE,
} from './types';

/**
 * Fetch categories from the API and dispatch relevant actions.
 * @returns {Function} - Thunk function that dispatches actions based on API call.
 */
export const fetchCategories = () => {
    return async (dispatch) => {
        // Dispatch request action to indicate fetching process has started
        dispatch({ type: FETCH_CATEGORIES_REQUEST });

        try {
            // Make the API call to fetch categories
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/categories`);

            // Ensure we have categories in the response
            if (response.data && response.data.categories) {
                dispatch({
                    type: FETCH_CATEGORIES_SUCCESS,
                    payload: response.data.categories,
                });
            } else {
                // Dispatch failure action if categories are not found
                throw new Error('Categories not found in response.');
            }
        } catch (error) {
            // Handle error and dispatch failure action with error message
            dispatch({
                type: FETCH_CATEGORIES_FAILURE,
                payload: error.response ? error.response.data.message : error.message,
            });
        }
    };
};
