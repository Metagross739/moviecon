import { useState, useEffect } from "react";

export function useLocalStorageState(defaultValue=[], key){
    const [value, setValue] = useState(function(){
      try {
        const storedValue = localStorage.getItem(key);
        return storedValue?.length ? JSON.parse(storedValue) : defaultValue; // Use optional chaining if supported
      } catch (error) {
        console.error('Error parsing localStorage value:', error);
        return defaultValue;
      }
      });

      useEffect(()=>{
        localStorage.setItem(key, JSON.stringify(value));
      },[value, key]
      
    );
    
    return [value, setValue];
}