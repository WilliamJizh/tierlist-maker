"use client";


import { addUser } from "@/drizzle/actions";
import { Button } from "../ui/button";



const AddUser = () => {

  const generateRandomString = (length: number) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

   const handleAddUser = async () => {
     const name = generateRandomString(10);
     const email = generateRandomString(10) + "@example.com";
     const image = generateRandomString(10) + ".png";

     console.log("Adding user...");
     const result = await addUser(name, email, image);
     console.log("User added!", result);
     
   };
   
  return <Button onClick={handleAddUser}>Add User</Button>;
};

export default AddUser;
