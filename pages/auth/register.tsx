import Layout from "../../components/layout";
import Head from "next/head";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {Star} from "../../components/star";
import Link from "next/link";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import {stringifyQuery} from "next/dist/server/server-route-utils";
import {getURL, githubLogin, googleLogin, loggedIn} from "../../lib/helpers";
import {useRouter} from "next/router";

const isEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

export default function Register() {
    const [hidePassword, setHidePassword] = useState(true);
    const [emailStyles, setEmailStyles] = useState("");
    const [passwordStyles, setPasswordStyles] = useState("");
    const [strengthStyles, setStrengthStyles] = useState(["", "0%"]);
    const [repeatPasswordStyles, setRepeatPasswordStyles] = useState("");
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [strength, setStrength] = useState(0);
    const supabase = useSupabaseClient()
    const passwordRef = React.useRef<HTMLInputElement>(null)
    const emailRef = React.useRef<HTMLInputElement>(null)
    const usernameRef = React.useRef<HTMLInputElement>(null)

    let router = useRouter();

    function onHidePassword() {
        setHidePassword(!hidePassword);
    }

    function onEmailChange(event: any) {
        if (isEmail(event.target.value)) {
            setEmailStyles("!border-green-mid");
        } else {
            setEmailStyles("!border-red-mid");
        }
    }

    function verifyEmailState() {
        if (emailStyles.startsWith("!border-red-mid")) {
            setEmailStyles("!border-red-mid animate-shake");
        }
    }

    function onRepeatPasswordChange(event: any) {
        if (event.target.value !== passwordRef.current?.value) {
            setRepeatPasswordStyles("!border-red-mid");
        } else {
            setRepeatPasswordStyles("!border-green-mid");
        }
    }

    function verifyRepeatPassword(event: any) {
        if (event.target.value !== passwordRef.current?.value) {
            setRepeatPasswordStyles("!border-red-mid animate-shake");
        }
    }

    function onPasswordChange(event: any) {
        // Check password length
        let temp_strength = 0;
        if (event.target.value.length >= 8) {
            temp_strength++;
        }
        if (event.target.value.match(/[a-z]+/)) {
            temp_strength++;
        }
        if (event.target.value.match(/[A-Z]+/)) {
            temp_strength++;
        }
        if (event.target.value.match(/[0-9]+/)) {
            temp_strength++;
        }
        if (event.target.value.match(/[$@#&!]+/)) {
            temp_strength++;
        }
        setStrength(temp_strength);
        if (strength >= 4) {
            setStrengthStyles(["bg-green-mid", `${temp_strength * 100 / 5}%`]);
        }
        if (strength === 3) {
            setStrengthStyles(["bg-yellow-mid", `${temp_strength * 100 / 5}%`]);
        }
        if (strength <= 2) {
            setStrengthStyles(["bg-red-mid", `${temp_strength * 100 / 5}%`]);
        }
    }

    async function onSubmit(event: any) {
        event.preventDefault();

        if (emailStyles.startsWith("!border-red-mid") || emailRef.current?.value === '') {
            setErrorMsg('Please enter a valid email address')
            setEmailStyles("!border-red-mid !animate-shake");
            return;
        }

        if (passwordRef.current?.value === '') {
            setErrorMsg('Please enter a password')
            setPasswordStyles("!border-red-mid !animate-shake");
            return;
        }

        if (strength < 4) {
            setErrorMsg('Password is too weak')
            setPasswordStyles("!border-red-mid !animate-shake");
            return;
        }

        const body = {
            username: event.currentTarget.username.value,
            password: event.currentTarget.password.value,
            name: event.currentTarget.name.value,
        }

        if (body.password !== event.currentTarget.rpassword.value) {
            setErrorMsg(`The passwords don't match`)
            return
        }

        const {data, error} = await supabase.auth.signUp({
            email: event.currentTarget.email.value,
            password: event.currentTarget.password.value,
        })

        const {
            data: {session},
        } = await supabase.auth.getSession()

        const { data: profile } = await supabase
            .from('profiles')
            .update({ username: usernameRef.current?.value })
            .eq('id', session?.user?.id)

        setSuccessMsg('Check your email for a confirmation link')
    }

    useEffect(() => {
        loggedIn(supabase, router, "/editor/dashboard");
    })

    return (
        <Layout>
            <Head>
                <title>Sloby Signup</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main>
                {Array.from({length: 20}, (_, i) => <Star key={i}/>)}
                <div className={"flex-center flex-col gap-8 lg:p-40"}>
                    <div className={"flex flex-row bg-dark-dark rounded-lg w-2/3 z-40"}>
                        <div className={"bg-dark-mid flex-center rounded-l-lg w-1/2"}>
                            <Image alt="Sloby Logo" src={"/images/Sloby Logo Dark.svg"} width={400} height={500}/>
                        </div>
                        <form onSubmit={onSubmit} className={"w-1/2 flex flex-col justify-between m-16 gap-8"}>
                            <p className={"font-semibold text-5xl"}>Sign Up</p>
                            <div
                                className={"flex items-center w-full rounded-lg bg-white p-2 gap-3 hover:cursor-pointer"}
                                onClick={(e) => googleLogin(e, supabase)}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"/>
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"/>
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"/>
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"/>
                                    <path d="M1 1h22v22H1z" fill="none"/>
                                </svg>
                                <span className={"text-gray-500 font-medium"}>Continue with Google</span>
                            </div>
                            <div
                                className={"flex items-center w-full rounded-lg bg-white p-2 gap-3 hover:cursor-pointer"}
                                onClick={(e) => githubLogin(e, supabase)}>
                                <svg role="img"
                                     height="24"
                                     viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg"><title>GitHub</title>
                                    <path
                                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                                </svg>
                                <span className={"text-gray-500 font-medium"}>Continue with GitHub</span>
                            </div>
                            <label className="block flex flex-col gap-2">
                                <span className="">Your Username</span>
                                <input type="text"
                                       name={"username"}
                                       ref={usernameRef}
                                       className={`px-6 rounded-full mt-1 block w-full rounded-md bg-dark-mid border-transparent focus:border-gray-500 focus:bg-dark-dark focus:ring-0`}
                                       placeholder="Enter your username"
                                />
                            </label>
                            <label className="block flex flex-col gap-2">
                                <span className="">Your email</span>
                                <input type="email"
                                       ref={emailRef}
                                       name={"email"}
                                       className={`${emailStyles} px-6 rounded-full mt-1 block w-full rounded-md bg-dark-mid border-transparent focus:border-gray-500 focus:bg-dark-dark focus:ring-0`}
                                       placeholder="Enter your email"
                                       onChange={onEmailChange}
                                       onBlur={verifyEmailState}
                                />
                            </label>
                            <label className="block flex flex-col gap-2">
                                <span className="">Your password</span>
                                <div className={"flex-center gap-2"}>
                                    <span className={"text-sm text-gray-400"}>Strength: </span>
                                    <div className={"h-2 w-full bg-dark-mid rounded-full"}>
                                        <div
                                            className={`${passwordStyles} rounded-full ${strengthStyles[0]} h-full transition-all duration-500`}
                                            style={{width: strengthStyles[1]}}/>
                                    </div>
                                </div>
                                <input type={hidePassword ? "password" : "text"}
                                       ref={passwordRef}
                                       id={"password"}
                                       name={"password"}
                                       onChange={onPasswordChange}
                                       className="px-6 rounded-full mt-1 block w-full rounded-md bg-dark-mid border-transparent focus:border-gray-500 focus:bg-dark-dark focus:ring-0"
                                       placeholder="Enter your password"></input>
                                <label className="mt-2 inline-flex items-center">
                                    <input type="checkbox"
                                           onClick={onHidePassword}
                                           className="rounded bg-gray-200 border-transparent focus:border-transparent focus:bg-dark-mid text-gray-700 focus:ring-1 focus:ring-offset-2 focus:ring-gray-500"/>
                                    <span className="ml-2">Show password</span>
                                </label>
                            </label>
                            <label className="block flex flex-col gap-2">
                                <span className="">Repeat your password</span>
                                <input type={"password"}
                                       name={"rpassword"}
                                       onChange={onRepeatPasswordChange}
                                       onBlur={verifyRepeatPassword}
                                       className={`${repeatPasswordStyles} px-6 rounded-full mt-1 block w-full rounded-md bg-dark-mid border-transparent focus:border-gray-500 focus:bg-dark-dark focus:ring-0`}
                                       placeholder="Repeat your password"></input>
                            </label>
                            <div className={"flex flex-col gap-3"}>
                                <button type="submit"
                                        className={"flex-center bg-green-dark w-1/4 p-3 rounded-full"}>Submit
                                </button>
                                <Link href={"/auth/login"}>
                                    <p className={"hover:underline"}>Already a member? <span
                                        className={"text-blue-400"}>Log in</span>
                                    </p>
                                </Link>
                            </div>
                            <div className={`${errorMsg ? "p-2 px-6" : ""} bg-red-mid rounded-xl`}>
                                {errorMsg}
                            </div>
                            <div className={`${successMsg ? "p-2 px-6" : ""} bg-green-mid rounded-xl`}>
                                {successMsg}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </Layout>
    )
}
