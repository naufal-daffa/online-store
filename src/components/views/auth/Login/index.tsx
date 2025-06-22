import { useRouter } from 'next/router';
import styles from './login.module.scss';
import Link from 'next/link';
// import { error } from 'console';
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';

const LoginView = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {push, query} = useRouter();
  
    const callbackUrl: any = query.callbackUrl || '/';

    const handleSubmit = async (event: FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        setIsLoading(true);
        setError('');
        const form = event.target as HTMLFormElement
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: form.email.value,
                password: form.password.value,
                callbackUrl
            });

            if(!res?.error){
                setIsLoading(false);
                form.reset();
                push(callbackUrl)
            }else{
                setIsLoading(false);
                setError("Email or Password is incorrect");
            };
        } catch (error) {
            setIsLoading(false);
            setError("Email or Password is incorrect");
        };
    };

    return (
        <div className={styles.Login}>
            <h1 className={styles.Login__title}>
                Login
            </h1>
            {error && <p className={styles.Login__error}>{error}</p>}
            <div className={styles.Login__form}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.Login__form__item}>
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email"
                            name='email' 
                            id='email' 
                            className={styles.Login__form__item__input} />
                    </div>
                    <div className={styles.Login__form__item}>
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password"
                            name='password' 
                            id='password' 
                            className={styles.Login__form__item__input} />
                    </div>
                    <button type='submit' className={styles.Login__form__button}>
                        {isLoading ? 'Loading...' : 'Login'}
                    </button>
                </form>
            </div>
            <p className={styles.Login__link}>
                Don{" ' "}t have an account? Sign up <Link href="/auth/register">here</Link>
            </p>
        </div>
    );
};

export default LoginView;