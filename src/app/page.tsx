import '@/app/page.css'
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main>
        <h1>Entre no Mundo Pokémon e Colecione Todos.<br/> Gotta Catch 'Em All</h1>
        <Link href={"/user/login"} className='link-conhecer' >Clique e Venha Conhecer</Link>
      </main>
    </>
  );
}