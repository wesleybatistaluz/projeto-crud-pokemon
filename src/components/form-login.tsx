"use client";

import '@/styles/Login.css';

import Link from "next/link";
import Image from "next/image";

import userIcon from "public/user.png";
import passwordIcon from "public/padlock.png";
import pokeLogo from "public/pokemon-logo.png";
import {login} from "@/utils/credentials";
import {z} from "zod"; //import do zod para apoio nas validações do front: npm i zod 
import toast from 'react-hot-toast'; //import do react-hot-toast:  npm i react-hot-toast
import { LoginCredentials } from '@/utils/credentials';

//Criação do schema para colocarmos as regras de validação do zod para os campos de login
const LoginSchema = z.object({
    email: z.string().trim().email('Email com formato incorreto'),
    password: z.string({message: 'Insira uma senha'}).trim().min(1, {message: 'Senha não pode ser vazia'})
})

export default function LoginForm(){

    const loginClientAction = async(formData: FormData) => {
        
        const loginData: LoginCredentials = {
            email: formData.get('email') as string,
            password: formData.get('password') as string
        }
                
        const result = LoginSchema.safeParse(loginData);

        if(!result.success){

            let errorMsg = "";

            result.error.issues.forEach((issue) => {
                errorMsg = errorMsg + issue.message + '. ';
            })

            toast.error(errorMsg);
            return;
        }
        
        //Chama o Server Action (nesse local é permitido)
        const retorno = await login(loginData);

        if(retorno){
            toast.error(retorno.error);
            return;
        }
    }

    return(
        <form className="login-form" action={loginClientAction}>
            <div>
                <Image className="form-image" src={pokeLogo} alt="pokémon logo" />
            </div>
            <div>
                <section className="user-input">
                    <Image src={userIcon} alt="user icon"/>
                    <input type="email" name="email" id="email" placeholder="Email" aria-label="Email"/>
                </section>

                <section className="user-input">
                    <Image src={passwordIcon} alt="user icon"/>
                    <input type="password" name="password" id="password" placeholder="Senha" aria-label="Senha"/>
                </section>
            </div>
            <button>Entrar</button>
            <Link id="link-cadastrar" href="/user/create">Não tem cadastro? Clique aqui</Link>
    
        </form>
    )
}



