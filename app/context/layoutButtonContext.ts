// context for defining the shape of our button context
import React, { Dispatch, SetStateAction } from 'react';

interface layoutButtonContextType {
    setButtonTitle: Dispatch<SetStateAction<string>>;
    setButtonLink: Dispatch<SetStateAction<string>>;
}

const layoutButtonContext = React.createContext<layoutButtonContextType>({} as layoutButtonContextType);

export default layoutButtonContext;

