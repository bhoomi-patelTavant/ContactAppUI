import { createSlice } from '@reduxjs/toolkit';

interface LanguageState {
  value: string
}

// Define the initial state using that type
const initialState: LanguageState = {
  value: "en",
}

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        updateLanguage: (state, action) => {
            state.value = action.payload
        }
    },
});

export const { updateLanguage } = languageSlice.actions;
export default languageSlice.reducer;