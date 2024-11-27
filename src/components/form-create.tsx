//Marcamos esse componente como "client" para podermos usar a lib "toast" que irá apresentar mensagens para o usuário
//Se fosse necessário hooks (como useState) também seria necessário marcar o componente como "cliente"
'use client';

import Image from "next/image";
import userIcon from "public/user.png";
import passwordIcon from "public/padlock.png";
import pokeLogo from "public/pokemon-logo.png";

import '@/styles/Login.css';
import {createUser, LoginCredentials} from "@/utils/credentials";
import {z} from "zod"; //import do zod para apoio nas validações do front: npm i zod 
import toast from 'react-hot-toast'; //import do react-hot-toast:  npm i react-hot-toast

//Criação do schema para colocarmos as regras de validação do zod para os campos de createUser
//Retirado diretamente da documentação do "zod" em https://zod.dev/
const CreateUserSchema = z.object({
    email: z.string().trim().email('Email com formato incorreto'),
    password: z.string({message: 'Insira uma senha'}).trim().min(4, {message: 'Senha precisa no mínimo 4 caracteres'}),
    confPassword: z.string({message: 'Insira uma confirmação de senha'}).trim().min(1, {message: 'Confirmar Senha não pode ser vazia'}),
}).refine((data) => data.password === data.confPassword, {
    message: "Senhas não conferem",
    path: ["confPassword"]
});


export default function CreateUserForm(){

    //Precisamos criar uma função dentro do componente que irá
    //permitir chamar uma função em outro arquivo para executar do lado do servidor
    //Os arquivo em questão é auth.ts Nele temos funções que executam do lado do servidor
    //Para criar o usuário usamos a "createUser". No arquivo "auth.ts", observe que no início tem a diretiva "use server"
    //para inidicar que todas as funções são executadas do lado do servidor.
    //Em outras palavras a função abaixo faz a conexão entre um componente "client" e um "server"
    //A função está associada ao "form" desse arquivo. Veja no atribute "action", estamos chamando o "createUserClient"
    const createUserClient = async (formData: FormData) =>{

        const createUserData = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confPassword: formData.get('conf-password') as string
        }
                
        const result = CreateUserSchema.safeParse(createUserData);

        if(!result.success){

            let errorMsg = "";

            //Acumulando todas as mensagens de error
            //Retirado da documentação do zod: https://www.zod.dev
            result.error.issues.forEach((issue) => {
                errorMsg = errorMsg + issue.message + '. ';
            })
            //Passa a mensagem de erro para o "toast" mostrar para o usuário
            toast.error(errorMsg);
            return;
        }
        
        //Chama o Server Action. Nesse local do componente "cliente" é permitido.
        const retorno = await createUser(createUserData as LoginCredentials);//Forçando o cast para o tipo "LoginCredentials"

        if(retorno){
            toast.error(retorno.error);
            return;
        }

    }

    return(
        <form action={createUserClient} className="login-form">
        <div>
            <Image className="form-image" src={pokeLogo} alt="pokémon logo" />
        </div>
        <div>
            <section className="user-input">
                <Image src={userIcon} alt="user icon"/>
                <input type="email" name="email" id="email" placeholder="Email" aria-label="Email" required/>
            </section>

            <section className="user-input">
                <Image src={passwordIcon} alt="user icon"/>
                <input type="password" name="password" id="password" placeholder="Senha" aria-label="Senha" required/>
            </section>

            <section className="user-input">
                <Image src={passwordIcon} alt="user icon"/>
                <input type="password" name="conf-password" id="conf-password" placeholder="Confirmar Senha" aria-label="Confirmar Senha" required/>
            </section>
        </div>    
        <button>Cadastrar</button>
    </form>
    )
}