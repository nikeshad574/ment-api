import mongoose from "mongoose";
import { Request } from "express";
import fs from "fs";

/**
 * changed keys value to undefined from any provided object
 * @param obj the object from which key is value is undefined
 * @param keys strings array of keys to be removed
 * @returns new object with removed keys
 * useCase: responseObject
 */
export const convertValuesToUndefined = (obj: any, keys: string[]) => {
  keys.forEach((key) => {
    obj[key] = undefined;
  });
  return obj;
};

/**
 * delete keys from any provided object
 * @param obj the object from which key are removed
 * @param keys strings array of keys to be removed
 * @returns new object with removed keys
 * useCase: req.body
 */
export const removeKeys = (obj: any, keys: string[]) => {
  keys.forEach((key) => {
    delete obj[key];
  });
  return obj;
};

/**
 * convert the normal id into mongoose ID
 */
export const mongooseId = (id: string) => {
  return mongoose.Types.ObjectId.createFromHexString(id);
};

/**
 *
 * @param length length of the random string
 * @returns random string of given length
 */
export const generateRndStr = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 *
 * @param {import("express").Request} req
 * @param {string} fileName
 * @description returns the file's static path from where the server is serving the static image
 */
export const getStaticFilePath = (req: Request, fileName: string) => {
  return `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
};

/**
 *
 * @param {string} fileName
 * @description returns the file's local path in the file system to assist future removal
 */
export const getLocalPath = (fileName: string) => {
  return `public/uploads/${fileName}`;
};

/**
 *
 * @param {string} localPath
 * @description Removed the local file from the local file system based on the file path
 */
export const removeLocalFile = (localPath: string) => {
  fs.unlink(localPath, (err: unknown) => {
    if (err) console.log("Error while removing local files: ", err);
    else {
      console.log("Removed local: ", localPath);
    }
  });
};

export interface FileReq extends Request {
  filePaths: string[];
}

export const removeUnusedMulterImageFilesOnError = (req: FileReq) => {
  try {
    if (!req.filePaths) return;
    req.filePaths.map((filePath) => {
      removeLocalFile(getLocalPath(filePath));
    });
  } catch (error) {
    console.log("Error while removing image files: ", error);
  }
};

/**
 *
 * @param ms time in milliseconds
 * @returns  a promise that resolves after the given time
 */
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * get inner regex pattern from string leaving the pattens eg: / / from string
 * @param str string to check for regex pattern eg: for regex username=/name/
 * @param regex pattern to match eg: /"\/([^\/]+)\/"/
 * @returns returns what is inside that pattern eg: name
 */
export const matchInnerRegex = (str: string, regex: RegExp) => {
  const match = str.match(regex);
  if (match) {
    return match[1];
  }
  return match;
};
