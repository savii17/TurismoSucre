import HomePage from "./HomePage";
import UserHomePage from "./user/UserHomePage";
import { authRepository } from "../repositories/authRepository";

export default function AudienceHomePage() { return authRepository.isRole("USUARIO") ? <UserHomePage /> : <HomePage />; }
