import { UserData } from "../data/models/user.model";
import app from "./testApp";
import request from "supertest";

export const createUser = async (userData: UserData) => {
  const res = await request(app).post("/api/v1/users").send(userData);
  return res;
};

export const loginUser = async (loginData: {
  email: string;
  password: string;
}) => {
  const res = await request(app).post("/api/v1/login").send(loginData);
  return res;
};
