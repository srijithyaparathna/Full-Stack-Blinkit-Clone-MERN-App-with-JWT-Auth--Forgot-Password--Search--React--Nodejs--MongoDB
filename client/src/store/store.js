// Importing `configureStore` to create the Redux store
import { configureStore } from '@reduxjs/toolkit';

// Importing reducers from different slices
import userReducer from './userSlice';
import productReducer from './productSlice';
import cartReducer from './cartProduct';
import addressReducer from './addressSlice';
import orderReducer from './orderSlice';

// Configuring the store with all the reducers
export const store = configureStore({
    reducer: {
        user: userReducer, // User slice
        product: productReducer, // Product slice
        cartItem: cartReducer, // Cart slice
        addresses: addressReducer, // Address slice
        orders: orderReducer // Order slice
    }
});

/* 

What is the Redux 
    Redux is a library used for state management in JavaScript application. It helps manage the state of an
    application in a centralized and predictable way
    State : State is like the memory of your application it holds the data that your application need to work
            such and user details products or cart items
    Store : The Store is where the state is kept it is like a container for all application data 

What is a Reducer in Redux
    A reducer is a function that takes two things
        The current state : What the data looks like right now.
        An action         : A signal that something happend (e.g add a new product )

the reducer uses the action to figure out what changes need to be made to the state and then returns the 
updated state
    in simple terms
    A reducer is like a machine that takes input(state + action) and gives output (new state)
    it does not store data itself but decides how the stores data should change
    
Why Use Reducers
    Reducers ensures that the state update in a predictable and organized way. Every change to the state 
    goes through the reducer which make dubugging and tracking changes easier


Step API call to fetch Data and Store in Redux 
    1. User Triggers an Action
    for example when the app loads you might want to fetch a list of products  form the backend 

    2. Dispatch an Action 
    The frontend sends a signal (called an "action") to redux saying "I need the product data from the backend"
    
    3. Make an API Call
    you use a library like Axios or Fetch to request data from the backend (e.g., "Get all products").

    4. Send Data to the Reducer 
    Once the API response is received (e.g., a list of products), you dispatch another action 
    containing that data. The reducer catches this action and updates the state 

    5. Update the Store
    The reducer processes the action, updates the state (e.g., storing the product data), and saves it 
    in the Redux store.

    6. React Component Uses the Data:
    React components connected to the Redux store automatically get the updated data and re-render with new information


    Files Responsible for this 
    here are the files typically involved:
    1. Action Creators(Optional) : A file that defines what actions to send (e.g "fetchProducts")
    2. Reducer : A file that listens for action and updates the state accordingly (e.g., adds products to the state).
    3. Redux Store : The central location where the stete is stored
    4. React Component: The place where you trigger the action (e.g fetching products ) and display the data

    Summary
    state : The current data or memory of your app  (e.g., user details, cart items).
    Store : A container for all the state in your app 
    Reducer : A function  that update the state in response to action 
        API Data Flow:
            Component dispatches an action 
            API call is made to the backend
            Data comes back and is sent to the reducer 
            Reducer update the store
            Component re-render with the update data
        Reducers do not make API calls they only handle how the data should change when an action is dispatched

    1 . GET Request(Fetching Data)
        Flow 
            1 . The frontend sends an action to the store saying start fetch data
            2 . An API call is made to the backend to retrieve data (e.g list of product or user details)
            3 . When the data comes back another action is dispatched with the data as payload
            4 . The reducer catches this action updates the state stores the retrieved data and the store
                now contains the latest data 
            5 . components connected to the store automatically re-render with the update data

    2 . Post Request(creating data)
        Flow  
            1 . the frontend sends an action to indicate i m adding new data 
            2 . an API call is made to the backend to send the new data (sending a new product to the server )
            3 . Once the backend confirms the data is added (success, response) anothe action is dispatched
            4 . the reducer catches this action and update the state adding new item to the product list in the store
            5 . Components update with newly added data

    3 . Put Request (Updating)
        Flow 
            1 . the frontend sends an action saying "i m updating data"
            2 . An Api call is made to backend with the update data
            3 . when the backend confirms the update (success,response) another action is dispatched
            4 . the reducer catches this action and update the specific item in the state 
            5 . Components re-rerender to show the update data

    4 . Delete Request (removing data)
        Flow 
            1 . The frontend sends an action saying "i m deleting data"
            2 . An API call is made to the backend to delete the data (delete a product or review)
            3 . When the backend confirms the deletion (success, response) another   
            4 . The reducer catches this action and removes the item form the state remoning it from the product
                list 
            5 . Components re-render to show the updated list without the deleted item


        Key Concepts for All Operation
            Action - : Every operation starts by dispatching an action which acts as a "message" to redux 
                       saying "Smoething needs to change"
            Reducer - : They listen for these actions and decide how to update the state in response 
            State Updates - : The updated state is stored in the redux store and react component automatically
                        update to reflect these changes
           
                        Asynchronous API Calls: The API calls (GET, POST, PUT, DELETE) are usually handled in middleware (like Redux Thunk or Redux Saga) or in the component logic before sending the final result to Redux.
        
                        Why is Everything Centralized in Redux?
The centralized store and reducers ensure that the application state is always in sync with user actions and 
backend changes. By handling all state changes through actions and reducers:

            The app becomes predictable and easier to debug.
            Multiple components can share and react to the same data without duplicating logic.
            Developers can handle complex workflows like data fetching and error handling consistently.



*/