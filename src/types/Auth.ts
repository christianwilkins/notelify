import { Session, User } from "@supabase/supabase-js";

export interface AuthResponse {
    error?: Error;
    user?: User;
    session?: Session;
  }