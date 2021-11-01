"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  let [state, setState] = useState({ username: "", password: "" });
  let router = useRouter();
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        // TODO add error handling
        await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(state),
        });
        router.refresh();
      }}
    >
      <div>
        username:{" "}
        <input
          className="border"
          name="username"
          onChange={(e) => {
            let username = e.currentTarget.value;
            setState((oldState) => ({
              ...oldState,
              username,
            }));
          }}
        />
      </div>
      <div>
        password:{" "}
        <input
          className="border"
          name="password"
          onChange={(e) => {
            let password = e.currentTarget.value;
            setState((oldState) => ({
              ...oldState,
              password,
            }));
          }}
        />
      </div>
      <button type="submit" className="w-min">
        login
      </button>
    </form>
  );
}
