"use client";

import { useActionState } from "react";
import { signInAdmin, type AdminLoginState } from "./actions";

const initialState: AdminLoginState = { error: "" };

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(signInAdmin, initialState);

  return (
    <form action={formAction} className="admin-login-form">
      <label>
        <span>Contraseña</span>
        <input autoComplete="current-password" name="password" required type="password" />
      </label>
      <button className="primary-cta" disabled={isPending} type="submit">
        {isPending ? "Ingresando…" : "Ingresar"}
      </button>
      {state.error && <p aria-live="polite" className="admin-login-error">{state.error}</p>}
    </form>
  );
}
