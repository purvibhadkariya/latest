import { JWT_EXPIRY, JWT_REFRESH_EXPIRY, JWT_REFRESH_SECRET, JWT_SECRET } from "../config";
import { IUser, User } from "../models/user.model"
import { Types } from "mongoose";
import Jwt from 'jsonwebtoken'
import path from "path";
import fs  from "fs";
import { storeAttachment } from "./attachment.service";

export const login = async (contact: string, password: string) =>{
    const user = await User.findOne({ contact: contact});
    if(user){
        if(user.password === password){
            const [token, refreshToken] = await generateTokens(user)
            await setRefreshToken(user._id as Types.ObjectId, refreshToken)

            return ({
                token: token,   
                refreshToken: refreshToken,
                user: user
            })

        }else{
            throw new Error("invalid Password. please try again")
        }
    }else{
        throw new Error("User not found")
    }
}

export const signup = async (
  req: any,
  userName: string,
  contact: string,
  password: string
) => {
  const isExists = await checkUserExists(contact);
  console.log(isExists, "isExists");
  const isUserNameTaken = await checkUserNameExists(userName);
  console.log(isUserNameTaken, "isUserNameTaken");
  if (isExists) {
    throw new Error("User already Exists..");
  }

  if (isUserNameTaken) {
    throw new Error("UserName already taken. Try something");
  }

  try {
    const user = await User.create({ userName, contact, password });
    console.log("User created successfully:", user);

    const [token, refreshToken] = await generateTokens(user);
    await setRefreshToken(user._id as Types.ObjectId, refreshToken);

    return {
      token,
      refreshToken,
      user,
    };
  } catch (err: any) {
    console.error("Error during user creation:", err.message, err.code, err);
    throw new Error(err.message || "Something went wrong while creating user.");
  }
};

//     const user = await User.create({userName: userName, contact: contact, password: password})

//     const [ token, refreshToken] = await generateTokens(user)
//     await setRefreshToken(user._id as Types.ObjectId, refreshToken)
    
//     return ({
//                 token: token,
//                 refreshToken: refreshToken,
//                 user: user,
//             })

// }

export const checkUserNameExists = async (userName: string) => {
    const user = await User.exists({ userName: userName });
    if (user) return true;
    return false;
}


export const checkUserExists = async (contact: string) => {
    const user = await User.exists({ contact: contact });
    if (user) return true;
    return false;
}



export const getJwtToken = (user: IUser, jwtSecret: string, jwtExpiry: string) => {
    const payload = {
        id: user._id,
        contact: user.contact,
    }
    return Jwt.sign({ ...payload }, jwtSecret, { expiresIn: jwtExpiry })
}

const   setRefreshToken = async (userId: Types.ObjectId, refreshToken: string) => {
    await User.findByIdAndUpdate(userId, {
        $set: { refreshToken: refreshToken }
    })
}

const  generateTokens = async (user: IUser) => {
    const token = getJwtToken(user as IUser, JWT_SECRET, JWT_EXPIRY);
    const refreshToken = getJwtToken(user as IUser, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRY);
    return [token, refreshToken]
}

export const getUserDetailsById = async (userId: string) => {
    return User.findById({ _id: userId }).lean();
}