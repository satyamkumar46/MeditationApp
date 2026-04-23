import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUserToCache = async (user) =>{

    try {
        await AsyncStorage.setItem("USER_DATA",JSON.stringify(user));
    } catch (error) {
        console.log("Cache save error", error);
    }
};

export const getUserFromCache = () =>{
    try {
        const data= await AsyncStorage.getItem("USER_DATA");
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.log("Cache read error", error);
        return null;
    }
};