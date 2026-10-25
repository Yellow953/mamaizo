import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";
import { tartan as c } from "@/lib/content";

export const metadata: Metadata = { title: c.admin.login.submit };

export default function Login() {
  return <LoginForm />;
}
